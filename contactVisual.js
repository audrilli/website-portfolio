import * as THREE from "three";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three-gltf-loader@1.111.0/index.min.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Setup scene
const scene = new THREE.Scene();
scene.background = null; // No background, transparent

const loader1 = new THREE.TextureLoader();
const texture1 = loader1.load("public/kloppenheim_06_puresky_4k.jpg");
texture1.mapping = THREE.EquirectangularReflectionMapping;
texture1.colorSpace = THREE.SRGBColorSpace;
scene.environment = texture1; // Set environment texture once loaded

// Setup camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.5,
    1000
);
camera.position.set(0, 0, 1);

const container = document.getElementById('contact');

// Setup renderer and size it according to the credo div while maintaining aspect ratio
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better tone mapping for HDRI
renderer.toneMappingExposure = 1;

//container of the render
container.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x504040); // Soft white light
scene.add(ambientLight);

// Add directional lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const backLightPink = new THREE.DirectionalLight(0xff00aa, 80);
backLightPink.position.set(0, 0, 10).normalize();
scene.add(backLightPink);

// Setup orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false; // Disable auto-rotation
controls.enableZoom = false; // Disable zoom

// Global Variables
let model;
let baseRotationSpeed = 0.005; // Base rotation speed
let scrollBoost = 100; // Additional speed boost on scroll
let clock = new THREE.Clock();
let oscillationSpeed = 0.8; // Speed of oscillation
let amplitude = 0.2; // How far up and down the model will move
let isHovered = false; // Whether the model is being hovered over
let targetSlowdown = 2; // Target value for hover slowdown
let currentSlowdown = 1; // Actual slowdown value used for smooth transition
const smoothingFactor = 0.05; // Smoothing factor for interpolation



// Load the model
const loader = new GLTFLoader();
loader.load(
    'public/Star2.gltf',  // Path to the custom model
    function (gltf) {
        model = gltf.scene;
        model.scale.set(6, 6, 6);

        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xB1B1B1, 
                    metalness: 1,
                    roughness: 0,
                    envMap: scene.environment,
                    envMapIntensity: 2,
                });
            }
        });

        scene.add(model);
    },
    undefined,
    function (error) {
        console.error('An error occurred loading the model', error);
    }
);
//Center the Model
// function centerModel(){
//     if(model){
//         model.position.ser(camera.position.x,   camera.postion.y, 0);
//     }
// }

// Resize function to fit renderer to container while maintaining aspect ratio
function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const canvasPixelWidth = canvas.width / container.devicePixelRatio;
    const canvasPixelHeight = canvas.height / container.devicePixelRatio;

    if (canvasPixelWidth !== width || canvasPixelHeight !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

// Handle window resize to adjust the renderer's size based on the credo div
window.addEventListener('resize', resizeRendererToDisplaySize);
resizeRendererToDisplaySize(); // Ensure initial sizing
// centerModel();

// Scroll event to increase rotation speed temporarily
document.addEventListener('scroll', () => {
    scrollBoost = 0.01;
});

container.addEventListener('mouseenter', () => {
    targetSlowdown = 0.5; // Slow down when hovered
    console.log("mouseentered")
    
});

container.addEventListener('mouseleave', () => {
    targetSlowdown = 5; // Return to normal speed when not hovered
    console.log('mouseleft')
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (model) {
        currentSlowdown += (targetSlowdown - currentSlowdown) * smoothingFactor;

        const delta = clock.getDelta();
        const time = clock.elapsedTime;

        // Update oscillation speed based on hover state
        
        const hoverSlowdown = isHovered ? 0.2 : 1; // Reduce speed when hovered
        const oscillation = Math.sin(time * oscillationSpeed * hoverSlowdown) * amplitude;

        const speed = baseRotationSpeed + scrollBoost;
        model.rotation.z += speed * currentSlowdown;
        model.rotation.y += speed *currentSlowdown;
        model.position.y = oscillation; // Move model up and down

        scrollBoost = Math.max(0, scrollBoost - 0.1);


    }

    renderer.render(scene, camera);
}
animate();
