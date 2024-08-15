console.log("file connecetd");

import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from 'cannon-es';


const containerfront = document.getElementById('landing');
            

                


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

//Append to div
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
world.gravity.set(0, -9.81, 0); // Gravity
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
//get Position in Camera view to position Model
function getRandomPositioninView(zValue){
    const distance =10; //DistanceCamera
    const aspect = containerfront.clientWidth/containerfront.clientHeight;
    const height = 2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)) *distance;
    const width=height*aspect;

    return{
        x: (Math.random() - 0.5)*width,
        y: (Math.random() - 0.5)*height,

        //fixed Z Value
        z:zValue
    };
}
//set Z Value
const fixedZ = 0;


modelPaths.forEach((path, index) => {
    loader.load(path, (gltf) => {
        const model = gltf.scene;
       scene.add(model);

       //Add Position of the Models
       const position = getRandomPositioninView(fixedZ);
       model.position.set(position.x,position.y, position.z);

       //Scale of the Mode9
       model.scale.set(10,10,10)

       models.push(model);
        

        

        
      

        //Log Model Position
        console.log('ModelPosition',model.position)

        // Create a physics body
        const shape = new CANNON.Sphere(1); // Assuming a spherical shape for simplicity
        const body = new CANNON.Body({ mass: 0.1, shape });
        body.position.set(model.position.x, model.position.y, model.position.z);
        body.linearDamping = 1; // To make it float like a balloon

        // Apply an initial random velocity to make the models move
        body.velocity.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            0 // No velocity along the z-axis
        );



        bodies.push(body);
        world.addBody(body);



       
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


