import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CustomSky from './classes/Sky.js';
import CustomSea from './classes/Sea.js';
import MovingBox from './classes/Box.js';

let container, stats, controls;
let camera, scene, renderer;
let customSky, customSea, movingBox;

init();
animate();

function init() {
    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    // Set up the camera
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(30, 30, 100);

    // Instantiate the custom components
    customSky = new CustomSky(scene, renderer);
    customSea = new CustomSea(scene, new THREE.Vector3(1, 0, 0)); // Adjust sun direction as needed
    movingBox = new MovingBox(scene);

    // Set up orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;

    // Set up the stats monitor
    stats = new Stats();
    container.appendChild(stats.dom);

    // Set up the GUI for interactive adjustments
    const gui = new GUI();
    const folderSky = gui.addFolder('Sky');
    folderSky.add(customSky.parameters, 'elevation', 0, 90, 0.1).onChange(() => customSky.updateSun());
    folderSky.add(customSky.parameters, 'azimuth', -180, 180, 0.1).onChange(() => customSky.updateSun());
    folderSky.open();

    const folderBox = gui.addFolder('Box Motion');
    folderBox.add(movingBox, 'engineCycles', 0, 100).onChange(() => movingBox.updateSpeed());
    folderBox.open();

    const waterUniforms = customSea.water.material.uniforms;
    const folderWater = gui.addFolder('Water Effects');
    folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('Distortion Scale');
    folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('Wave Size');
    folderWater.open();

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    movingBox.update(); // Update box movement
    customSea.update(); // Update sea animations
    customSky.updateSun(); // Update sky if necessary
    
    controls.update();
    renderer.render(scene, camera);
    stats.update();
}
