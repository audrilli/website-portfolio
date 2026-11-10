import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Landing page 3D visual: chrome star in the #landing container.

// new URL(...) lets Vite include the model in the production build.
const MODEL_URL = new URL('../media/Star2.gltf', import.meta.url).href;
const ENV_URL = new URL('../media/kloppenheim_06_puresky_4k.jpg', import.meta.url).href;

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

// Chrome needs something to reflect: the sky panorama. It is only used
// for reflections; the page background stays visible behind the model.
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

// Wireframe reveal: a grey wireframe copy sits inside the chrome model.
// Within a sphere around the hover point the chrome is cut away and the
// wireframe shows; the sphere grows on hover and shrinks when leaving.
const WIREFRAME_COLOR = 0x9a9a9a;
const reveal = {
    origin: { value: new THREE.Vector3() }, // in the model's own coordinates
    radius: { value: 0 },
    edge: { value: 0 }, // width of the soft wireframe edge, set on load
};

const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: WIREFRAME_COLOR,
    wireframe: true,
    transparent: true,
    toneMapped: false, // keep the exact grey (tone mapping lightens it)
});

// Adds the reveal sphere test to a built-in three.js material.
// keepInside: true keeps fragments inside the sphere (wireframe),
// false keeps those outside (chrome).
function addReveal(material, keepInside) {
    material.onBeforeCompile = (shader) => {
        shader.uniforms.uRevealOrigin = reveal.origin;
        shader.uniforms.uRevealRadius = reveal.radius;
        shader.uniforms.uRevealEdge = reveal.edge;
        shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vRevealPos;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRevealPos = position;');
        shader.fragmentShader = shader.fragmentShader
            .replace('#include <common>', `#include <common>
                varying vec3 vRevealPos;
                uniform vec3 uRevealOrigin;
                uniform float uRevealRadius;
                uniform float uRevealEdge;`)
            .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
                float revealDist = distance(vRevealPos, uRevealOrigin);
                ${keepInside
                    ? 'if (revealDist > uRevealRadius) discard;'
                    : 'if (revealDist < uRevealRadius) discard;'}`)
            .replace('#include <dithering_fragment>', `#include <dithering_fragment>
                ${keepInside
                    ? 'gl_FragColor.a *= smoothstep(uRevealRadius, uRevealRadius - uRevealEdge, revealDist);'
                    : ''}`);
    };
}
addReveal(chromeMaterial, false);
addReveal(wireframeMaterial, true);

// The model is centered and scaled to a fixed world size, so its
// on-screen size only depends on the camera and container.
const MODEL_SIZE = 1.6;
const pivot = new THREE.Group();
scene.add(pivot);
const meshes = [];
let revealMaxRadius = 0;

new GLTFLoader().load(MODEL_URL, (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh) meshes.push(child);
    });
    // Collected first: adding children while traversing would loop forever.
    for (const mesh of meshes) {
        mesh.material = chromeMaterial;
        // Same geometry, so it lines up exactly with the chrome surface.
        mesh.add(new THREE.Mesh(mesh.geometry, wireframeMaterial));

        mesh.geometry.computeBoundingSphere();
        const r = mesh.geometry.boundingSphere.radius;
        // Large enough to cover the whole model from any starting point.
        revealMaxRadius = Math.max(revealMaxRadius, 2 * r);
        reveal.edge.value = 0.25 * r;
    }

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

// Hover: test the pointer against the model's actual shape
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerInside = false;
let hovered = false;
let touchRevealed = false; // touch screens have no hover: tap toggles

function hitTest() {
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(meshes, false)[0];
}

function setPointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

renderer.domElement.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    setPointer(event);
    pointerInside = true;
});
renderer.domElement.addEventListener('pointerleave', () => {
    pointerInside = false;
});
renderer.domElement.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' || !meshes.length) return;
    setPointer(event);
    const hit = hitTest();
    touchRevealed = Boolean(hit) && !touchRevealed;
    if (touchRevealed) setRevealOrigin(hit);
});

function setRevealOrigin(hit) {
    reveal.origin.value.copy(hit.object.worldToLocal(hit.point.clone()));
}

// Tested every frame, because the model keeps rotating under a still cursor.
function updateHover() {
    hovered = false;
    if (pointerInside && meshes.length) {
        const hit = hitTest();
        hovered = Boolean(hit);
        // Start the reveal where the cursor touches the model; follow the
        // cursor while it is still growing.
        if (hit && reveal.radius.value < revealMaxRadius * 0.9) setRevealOrigin(hit);
    }
    renderer.domElement.style.cursor = hovered ? 'pointer' : '';
}

// Rotation: slows down while hovered so the interaction can be enjoyed
const ROTATION_SPEED = 0.5; // radians per second
const ROTATION_SPEED_HOVER = 0.08;
const SPEED_EASING = 3; // higher = faster change between speeds
const REVEAL_EASING = 2; // higher = faster reveal
let rotationSpeed = ROTATION_SPEED;
const clock = new THREE.Clock();

// Frame-rate independent easing of value towards target
function damp(value, target, lambda, dt) {
    return THREE.MathUtils.lerp(value, target, 1 - Math.exp(-lambda * dt));
}

function animate() {
    const dt = Math.min(clock.getDelta(), 0.1);
    updateHover();
    const active = hovered || touchRevealed;
    rotationSpeed = damp(rotationSpeed, active ? ROTATION_SPEED_HOVER : ROTATION_SPEED, SPEED_EASING, dt);
    reveal.radius.value = damp(reveal.radius.value, active ? revealMaxRadius : 0, REVEAL_EASING, dt);
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
