import React, { useState, useRef } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ZoomIn, ZoomOut, Move, Info, MapPin, Upload, X } from "lucide-react";
import { Badge } from "../ui/badge";

interface SectionInfo {
  id: string;
  color: string;
  name: string;
  details?: string;
}

const sections: { [key: string]: SectionInfo } = {
  north: { id: "north", color: "#1e40af", name: "North Stand (60-89)", details: "Sections 60-89. Home team fans seating area." },
  northeast: { id: "northeast", color: "#3b82f6", name: "Northeast Stand (50-59)", details: "Sections 50-59. Corner seating with good view of both goals." },
  east: { id: "east", color: "#60a5fa", name: "East Stand (28-49)", details: "Sections 28-49. Side seating with great midfield views." },
  southeast: { id: "southeast", color: "#93c5fd", name: "Southeast Stand (1-27)", details: "Sections 1-27. Corner seating with family-friendly areas." },
  south: { id: "south", color: "#bae6fd", name: "South Stand (1-27)", details: "Sections 1-27. Away team and neutral seating." },
  southwest: { id: "southwest", color: "#fbbf24", name: "Southwest Stand (101-119)", details: "Sections 101-119. Premium seating area." },
  west: { id: "west", color: "#f59e0b", name: "West Stand (90-100)", details: "Sections 90-100. Main stand with press and team benches." },
  northwest: { id: "northwest", color: "#f97316", name: "Northwest Stand (80-89)", details: "Sections 80-89. Corner seating with great atmosphere." },
  vip: { id: "vip", color: "#06b6d4", name: "VIP Area", details: "Premium hospitality area with the best amenities and service." },
};

const StadiumMap: React.FC = () => {
  const { language, isEmergencyMode } = useAppContext();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.5), 2));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && svgRef.current) {
      setPosition(prev => ({
        x: prev.x + e.movementX / scale,
        y: prev.y + e.movementY / scale
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId === selectedSection ? null : sectionId);
  };

  const handleSectionHover = (sectionId: string | null) => {
    setHoveredSection(sectionId);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeCustomImage = () => {
    setCustomImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative w-full">
      {selectedSection && (
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-md mr-3 flex-shrink-0" style={{ backgroundColor: sections[selectedSection].color }}>
              <span className="sr-only">{sections[selectedSection].name}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{sections[selectedSection].name}</h3>
              <p className="text-sm text-gray-600 mt-1">{sections[selectedSection].details}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => setSelectedSection(null)}
            >
              <span className="sr-only">Close</span>
              &times;
            </Button>
          </div>
          
          {selectedSection === "vip" && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white">VIP Lounge Access</Badge>
              <Badge variant="outline" className="bg-white">Priority Parking</Badge>
              <Badge variant="outline" className="bg-white">Exclusive Menu</Badge>
              <Badge variant="outline" className="bg-white">In-seat Service</Badge>
            </div>
          )}
          
          {isEmergencyMode && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              {language === "en" 
                ? "Please follow the indicated emergency routes for this section."
                : "يرجى اتباع مسارات الطوارئ المشار إليها لهذا القسم."}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-600 h-5 w-5" />
          <span className="text-sm font-medium">
            {hoveredSection ? sections[hoveredSection].name : language === "en" ? "Hover over sections for details" : "مرر فوق الأقسام للحصول على التفاصيل"}
          </span>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <Button
            variant="outline"
            size="sm"
            onClick={triggerFileInput}
            className="flex items-center gap-1"
            disabled={isUploading}
          >
            <Upload size={14} />
            <span className="hidden sm:inline">{language === "en" ? "Upload Layout" : "تحميل المخطط"}</span>
          </Button>
          {customImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeCustomImage}
              className="flex items-center gap-1 text-red-600 hover:text-red-700"
            >
              <X size={14} />
              <span className="hidden sm:inline">{language === "en" ? "Remove" : "إزالة"}</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}
          >
            <ZoomIn size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
          >
            <ZoomOut size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setScale(1);
              setPosition({ x: 0, y: 0 });
            }}
          >
            <Move size={16} />
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {customImage ? (
          <div 
            className="cursor-grab active:cursor-grabbing relative"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: "center",
                height: "600px",
                backgroundImage: `url(${customImage})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            />
            {isEmergencyMode && (
              <div className="absolute bottom-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold animate-pulse flex items-center">
                <Info size={14} className="mr-1" />
                {language === "en" ? "Emergency Mode Active" : "وضع الطوارئ نشط"}
              </div>
            )}
          </div>
        ) : (
          isUploading ? (
            <div className="flex flex-col items-center justify-center h-80">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">
                {language === "en" ? "Uploading image..." : "جاري تحميل الصورة..."}
              </p>
            </div>
          ) : (
            <svg
              ref={svgRef}
              width="100%"
              height="600"
              viewBox="0 0 1000 800"
              className="cursor-grab active:cursor-grabbing"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: "center"
              }}
            >
              {/* Stadium border */}
              <ellipse
                cx="500"
                cy="400"
                rx="480"
                ry="380"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />
    
              {/* Pitch */}
              <rect
                x="250"
                y="200"
                width="500"
                height="400"
                fill="#a3e635"
                stroke="white"
                strokeWidth="4"
              />
              
              {/* Pitch markings */}
              <rect
                x="270"
                y="220"
                width="460"
                height="360"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx="500"
                cy="400"
                r="70"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <line
                x1="500"
                y1="220"
                x2="500"
                y2="580"
                stroke="white"
                strokeWidth="2"
              />
              <rect
                x="270"
                y="320"
                width="60"
                height="160"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <rect
                x="670"
                y="320"
                width="60"
                height="160"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx="500"
                cy="400"
                r="5"
                fill="white"
              />
    
              {/* North sections (blue) - 60-89 */}
              <path
                d="M 350,100 L 650,100 C 650,100 650,150 650,150 L 350,150 C 350,150 350,100 350,100"
                fill={hoveredSection === "north" || selectedSection === "north" ? "#1e3a8a" : "#1e40af"}
                stroke="#fff"
                strokeWidth="1"
                opacity={hoveredSection === "north" || selectedSection === "north" ? 1 : 0.9}
                onClick={() => handleSectionClick("north")}
                onMouseEnter={() => handleSectionHover("north")}
                onMouseLeave={() => handleSectionHover(null)}
                className="cursor-pointer"
              />
              
              {/* North sections numbers */}
              {Array.from({ length: 20 }, (_, i) => (
                <text
                  key={`north-${i}`}
                  x={370 + i * 15}
                  y="130"
                  fill="white"
                  fontSize="10"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {70 + i}
                </text>
              ))}
              
              {/* Northeast sections (light blue) - 50-59 */}
              <path
                d="M 650,150 L 750,200 C 750,200 700,250 700,250 L 650,200 C 650,200 650,150 650,150"
                fill={hoveredSection === "northeast" || selectedSection === "northeast" ? "#2563eb" : "#3b82f6"}
                stroke="#fff"
                strokeWidth="1"
                opacity={hoveredSection === "northeast" || selectedSection === "northeast" ? 1 : 0.9}
                onClick={() => handleSectionClick("northeast")}
                onMouseEnter={() => handleSectionHover("northeast")}
                onMouseLeave={() => handleSectionHover(null)}
                className="cursor-pointer"
              />
              
              {/* Northeast section numbers */}
              {Array.from({ length: 10 }, (_, i) => (
                <text
                  key={`ne-${i}`}
                  x={670 + i * 8}
                  y={200 - i * 5}
                  fill="white"
                  fontSize="10"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {50 + i}
                </text>
              ))}
              
              {/* East sections (blue) - 28-49 */}
              <path
                d="M 750,200 L 800,400 C 800,400 750,400 750,400 L 700,250 C 700,250 750,200 750,200"
                fill={hoveredSection === "east" || selectedSection === "east" ? "#60a5fa" : "#60a5fa"}
                stroke="#fff"
                strokeWidth="1"
                opacity={hoveredSection === "east" || selectedSection === "east" ? 1 : 0.9}
                onClick={() => handleSectionClick("east")}
                onMouseEnter={() => handleSectionHover("east")}
                onMouseLeave={() => handleSectionHover(null)}
                className="cursor-pointer"
              />
              
              {/* East section numbers */}
              {Array.from({ length: 22 }, (_, i) => (
                <text
                  key={`e-${i}`}
                  x={780}
                  y={250 + i * 15}
                  fill="#333"
                  fontSize="10"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {49 - i}
                </text>
              ))}
              
              {/* Southeast sections (lightest blue) */}
              <path
                d="M 800,400 L 750,600 C 750,600 700,550 700,550 L 750,400 C 750,400 800,400 800,400"
                fill={hoveredSection === "southeast" || selectedSection === "southeast" ? "#93c5fd" : "#93c5fd"}
                stroke="#fff"
                strokeWidth="1"
                opacity={hoveredSection === "southeast" || selectedSection === "southeast" ? 1 : 0.9}
                onClick={() => handleSectionClick("southeast")}
                onMouseEnter={() => handleSectionHover("southeast")}
                onMouseLeave={() => handleSectionHover(null)}
                className="cursor-pointer"
              />
              
              {/* South sections (sky blue) */}
              <path
                d="M 650,650 L 350,650 C 350,650 350,600 350,600 L 650,600 C 650,600 650,650 650,650"
                fill={hoveredSection === "south" || selectedSection === "south" ? "#bae6fd" : "#bae6fd"}
                stroke="#fff"
                strokeWidth="1"
                opacity={hoveredSection === "south" || selectedSection === "south" ? 1 : 0.9}
                onClick={() => handleSectionClick("south")}
                onMouseEnter={() => handleSectionHover("south")}
                onMouseLeave={() => handleSectionHover(null)}
                className="cursor-pointer"
              />
              
              {/* South section numbers */}
              {Array.from({ length: 20 }, (_, i) => (
                <text
                  key={`s-${i}`}
                  x={370 + i * 15}
                  y="630"
                  fill="#333"
                  fontSize="10"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {i + 1}
                </text>
              ))}
              
              {/* Southwest sections (amber) */}
              <path
                d="M 350,600 L 250,550 C 250,550 200,500 200,500 L 300,550 C 300,550 350,600 350,600"
                fill={hoveredSection === "southwest" || selectedSection === "southwest" ? "#fbbf24" : "#fbbf24"}
                stroke="#fff"
                strokeWidth="1"
                opacity={hoveredSection === "southwest" || selectedSection === "southwest" ? 1 : 0.9}
                onClick={() => handleSectionClick("southwest")}
                onMouseEnter={() => handleSectionHover("southwest")}
                onMouseLeave={() => handleSectionHover(null)}
                className="cursor-pointer"
              />
              
              {/* Southwest section numbers */}
              {Array.from({ length: 7 }, (_, i) => (
                <text
                  key={`sw-${i}`}
                  x={300 - i * 10}
                  y={580 - i * 10}
                  fill="#333"
                  fontSize="10"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {118 - i}
                </text>
              ))}
              
              {/* West sections (orange) */}
              <path
                d="M 250,200 L 200,500 C 200,500 250,500 250,500 L 300,250 C 300,250 250,200 250,200"
                fill={hoveredSection === "west" || selectedSection === "west" ? "#f59e0b" : "#f59e0b"}
                stroke="#fff"
                strokeWidth="1"
                opacity={hoveredSection === "west" || selectedSection === "west" ? 1 : 0.9}
                onClick={() => handleSectionClick("west")}
                onMouseEnter={() => handleSectionHover("west")}
                onMouseLeave={() => handleSectionHover(null)}
                className="cursor-pointer"
              />
              
              {/* West section numbers */}
              {Array.from({ length: 11 }, (_, i) => (
                <text
                  key={`w-${i}`}
                  x={220}
                  y={250 + i * 25}
                  fill="#333"
                  fontSize="10"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {90 + i}
                </text>
              ))}
              
              {/* Northwest sections (dark orange) */}
              <path
                d="M 350,150 L 250,200 C 250,200 300,250 300,250 L 350,200 C 350,200 350,150 350,150"
                fill={hoveredSection === "northwest" || selectedSection === "northwest" ? "#f97316" : "#f97316"}
                stroke="#fff"
                strokeWidth="1"
                opacity={hoveredSection === "northwest" || selectedSection === "northwest" ? 1 : 0.9}
                onClick={() => handleSectionClick("northwest")}
                onMouseEnter={() => handleSectionHover("northwest")}
                onMouseLeave={() => handleSectionHover(null)}
                className="cursor-pointer"
              />
              
              {/* Northwest section numbers */}
              {Array.from({ length: 5 }, (_, i) => (
                <text
                  key={`nw-${i}`}
                  x={330 - i * 10}
                  y={170 + i * 10}
                  fill="#333"
                  fontSize="10"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {80 + i}
                </text>
              ))}
              
              {/* VIP Area */}
              <g
                onClick={() => handleSectionClick("vip")}
                onMouseEnter={() => handleSectionHover("vip")}
                onMouseLeave={() => handleSectionHover(null)}
                className="cursor-pointer"
              >
                <rect
                  x="400"
                  y="700"
                  width="200"
                  height="80"
                  fill={hoveredSection === "vip" || selectedSection === "vip" ? "#0891b2" : "#06b6d4"}
                  stroke="#fff"
                  strokeWidth="2"
                  rx="10"
                  opacity={hoveredSection === "vip" || selectedSection === "vip" ? 1 : 0.9}
                />
                <text
                  x="500"
                  y="750"
                  fill="white"
                  fontSize="24"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  VIP
                </text>
              </g>
              
              {/* Emergency exits */}
              {isEmergencyMode && (
                <>
                  <circle cx="500" cy="700" r="15" fill="#dc2626" className="animate-ping" opacity="0.5" />
                  <circle cx="500" cy="700" r="15" fill="#dc2626" stroke="#fff" strokeWidth="2" />
                  <circle cx="200" cy="400" r="15" fill="#dc2626" className="animate-ping" opacity="0.5" />
                  <circle cx="200" cy="400" r="15" fill="#dc2626" stroke="#fff" strokeWidth="2" />
                  <circle cx="800" cy="400" r="15" fill="#dc2626" className="animate-ping" opacity="0.5" />
                  <circle cx="800" cy="400" r="15" fill="#dc2626" stroke="#fff" strokeWidth="2" />
                  <circle cx="500" cy="100" r="15" fill="#dc2626" className="animate-ping" opacity="0.5" />
                  <circle cx="500" cy="100" r="15" fill="#dc2626" stroke="#fff" strokeWidth="2" />
                </>
              )}
            </svg>
          )
        )}

        {!customImage && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-1 p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-gray-200 max-w-[180px] text-xs">
            <div className="text-xs font-bold uppercase text-gray-500 mb-1">Seating Areas</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-sm bg-[#1e40af] mr-1"></div>
                <span>North (60-89)</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-sm bg-[#60a5fa] mr-1"></div>
                <span>East (28-49)</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-sm bg-[#bae6fd] mr-1"></div>
                <span>South (1-27)</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-sm bg-[#f59e0b] mr-1"></div>
                <span>West (90-100)</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-sm bg-[#06b6d4] mr-1"></div>
                <span>VIP Area</span>
              </div>
              {isEmergencyMode && (
                <div className="flex items-center col-span-2">
                  <div className="h-3 w-3 rounded-full bg-[#dc2626] mr-1"></div>
                  <span>Emergency Exits</span>
                </div>
              )}
            </div>
          </div>
        )}

        {!customImage && (
          <div className="absolute bottom-4 left-4 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white/95 transition-colors cursor-pointer" onClick={triggerFileInput}>
            <div className="flex flex-col items-center justify-center">
              <Upload size={16} className="text-blue-600 mb-1" />
              <p className="text-xs text-blue-600 font-medium">
                {language === "en" ? "Upload Custom Map" : "تحميل خريطة مخصصة"}
              </p>
            </div>
          </div>
        )}
      </div>

      {customImage && (
        <div className="mt-2 text-xs text-gray-500 italic">
          {language === "en" 
            ? "Note: Custom map uploaded. Interactive section selection is only available on the default map."
            : "ملاحظة: تم تحميل خريطة مخصصة. اختيار القسم التفاعلي متاح فقط في الخريطة الافتراضية."}
        </div>
      )}
    </div>
  );
};

export default StadiumMap;

