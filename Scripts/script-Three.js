import * as THREE from 'three';

const width = window.innerWidth, 
height = window.innerHeight;
const container = document.getElementById("landing");

// init

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.5,
    1000
  );

camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
container.appendChild(renderer.domElement);

// animation

function animate( time ) {

    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    renderer.render( scene, camera );

}
