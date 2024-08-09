import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CustomSky from './classes/Sky.js';
import CustomSea from './classes/Sea.js';
import MovingBox from './classes/Box.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';

let container, stats, controls;
let camera, scene, renderer;
let customSky, customSea, movingBox;

// متغيرات لتخزين حالة المفاتيح المضغوطة
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

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
    movingBox = new MovingBox(scene);

    // Set up the camera
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(0, 700, 800); // رفع الكاميرا إلى 500 على المحور Y
    // camera.position.set(0, 20, 40); // رفع الكاميرا إلى 500 على المحور Y

    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100).normalize();
    scene.add(directionalLight);

    // Instantiate the custom components 
    customSky = new CustomSky(scene, renderer);
    customSea = new CustomSea(scene, new THREE.Vector3(1, 0, 0)); // Adjust sun direction as needed

   
    // Set up orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.75; // ضبط الزاوية القطبية القصوى للسماح برؤية أفضل
    controls.target.set(0, 10, 0); // الهدف لا يزال عند مستوى الأرض
    controls.minDistance = 40.0;
    controls.maxDistance = 20000.0; // زيادة المسافة القصوى للرؤية

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
    folderBox.add(movingBox, 'engineCycles', 0, 100).onChange((value) => movingBox.update(value));
    folderBox.open();

    const waterUniforms = customSea.water.material.uniforms;
    const folderWater = gui.addFolder('Water Effects');
    folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('Distortion Scale');
    folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('Wave Size');
    folderWater.open();

    window.addEventListener('resize', onWindowResize, false);

    // إضافة مستمعين لأحداث الضغط والإفلات عن المفاتيح
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    keys[event.key] = true;
}

function onKeyUp(event) {
    keys[event.key] = false;
}

function updateCameraPosition() {
    const moveSpeed = 100; // سرعة الحركة

    if (keys.ArrowUp) {
        camera.position.z -= moveSpeed;
    }
    if (keys.ArrowDown) {
        camera.position.z += moveSpeed;
    }
    if (keys.ArrowLeft) {
        camera.position.x -= moveSpeed;
    }
    if (keys.ArrowRight) {
        camera.position.x += moveSpeed;
    }
}

function animate() {

    // reduce frames
    setTimeout(() => {
        requestAnimationFrame(animate);

    }, 10)

    

    movingBox.update(); // Update box movement
    customSea.update(); // Update sea animations
    customSky.updateSun(); // Update sky if necessary

    updateCameraPosition();

    // Calculate the new camera position relative to the ship
    if (movingBox.ship) {
        const shipPosition = movingBox.ship.position.clone();
        const offset = new THREE.Vector3(0, 50, -2000); // Adjust the offset as needed

        // Calculate the new camera position
        // const cameraPosition = shipPosition.clone().add(offset);

        // Set the camera position and make it look at the ship
        // camera.position.lerp(cameraPosition, 0.1);
        camera.lookAt(shipPosition);
    }

    controls.update();
    renderer.render(scene, camera);
    stats.update();
}
