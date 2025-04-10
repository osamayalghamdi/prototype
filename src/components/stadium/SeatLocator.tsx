
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppContext } from "../../contexts/AppContext";
import { MapPin } from "lucide-react";

const SeatLocator: React.FC = () => {
  const { language } = useAppContext();
  const [section, setSection] = useState("");
  const [row, setRow] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  
  const handleLocate = (e: React.FormEvent) => {
    e.preventDefault();
    // In the future, this would update the map and provide navigation
    console.log("Locate seat:", { section, row, seatNumber });
  };
  
  return (
    <section className="my-8 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-center flex items-center justify-center">
          <MapPin className="mr-2 text-stadium-primary" />
          {language === "en" ? "Find Your Seat" : "ابحث عن مقعدك"}
        </h2>
        
        <form onSubmit={handleLocate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section">
              {language === "en" ? "Section" : "القسم"}
            </Label>
            <Input
              id="section"
              placeholder={language === "en" ? "e.g. A, B, C" : "مثال: أ، ب، ج"}
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="border-stadium-primary/30 focus-visible:ring-stadium-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="row">
              {language === "en" ? "Row" : "الصف"}
            </Label>
            <Input
              id="row"
              placeholder={language === "en" ? "e.g. 1, 2, 3" : "مثال: ١، ٢، ٣"}
              value={row}
              onChange={(e) => setRow(e.target.value)}
              className="border-stadium-primary/30 focus-visible:ring-stadium-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seatNumber">
              {language === "en" ? "Seat Number" : "رقم المقعد"}
            </Label>
            <Input
              id="seatNumber"
              placeholder={language === "en" ? "e.g. 15" : "مثال: ١٥"}
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              className="border-stadium-primary/30 focus-visible:ring-stadium-primary"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-stadium-primary hover:bg-stadium-primary/90"
          >
            {language === "en" ? "Locate My Seat" : "حدد مقعدي"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default SeatLocator;
