import React, { useState } from 'react';

interface FilterProps {
  onPass: () => void;
}

const Filter: React.FC<FilterProps> = ({ onPass }) => {
  const [input, setInput] = useState('');
  const targetPhrase = "NO COMPROMISE";
  const isUnlocked = input === targetPhrase;

  return (
    <main className="fixed inset-0 z-50 flex flex-col items-center justify-center p-10 pointer-events-none selection:bg-red-900 selection:text-white backdrop-blur-md bg-black/60">
      
      {/* THE MANIFESTO CARD */}
      <div className="max-w-3xl w-full pointer-events-auto border border-white/10 bg-[#0a0a0a] p-12 relative overflow-hidden shadow-2xl">
        
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* The Red Line (The "Bloodline") */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-700" />

        <div className="relative z-10 flex flex-col gap-10">
          
          <div className="pl-6">
            <h2 className="text-white text-3xl font-black uppercase tracking-tighter mb-2">
              The Alignment.
            </h2>
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
              Clearance Level: Founder // Architect
            </p>
          </div>

          {/* THE DOCTRINE OF POWER (Positive Framing) */}
          <div className="space-y-8 pl-6 border-l border-white/5">
            
            <div className="group">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2 group-hover:text-red-500 transition-colors">
                01. Sovereignty Over Trends
              </h3>
              <p className="text-white/60 font-mono text-xs leading-relaxed max-w-lg">
                We do not chase the market's fluctuating tastes. We build timeless, closed systems that force the market to adapt to <em>you</em>.
              </p>
            </div>

            <div className="group">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2 group-hover:text-red-500 transition-colors">
                02. Authority Over Appeal
              </h3>
              <p className="text-white/60 font-mono text-xs leading-relaxed max-w-lg">
                Most brands beg to be liked. We build infrastructure that demands to be respected. We design for dominance, not consensus.
              </p>
            </div>

            <div className="group">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2 group-hover:text-red-500 transition-colors">
                03. Speed as a Weapon
              </h3>
              <p className="text-white/60 font-mono text-xs leading-relaxed max-w-lg">
                Hesitation is the death of signal. We execute with decisive, high-bandwidth precision. No committees. No dilution.
              </p>
            </div>

          </div>

          {/* THE HANDSHAKE */}
          <div className="mt-4 pt-8 border-t border-white/10 flex flex-col gap-4">
            <label className="text-white/30 font-mono text-[10px] uppercase tracking-widest">
              Confirm Alignment. Type: <span className="text-white">"NO COMPROMISE"</span>
            </label>
            
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="AWAITING_CONFIRMATION"
              className="bg-transparent border-b border-white/20 text-white font-mono text-2xl py-2 outline-none focus:border-red-500 transition-colors uppercase w-full placeholder:text-white/5"
              autoComplete="off"
            />

            <div className="flex justify-end mt-4">
              <button 
                onClick={isUnlocked ? onPass : undefined}
                className={`px-8 py-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border
                  ${isUnlocked 
                    ? 'bg-white text-black border-white hover:bg-red-600 hover:text-white hover:border-red-600 cursor-crosshair' 
                    : 'bg-transparent border-white/10 text-white/10 cursor-not-allowed'
                  }
                `}
              >
                {isUnlocked ? 'Enter_Protocol' : 'Locked'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Filter;