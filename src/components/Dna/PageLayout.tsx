import { useEffect } from "react";
import initBackground from "./Background/HomeBackground.js";

import { mountCoherenceEngine } from '../Dna/Background/main.js'; // Imports the JS logic

type PageLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  useEffect(() => {
    const cleanup = initBackground() as unknown as (() => void) | null;
    return () => { if (typeof cleanup === "function") cleanup(); };
  }, []);

  return (
    /* THE FLOOR: This carries the brand color */
    <div className={`relative min-h-screen  ${className}`}>

      {/* THE BASEMENT: Sink only the background. 
          z-[-1] is enough if the parent is the 'Floor'. */}
      <canvas
        id="deckforge-bg"
        className="fixed inset-0 w-screen h-screen z-[-1] pointer-events-none " 
      />
      
      {/* THE GROUND FLOOR: Everything else must be z-10 or higher 
          to stay above the basement but in front of the color. */}
      <main >
        {children}
      </main>

    </div>
  );
}