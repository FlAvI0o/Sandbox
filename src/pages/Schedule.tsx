import React, { useState } from 'react';

const Schedule: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'executing' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('executing');
    // Simulate the high-speed uplink
    setTimeout(() => setStatus('sent'), 2000);
  };

  if (status === 'sent') {
    return (
      <main className="fixed inset-0 z-50 flex items-center justify-center p-10 pointer-events-none bg-black/80 backdrop-blur-sm">
        <div className="text-center pointer-events-auto border border-red-500/30 p-12 bg-black">
          <h2 className="text-white text-2xl font-black uppercase tracking-tight mb-2">Signal Received.</h2>
          <p className="text-white/60 font-mono text-xs uppercase tracking-widest mb-6">
            The channel is open.
          </p>
          <p className="text-white/40 font-mono text-[10px] max-w-xs mx-auto">
            We are reviewing your coordinates. Expect a secured transmission within 24 hours.
          </p>
          <button onClick={() => window.location.reload()} className="mt-8 text-red-500 text-[10px] font-mono hover:text-white uppercase tracking-widest">
            [Reset_System]
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center p-10 pointer-events-none">
      
      {/* THE TERMINAL */}
      <form 
        onSubmit={handleSubmit}
        className="max-w-xl w-full pointer-events-auto bg-[#050505] border border-white/10 p-12 flex flex-col gap-8 relative shadow-2xl"
      >
        {/* Status Light */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-green-500/50 font-mono text-[8px] uppercase tracking-widest">Uplink_Secure</span>
        </div>

        <div>
          <h2 className="text-white text-3xl font-black uppercase tracking-tighter mb-2">
            Establish Link.
          </h2>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
            From Founder // To Architect
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-white/30 font-mono text-[9px] uppercase tracking-widest">Identity</label>
              <input required placeholder="NAME / CALLSIGN" type="text" className="bg-transparent border-b border-white/20 py-2 text-white font-mono text-xs outline-none focus:border-red-500 transition-colors placeholder:text-white/10" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white/30 font-mono text-[9px] uppercase tracking-widest">Frequency</label>
              <input required placeholder="EMAIL ADDRESS" type="email" className="bg-transparent border-b border-white/20 py-2 text-white font-mono text-xs outline-none focus:border-red-500 transition-colors placeholder:text-white/10" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white/30 font-mono text-[9px] uppercase tracking-widest">The Objective</label>
            <textarea required rows={1} placeholder="DESCRIBE THE TARGET OR THE MISMATCH" className="bg-transparent border-b border-white/20 py-2 text-white font-mono text-xs outline-none focus:border-red-500 transition-colors resize-none placeholder:text-white/10 h-20" />
          </div>
        </div>

        <button 
          type="submit"
          disabled={status === 'executing'}
          className="group relative w-full py-4 bg-white text-black border border-white font-mono text-[10px] uppercase tracking-[0.3em] overflow-hidden hover:bg-black hover:text-white hover:border-white transition-all duration-300 cursor-crosshair mt-4"
        >
          <span className="relative z-10">
            {status === 'idle' ? 'Transmit_Coordinates' : 'Encrypting_Payload...'}
          </span>
          {/* Progress Bar Animation */}
          {status === 'executing' && (
            <div className="absolute inset-0 bg-red-600 w-full animate-[wiggle_1s_ease-in-out_infinite]" />
          )}
        </button>

      </form>
    </main>
  );
};

export default Schedule;