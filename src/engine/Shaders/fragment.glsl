uniform float uTime;
uniform float uState;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vDisplacement;

void main() {
    // Re-normalize in fragment shader for accurate lighting
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // FRESNEL CALCULATION: How much the surface points away from the camera
    float fresnel = dot(viewDir, normal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    
    // Sharpen the fresnel for a "glassy" edge
    float edgeLight = pow(fresnel, 3.0);

    // Deep Obsidian Base
    vec3 baseColor = vec3(0.01, 0.01, 0.01); // Pure black/dark grey
    
    // The Light Aura (Cold White / Silver)
    vec3 auraColor = vec3(1.0, 1.0, 1.0);
    
    // Chromatic Aberration Simulation (Subtle color splitting on the edges)
    float redEdge = pow(fresnel, 2.8) * 0.5;
    float blueEdge = pow(fresnel, 3.2) * 0.5;

    // Combine
    vec3 finalColor = baseColor;
    finalColor += auraColor * edgeLight;
    
    // Add subtle structural lines based on the displacement (makes the liquid look like it has inner facets)
    finalColor += vec3(0.1) * abs(vDisplacement) * 2.0;

    // Add subtle color split on extreme edges for expensive lens feel
    finalColor.r += redEdge * 0.1;
    finalColor.b += blueEdge * 0.15;

    // If uState = 1.0 (Signal Accepted), turn it pure blinding white
    finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), uState);

    gl_FragColor = vec4(finalColor, 1.0);
}