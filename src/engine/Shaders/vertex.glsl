varying vec2 vUv;
varying float vDist; // Send distance to fragment for coloring
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

void main() {
    vUv = uv;
    vec3 pos = position;

    // Aspect ratio correction so the "wound" is circular, not oval
    float aspect = uResolution.x / uResolution.y;
    vec2 aspectUV = uv;
    aspectUV.x *= aspect;
    vec2 aspectMouse = uMouse * 0.5 + 0.5;
    aspectMouse.x *= aspect;

    // Calculate distance from the "Sword"
    float dist = distance(aspectUV, aspectMouse);
    vDist = dist; // Pass to fragment

    // THE PUNCTURE
    // A sharp, deep indent where the mouse is
    float wound = smoothstep(0.3, 0.0, dist);
    
    // Push Z down heavily (The impact)
    pos.z -= wound * 0.5;

    // THE TREMOR
    // The vertices shake violently near the impact point
    float shake = sin(uTime * 20.0 + pos.y * 10.0) * 0.005;
    pos.x += shake * wound;
    pos.y += shake * wound;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}