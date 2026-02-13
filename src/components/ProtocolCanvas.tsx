import React, { useEffect, useRef } from 'react';
import World from '../engine/World';

interface CanvasProps {
  phase: number; // 0 = Arena, 1 = Ascension
}

const ProtocolCanvas: React.FC<CanvasProps> = ({ phase }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<World | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    worldRef.current = new World(containerRef.current);
    return () => worldRef.current?.destroy();
  }, []);

  // REACT TO PHASE CHANGES
  useEffect(() => {
    if (worldRef.current) {
        worldRef.current.setPhase(phase);
    }
  }, [phase]);

  return <div ref={containerRef} className="fixed inset-0 z-0" />;
};

export default ProtocolCanvas;