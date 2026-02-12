uniform float uTime;
uniform vec2 uRectPos; // The "Identity Node" position (0.0 to 1.0)
uniform vec2 uResolution;

varying vec2 vUv;
varying float vElevation;

void main() {
    vUv = uv;

    // --- STRUCTURAL NORMALIZATION ---
    // Convert 3D space to 2D screen space ratio
    vec2 normalizedPos = position.xy / vec2(30.0, 20.0) + 0.5;
    float aspect = uResolution.x / uResolution.y;
    
    // Vector from vertex to Identity Node
    vec2 distVec = normalizedPos - uRectPos;
    distVec.x *= aspect; 
    
    float dist = length(distVec);

    // --- COHERENCE COMPRESSION FORMULA ---
    // 1. The Ripple: A wave emanating from the node
    float elevation = sin(dist * 10.0 - uTime * 1.5) * 0.5;
    
    // 2. The Decay: Effect fades over distance
    elevation *= exp(-dist * 3.0);
    
    // 3. The Gravity: Grid lines are pulled TIGHTLY into the node
    float pull = exp(-dist * 5.0) * 2.5;
    
    vec3 newPos = position;
    newPos.z += elevation + pull;

    vElevation = newPos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}