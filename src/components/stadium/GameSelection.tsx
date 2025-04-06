
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAppContext } from "../../contexts/AppContext";

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  stadium: string;
}

const upcomingGames: Game[] = [
  {
    id: "game1",
    homeTeam: "Al-Hilal",
    awayTeam: "Al-Nassr",
    date: "2025-04-12",
    time: "19:00",
    stadium: "King Fahd Stadium"
  },
  {
    id: "game2",
    homeTeam: "Al-Ahli",
    awayTeam: "Al-Ittihad",
    date: "2025-04-15",
    time: "20:30",
    stadium: "King Abdullah Sports City"
  },
  {
    id: "game3",
    homeTeam: "Al-Shabab",
    awayTeam: "Al-Faisaly",
    date: "2025-04-18",
    time: "18:45",
    stadium: "Prince Faisal bin Fahd Stadium"
  }
];

const GameSelection: React.FC = () => {
  const { language } = useAppContext();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };
  
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {language === "en" ? "Select Your Game" : "اختر المباراة"}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingGames.map((game) => (
          <Card 
            key={game.id}
            className="overflow-hidden transition-all hover:shadow-lg border-l-4 border-l-stadium-primary hover:scale-[1.02]"
          >
            <CardHeader className="bg-gradient-to-r from-stadium-primary/10 to-transparent">
              <CardTitle className="flex justify-between items-center">
                <span className="text-stadium-primary">{game.stadium}</span>
                <span className="text-sm bg-stadium-primary text-white px-2 py-1 rounded">
                  {game.time}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{game.homeTeam}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {language === "en" ? "Home" : "المضيف"}
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-xs">
                    {language === "en" ? "VS" : "ضد"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{game.awayTeam}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {language === "en" ? "Away" : "الضيف"}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t text-center text-sm text-gray-600">
                  {formatDate(game.date)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default GameSelection;
