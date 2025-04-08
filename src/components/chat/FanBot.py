import json
import numpy as np
import faiss
import torch
from sentence_transformers import SentenceTransformer
from spellchecker import SpellChecker
import openai

from flask import Flask, request, jsonify

app = Flask(__name__)

# -----------------------
# 1. Preprocessing Functions
# -----------------------

try:
    # Initialize the spell checker for Arabic.
    spell_checker = SpellChecker(language='ar')

    def spell_check(text):
        """
        Correct each word in the text using pyspellchecker.
        If correction returns None, fall back to the original word.
        """
        corrected_words = []
        for word in text.split():
            corrected_word = spell_checker.correction(word)
            if corrected_word is None:
                corrected_word = word
            corrected_words.append(corrected_word)
        return " ".join(corrected_words)
except ModuleNotFoundError:
    print("Warning: 'pyspellchecker' module not found. Proceeding without spell checking.")
    def spell_check(text):
        return text

def preprocess_text(text):
    """
    Apply spell checking (if available) and strip whitespace.
    """
    if text is None:
        return ""
    corrected_text = spell_check(text)
    return corrected_text.strip()

def flatten_intents(nested_list):
    """
    Collect all {tag, patterns, responses} objects from nested lists/dicts
    into a single flat list.
    """
    results = []
    if isinstance(nested_list, list):
        for item in nested_list:
            results.extend(flatten_intents(item))
    elif isinstance(nested_list, dict):
        # If it's a valid intent
        if all(k in nested_list for k in ("tag", "patterns", "responses")):
            results.append(nested_list)
        # Otherwise look deeper
        for v in nested_list.values():
            results.extend(flatten_intents(v))
    return results

# -----------------------
# 2. Load and merge the JSON dataset
# -----------------------

json_path = "/Users/abdulelah./Downloads/prototype/src/components/chat/king_abdullah_stadium_arabic_cleaned.json"
with open(json_path, "r", encoding="utf-8") as f:
    raw_data = json.load(f)

flat_intents = flatten_intents(raw_data)

# بإمكانك حفظ النتائج إذا أردت:
# with open("cleaned_intents.json", "w", encoding="utf-8") as f:
#     json.dump({"intents": flat_intents}, f, ensure_ascii=False, indent=2)

print("Done! Merged all nested arrays into a single 'intents' list.")

def extract_qna_all_combinations(intent_list):
    """
    Produce all combinations (pattern x response) from the dataset.
    """
    qna_pairs = []
    for intent in intent_list:
        patterns = intent.get("patterns", [])
        responses = intent.get("responses", [])
        for pat in patterns:
            for resp in responses:
                qna_pairs.append({"question": pat, "answer": resp})
    return qna_pairs

qna_pairs = extract_qna_all_combinations(flat_intents)

# -----------------------
# 3. Embedding with LaBSE + Build FAISS Index
# -----------------------

print("Loading LaBSE model for embeddings...")
embedder = SentenceTransformer('sentence-transformers/LaBSE')
questions = [pair['question'] for pair in qna_pairs]
question_embeddings = embedder.encode(questions, convert_to_tensor=False)
embeddings_np = np.array(question_embeddings).astype('float32')

faiss.normalize_L2(embeddings_np)
dimension = embeddings_np.shape[1]
index = faiss.IndexFlatIP(dimension)  # inner product on normalized vectors = cosine similarity
index.add(embeddings_np)
print(f"FAISS index built with {index.ntotal} vectors.")

# -----------------------
# 4. Retrieval Function
# -----------------------

def retrieve_context(query, threshold=0.5, k=1):
    """
    Given a query, retrieve the best matching Q&A pair if similarity score meets threshold.
    """
    query_embedding = embedder.encode([query], convert_to_tensor=False)
    query_np = np.array(query_embedding).astype('float32')
    faiss.normalize_L2(query_np)
    distances, indices = index.search(query_np, k)
    score = distances[0][0]
    best_index = indices[0][0]
    if score >= threshold:
        return qna_pairs[best_index], score
    else:
        return None, score


# Configure OpenAI (Nebius AI Gateway)
openai.api_base = "https://api.studio.nebius.ai/v1/"
openai.api_key = "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprL..."

# The Arabic prompt
arabic_prompt = """
أريدك أن تكون مساعدًا ذكيًا متخصصًا في اللغة العربية. مهمتك هي:
1. تصحيح الأخطاء الإملائية والنحوية.
2. تحويل النصوص المكتوبة باللهجة العامية إلى لغة عربية فصحى، بأسلوب احترافي وأنيق.
3. التأكد من جعل النصوص رسمية ومناسبة لجميع الفئات.
4. ربط الإجابات بالسياق السابق إذا كانت الأسئلة مترابطة.
5. إذا كان النص سؤالًا، أعد صياغته بشكل رسمي.
6. افهم النص جيدًا وأعد صياغته بناءً على المحادثات السابقة للتأكد من الترابط.
7. لا تُضفِ أي كلمات إضافية، والتزم بتعديل السؤال فقط.
8. عند وجود عبارات عامية مختصرة مثل \"انت ميم\" حولها إلى \"انت مين\"، أو \"كيف خالك\" إلى \"كيف حالك\"، مع الحفاظ على الكلمات قدر الإمكان دون تغيير المعنى.

أمثلة مرتبطة بالملاعب:

1) المدخل: وش هذا الملعب؟
   المخرَج: ما هو هذا الملعب؟

2) المدخل: فين المدرجات الرئيسة؟
   المخرَج: أين تقع المدرجات الرئيسة؟

3) المدخل: ابغى اعرف سعة الملعب
   المخرَج: أريد معرفة سعة الملعب.

4) المدخل: كيف اوصل لمنطقة كبار الشخصيات؟
   المخرَج: كيف يمكنني الوصول إلى منطقة كبار الشخصيات؟

5) المدخل: عندكم تذاكر زيادة؟
   المخرَج: هل لديكم تذاكر إضافية؟

6) المدخل: انت ميم تشجع؟
   المخرَج: أنت مين تشجع؟

7) المدخل: كيف خالك اليوم؟
   المخرَج: كيف حالك اليوم؟
"""

def formalize_query(user_input):
    """
    Use openai.ChatCompletion to produce a formal Arabic version of the query.
    """
    try:
        messages = [{
            "role": "user",
            "content": f"{arabic_prompt}\n\nالنص المدخل: {user_input}"
        }]

        completion = openai.ChatCompletion.create(
            model="google/gemma-2-9b-it",
            messages=messages,
            temperature=0.2,
            max_tokens=512,
            top_p=0.9
        )
        content = completion.choices[0].message.content.strip()
        return content
    except Exception as e:
        print(f"Error in formalize_query: {e}")
        return user_input  # fallback to original if error

# -----------------------
# 5. Flask App
# -----------------------

@app.route("/ask", methods=["POST"])
def ask():
    """
    POST JSON: { "question": "...user question..." }
    Returns: { "answer": "...best answer...", "score": float }
    """
    data = request.json or {}
    user_question = data.get("question", "").strip()
    if not user_question:
        return jsonify({"error": "No question provided."}), 400

    formal = formalize_query(user_question)

    context, score = retrieve_context(formal, threshold=0.5, k=1)
    if context:
        return jsonify({"answer": context["answer"], "score": float(score)})
    else:
        return jsonify({"answer": "لا يوجد سياق مناسب.", "score": float(score)})

if __name__ == "__main__":
    # Run Flask
    app.run(debug=True, port=5000)