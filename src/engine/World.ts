import * as THREE from 'three';
import vertex from './Shaders/vertex.glsl?raw';
import fragment from './Shaders/fragment.glsl?raw';

export default class World {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private container: HTMLElement;
    private mesh!: THREE.Mesh;
    private mouse = new THREE.Vector2();
    private target = new THREE.Vector2();
    private rafId: number = 0;
    private currentState: number = 0;
    private targetState: number = 0;

    constructor(container: HTMLElement) {
        this.container = container;
        
        // 1. SETUP
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 100);
        this.camera.position.z = 1; // Close up for impact

        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(this.renderer.domElement);

        // 2. THE ARENA MESH
        this.addObjects();

        // 3. EVENTS
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // 4. START LOOP
        this.render();
    }

    private addObjects() {
        // High segment count (128) is CRITICAL for the "Puncture" effect
        const geometry = new THREE.PlaneGeometry(3, 3, 128, 128); 
        
        const material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            },
            // side: THREE.DoubleSide // Optional: if you want to see the back of the wound
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }

    private onMouseMove(e: MouseEvent) {
        // Map mouse to -1 to 1
        this.target.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.target.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    private resize() {
        if (!this.renderer) return;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update shader resolution
        const mat = this.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }

    private render() {
        if (!this.mesh) return;
        this.rafId = requestAnimationFrame(this.render.bind(this));

        // SMOOTH TRANSITION of the Soul
        // This makes the blood slowly boil into gold. It's not instant.
        this.currentState += (this.targetState - this.currentState) * 0.02;

        const mat = this.mesh.material as THREE.ShaderMaterial;
        mat.uniforms.uTime.value += 0.01;
        mat.uniforms.uMouse.value.copy(this.mouse);
        
        // PASS THE STATE TO SHADER
        // Ensure you added uState: { value: 0 } to your uniforms in createProtocolNode/addObjects!
        if (mat.uniforms.uState) {
            mat.uniforms.uState.value = this.currentState;
        }

        this.renderer.render(this.scene, this.camera);
    }

    public destroy() {
        cancelAnimationFrame(this.rafId);
        window.removeEventListener('resize', this.resize.bind(this));
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        if (this.container && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
        this.renderer.dispose();
    }
    public setPhase(phase: number) {
    this.targetState = phase;}
}