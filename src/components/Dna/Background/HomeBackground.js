import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function initBackground() {
    const canvas = document.getElementById("deckforge-bg");
    if (!canvas) return;

    // --- 0. PREPARAZIONE SILENZIOSA ---
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 2.0s cubic-bezier(0.2, 0.8, 0.2, 1.0)";

    // --- 1. SEED MONOLITICO ---
    function mulberry32(a) {
        return function () {
            var t = (a += 0x6d2b79f5);
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    const seed = mulberry32(123456); 
    const rand = () => seed();

    // --- 2. SCENA & CAMERA ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); 

    // [FIX] STATE FOR SCATTERING (Not Zooming)
    // 0 = Normal, 1 = Pushed Away (Scattered)
    let targetScatter = 0;
    let currentScatter = 0;

    // Camera stays locked at the perfect "Artisan" distance. No cheap zooming.
    const camera = new THREE.PerspectiveCamera(22, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 35); 

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- 3. LUCI & ENVIRONMENT ---
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv).texture;
    scene.environmentIntensity = 0.6; 

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(10, 20, 15);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(fillLight);

    // --- 4. MATERIALI ---
    const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        thickness: 2.2, 
        roughness: 0.08, 
        ior: 1.6, 
        transparent: true,
        opacity: 0,
    });

    const porcelainMat = new THREE.MeshPhysicalMaterial({
        color: 0xf8f8f8, 
        roughness: 0.65, 
        metalness: 0.05,
        transparent: true,
        opacity: 0,
    });

    // --- 5. COMPOSIZIONE ---
    const objects = [];
    const geometries = [
        new THREE.BoxGeometry(1.4, 2.1, 0.15), 
        new THREE.IcosahedronGeometry(0.9, 0),
        new THREE.TorusGeometry(0.7, 0.2, 32, 64) 
    ];

    const COUNT = 18; 

    for (let i = 0; i < COUNT; i++) {
        const zPos = -3 - (rand() * 8); 
        
        const angle = i * 0.5 + (rand() * 0.6); 
        const radius = 2.2 + (i * 0.25) + (rand() * 1.5);
        
        const x = Math.cos(angle) * radius * 1.6; 
        const y = Math.sin(angle) * radius * 0.9;

        const geo = geometries[i % geometries.length];
        const isCrystal = i % 2 === 0;
        const mat = isCrystal ? crystalMat.clone() : porcelainMat.clone();

        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.setScalar(1 + rand() * 0.4);
        mesh.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * 0.2);
        mesh.position.set(x, y - 2.0, zPos); 
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.userData = {
            // [IMPORTANT] We save initial X/Y so we can push them away later
            initialX: x,
            initialY: y,
            targetY: y, 
            currentY: y - 2.5, 
            originalZ: zPos,
            rotSpeed: { x: (rand()-0.5)*0.002, y: (rand()-0.5)*0.003 },
            phase: rand() * Math.PI * 2,
            delay: i * 0.06, 
            opacity: 0,
        };

        scene.add(mesh);
        objects.push(mesh);
    }

    // --- 6. INTERAZIONE ---
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // [FIX] The Listener controls "Scatter" not "Zoom"
    window.addEventListener("df-camera-push", (e) => {
        if (e.detail === "deep") {
            targetScatter = 1; // Activate Repel
        } else {
            targetScatter = 0; // Return to Center
        }
    });

    // --- 7. ANIMAZIONE ---
    const clock = new THREE.Clock();
    let firstFrameRendered = false;

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Smoothly interpolate the Scatter State
        currentScatter += (targetScatter - currentScatter) * 0.05;

        // Camera Physics (Standard Parallax only)
        const inertia = 0.03; 
        mouse.x += (targetMouse.x - mouse.x) * inertia;
        mouse.y += (targetMouse.y - mouse.y) * inertia;

        camera.position.x += (mouse.x * 1.2 - camera.position.x) * inertia;
        camera.position.y += (mouse.y * 1.2 - camera.position.y) * inertia;
        camera.lookAt(0, 0, -5);

        objects.forEach((obj) => {
            const u = obj.userData;

            if (time > u.delay) {
                u.opacity += (1 - u.opacity) * 0.025;
                obj.material.opacity = u.opacity;
                
                const entranceOffset = (1 - u.opacity) * -2.5; 
                const breath = Math.sin(time * 0.6 + u.phase) * 0.3;
                
                // [THE MAGIC] THE PARTING OF THE WAYS
                // Instead of moving the camera, we push the objects outward.
                // We use their initialX/Y to determine the direction.
                // Factor 1.5 determines how far they slide out.
                const scatterX = u.initialX * currentScatter * 1.5;
                const scatterY = u.initialY * currentScatter * 1.0;
                const scatterZ = -currentScatter * 5; // Slight push back for depth

                obj.position.x = u.initialX + scatterX;
                // We apply the scatter to Y, but keep the breath animation
                obj.position.y = u.targetY + entranceOffset + breath + scatterY;
                obj.position.z = u.originalZ + scatterZ;

            } else {
                 obj.position.y = u.targetY - 2.5;
                 obj.material.opacity = 0;
            }

            // Optional: Slow down rotation when scattered ("Time Freeze" effect)
            const slowDown = 1 - (currentScatter * 0.8); 
            obj.rotation.x += u.rotSpeed.x * slowDown;
            obj.rotation.y += u.rotSpeed.y * slowDown;
            
            obj.rotation.x += (mouse.y * 0.05 - obj.rotation.x * 0.05) * 0.02;
            obj.rotation.y += (mouse.x * 0.05 - obj.rotation.y * 0.05) * 0.02;
        });

        renderer.render(scene, camera);

        if (!firstFrameRendered) {
            firstFrameRendered = true;
            setTimeout(() => {
                canvas.style.opacity = "1";
            }, 100);
        }
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}