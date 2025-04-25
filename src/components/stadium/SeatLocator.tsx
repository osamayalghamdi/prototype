import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppContext } from "../../contexts/AppContext";
import { MapPin } from "lucide-react";

interface SeatLocatorProps {
  onLocate: (info: { section: string; row: string; seatNumber: string }) => void;
}

const SeatLocator: React.FC<SeatLocatorProps> = ({ onLocate }) => {
  const { language } = useAppContext(); // Get language from context
  const [section, setSection] = useState("");
  const [row, setRow] = useState("");
  const [seatNumber, setSeatNumber] = useState("");

  // Define the getText helper function locally within this component
  const getText = (en: string, ar: string, es: string) => {
    if (language === "en") return en;
    if (language === "ar") return ar;
    if (language === "es") return es;
    return en; // Default to English
  };
  
  const handleLocate = (e: React.FormEvent) => {
    e.preventDefault();
    onLocate({ section, row, seatNumber });
  };
  
  return (
    <section className="my-8 max-w-md mx-auto px-4">
      <div className="overflow-hidden rounded-xl shadow-lg border border-border bg-card">
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-stadium-primary to-stadium-primary/50 p-4">
          <h2 className="text-lg font-semibold text-white text-center flex items-center justify-center">
            <MapPin className="mr-2" />
            {/* Use getText for title */}
            {getText("Find Your Seat", "ابحث عن مقعدك", "Encuentra Tu Asiento")}
          </h2>
        </div>
        
        <form onSubmit={handleLocate} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="section">
              {/* Use getText for label */}
              {getText("Section", "القسم", "Sección")}
            </Label>
            <Input
              id="section"
              // Use getText for placeholder
              placeholder={getText("e.g. A, B, C", "مثال: أ، ب، ج", "ej. A, B, C")}
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="border-stadium-primary/40 focus-visible:ring-2 focus-visible:ring-stadium-primary focus:outline-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="row">
              {/* Use getText for label */}
              {getText("Row", "الصف", "Fila")}
            </Label>
            <Input
              id="row"
              // Use getText for placeholder
              placeholder={getText("e.g. 1, 2, 3", "مثال: ١، ٢، ٣", "ej. 1, 2, 3")}
              value={row}
              onChange={(e) => setRow(e.target.value)}
              className="border-stadium-primary/40 focus-visible:ring-2 focus-visible:ring-stadium-primary focus:outline-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seatNumber">
              {/* Use getText for label */}
              {getText("Seat Number", "رقم المقعد", "Número de Asiento")}
            </Label>
            <Input
              id="seatNumber"
              // Use getText for placeholder
              placeholder={getText("e.g. 15", "مثال: ١٥", "ej. 15")}
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              className="border-stadium-primary/40 focus-visible:ring-2 focus-visible:ring-stadium-primary focus:outline-none"
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-stadium-primary to-stadium-primary/60 hover:from-stadium-primary/80 hover:to-stadium-primary/80 text-white font-medium rounded-lg py-2 transition"
          >
            {/* Use getText for button text */}
            {getText("Locate My Seat", "حدد مقعدي", "Localizar Mi Asiento")}
          </Button>
          {/* Optional skip seat selection */}
          <div className="text-center mt-3">
            <button
              type="button"
              onClick={() => onLocate({ section: "", row: "", seatNumber: "" })}
              className="text-sm text-stadium-primary hover:text-stadium-primary/80 underline"
            >
              {/* Use getText for skip button text */}
              {getText("Skip seat selection", "تخطي اختيار المقعد", "Omitir selección de asiento")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SeatLocator;
