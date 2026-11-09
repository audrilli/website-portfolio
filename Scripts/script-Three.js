import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Landing page 3D visual: chrome star in the #landing container.

// new URL(...) lets Vite include the model in the production build.
const MODEL_URL = new URL('../media/Star2.gltf', import.meta.url).href;

const container = document.getElementById('landing');

// Renderer (transparent, so the page background shows through)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0, 4); // z is set in resize()

// Chrome needs something to reflect: a neutral studio environment
// (generated in code, so there is no image to download).
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.12,
});

// The model is centered and scaled to a fixed world size, so its
// on-screen size only depends on the camera and container.
const MODEL_SIZE = 1.6;
const pivot = new THREE.Group();
scene.add(pivot);

new GLTFLoader().load(MODEL_URL, (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh) child.material = chromeMaterial;
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    pivot.scale.setScalar(MODEL_SIZE / Math.max(size.x, size.y));
    pivot.add(model);
});

// Share of the container the model fills (the Figma render fills its box).
const FILL = 0.95;

function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // Move the camera so the model fits the shorter side of the container.
    const fitHeight = MODEL_SIZE / FILL / Math.min(1, camera.aspect);
    camera.position.z = fitHeight / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(container);
resize();

// Rotation
const ROTATION_SPEED = 0.5; // radians per second
const clock = new THREE.Clock();

function animate() {
    const dt = Math.min(clock.getDelta(), 0.1);
    pivot.rotation.y += ROTATION_SPEED * dt;
    renderer.render(scene, camera);
}

// Only render while the visual is on screen.
new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
        clock.getDelta(); // skip the time spent off screen
        renderer.setAnimationLoop(animate);
    } else {
        renderer.setAnimationLoop(null);
    }
}).observe(container);
