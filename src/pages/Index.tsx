import React, { useState } from "react";
import EmergencyOverlay from "../components/emergency/EmergencyOverlay";
import EmergencyFAB from "../components/emergency/EmergencyFAB";
import Header from "../components/layout/Header";
import StadiumMap from "../components/map/StadiumMap";
import SmartChat from "../components/chat/SmartChat";
import WelcomeBanner from "../components/stadium/WelcomeBanner";
import GameSelection from "../components/stadium/GameSelection";
import SeatLocator from "../components/stadium/SeatLocator";
import SaudiPatternBackground from "../components/stadium/SaudiPatternBackground";
import { useAppContext } from "../contexts/AppContext";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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

const StadiumNavigation: React.FC = () => {
  const { language } = useAppContext();
  const [activeTab, setActiveTab] = useState("map");
  
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
        <WelcomeBanner />
        
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              className="bg-white rounded-xl shadow-xl p-6 border border-gray-100"
              variants={itemVariants}
            >
              <Tabs defaultValue="map" onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-stadium-primary flex items-center gap-2">
                    {activeTab === "map" && <MapIcon className="h-6 w-6" />}
                    {activeTab === "seat" && <MapPin className="h-6 w-6" />}
                    {activeTab === "games" && <Calendar className="h-6 w-6" />}
                    {language === "en" ? 
                      (activeTab === "map" ? "Stadium Map" : 
                       activeTab === "seat" ? "Find Your Seat" : "Today's Games") : 
                      (activeTab === "map" ? "خريطة الملعب" : 
                       activeTab === "seat" ? "ابحث عن مقعدك" : "مباريات اليوم")}
                  </h2>
                  <TabsList className="grid grid-cols-3 h-9">
                    <TabsTrigger value="map" className="flex items-center gap-1 px-3">
                      <MapIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">{language === "en" ? "Map" : "خريطة"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="seat" className="flex items-center gap-1 px-3">
                      <MapPin className="h-4 w-4" />
                      <span className="hidden sm:inline">{language === "en" ? "Seats" : "مقاعد"}</span>
                    </TabsTrigger>
                    <TabsTrigger value="games" className="flex items-center gap-1 px-3">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">{language === "en" ? "Games" : "مباريات"}</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="map" className="mt-0">
                  <StadiumMap />
                </TabsContent>
                
                <TabsContent value="seat" className="mt-0">
                  <SeatLocator />
                </TabsContent>
                
                <TabsContent value="games" className="mt-0">
                  <GameSelection />
                </TabsContent>
              </Tabs>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              variants={containerVariants}
            >
              <motion.div 
                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="ml-3 font-semibold">
                    {language === "en" ? "Event Times" : "أوقات الفعاليات"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "Gates open 2 hours before kickoff" : "تفتح البوابات قبل ساعتين من بدء المباراة"}
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Utensils className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="ml-3 font-semibold">
                    {language === "en" ? "Food & Drinks" : "الطعام والشراب"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "12 food stands available" : "12 منفذ طعام متاح"}
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500 hover:shadow-lg transition-shadow"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start mb-2">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <DoorOpen className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="ml-3 font-semibold">
                    {language === "en" ? "Exits" : "المخارج"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "8 exits available around stadium" : "8 مخارج متاحة حول الملعب"}
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
              className="bg-white rounded-xl shadow-xl p-6 border border-indigo-100"
              variants={itemVariants}
            >
              <h2 className="text-xl font-bold mb-4 text-stadium-primary flex items-center">
                <span className="stadium-gradient text-white rounded-full p-1.5 mr-2">
                  <MessageSquare size={18} />
                </span>
                {language === "en" ? "FanBot AI Assistant" : "المساعد الذكي فان بوت"}
              </h2>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-4 border border-blue-100">
                <p className="text-gray-700">
                  {language === "en" 
                    ? "I can help with navigation, information, and emergency assistance! What can I help you with today?"
                    : "يمكنني المساعدة في التنقل والمعلومات والمساعدة في حالات الطوارئ! كيف يمكنني مساعدتك اليوم؟"}
                </p>
              </div>
              
              <div className="relative mb-4">
                <input 
                  type="text" 
                  placeholder={language === "en" ? "Ask me anything..." : "اسألني أي شيء..."}
                  className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-2.5 text-gray-400 h-5 w-5" />
              </div>
              
              <div className="space-y-2 mb-4">
                <h3 className="text-sm font-medium text-gray-700">
                  {language === "en" ? "Popular Questions" : "الأسئلة الشائعة"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="px-3 py-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                    onClick={() => handleQuickQuestion("Where are the exits?")}
                  >
                    <DoorOpen className="h-4 w-4 text-blue-600" />
                    {language === "en" ? "Where are the exits?" : "أين المخارج؟"}
                  </button>
                  <button 
                    className="px-3 py-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                    onClick={() => handleQuickQuestion("Where can I find food?")}
                  >
                    <Utensils className="h-4 w-4 text-blue-600" />
                    {language === "en" ? "Where can I find food?" : "أين يمكنني العثور على الطعام؟"}
                  </button>
                  <button 
                    className="px-3 py-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                    onClick={() => handleQuickQuestion("What time is the game?")}
                  >
                    <Clock className="h-4 w-4 text-blue-600" />
                    {language === "en" ? "What time is the game?" : "متى موعد المباراة؟"}
                  </button>
                </div>
              </div>
              
              <button className="w-full py-2.5 px-4 bg-stadium-gradient text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                {language === "en" ? "Open Chat Assistant" : "فتح مساعد الدردشة"}
              </button>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-xl shadow-md p-5 border border-gray-100"
              variants={itemVariants}
            >
              <div className="flex items-center mb-3">
                <Info className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="font-semibold text-gray-900">
                  {language === "en" ? "Stadium Info" : "معلومات الملعب"}
                </h3>
              </div>
              <ul className="space-y-2">
                <li className="text-sm flex justify-between">
                  <span className="text-gray-600">{language === "en" ? "Capacity" : "السعة"}</span>
                  <span className="font-medium">65,000</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span className="text-gray-600">{language === "en" ? "Food Stands" : "منافذ الطعام"}</span>
                  <span className="font-medium">12</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span className="text-gray-600">{language === "en" ? "Restrooms" : "دورات المياه"}</span>
                  <span className="font-medium">24</span>
                </li>
                <li className="text-sm flex justify-between">
                  <span className="text-gray-600">{language === "en" ? "First Aid" : "الإسعافات الأولية"}</span>
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
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <StadiumNavigation />
      </main>
      <EmergencyOverlay />
      <EmergencyFAB />
      <SmartChat />
    </div>
  );
};

export default Index;
