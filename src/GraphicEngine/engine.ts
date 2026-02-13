import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl?raw';
import fragmentShader from '../shaders/fragment.glsl?raw';

export class CoherenceEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private animationId: number | null = null;
  private clock: THREE.Clock;
  private container: HTMLElement;
  private identityNode: HTMLElement;

  constructor(container: HTMLElement, identityNode: HTMLElement) {
    console.log('Initializing CoherenceEngine with container and identityNode:', container, identityNode);

    this.container = container;
    this.identityNode = identityNode;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    // 1. Camera Setup
    console.log('Setting up camera');
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 10;

    // 2. Renderer Setup
    console.log('Setting up renderer');
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);
    console.log('Renderer attached to container');

    // 3. The Coherence Field (Geometry & Material)
    console.log('Creating geometry and material');
    const geometry = new THREE.PlaneGeometry(30, 20, 128, 128);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uRectPos: { value: new THREE.Vector2(0.5, 0.5) }
      },
      side: THREE.DoubleSide,
      // transparent: true // Uncomment if you want HTML background to show through
    });

    console.log('Material created with uniforms:', this.material.uniforms);

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);
    console.log('Mesh added to the scene');

    // 4. Bind Events
    console.log('Binding resize event');
    window.addEventListener('resize', this.handleResize);

    // 5. Start Loop
    console.log('Starting animation loop');
    this.animate();
  }

  private updateIdentityPosition = () => {
    console.log('Updating identity position');
    if (!this.identityNode) {
      console.warn('Identity node is not defined');
      return;
    }

    const rect = this.identityNode.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Map screen pixel coordinates to UV space (0..1)
    const x = centerX / window.innerWidth;
    const y = 1.0 - (centerY / window.innerHeight); // Invert Y for WebGL

    console.log('Identity position in UV space:', { x, y });
    this.material.uniforms.uRectPos.value.set(x, y);
  };

  private handleResize = () => {
    console.log('Handling resize event');
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    console.log('Updated camera and renderer for new window size');
  };

  private animate = () => {
    console.log('Animating frame');
    this.animationId = requestAnimationFrame(this.animate);

    this.material.uniforms.uTime.value = this.clock.getElapsedTime();
    this.updateIdentityPosition(); // Sync physics every frame

    this.renderer.render(this.scene, this.camera);
    console.log('Frame rendered');
  };

  public dispose() {
    console.log('Disposing CoherenceEngine');
    // Structural Integrity: Clean up memory to prevent leaks
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.handleResize);

    this.scene.remove(this.mesh);
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();

    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
    console.log('CoherenceEngine disposed');
  }
}