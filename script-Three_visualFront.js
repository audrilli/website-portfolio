
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

// Set initial camera position
camera.position.set(0, 0, 1);

const rendererfront = new THREE.WebGLRenderer({ antialias: true, alpha: true });
rendererfront.setSize(window.innerWidth, window.innerHeight);

//Append to div
containerfront.appendChild(rendererfront.domElement);

// console.log(rendererfront.domElement.parentNode);
// console.log(document.getElementById('landing'))

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

// Physics world
const world = new CANNON.World();
world.gravity.set(0, 0, 0); // Gravity
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

// GLTF Models paths
const modelPaths = ["Flower.gltf", "Star1.gltf"];

const models = [];
const bodies = [];
const boxHelpers = []; // Store box helpers to update them later
const boundingSpheres = [];

const loader = new GLTFLoader();

// Calculate the bounds of the visible area based on the camera's perspective
function calculateFrustumBounds(zPosition) {
  const aspect = containerfront.clientWidth / containerfront.clientHeight;
  const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * zPosition;
    2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * zPosition;
  const width = height * aspect;

  return {
    left: -width / 2,
    right: width / 2,
    top: height /2,
    bottom: -height /2,
  };
}

// Function to generate random position within the frustum bounds, with a fixed z-axis
function getRandomPositionInFrustum(zValue) {
  const bounds = calculateFrustumBounds(zValue);

  return {
    x: Math.random() * (bounds.right - bounds.left) + bounds.left,
    y: Math.random() * (bounds.top - bounds.bottom) + bounds.bottom,
    z: zValue - 2,

    
  };


}

// Scroll-based velocity increase
function increaseVelocityOnScroll() {
    window.addEventListener('scroll', () => {
        const scrollAmount = window.scrollY; // Get the current scroll amount

        bodies.forEach(body => {
            // Gradually increase the velocity based on scroll amount
            body.velocity.x += scrollAmount * 0.001; // Adjust the multiplier for desired effect
            body.velocity.y += scrollAmount * 0.001;
        });
    });
}


// Visualize the frustum bounds
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
    scene.add(model);

    // Set random position within the calculated frustum bounds
    const position = getRandomPositionInFrustum(fixedZ);
    model.position.set(position.x, position.y, position.z);

    //Scale of the Model
    model.scale.set(10, 10, 10);

    models.push(model);

    //Log Model Position
    // console.log("ModelPosition", model.position);

    // Create a physics body
    const shape = new CANNON.Sphere(0.5); // Assuming a spherical shape for simplicity
    const body = new CANNON.Body({ mass: 0.1, shape });
    body.position.set(model.position.x, model.position.y, model.position.z);
    body.linearDamping = 0.5; // To make it float like a balloon


console.log('BodyPosition:', body.position.y);

    // Apply an initial random velocity to make the models move
    body.velocity.set(
      (Math.random() - 0.5) * 1,
      (Math.random() - 0.5) * 1,
      0 // No velocity along the z-axis
    );

    bodies.push(body);
    world.addBody(body);

    const boxHelper = new THREE.BoxHelper(model, 0xfff000); // Yellow bounding box
    scene.add(boxHelper);
    boxHelpers.push(boxHelper); // Store the box helper for later updates

    //Visualize the bounding sphere
    const sphereGeometry = new THREE.SphereGeometry(shape.radius, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    }); 
    
    // Red bounding sphere
    const boundingSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    boundingSphere.position.copy(model.position);
    scene.add(boundingSphere);
    boundingSpheres.push(boundingSphere);

    //Debug Statements
    // console.log(model);
    console.log("modelbuilt");
  });
});


// Tolerance value to avoid false positives in collision detection
const collisionTolerance = 0.1;

// Function to handle bouncing off boundaries
function handleBoundaryCollision(body) {
  const bounds = calculateFrustumBounds(fixedZ);
  const radius = 0.1; // Assuming a spherical body with a radius of 1

//   console.log('BoundsBottom:',bounds.bottom);                     
//   console.log('BoundsTop:',bounds.top)

   // Simplified collision logic
   if (body.position.x - radius <  bounds.left || body.position.x + radius > bounds.right) {
   
    body.velocity.x = body.velocity.x*-1 ; // Reverse velocity on x-axis
}
    console.log('velocity before collision',body.velocity.y)        
  // Check for boundary collision on y-axis
  if (body.position.y - radius < bounds.bottom || body.position.y + radius > bounds.top) {
    console.log("Collision on y-axis");
    body.velocity.y = body.velocity.y*-1; // Reverse velocity on y-axis
    console.log(body.velocity.y)
}

    // console.log('collision on y')

    //Debug Statements1
   

    //console.log(bounds.left);
    // console.log(bounds.right);


  
}
;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Update the physics world
  world.step(1 / 60);

  // Sync the models with their physics bodies
  for (let i = 0; i < models.length; i++) {
    const body = bodies[i];
    models[i].position.copy(body.position);
    models[i].quaternion.copy(body.quaternion);

    // Update the bounding boxes
    boxHelpers[i].update();
    boundingSpheres[i].position.copy(body.position);

    // Handle boundary collisions
    handleBoundaryCollision(body);

    
  }

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

   // Update and visualize the new frustum bounds after resizing
   const newBounds = calculateFrustumBounds(fixedZ);
   visualizeFrustumBounds(newBounds);
});


console.clear();