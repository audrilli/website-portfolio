import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let model;
const width = window.innerWidth;
const height = window.innerHeight;
const container = document.getElementById("landing");

const camera = new THREE.PerspectiveCamera(75, width / height, 0.5, 1000);
camera.position.set(0, 0, 1.5);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.background = null;

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 5, 5);
scene.add(light);

const loaderGLTF = new GLTFLoader();
const modelScale = 1.5;

loaderGLTF.load('media/AssetsStartSeite/VisionPro1.gltf', function (gltf) {
    model = gltf.scene;
    model.scale.set(modelScale, modelScale, modelScale);
    model.position.set(0,0.2,0);

    model.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                metalness: 0.01,
                roughness: 0.5,
            });
        }
    });

    scene.add(model);
    renderer.render(scene, camera);
});

// Update light position based on mouse movement
function onMouseMove(event) {
    // Convert mouse position to normalized device coordinates (-1 to 1)
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update light position based on mouse coordinates
    light.position.set(mouseX * 5, mouseY * 5, 5);

    // Re-render the scene
    renderer.render(scene, camera);
}

window.addEventListener('mousemove', onMouseMove);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

function animate(time) {
    if (model) {
        model.rotation.y = time / 2000;
       
    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    renderer.setSize(newWidth, newHeight);
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
});