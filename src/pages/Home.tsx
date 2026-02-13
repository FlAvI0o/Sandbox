import React from 'react';

type HomeProps = {
  onStart: () => void;
};

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    // 1. THE ARENA CAGE
    // fixed inset-0: Locks to the viewport.
    // pointer-events-none: Allows the mouse to pass through the empty space and cut the WebGL canvas behind it.
    // z-50: Forces the UI above Layer 0 (The Engine).
    <main className="fixed inset-0 z-50 overflow-hidden pointer-events-none selection:bg-red-900 selection:text-white">
      
      {/* 2. THE AUDIENCE / SATIRE (Top Left) */}
      <div className="absolute top-10 left-10 z-50 mix-blend-difference">
        <div className="flex flex-col gap-1">
          <p className="text-white/60 font-mono text-[10px] uppercase tracking-widest leading-none">
            Arena_Status: Live
          </p>
          <p className="text-white/60 font-mono text-[10px] uppercase tracking-widest leading-none">
            Victim_Count: 001
          </p>
        </div>
      </div>

      {/* 3. THE GHOST / THE SIGNAL (Center) */}
      <div className="absolute inset-0 flex items-center justify-center z-40">
        {/* - opacity-20 + mix-blend-difference: Creates the ghostly watermark that reacts to the blood shader.
           - clamp(5rem, 25vw, 35rem): Ensures it is massive but never breaks the layout constraint.
           - tracking-[-0.08em]: Smashes the letters together for density.
        */}
        <h1 className="text-[clamp(5rem,25vw,35rem)] font-[1000] text-white tracking-[-0.08em] leading-none whitespace-nowrap uppercase opacity-20 mix-blend-difference">
          TORO
        </h1>
      </div>

      {/* 4. THE ESTOCADA / THE OFFER (Bottom Right) */}
      {/* pointer-events-auto: Reactivates the mouse for this specific section so links/hovers work. */}
      <div className="absolute bottom-10 right-10 z-50 pointer-events-auto flex flex-col items-end gap-8 text-right">
        
        {/* HEADER */}
        <div>
          <h2 className="text-white text-3xl font-bold uppercase mb-2 mix-blend-difference">
            The Estocada.
          </h2>
          <p className="text-white/50 text-[10px] font-mono uppercase tracking-widest">
            Deployment: Global // [High-Ticket]
          </p>
        </div>

        {/* THE WEAPON RACK (Services) */}
        <ul className="space-y-3">
          <li className="group flex items-center justify-end gap-3 cursor-crosshair">
            <span className="text-white/40 text-[10px] font-mono uppercase group-hover:text-red-500 transition-colors duration-300">
              01 // Identity_Architecture
            </span>
            <div className="w-1.5 h-1.5 bg-white/20 group-hover:bg-red-500 transform group-hover:rotate-45 transition-all duration-300" />
          </li>
          <li className="group flex items-center justify-end gap-3 cursor-crosshair">
            <span className="text-white/40 text-[10px] font-mono uppercase group-hover:text-red-500 transition-colors duration-300">
              02 // Closed_System_Web
            </span>
            <div className="w-1.5 h-1.5 bg-white/20 group-hover:bg-red-500 transform group-hover:rotate-45 transition-all duration-300" />
          </li>
          <li className="group flex items-center justify-end gap-3 cursor-crosshair">
            <span className="text-white/40 text-[10px] font-mono uppercase group-hover:text-red-500 transition-colors duration-300">
              03 // Signal_Enforcement
            </span>
            <div className="w-1.5 h-1.5 bg-white/20 group-hover:bg-red-500 transform group-hover:rotate-45 transition-all duration-300" />
          </li>
        </ul>

        {/* DOCTRINE & CTA */}
        <div className="flex flex-col items-end gap-6 mt-2">
          <p className="text-white/60 text-xs font-mono max-w-xs leading-relaxed mix-blend-difference">
            The market is a noisy beast. We do not guide it. We silence it.
          </p>
          
          <button
            onClick={onStart}
            className="group relative px-10 py-4 bg-black border border-red-900 text-red-600 font-mono text-[10px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 hover:border-red-500 hover:text-white cursor-crosshair"
          >
            <span className="relative z-10">Initialize_Protocol</span>
            {/* The Blood Fill Animation */}
            <div className="absolute inset-0 bg-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
        </div>

      </div>
    </main>
  );
};

export default Home;