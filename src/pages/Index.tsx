import React, { useState } from "react";
import EmergencyOverlay from "../components/emergency/EmergencyOverlay";
import EmergencyFAB from "../components/emergency/EmergencyFAB";
import Header from "../components/layout/Header";
import GameSelection from "../components/stadium/GameSelection";
import SeatLocator from "../components/stadium/SeatLocator";
import SaudiPatternBackground from "../components/stadium/SaudiPatternBackground";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Calendar,
  MessageSquare,
  Search,
  Info,
  Clock,
  MapIcon,
  Utensils,
  DoorOpen
} from "lucide-react";
import { Game } from "../components/stadium/GameSelection";
import { Card, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import ChatbotCustomizer from "../components/chat/ChatbotCustomizer";
import DifyChat from "../components/chat/DifyChat";
import { difyConfig } from "../config/difyConfig";

// Map stadium names to public image URLs
const stadiumImages: Record<string, string> = {
  "King Fahd Stadium": "/al-thumama-stadium.png",
  "King Abdullah Sports City": "/123.png",
  "Prince Faisal bin Fahd Stadium": "/placeholder.png",
};

const StadiumNavigation: React.FC<{ selectedGame: Game; seatInfo: { section: string; row: string; seatNumber: string } }> = ({ selectedGame, seatInfo }) => {
  const { language } = useAppContext();
  const [activeTab, setActiveTab] = useState("map");

  // Helper function to get localized text
  const getText = (en: string, ar: string, es: string) => {
    if (language === "en") return en;
    if (language === "ar") return ar;
    if (language === "es") return es;
    return en; // Default to English
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const handleQuickQuestion = (question: string) => {
    console.log("Question asked:", question);
    // Here you would normally trigger the SmartChat to open with this question
  };

  return (
    <div className="py-6 px-4 pb-20 relative">
      <SaudiPatternBackground />

      <motion.div
        className="space-y-6 relative z-10 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Display selected game and optional seat info */}
        <Card className="mx-auto max-w-3xl mb-6 overflow-hidden border-gray-300">
          {/* Stadium image as header with overlay text */}
          <div className="relative h-48 w-full">
            <img
              src='/image.png'
              alt={selectedGame.stadium}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center p-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {selectedGame.homeTeam} vs {selectedGame.awayTeam}
              </h2>
              <p className="text-sm sm:text-base text-white/90 mt-1">
                {new Intl.DateTimeFormat(
                  language === "en" ? "en-US" : 
                  language === "ar" ? "ar-SA" : "es-ES", 
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }
                ).format(new Date(selectedGame.date))} {getText("at", "في", "a las")} {selectedGame.time}
              </p>
              {seatInfo.section && (
                <p className="text-sm text-white/80 mt-2">
                  {
                    getText(
                      `Section ${seatInfo.section}, Row ${seatInfo.row}, Seat ${seatInfo.seatNumber}`,
                      `القسم ${seatInfo.section}، الصف ${seatInfo.row}، المقعد ${seatInfo.seatNumber}`,
                      `Sección ${seatInfo.section}, Fila ${seatInfo.row}, Asiento ${seatInfo.seatNumber}`
                    )
                  }
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-card rounded-xl shadow-xl p-6 border border-gray-300"
              variants={itemVariants}
            >
              <Tabs defaultValue="map" onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                    {activeTab === "map" && <MapIcon className="h-6 w-6" />}
                    {activeTab === "seat" && <MapPin className="h-6 w-6" />}
                    {activeTab === "games" && <Calendar className="h-6 w-6" />}
                    {
                      getText(
                        activeTab === "map" ? "Stadium Map" :
                        activeTab === "seat" ? "Find Your Seat" : "Today's Games",
                        activeTab === "map" ? "خريطة الملعب" :
                        activeTab === "seat" ? "ابحث عن مقعدك" : "مباريات اليوم",
                        activeTab === "map" ? "Mapa del Estadio" :
                        activeTab === "seat" ? "Encuentra Tu Asiento" : "Partidos de Hoy"
                      )
                    }
                  </h2>
                  <TabsList className="grid grid-cols-3 h-9">
                    <TabsTrigger value="map" className="flex items-center gap-1 px-3">
                      <MapIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {getText("Map", "خريطة", "Mapa")}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="seat" className="flex items-center gap-1 px-3">
                      <MapPin className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {getText("Seats", "مقاعد", "Asientos")}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="games" className="flex items-center gap-1 px-3">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {getText("Games", "مباريات", "Partidos")}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="map" className="mt-0">
                  {/* Show stadium image instead of interactive map */}
                  <img
                    src={stadiumImages[selectedGame.stadium] || "/al-thumama-stadium.png"}
                    alt={selectedGame.stadium}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </TabsContent>

                <TabsContent value="seat" className="mt-0">
                  {/* Display located seat info */}
                  <div className="p-4 bg-card rounded-lg shadow-sm text-center border border-gray-300">
                    {
                      getText(
                        `Section ${seatInfo.section}, Row ${seatInfo.row}, Seat ${seatInfo.seatNumber}`,
                        `القسم ${seatInfo.section}، الصف ${seatInfo.row}، المقعد ${seatInfo.seatNumber}`,
                        `Sección ${seatInfo.section}, Fila ${seatInfo.row}, Asiento ${seatInfo.seatNumber}`
                      )
                    }
                  </div>
                </TabsContent>

                <TabsContent value="games" className="mt-0">
                  {/* Display selected game info */}
                  <div className="p-4 bg-card rounded-lg shadow-sm border border-gray-300">
                    <h3 className="text-lg font-semibold">
                      {selectedGame.homeTeam} vs {selectedGame.awayTeam}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat(
                        language === "en" ? "en-US" : 
                        language === "ar" ? "ar-SA" : "es-ES", 
                        {
                          year: "numeric",
                          month: "long", 
                          day: "numeric"
                        }
                      ).format(new Date(selectedGame.date))} {getText("at", "في", "a las")} {selectedGame.time}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {getText("Stadium:", "الملعب:", "Estadio:")} {selectedGame.stadium}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              variants={containerVariants}
            >
              <motion.div
                className="bg-card rounded-xl shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="ml-3 font-semibold">
                    {getText("Event Times", "أوقات الفعاليات", "Horarios de Eventos")}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getText(
                    "Gates open 2 hours before kickoff", 
                    "تفتح البوابات قبل ساعتين من بدء المباراة",
                    "Las puertas abren 2 horas antes del inicio"
                  )}
                </p>
              </motion.div>

              <motion.div
                className="bg-card rounded-xl shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Utensils className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="ml-3 font-semibold">
                    {getText("Food & Drinks", "الطعام والشراب", "Comida y Bebida")}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getText(
                    "12 food stands available", 
                    "12 منفذ طعام متاح",
                    "12 puestos de comida disponibles"
                  )}
                </p>
              </motion.div>

              <motion.div
                className="bg-card rounded-xl shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <DoorOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="ml-3 font-semibold">
                    {getText("Exits", "المخارج", "Salidas")}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {getText(
                    "8 exits available around stadium", 
                    "8 مخارج متاحة حول الملعب",
                    "8 salidas disponibles alrededor del estadio"
                  )}
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
          >
            <motion.div
              className="bg-card rounded-xl shadow-xl p-6 border border-gray-300"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
                <span className="bg-blue-600 text-white rounded-full p-1.5 mr-2">
                  <MessageSquare size={18} />
                </span>
                <img 
                  src="/midan-logo.png" 
                  alt="Midan" 
                  className="h-6 object-contain" 
                />
              </h2>

              {/* Updated iframe with new Dify chat URL */}
              <div className="h-[700px] w-full border border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  src="https://udify.app/chat/5cClLtF8XorKBVZu" // Updated URL
                  style={{ width: "100%", height: "100%", minHeight: "700px" }}
                  frameBorder="0"
                  allow="microphone">
                </iframe>
              </div>
            </motion.div>

            <motion.div
              className="bg-card rounded-xl shadow-md p-5 border border-gray-300"
              variants={itemVariants}
            >
              <div className="flex items-center mb-3">
                <Info className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">
                  {getText("Stadium Info", "معلومات الملعب", "Información del Estadio")}
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="text-sm flex justify-between">
                  <span className="text-muted-foreground">{getText("Capacity", "السعة", "Capacidad")}</span>
                  <span className="font-medium">65,000</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span className="text-muted-foreground">{getText("Food Stands", "منافذ الطعام", "Puestos de Comida")}</span>
                  <span className="font-medium">12</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span className="text-muted-foreground">{getText("Restrooms", "دورات المياه", "Baños")}</span>
                  <span className="font-medium">24</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span className="text-muted-foreground">{getText("First Aid", "الإسعافات الأولية", "Primeros Auxilios")}</span>
                  <span className="font-medium">4</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const Index: React.FC = () => {
  const { setLanguage } = useAppContext();
  const [langSelected, setLangSelected] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [seatInfo, setSeatInfo] = useState<{ section: string; row: string; seatNumber: string }>({
    section: "",
    row: "",
    seatNumber: ""
  });
  const [seatDone, setSeatDone] = useState(false);

  const handleLanguageSelect = (lang: 'en' | 'ar' | 'es') => {
    setLanguage(lang);
    setLangSelected(true);
  };

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  const handleSeatLocate = (info: { section: string; row: string; seatNumber: string }) => {
    setSeatInfo(info);
    setSeatDone(true);
  };

  if (!langSelected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <img 
          src="/midan-logo.png" 
          alt="Midan - Stadium Assistant" 
          className="w-48 mb-8 object-contain" 
        />
        <h1 className="text-3xl font-bold mb-6">Select Language / اختر اللغة / Seleccione Idioma</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => handleLanguageSelect('en')}
          >
            English
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => handleLanguageSelect('ar')}
          >
            العربية
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => handleLanguageSelect('es')}
          >
            Español
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {!selectedGame ? (
          <GameSelection onSelectGame={handleGameSelect} />
        ) : !seatDone ? (
          <SeatLocator onLocate={handleSeatLocate} />
        ) : (
          <StadiumNavigation selectedGame={selectedGame} seatInfo={seatInfo} />
        )}
      </main>
      {seatDone && (
        <>
          <EmergencyOverlay />
          <EmergencyFAB />
        </>
      )}
    </div>
  );
};

export default Index;
