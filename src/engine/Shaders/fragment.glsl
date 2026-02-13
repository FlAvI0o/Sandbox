// fragment.glsl - The Organic Wound
varying vec2 vUv;
varying float vDist;
uniform float uTime;

// 1. IMPROVED NOISE (More granular)
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
    // 2. THE ARENA FLOOR (Rougher concrete texture)
    float n = noise(vUv * 20.0 + uTime * 0.05); 
    vec3 dust = vec3(0.05, 0.05, 0.05); 
    dust += n * 0.03; 

    // 3. THE TEAR (Distort the distance field)
    // We add noise to the distance so the circle is NOT perfect. It's jagged.
    float tearNoise = noise(vUv * 10.0 - uTime * 0.2); 
    float distortedDist = vDist + tearNoise * 0.1; // WARPING THE CIRCLE

    // 4. THE BLOOD (Deep and textured)
    vec3 deepBlood = vec3(0.4, 0.0, 0.0); // Dried blood
    vec3 freshBlood = vec3(1.0, 0.0, 0.0); // Arterial bright
    
    // 5. THE CUT
    // The cut happens closer to the center, based on the jagged distance
    float cut = smoothstep(0.12, 0.02, distortedDist);
    
    // 6. THE SATIRIC GOLD (The Rim)
    // Only appears on the very edge of the jagged cut
    float rim = smoothstep(0.13, 0.12, distortedDist) * smoothstep(0.11, 0.12, distortedDist);
    
    // Combine
    vec3 bloodTexture = mix(deepBlood, freshBlood, noise(vUv * 50.0));
    vec3 finalColor = mix(dust, bloodTexture, cut);
    
    // Add the gold, but make it flicker slightly
    finalColor += vec3(1.0, 0.9, 0.4) * rim * 3.0;

    gl_FragColor = vec4(finalColor, 1.0);
}