import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Landing page 3D: chrome star in the Figma frame "container-3d-three.js".
// It rotates slowly, and slower while the cursor is on the star.

// new URL(...) lets Vite include these files in the production build.
const MODEL_URL = new URL('../media/06_3D/01_Decoration/Star2.gltf', import.meta.url).href;
const ENV_URL = new URL('../media/kloppenheim_06_puresky_4k.jpg', import.meta.url).href;

const container = document.querySelector('.container-three');

// Renderer (transparent, so the container's background shows through)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0, 4); // z is set in resize()

// Chrome needs something to reflect: the sky panorama. It is only used
// for reflections, not shown as a background.
const pmrem = new THREE.PMREMGenerator(renderer);
new THREE.TextureLoader().load(ENV_URL, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.environment = pmrem.fromEquirectangular(texture).texture;
    texture.dispose();
});

const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.01,
});

// The model is centered and scaled to a fixed world size, so its
// on-screen size only depends on the camera and container.
const MODEL_SIZE = 1.6;
const pivot = new THREE.Group();
scene.add(pivot);
const meshes = [];

new GLTFLoader().load(MODEL_URL, (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh) {
            child.material = chromeMaterial;
            meshes.push(child);
        }
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    pivot.scale.setScalar(MODEL_SIZE / Math.max(size.x, size.y));
    pivot.add(model);
});

// Share of the container the model fills
const FILL = 0.95;

function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // Move the camera so the model fits the shorter side of the container.
    const fitHeight = MODEL_SIZE / FILL / Math.min(1, camera.aspect);
    camera.position.z = fitHeight / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(container);
resize();

// Hover: test the pointer against the model's actual shape
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerInside = false;
let hovered = false;

renderer.domElement.addEventListener('pointermove', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    pointerInside = true;
});
renderer.domElement.addEventListener('pointerleave', () => {
    pointerInside = false;
});

// Tested every frame, because the model keeps rotating under a still cursor.
function updateHover() {
    hovered = false;
    if (pointerInside && meshes.length) {
        raycaster.setFromCamera(pointer, camera);
        hovered = raycaster.intersectObjects(meshes, false).length > 0;
    }
}

// Rotation: slows down while hovered
const ROTATION_SPEED = 0.5; // radians per second
const ROTATION_SPEED_HOVER = 0.08;
const SPEED_EASING = 3; // higher = faster change between speeds
let rotationSpeed = ROTATION_SPEED;
const clock = new THREE.Clock();

// Frame-rate independent easing of value towards target
function damp(value, target, lambda, dt) {
    return THREE.MathUtils.lerp(value, target, 1 - Math.exp(-lambda * dt));
}

function animate() {
    const dt = Math.min(clock.getDelta(), 0.1);
    updateHover();
    rotationSpeed = damp(rotationSpeed, hovered ? ROTATION_SPEED_HOVER : ROTATION_SPEED, SPEED_EASING, dt);
    pivot.rotation.y += rotationSpeed * dt;
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
