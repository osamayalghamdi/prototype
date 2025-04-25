import React from "react";
import { useAppContext } from "../../contexts/AppContext";
import { Button } from "../ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { language, setLanguage } = useAppContext();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`flex items-center gap-1 ${language === "ar" ? "font-[IBM Plex Sans Arabic]" : ""} ${className}`}
          aria-label="Select language" // Consider adding translations here too if needed
        >
          <Globe size={16} />
          <span>
            {/* Re-add Spanish option */}
            {language === "en" ? "English" : 
             language === "ar" ? "العربية" : "Español"} 
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ar")}>
          العربية
        </DropdownMenuItem>
        {/* Re-add Spanish menu item */}
        <DropdownMenuItem onClick={() => setLanguage("es")}> 
          Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
