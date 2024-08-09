import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { color } from "three/webgpu";

console.log("threeisthere");

//Canvas
// const canvas = document.querySelector('canvas.credo');
// console.log(canvas);

// Setup scene

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xffffff); // Set background to white

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
  0.1,
  1000
);
camera.position.set(0, 0, 1);

const container = document.getElementById('credo');
console.log(container)

// Setup renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
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

// Load the model
const loader = new GLTFLoader();
loader.load(
  "Flower.gltf",
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(6, 6, 6); // Double the size of the model

    // Apply shiny metallic material
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xcccccc, // Base color (can be adjusted)
          metalness: 1, // Full metallic look
          roughness: 0, // Low roughness for a shiny surface
          envMap: scene.environment,
          envMapIntensity: 1, // Reflectiveness from environment map
        });
      }
    });

    scene.add(model);
  },
  undefined,
  function (error) {
    console.error("An error occurred loading the model", error);
  }
);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Mouse move effect
document.addEventListener("mousemove", (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  const targetX = mouseX * 0.5;
  const targetY = mouseY * 0.5;

  camera.position.x = targetX;
  camera.position.y = targetY;
  camera.lookAt(scene.position);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
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
