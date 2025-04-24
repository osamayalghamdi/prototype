import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAppContext } from "../../contexts/AppContext";

export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  stadium: string;
}

interface Props {
  onSelectGame?: (game: Game) => void;
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

const GameSelection: React.FC<Props> = ({ onSelectGame }) => {
  const { language } = useAppContext();
  
  // Helper function for localized text
  const getText = (en: string, ar: string, es: string) => {
    if (language === "en") return en;
    if (language === "ar") return ar;
    if (language === "es") return es;
    return en; // Default to English
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    // Add es-ES locale for date formatting
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : language === "ar" ? "ar-SA" : "es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(date);
  };
  
  return (
    <section className="my-8 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {/* Use getText for title */}
        {getText("Select Your Game", "اختر المباراة", "Selecciona Tu Partido")}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingGames.map((game) => (
          <Card
            key={game.id}
            onClick={() => onSelectGame?.(game)}
            className="cursor-pointer overflow-hidden transform transition duration-300 hover:scale-105 shadow-md hover:shadow-xl rounded-xl border border-gray-200"
          >
            <CardHeader className="bg-gradient-to-r from-stadium-primary to-stadium-primary/50 p-4">
              <CardTitle className="flex justify-between items-center text-lg font-semibold text-white">
                <span>{game.stadium}</span>
                <span className="text-xs bg-white bg-opacity-30 backdrop-blur-sm px-2 py-1 rounded uppercase">
                  {game.time}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-4 px-5 bg-card">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{game.homeTeam}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {/* Use getText for Home label */}
                    {getText("Home", "المضيف", "Local")}
                  </span>
                </div>
                <div className="flex justify-center">
                  <span className="bg-muted text-muted-foreground px-4 py-1 rounded-full text-xs">
                    {/* Use getText for VS label */}
                    {getText("VS", "ضد", "VS")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">{game.awayTeam}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {/* Use getText for Away label */}
                    {getText("Away", "الضيف", "Visitante")}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-border text-center text-sm text-muted-foreground">
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
