uniform float uTime;
uniform float uState;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vDisplacement;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Fresnel Effect (The Glass Edge)
    float fresnel = dot(viewDir, normal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    
    float edgeLight = pow(fresnel, 3.0);

    // Deep Obsidian Base
    vec3 baseColor = vec3(0.01, 0.01, 0.01); 
    
    // The Aura (Cold Silver)
    vec3 auraColor = vec3(1.0, 1.0, 1.0);
    
    // Chromatic Aberration
    float redEdge = pow(fresnel, 2.8) * 0.5;
    float blueEdge = pow(fresnel, 3.2) * 0.5;

    // Combine lighting
    vec3 finalColor = baseColor;
    finalColor += auraColor * edgeLight;
    finalColor += vec3(0.1) * abs(vDisplacement) * 2.0;

    // Apply color split
    finalColor.r += redEdge * 0.1;
    finalColor.b += blueEdge * 0.15;

    // The Lock: If uState = 1.0, transition to pure white
    finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), uState);

    gl_FragColor = vec4(finalColor, 1.0);
}