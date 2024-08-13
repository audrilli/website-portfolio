import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";


console.log("threeisthere");

//Canvas
// const canvas = document.querySelector('canvas.credo');
// console.log(canvas);

// Setup scene

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Set background to white
scene.background = null; // No background, transparent

const loader1 = new THREE.TextureLoader();
const texture1 = loader1.load("Material/kloppenheim_06_puresky_4k.jpg", () => {
  texture1.mapping = THREE.EquirectangularReflectionMapping;
  texture1.colorSpace = THREE.SRGBColorSpace;

  scene.environment = texture1;

  console.log("texture1");
});



//Load HDRI
// new RGBELoader()
//   .setDataType(THREE.UnsignedByteType)
//   .setPath("Material/kloppenheim_06_puresky_4k.exr")
//   .load("kloppenheim_06_puresky_4k.exr", function (texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;

//     scene.background = texture;
//     scene.environment = texture;

//     console.log("hdri: Loadad");
//   });

// Setup camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);
camera.position.set(0, 0, 1);

const container = document.getElementById('credo');
console.log(container)

// Setup renderer and size it according to the credo div while maintaining aspect ratio
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
resizeRendererToDisplaySize();
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Better tone mapping for HDRI
renderer.toneMappingExposure = 1;
container.appendChild(renderer.domElement);


// Add ambient light
const ambientLight = new THREE.AmbientLight(0x504040); // Soft white light
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Setup orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false; // Disable auto-rotation
controls.enableZoom = false; // Disable zoom

//global Variables

let model; // Define model globally so it can be accessed in other functions
let baseRotationSpeed = 0.005; // Base rotation speed
let scrollBoost = 100; // Additional speed boost on scroll


// Load the model
const loader = new GLTFLoader();
loader.load(
    'Flower.gltf',  // Path to the custom model
    function (gltf) {
        model = gltf.scene;
        model.scale.set(6, 6, 6); // Double the size of the model

        // Move the model to the right
        model.position.x += 0; // Increase this value to move it further to the right

        // Apply chrome-like material
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 0xB1B1B1, // Chrome is typically reflective silver
                    metalness: 1,    // Full metallic
                    roughness: 0,    // No roughness, fully smooth and shiny
                    envMap: scene.environment,  // Use the HDRI environment map for reflections
                    envMapIntensity: 1, // Control the reflection intensity

                    
                });
            }
        });

        scene.add(model);
        console.log("modelBuilt")
    },
    undefined,
    function (error) {
        console.error('An error occurred loading the model', error);
    }
);

console.log(model);

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

// Mouse move effect
document.addEventListener('mousemove', (event) => {
    if (!model) return; // Ensure model is loaded

    const mouseX = (event.clientX / container.clientWidth) * 2 - 1;
    const mouseY = -(event.clientY / container.clientHeight) * 2 + 1;

    const targetX = model.position.x + mouseX * 0.5;
    const targetY = model.position.y + mouseY * 0.5;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    camera.lookAt(model.position);
});

// Scroll event to increase rotation speed temporarily
document.addEventListener('scroll', () => {
    scrollBoost = 0.01; // Increase rotation speed temporarily
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    resizeRendererToDisplaySize(); // Ensure the renderer always fits within the div

    // Apply rotation to the model
    if (model) {
        model.rotation.y += baseRotationSpeed + scrollBoost;

        // Gradually reduce the scroll boost effect
        scrollBoost = Math.max(0, scrollBoost - 0.0005);
    }

    renderer.render(scene, camera);
}
animate();




// //Scene
// const scene = new THREE.Scene();

// //Geometry
// const geometry = new THREE.BoxGeometry(1,1,1);
// const material = new THREE.MeshBasicMaterial({ color: '#ff0000'});
// const mesh = new THREE.Mesh(geometry,material);
// scene.add(mesh)

// //Sizes
// const sizes = {
//     width: 800,
//     height: 600
// }

//  // Add ambient light
//  const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
//  scene.add(ambientLight);

//  // Add directional light
//  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//  directionalLight.position.set(5, 10, 7.5);
//  scene.add(directionalLight);

// //Camera
// const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);
// scene.add(camera);
// camera.position.z = 4

// //Renderer
// const renderer = new THREE.WebGLRenderer({
//     canvas:canvas

// })

// renderer.setSize(sizes.width, sizes.height);
// renderer.render(scene,camera);
