# Experimental WebGL Telemetry Gateway

An interactive, low-latency interface that couples real-time DOM telemetry tracking with GPU-driven geometric deformations using Three.js and custom GLSL shaders.

## 1. System Architecture

The runtime relies on two core logical nodes that synchronize via linear interpolation (Lerp) and continuous uniform updates to the GPU:

* **DOM Telemetry Input (`main.ts`):** Manages high-frequency cursor tracking, coordinate string formatting for crosshair rendering, and input gate validation.
* **WebGL Graphics Engine (`World.ts`):** Initializes the 3D pipeline, instantiates a high-density vertex mesh (128-subdivision Icosahedron), and drives inertial rotation based on cursor telemetry.

## 2. Core Mechanics

* **Linear Interpolation Influx (Lerp Core):** Cursors and global system state transitions bypass rigid snapping. Deformations utilize a linear interpolation layer (coefficients: `0.02` for mouse vectors, `0.03` for global states) to yield fluid, inertial behaviors.
* **Rigid String Validation:** System state mutates only when text strings submitted to the input buffer pass explicit quantitative criteria (`length >= 15`).
* **Sussultatory DOM Shockwave (Shake Engine):** Invalid input signatures invoke immediate physical feedback. The WebGL container is distorted through an asynchronous native animation loop (`translate3d` and `rotate`).
* **Geometric Signal Collapse:** Upon valid input commitment, the `uState` uniform mutates, signaling the GLSL shaders to transition the fluid, turbulent vertex mass into a static, stable geometric solid.

## 3. Technology Stack

* **Runtime/Language:** TypeScript / Vite
* **3D Engine:** Three.js (WebGL backend)
* **Shaders:** GLSL (Custom Vertex & Fragment Shaders)
* **Animation Pipeline:** Web Animations API (Native DOM Level)

## 4. Local Installation & Development

```bash
# Clone and install dependencies
npm install

# Boot local development server
npm run dev
