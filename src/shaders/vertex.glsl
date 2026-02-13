varying vec2 vUv;
uniform float uTime;
uniform vec2 uMouse;

void main() {
    vUv = uv;
    vec3 pos = position;

    float dist = distance(uv, uMouse * 0.5 + 0.5);
    
    // SPIKE: Not a smooth bend. A digital spike.
    float spike = pow(1.0 - dist, 20.0); // Extremely sharp falloff
    
    // The "Wrong" Math: Adding uTime to the displacement even when idle
    pos.z += spike * 1.5;
    pos.x += sin(pos.y * 10.0 + uTime) * (spike * 0.2);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}