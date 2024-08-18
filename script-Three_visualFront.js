console.log("file connecetd");

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";



import * as CANNON from "cannon-es";

const containerfront = document.getElementById("landing");

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);
// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);

// //TextureLoader
// const loader1 = new THREE.TextureLoader();
// const texture1 = loader1.load("Material/kloppenheim_06_puresky_4k.jpg", () => {
//   texture1.mapping = THREE.EquirectangularReflectionMapping;
//   texture1.colorSpace = THREE.SRGBColorSpace;

//   scene.environment = texture1;

// //   console.log("texture1");
// });
// loader = new UltraHDRLoader();
// const loadEnviroment = function (resolution = '8k', type = 'HalfFloatType'){

// loader.setDataType(THREE[type]);
// loader.load(`Material/rosendal_park_sunset_puresky_${resolution}.hdr.jpg`, function(texture){
//     texture.mapping =  THREE.EquirectangularReflectionMapping;
//     texture.needsUpdate = true;
//     scene.background = texture;
// 	scene.environment = texture;
// });
// };

// Set initial camera position
camera.position.set(0, 0, 1);

const rendererfront = new THREE.WebGLRenderer({ antialias: true, alpha: true });
rendererfront.setSize(window.innerWidth, window.innerHeight);
rendererfront.toneMapping = THREE.ACESFilmicToneMapping; // Better tone mapping for HDRI
rendererfront.toneMappingExposure = -0.55;

//Append to div
containerfront.appendChild(rendererfront.domElement);
// Postprocessing setup
// const composer = new EffectComposer(rendererfront);
// const renderPass = new RenderPass(scene, camera);
// composer.addPass(renderPass);

// Unreal Bloom Pass
// const bloomPass = new UnrealBloomPass(
//   new THREE.Vector2(containerfront.clientWidth, containerfront.clientHeight),
//   1.5, // Strength
//   1, // Radius
//   0.85 // Threshold 
// );
// composer.addPass(bloomPass);

const loader1 = new THREE.TextureLoader();
const texture = loader1.load("Material/kloppenheim_06_puresky_4k.jpg", () => {
  // new EXRLoader().load('Material/kloppenheim_06_puresky_4k.exr', function (texture) {

  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.encoding = THREE.sRGBEncoding;
  scene.environment = texture;
});

// console.log(rendererfront.domElement.parentNode);
// console.log(document.getElementById('landing'))

// Lighting
const ambientLight = new THREE.AmbientLight(0x504040, 5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 100);
directionalLight1.position.set(5, -10, 7.5);
scene.add(directionalLight1);

const backLightPink = new THREE.DirectionalLight(0xff00aa, 80);
backLightPink.position.set(0, 0, 10).normalize();
scene.add(backLightPink);

// Light helper to visualize the directional light position
// const directionalLightHelper = new THREE.DirectionalLightHelper(backLight, 10); // Adjust the size as needed
// scene.add(directionalLightHelper);
// helper.update();

// directionalLightHelper.update();

// Visualize the ambient light position (using a small sphere as a placeholder)
// const ambientLightHelper = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 16, 16),
//     new THREE.MeshBasicMaterial({ color: 0xffffff })
// );
// ambientLightHelper.position.set(0, 0, 0); // Ambient light is usually global, so this is just for visualization
// scene.add(ambientLightHelper);

// Physics world
const world = new CANNON.World();
world.gravity.set(0, 0, 0); // Gravity
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

// GLTF Models paths
const modelPaths = [
  "3DAssets/Flower.gltf",
  "3DAssets/Star1.gltf",
  "3DAssets/Star2.gltf",
];

const models = [];
const bodies = [];

// const boxHelpers = []; // Store box helpers to update them later
// const boundingSpheres = [];

const loader = new GLTFLoader();

// Calculate the bounds of the visible area based on the camera's perspective
function calculateFrustumBounds(zPosition) {
  const aspect = containerfront.clientWidth / containerfront.clientHeight;
  const height =
    2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * zPosition;
  2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * zPosition;
  const width = height * aspect;

  return {
    left: -width / 2,
    right: width / 2,
    top: height / 2,
    bottom: -height / 2,
  };
}

// Function to generate random position within the frustum bounds, with a fixed z-axis
function getRandomPositionInFrustum(zValue) {
  const bounds = calculateFrustumBounds(zValue);

  return {
    x: Math.random() * (bounds.right - bounds.left) + bounds.left,
    y: Math.random() * (bounds.top - bounds.bottom) + bounds.bottom,
    z: zValue - 1.5,
  };
}

// Scroll-based velocity increase
function increaseVelocityOnScroll() {
  window.addEventListener("scroll", () => {
    const scrollAmount = window.scrollY; // Get the current scroll amount

    bodies.forEach((body) => {
      // Gradually increase the velocity based on scroll amount
      body.velocity.x += scrollAmount * -0.0001; // Adjust the multiplier for desired effect
      body.velocity.y += scrollAmount * 0.0001;
    });
  });
}

// // Visualize the frustum bounds
function visualizeFrustumBounds(bounds) {
    const geometry = new THREE.BoxGeometry(bounds.right - bounds.left, bounds.top - bounds.bottom, 1);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00ff00 }));

    line.position.set((bounds.right + bounds.left) / 2, (bounds.top + bounds.bottom) / 2, fixedZ ); // Move it slightly closer to the camera
    scene.add(line);
}

//set Z Value
const fixedZ = 1;

modelPaths.forEach((path, index) => {
  loader.load(path, (gltf) => {
    const model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        child.material.envMap = scene.environment; // Apply the environment map to the material
        child.material.envMapIntensity = 1.0; // Adjust the intensity of reflections
      }
    });
    scene.add(model);

    // Set random position within the calculated frustum bounds
    const position = getRandomPositionInFrustum(fixedZ);
    model.position.set(position.x, position.y, position.z);
    const modelScale = 10;
    //Scale of the Model
    model.scale.set(modelScale, modelScale, modelScale);

    // Apply chrome-like material
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0xb1b1b0,
          metalness: 1,
          roughness: 0,
          envMap: scene.environment, // Use the HDRI environment
          envMapIntensity: 0.97,
        });
      }
    });

    models.push(model);

    //Log Model Position
    // console.log("ModelPosition", model.position);

    // Create a physics body
    const shape = new CANNON.Sphere(0.6); // Assuming a spherical shape for simplicity
    const body = new CANNON.Body({ mass: 0.1, shape });
    body.position.set(model.position.x, model.position.y, model.position.z);
    body.linearDamping = 0.8; // To make it float like a balloon
          
    console.log("BodyPosition:", body.position.y);

    // Apply an initial random velocity to make the models move
    body.velocity.set(
      (Math.random() - 0.5) * 0.002,
      (Math.random() - 0.5) * 0.002,
      0 // No velocity along the z-axis
    );

    bodies.push(body);
    world.addBody(body);
    



    // const boxHelper = new THREE.BoxHelper(model, 0xfff000); // Yellow bounding box
    // scene.add(boxHelper);
    // boxHelpers.push(boxHelper); // Store the box helper for later updates

    // //Visualize the bounding sphere
    // const sphereGeometry = new THREE.SphereGeometry(shape.radius, 16, 16);
    // const sphereMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xff0000,
    //   wireframe: true,
    // });

    // Red bounding sphere
    // const boundingSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // boundingSphere.position.copy(model.position);
    // scene.add(boundingSphere);
    // boundingSpheres.push(boundingSphere);

    //Debug Statements
    // console.log(model);

    console.log("modelbuilt");
  });
});

// Minimum velocity to prevent models from getting stuck
const minVelocity = 0.2;



// Function to handle bouncing off boundaries
function handleBoundaryCollision(body) {
  const bounds = calculateFrustumBounds(fixedZ);
  const radius = 0.05; // Assuming a spherical body with a radius of 1

  //   console.log('BoundsBottom:',bounds.bottom);
  //   console.log('BoundsTop:',bounds.top)

  // Simplified collision logic
  if (
    body.position.x - radius < bounds.left ||
    body.position.x + radius > bounds.right
  ) {
    body.velocity.x = body.velocity.x * -1.2; // Reverse velocity on x-axis

    // Ensure minimum velocity
    if (Math.abs(body.velocity.x) < minVelocity) {
      body.velocity.x = (body.velocity.x < 0 ? -1 : 1) * minVelocity;
    }

    // Apply a small random nudge to help prevent getting stuck
    body.velocity.y += (Math.random() - 0.5) * 0.1;
  }

  // console.log('velocity before collision',body.velocity.y)

  // Check for boundary collision on y-axis
  if (
    body.position.y - radius < bounds.bottom ||
    body.position.y + radius > bounds.top
  ) {
    // console.log("Collision on y-axis");
    body.velocity.y = body.velocity.y * -1.1; // Reverse velocity on y-axis

    // Ensure minimum velocity
    if (Math.abs(body.velocity.y) < minVelocity) {
      body.velocity.y = (body.velocity.y < 0 ? -1 : 1) * minVelocity;
    }

    // Apply a small random nudge to help prevent getting stuck
    body.velocity.x += (Math.random() - 0.5) * 0.1;
  }
  // console.log(body.velocity.y)

  // console.log('collision on y')

  //Debug Statements1

  //console.log(bounds.left);
  // console.log(bounds.right);
}

//Composer

// Maximum velocity
const maxVelocity = 5.0; // Adjust this value as needed
    // Function to clamp velocity
    function clampVelocity(body) {
        const velocity = body.velocity;
        const speed = velocity.length();
    
        if (speed > maxVelocity) {
            velocity.scale(maxVelocity / speed, velocity);
        }
    }
    // Function to scale models on window resize
function scaleModelsOnResize() {
    const scaleFactor = Math.min(window.innerWidth / container.clientWidth, window.innerHeight / container.clientHeight);

    models.forEach((model) => {
        const originalScale = model.userData.originalScale;
        model.scale.set(
            originalScale.x * scaleFactor,
            originalScale.y * scaleFactor,
            originalScale.z * scaleFactor
        );
    });
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Update the physics world
  world.step(1 / 60);

  // Sync the models with their physics bodies
  for (let i = 0; i < models.length; i++) {
    const body = bodies[i];
     // Clamp the velocity to prevent excessive speed
     
     clampVelocity(body);

    models[i].position.copy(body.position);
    models[i].quaternion.copy(body.quaternion);
   
    // Update the bounding boxes
    // boxHelpers[i].update();
    // boundingSpheres[i].position.copy(body.position);

    handleBoundaryCollision(body);

  };

  rendererfront.render(scene, camera);

}

// Start the animation loop
animate();

// Visualize the frustum bounds
visualizeFrustumBounds(calculateFrustumBounds(fixedZ));

// Increase velocity on scroll
increaseVelocityOnScroll();

// Handle window resize
window.addEventListener("resize", () => {
  const width = containerfront.clientWidth;
  const height = containerfront.clientHeight;
  rendererfront.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  

//   composer.setSize(width, height); // Update composer size
//   bloomPass.setSize(width, height); // Update bloom pass size

  // Update and visualize the new frustum bounds after resizing
     const newBounds = calculateFrustumBounds(fixedZ);

//   Visualise Bounds in Animate
     visualizeFrustumBounds(newBounds);
});

console.clear();
