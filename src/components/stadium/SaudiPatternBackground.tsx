
import React from "react";

const SaudiPatternBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-5 pointer-events-none">
      <svg 
        width="100%" 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-stadium-primary"
      >
        <defs>
          <pattern 
            id="saudi-pattern" 
            x="0" 
            y="0" 
            width="80" 
            height="80" 
            patternUnits="userSpaceOnUse"
          >
            <path 
              d="M20 0L0 20L20 40L40 20L20 0Z M60 40L40 60L60 80L80 60L60 40Z" 
              fill="currentColor"
            />
            <path 
              d="M60 0L40 20L60 40L80 20L60 0Z M20 40L0 60L20 80L40 60L20 40Z" 
              fill="currentColor"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#saudi-pattern)" />
      </svg>
    </div>
  );
};

export default SaudiPatternBackground;
