
// Stadium location data
export interface LocationPoint {
  id: string;
  name: string;
  path: {
    en: string;
    ar: string;
  };
  landmarks: {
    en: string[];
    ar: string[];
  };
  position: {
    x: number;
    y: number;
    z: number;
  };
  type: "gate" | "food" | "restroom" | "shop" | "section" | "first_aid" | "exit";
}

export interface QuickAction {
  id: string;
  label: {
    en: string;
    ar: string;
  };
  icon: string;
}

export const gateLocations: Record<string, LocationPoint> = {
  "12": {
    id: "gate-12",
    name: "Gate 12",
    path: {
      en: "North Concourse > Follow blue signs",
      ar: "الممر الشمالي > اتبع العلامات الزرقاء"
    },
    landmarks: {
      en: ["After restroom cluster", "Near Fan Shop"],
      ar: ["بعد مجموعة الحمامات", "بالقرب من متجر المشجعين"]
    },
    position: { x: 120, y: 45, z: 2 },
    type: "gate"
  },
  "8": {
    id: "gate-8",
    name: "Gate 8",
    path: {
      en: "East Entrance > Follow green signs",
      ar: "المدخل الشرقي > اتبع العلامات الخضراء"
    },
    landmarks: {
      en: ["Next to food court", "Behind ticket office"],
      ar: ["بجوار ساحة الطعام", "خلف مكتب التذاكر"]
    },
    position: { x: 180, y: 65, z: 1 },
    type: "gate"
  }
};

export const exitLocations: Record<string, LocationPoint> = {
  "exit-n": {
    id: "exit-north",
    name: "North Exit",
    path: {
      en: "Follow red emergency signs > North Exit",
      ar: "اتبع علامات الطوارئ الحمراء > المخرج الشمالي"
    },
    landmarks: {
      en: ["Past Gate 12", "Through main concourse"],
      ar: ["بعد البوابة 12", "عبر الممر الرئيسي"]
    },
    position: { x: 125, y: 10, z: 1 },
    type: "exit"
  },
  "exit-e": {
    id: "exit-east",
    name: "East Exit",
    path: {
      en: "Follow red emergency signs > East Exit",
      ar: "اتبع علامات الطوارئ الحمراء > المخرج الشرقي"
    },
    landmarks: {
      en: ["Next to Gate 8", "Through VIP corridor"],
      ar: ["بجوار البوابة 8", "عبر ممر كبار الشخصيات"]
    },
    position: { x: 240, y: 70, z: 1 },
    type: "exit"
  }
};

export const foodLocations: Record<string, LocationPoint> = {
  "food-1": {
    id: "food-court-main",
    name: "Main Food Court",
    path: {
      en: "Level 2 > West Concourse",
      ar: "الطابق 2 > الممر الغربي"
    },
    landmarks: {
      en: ["Between Sections 110-115", "Near Hall of Fame display"],
      ar: ["بين الأقسام 110-115", "بالقرب من معرض المشاهير"]
    },
    position: { x: 60, y: 120, z: 2 },
    type: "food"
  }
};

export const firstAidLocations: Record<string, LocationPoint> = {
  "aid-1": {
    id: "first-aid-main",
    name: "Main First Aid Station",
    path: {
      en: "Level 1 > South Concourse",
      ar: "الطابق 1 > الممر الجنوبي"
    },
    landmarks: {
      en: ["Between Sections 130-135", "Next to Information Desk"],
      ar: ["بين الأقسام 130-135", "بجوار مكتب المعلومات"]
    },
    position: { x: 100, y: 200, z: 1 },
    type: "first_aid"
  }
};

export const quickActions: QuickAction[] = [
  {
    id: "show-exits",
    label: {
      en: "Show exits",
      ar: "عرض المخارج"
    },
    icon: "exit"
  },
  {
    id: "find-food",
    label: {
      en: "Find food",
      ar: "البحث عن الطعام"
    },
    icon: "food"
  },
  {
    id: "lost-found",
    label: {
      en: "Lost & Found",
      ar: "المفقودات والموجودات"
    },
    icon: "search"
  }
];

export const chatResponses = {
  exits: {
    en: "The nearest exits are at Gate 12 (North) and Gate 8 (East). Follow the illuminated signs to reach them safely.",
    ar: "أقرب المخارج موجودة عند البوابة 12 (الشمال) والبوابة 8 (الشرق). اتبع العلامات المضاءة للوصول إليها بأمان."
  },
  food: {
    en: "You can find food at the Main Food Court on Level 2, West Concourse. Current wait time: 10 minutes.",
    ar: "يمكنك العثور على الطعام في ساحة الطعام الرئيسية في الطابق 2، الممر الغربي. وقت الانتظار الحالي: 10 دقائق."
  },
  lostFound: {
    en: "Lost & Found is located at the Information Desk near Section 130 on Level 1, South Concourse.",
    ar: "المفقودات والموجودات موجودة في مكتب المعلومات بالقرب من القسم 130 في الطابق 1، الممر الجنوبي."
  },
  fallback: {
    en: "Please approach the nearest staff member for immediate help.",
    ar: "يرجى التوجه إلى أقرب موظف للحصول على المساعدة الفورية."
  }
};
