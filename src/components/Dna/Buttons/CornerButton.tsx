import React from 'react';

interface CornerButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const CornerButton: React.FC<CornerButtonProps> = ({ 
  onClick, 
  children, 
  className = "" 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`relative group px-12 py-5 bg-transparent transition-all duration-1000 ease-[cubic-bezier(0.2,0,0,1)] ${className}`}
    >
      {/* I MIRINI (CORNER BRACKETS)
          Questi definiscono la "Tactile Affordance". 
          Al hover si espandono e diventano nitidi, simulando una calibrazione attiva.
      */}
      
      {/* Top Left */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/10 group-hover:border-black/80 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)]" />
      
      {/* Top Right */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/10 group-hover:border-black/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)]" />
      
      {/* Bottom Left */}
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/10 group-hover:border-black/80 group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)]" />
      
      {/* Bottom Right */}
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/10 group-hover:border-black/80 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)]" />

      {/* LABEL TECNICA
          Utilizziamo JetBrains Mono per mantenere l'autorità del sistema.
      */}
      <span className="relative z-10 text-[11px] uppercase tracking-[0.5em] text-black/30 group-hover:text-black transition-colors duration-1000 font-mono font-light">
        {children}
      </span>

      {/* THE SENSORY GLOW
          Un'ombra interna quasi invisibile per dare massa al pulsante.
      */}
      <div className="absolute inset-0 bg-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </button>
  );
};