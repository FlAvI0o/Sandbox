import * as THREE from 'three';

export function mountCoherenceEngine(container, identityNode) {
    // --- 1. SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Mount the canvas
    container.appendChild(renderer.domElement);

    // --- 2. GEOMETRY & SHADERS (The Logic) ---
    const geometry = new THREE.PlaneGeometry(30, 20, 128, 128);

    const vertexShader = `
        uniform float uTime;
        uniform vec2 uRectPos;
        uniform vec2 uResolution;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
            vUv = uv;
            vec2 normalizedPos = position.xy / vec2(30.0, 20.0) + 0.5;
            float aspect = uResolution.x / uResolution.y;
            vec2 distVec = normalizedPos - uRectPos;
            distVec.x *= aspect; 
            float dist = length(distVec);

            float elevation = sin(dist * 10.0 - uTime * 1.5) * 0.5;
            elevation *= exp(-dist * 3.0);
            float pull = exp(-dist * 5.0) * 2.0;
            
            vec3 newPos = position;
            newPos.z += elevation + pull;
            vElevation = newPos.z;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
            float gridX = step(0.98, fract(vUv.x * 40.0));
            float gridY = step(0.98, fract(vUv.y * 40.0));
            float grid = max(gridX, gridY);

            vec3 colorBg = vec3(0.02, 0.02, 0.05);
            vec3 colorGrid = vec3(0.2, 0.2, 0.3);
            vec3 colorHigh = vec3(0.0, 1.0, 0.94);
            vec3 colorDeep = vec3(1.0, 0.0, 0.75);

            vec3 finalColor = mix(colorBg, colorGrid, grid);
            float intensity = smoothstep(0.0, 2.0, vElevation);
            vec3 glow = mix(colorDeep, colorHigh, vElevation * 0.5 + 0.5);
            
            finalColor += glow * intensity * 0.8;
            float alpha = 1.0 - smoothstep(0.4, 0.5, distance(vUv, vec2(0.5)));

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uRectPos: { value: new THREE.Vector2(0.5, 0.5) }
        },
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // --- 3. CORE FUNCTIONS ---
    function updateIdentityPosition() {
        if (!identityNode) return;
        const rect = identityNode.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = centerX / window.innerWidth;
        const y = 1.0 - (centerY / window.innerHeight);
        material.uniforms.uRectPos.value.set(x, y);
    }

    function handleResize() {
        material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // --- 4. LOOP & CLEANUP ---
    let animationId;
    const clock = new THREE.Clock();

    function animate() {
        animationId = requestAnimationFrame(animate);
        material.uniforms.uTime.value = clock.getElapsedTime();
        updateIdentityPosition();
        renderer.render(scene, camera);
    }

    // Start
    window.addEventListener('resize', handleResize);
    animate();

    // Return Cleanup Function (Important for React useEffect)
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        container.removeChild(renderer.domElement);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
}