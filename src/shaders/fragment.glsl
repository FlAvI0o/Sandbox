varying vec2 vUv;
varying float vDist;
uniform float uTime;
uniform float uState; // 0.0 = BLOOD (Chaos), 1.0 = GOLD (Order)

// Noise function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    // 1. BASE TEXTURE (Evolves from Dust to Silk)
    // When uState goes up, the frequency lowers (becoming smoother)
    float freq = mix(50.0, 10.0, uState);
    float n = noise(vUv * freq + uTime * 0.05); 
    
    // 2. COLORS
    // PALETTE A: The Arena (Iron & Blood)
    vec3 iron = vec3(0.05, 0.05, 0.05);
    vec3 blood = vec3(0.6, 0.0, 0.0);
    
    // PALETTE B: The Kingdom (Obsidian & Gold)
    vec3 obsidian = vec3(0.0, 0.0, 0.0);
    vec3 gold = vec3(1.0, 0.8, 0.2);

    // 3. INTERACTION LOGIC
    float dist = vDist; // Distance from mouse
    
    // CHAOS MODE (State 0): Jagged tears
    float tear = smoothstep(0.15, 0.0, dist + noise(vUv * 20.0)*0.1);
    
    // ORDER MODE (State 1): Perfect geometric ripples
    float ripple = sin(dist * 40.0 - uTime * 2.0) * 0.5 + 0.5;
    float ring = smoothstep(0.4, 0.0, dist) * ripple;

    // 4. MIXING THE SOUL
    // Interpolate everything based on uState
    vec3 baseColor = mix(iron, obsidian, uState);
    vec3 activeColor = mix(blood, gold, uState);
    float shape = mix(tear, ring, uState); // Chaos -> Order shape

    // Final composition
    vec3 finalColor = mix(baseColor, activeColor, shape);

    // Add a "Holy" glow in State 1
    finalColor += gold * (uState * 0.1) * noise(vUv * 5.0 + uTime);

    gl_FragColor = vec4(finalColor, 1.0);
}