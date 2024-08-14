console.log("file connecetd");

import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from 'cannon-es';


            const containerfront = document.getElementById('landing');
            
                // Initialize the scene, camera, and renderer here
                


// Select the div where the canvas should be rendered
// const container = document.getElementById('landing');


// //Check if Div is in the DOM
// document.addEventListener("DOMContentLoaded",() => {
//     const container = document.getElementById('landing');

//     if (container){
//         console.error('div not in DOM');
//     }
// })






// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const rendererfront = new THREE.WebGLRenderer({ antialias: true, alpha: true });
rendererfront.setSize(window.innerWidth, window.innerHeight);
containerfront.appendChild(rendererfront.domElement);

console.log(rendererfront.domElement.parentNode); 
console.log(document.getElementById('landing'))

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

// Physics world
const world = new CANNON.World();
world.gravity.set(0, -1.0, 0); // Gravity
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

// GLTF Models paths
const modelPaths = [
    'Flower.gltf',
    'Star1.gltf',

];

const models = [];
const bodies = [];

const loader = new GLTFLoader();

// Set a fixed z-value for all models
const fixedZ = 0; // You can adjust this value to position them closer or further away from the camera

// Function to generate random position within camera view
function getRandomPositionInView() {
    const distance = 1; // Distance from the camera
    const aspect = container.clientWidth / container.clientHeight;
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distance;
    const width = height * aspect;

    return {
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: fixedZ // Fixed z-axis value
    };
}




modelPaths.forEach((path, index) => {
    loader.load(path, (gltf) => {
        const model = gltf.scene;
        model.scale.set(10,10,10);
        

        

        // Random initial position
        model.position.set(Math.random() * 10 - 5, Math.random() * 10, Math.random() * 10 - 5);
        models.push(model);

        // Create a physics body
        const shape = new CANNON.Sphere(1); // Assuming a spherical shape for simplicity
        const body = new CANNON.Body({ mass: 0.1, shape });
        body.position.set(model.position.x, model.position.y, model.position.z);
        body.linearDamping = 0.9; // To make it float like a balloon

        // Apply an initial random velocity to make the models move
        body.velocity.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0 // No velocity along the z-axis
        );



        bodies.push(body);
        world.addBody(body);



        scene.add(model);
        //Debug Statements
        console.log(model)
        console.log("modelbuilt")
    });
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Update the physics world
    world.step(1 / 60);

    // Sync the models with their physics bodies
    for (let i = 0; i < models.length; i++) {
        models[i].position.copy(bodies[i].position);
        models[i].quaternion.copy(bodies[i].quaternion);
    }

    rendererfront.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const width = containerfront.clientWidth;
    const height = containerfront.clientHeight;
    rendererfront.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});


// Start the animation loop
animate();

// Set initial camera position
camera.position.z = 1;


