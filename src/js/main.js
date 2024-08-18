import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CustomSky from './classes/Sky.js';
import CustomSea from './classes/Sea.js';
import MovingBox from './classes/Box.js';
import Rock from './classes/Rock.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { setSpeed } from './stat.js';
import { setCollesion } from './physics.js';

let container, stats, controls;
let camera, scene, renderer;
let customSky, customSea, movingBox, rock;

// متغيرات لتخزين حالة المفاتيح المضغوطة
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

export function updateCycles(value) {
  movingBox.engineCycles = value;
  console.log(movingBox.engineCycles);
}

export function updateWeight(value) {
  movingBox.shipWeight = value;
}

export function addGui() {
  // Set up the GUI for interactive adjustments
  const gui = new GUI();
  const folderSky = gui.addFolder('Sky');
  folderSky
    .add(customSky.parameters, 'elevation', 0, 90, 0.1)
    .onChange(() => customSky.updateSun());
  folderSky
    .add(customSky.parameters, 'azimuth', -180, 130, 0.1)
    .onChange(() => customSky.updateSun());

  const folderBox = gui.addFolder('Box Motion');
  const cyclesFolder = folderBox
    .add(movingBox, 'engineCycles', 1, 1000)
    .onChange((value) => {
      updateCycles(value);
    });
}

export function init() {
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
  rock = new Rock(scene);

  // Set up the camera
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(0, 700, 1100); // رفع الكاميرا إلى 500 على المحور Y
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

  // folderBox.add('', 'shipWeight', 187000000, 187000000 * 2).onChange((value) => {
  //     setWeight(value)
  // });

  // folderBox.add(movingBox, 'direction', ['forward', 'backward']).onChange((value) => {
  // movingBox.changeDirection()
  // });

  // const waterUniforms = customSea.water.material.uniforms;
  // const folderWater = gui.addFolder('Water Effects');
  // folderWater.add(waterUniforms.distortionScale, 'value', 0, 8, 0.1).name('Distortion Scale');
  // folderWater.add(waterUniforms.size, 'value', 0.1, 10, 0.1).name('Wave Size');
  // folderWater.open();

  window.addEventListener('resize', onWindowResize, false);

  // إضافة مستمعين لأحداث الضغط والإفلات عن المفاتيح
  window.addEventListener('keydown', onKeyDown, false);
  window.addEventListener('keyup', onKeyUp, false);

  // start animation
  animate();
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

export function animate() {
  // reduce frames
  setTimeout(() => {
    requestAnimationFrame(animate);
  }, 1000);

  movingBox.update(movingBox.engineCycles); // Update box movement
  customSea.update(); // Update sea animations
  customSky.updateSun(); // Update sky if necessary

  updateCameraPosition();

  // Calculate the new camera position relative to the ship
  if (movingBox.ship) {
    const shipPosition = movingBox.ship.position.clone();
    const offset = new THREE.Vector3(0, 50, -2000); // Adjust the offset as needed

    // Calculate the new camera position
    const cameraPosition = shipPosition.clone().add(offset);

    // Set the camera position and make it look at the ship
    // camera.position.lerp(cameraPosition, 0.1);
    camera.lookAt(shipPosition);
  }

  const shipCollisionDetectionBox = new THREE.Box3().setFromObject(
    movingBox.ship
  );

  let rockCollisionDetectionBox;

  if (rock.rock) {
    rockCollisionDetectionBox = new THREE.Box3().setFromCenterAndSize(
      rock.rock.position,
      new THREE.Vector3(3000, 3000, 3000) //need better numbers
    );

    // var distance = distanceVector(movingBox.ship.position , rock.rock.position) ;
    if (shipCollisionDetectionBox.intersectsBox(rockCollisionDetectionBox)) {
      //speed needs to be 0 buy the function
      //speed after collision // just add more weight to the rock untell it became 0
      console.log('collision');
      movingBox.weight += 1.6;
      console.log(movingBox.weight);

      // Shut down
      setCollesion();
      setSpeed(0);
    }
  }

  controls.update();
  renderer.render(scene, camera);
  stats.update();
}
