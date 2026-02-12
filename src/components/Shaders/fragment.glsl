uniform float uTime;

varying vec2 vUv;
varying float vElevation;

void main() {
    // --- GRID LOGIC ---
    // Sharp, thin lines for structural integrity
    float gridX = step(0.98, fract(vUv.x * 40.0));
    float gridY = step(0.98, fract(vUv.y * 40.0));
    float grid = max(gridX, gridY);

    // --- PALETTE ---
    vec3 colorBg = vec3(0.02, 0.02, 0.05); // Void
    vec3 colorGrid = vec3(0.2, 0.2, 0.3);  // Structure
    vec3 colorVapor = vec3(0.0, 1.0, 0.94); // Cyan (Energy)
    vec3 colorCore = vec3(1.0, 0.0, 0.75);  // Magenta (Identity)

    // --- MIXING ---
    vec3 finalColor = mix(colorBg, colorGrid, grid);
    
    // Glow based on elevation (proximity to identity)
    float intensity = smoothstep(0.0, 2.0, vElevation);
    vec3 glow = mix(colorCore, colorVapor, vElevation * 0.5 + 0.5);
    
    finalColor += glow * intensity * 0.8;
    
    // Vignette / Fade edges
    float alpha = 1.0 - smoothstep(0.4, 0.5, distance(vUv, vec2(0.5)));

    gl_FragColor = vec4(finalColor, 1.0);
}