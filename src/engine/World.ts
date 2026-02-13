import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl?raw';
import fragmentShader from '../shaders/fragment.glsl?raw';

export default class World {
    private container: HTMLElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    
    private material!: THREE.ShaderMaterial;
    private mesh!: THREE.Mesh;

    private clock: THREE.Clock;
    private targetMouse: THREE.Vector2;
    private currentMouse: THREE.Vector2;
    
    private targetState: number = 0;
    private currentState: number = 0;

    constructor(container: HTMLElement) {
        this.container = container;
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 6;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 1);
        this.container.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock();
        this.targetMouse = new THREE.Vector2(0, 0);
        this.currentMouse = new THREE.Vector2(0, 0);

        this.constructMass();
        this.bindEvents();
        this.render();
    }

    private constructMass() {
        const geometry = new THREE.IcosahedronGeometry(1.5, 128);

        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uState: { value: 0.0 }
            },
            transparent: true,
            wireframe: false,
        });

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);
    }

    private bindEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    private render = () => {
        const elapsedTime = this.clock.getElapsedTime();

        // Heavy friction & State Lerp
        this.currentMouse.lerp(this.targetMouse, 0.02);
        this.currentState += (this.targetState - this.currentState) * 0.03;

        this.material.uniforms.uTime.value = elapsedTime;
        this.material.uniforms.uMouse.value.copy(this.currentMouse);
        this.material.uniforms.uState.value = this.currentState;

        this.mesh.rotation.y = this.currentMouse.x * 0.5;
        this.mesh.rotation.x = -this.currentMouse.y * 0.5;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }
    
    public setSignalState(value: number) {
        this.targetState = value;
    }
}