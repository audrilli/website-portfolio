import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let model;
const width = window.innerWidth;
const height = window.innerHeight;
const container = document.getElementById("landing");

const camera = new THREE.PerspectiveCamera(75, width / height, 0.5, 1000);
camera.position.set(0, 0, 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
scene.background = null;

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 5, 5);
scene.add(directionalLight);

const loaderGLTF = new GLTFLoader();
const modelScale = 10;

loaderGLTF.load('media/Flower.gltf', function (gltf) {
    model = gltf.scene;
    model.scale.set(modelScale, modelScale, modelScale);

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

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});
