import { useEffect, useRef } from 'react';
import { CoherenceEngine } from '@/GraphicEngine/engine'; // Adjust the path as needed

export default function DeckForge() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  
  // We use a ref to hold the engine instance so we can destroy it properly
  const engineRef = useRef<CoherenceEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !identityRef.current) return;

    // Initialize System B (The Engine)
    engineRef.current = new CoherenceEngine(
        canvasRef.current, 
        identityRef.current
    );

    // React Cleanup: Destroy the engine when component unmounts
    return () => {
      engineRef.current?.dispose();
    };
  }, []);

  return (
    <>
      <div id="canvas-container" ref={canvasRef} />

      <main>
        <div className="copy-block">
            <h1>Coherence<br/>Compression<br/>Engine.</h1>
            <p>
                DeckForge is not a site builder. It is a structural repositioning blueprint.
            </p>
        </div>
        
        {/* The Identity Node */}
        <div className="identity-node" ref={identityRef}></div>
      </main>
    </>
  );
}