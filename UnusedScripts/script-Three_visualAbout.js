import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Setup scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.background = null; // No background, transparent

const loader1 = new THREE.TextureLoader();
const texture1 = loader1.load("public/kloppenheim_06_puresky_4k.jpg", () => {
    texture1.mapping = THREE.EquirectangularReflectionMapping;
    texture1.colorSpace = THREE.SRGBColorSpace;
    scene.environment = texture1;
});

// Setup camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.5,
    1000
);
camera.position.set(0, 0, 1);

const container = document.getElementById('about');

// Setup renderer and size it according to the credo div while maintaining aspect ratio
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better tone mapping for HDRI
renderer.toneMappingExposure = 1;
resizeRendererToDisplaySize();
container.appendChild(renderer.domElement);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x504040); // Soft white light
scene.add(ambientLight);

// Add directional lights
const directionalLight = new THREE.DirectionalLight(0xff00aa, 100);
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
let imageIndex = 0; // Index for image rotation
const images = [
    'Images/personalImages/Image1.png',
    'Images/personalImages/Image2.jpg',
    'Images/personalImages/Image3.jpg',
    'Images/personalImages/Image4.jpg'
    
];
const imageDiv = document.getElementById('Image'); // Assuming you have a div with this ID
// Initialize the imageDiv with the first image
imageElement.src = images[imageIndex];



// Load the model
const loader = new GLTFLoader();
const modelScale = 4;
loader.load(
    'public/Star1.gltf',  // Path to the custom model
    function (gltf) {
        model = gltf.scene;
        model.scale.set(modelScale, modelScale, modelScale);

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

        // Add click event to the model
        renderer.domElement.addEventListener('click', () => {
            if (model) {
                // Trigger the scale animation
                scaleModel();

                // Rotate through the images
                updateImage();
            }
        });
    },
    undefined,
    function (error) {
        console.error('An error occurred loading the model', error);
    }
);

// Resize function to fit renderer to container while maintaining aspect ratio
function resizeRendererToDisplaySize() {
    const canvas = renderer.domElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const canvasPixelWidth = canvas.width / window.devicePixelRatio;
    const canvasPixelHeight = canvas.height / window.devicePixelRatio;

    if (canvasPixelWidth !== width || canvasPixelHeight !== height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

// Handle window resize to adjust the renderer's size based on the credo div
window.addEventListener('resize', resizeRendererToDisplaySize);



// Scroll event to increase rotation speed temporarily (throttled)
document.addEventListener('scroll', () => {
    scrollBoost = 0.01;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (model) {
        model.rotation.y += baseRotationSpeed + scrollBoost;
        scrollBoost = Math.max(0, scrollBoost - 0.0005);
    }

    renderer.render(scene, camera);
}
animate();

// Function to scale the model
function scaleModel() {
    const targetScale = 6; // Target scale
    const scaleSpeed = 0.3; // Speed of scaling

    function scaleUp() {
        if (model.scale.x < targetScale) {
            model.scale.x += scaleSpeed;
            model.scale.y += scaleSpeed;
            model.scale.z += scaleSpeed;
            requestAnimationFrame(scaleUp);
        } else {
            scaleDown();
        }
    }

    function scaleDown() {
        if (model.scale.x > 4) {
            model.scale.x -= scaleSpeed;
            model.scale.y -= scaleSpeed;
            model.scale.z -= scaleSpeed;
            requestAnimationFrame(scaleDown);
        }
    }

    scaleUp();
}

// Function to update the image in the div
function updateImage() {
    imageIndex = (imageIndex + 1) % images.length; // Rotate through the images
    document.getElementById('imageElement').src = images[imageIndex]; // Update the image source
    console.log("ImageIndex", imageIndex)
    
}

