/**
 * DeckForge Coherence Engine
 * Handles the WebGL distortion field and identity node coupling.
 */

// options allow for future scalability (e.g. changing vapor colors dynamically)
export interface EngineOptions {
  vaporColor1?: string;
  vaporColor2?: string;
}

/**
 * Mounts the WebGL Coherence Engine to the DOM.
 * * @param container - The <div> where the canvas will be injected.
 * @param identityNode - The <div> acting as the "Identity Node" (your photo).
 * @param options - Optional configuration for the vapor field.
 * * @returns A cleanup function that disposes of the scene, 
 * stops the animation loop, and removes event listeners.
 */
export function mountCoherenceEngine(
  container: HTMLDivElement,
  identityNode: HTMLDivElement,
  options?: EngineOptions
): () => void;