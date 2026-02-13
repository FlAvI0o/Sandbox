import './index.css';
import World from './engine/World';

// 1. Structural Nodes
const container = document.getElementById('webgl-container');
const interactionNode = document.getElementById('interaction-node');
const coordReadout = document.getElementById('coord-readout');
const hairX = document.getElementById('hair-x');
const hairY = document.getElementById('hair-y');
const statusReadout = document.getElementById('status-readout');

if (!container || !interactionNode || !coordReadout || !hairX || !hairY) {
    throw new Error("CRITICAL: DOM infrastructure missing.");
}

// 2. Ignite the Engine
const engine = new World(container);

const shakeKeyframes: Keyframe[] = [
    { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
    { transform: 'translate3d(-14px, 10px, 0) rotate(-0.7deg)' },
    { transform: 'translate3d(12px, -8px, 0) rotate(0.6deg)' },
    { transform: 'translate3d(-10px, 12px, 0) rotate(-0.5deg)' },
    { transform: 'translate3d(10px, -10px, 0) rotate(0.5deg)' },
    { transform: 'translate3d(-8px, 6px, 0) rotate(-0.4deg)' },
    { transform: 'translate3d(0, 0, 0) rotate(0deg)' }
];
const shakeTiming: KeyframeAnimationOptions = { duration: 240, iterations: 1, easing: 'linear' };
let shakeAnimation: Animation | null = null;

const shakeEngine = () => {
    shakeAnimation?.cancel();
    shakeAnimation = container.animate(shakeKeyframes, shakeTiming);
};

// 3. Telemetry Tracking (The DOM responding to the user physically)
window.addEventListener('mousemove', (e) => {
    // Move Crosshairs
    hairX.style.top = `${e.clientY}px`;
    hairY.style.left = `${e.clientX}px`;

    // Update Coordinates
    const x = String(e.clientX).padStart(4, '0');
    const y = String(e.clientY).padStart(4, '0');
    coordReadout.innerText = `X:${x} Y:${y}`;
});

// 4. The Confession Gate (The Filter)
function renderConfessionGate() {
    interactionNode!.innerHTML = `
        <label style="display: block; margin-bottom: 15px; color: #888;">
            IDENTIFY THE WEAKEST POINT OF YOUR PRODUCT:
        </label>
        <input type="text" id="confession-input" class="input-raw" placeholder="_" autocomplete="off" />
        <span id="gate-response" class="error-text"></span>
    `;

    const input = document.getElementById('confession-input') as HTMLInputElement;
    const response = document.getElementById('gate-response');

    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            if (val.length < 15) {
                // Reject weak, short answers
                response!.innerText = "SIGNAL TOO WEAK. ELABORATE OR LEAVE.";
                input.value = '';
                shakeEngine();
            } else {
                // Accept the confession
                response!.style.color = "#00ff00";
                response!.innerText = "SIGNAL ACCEPTED. ANALYZING.";
                statusReadout!.innerText = "SUBJECT LOCKED";
                statusReadout!.classList.remove('blink');
                
                input.disabled = true;
                
                // Command Engine to align the Ego Mass into a perfect solid
                engine.alignEgoMassToSolid();
            }
        }
        
        // As they type, we will eventually feed the length to the shader
        // engine.setTurbulence(val.length);
    });
}

// Init
renderConfessionGate();
