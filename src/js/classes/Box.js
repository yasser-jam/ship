import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { getShipSpeed } from './../physics.js';

class MovingBox {
  constructor(scene) {
    this.scene = scene;
    this.loader = new OBJLoader();
    this.mtlLoader = new MTLLoader();

    // BOX
    // const geometry = new THREE.BoxGeometry(200, 200, 200);
    // const material = new THREE.MeshStandardMaterial({ roughness: 0 });
    // this.ship = new THREE.Mesh(geometry, material);
    // this.ship.castShadow = true;
    // this.ship.receiveShadow = true;
    // this.scene.add(this.ship);


    // SHIP
    this.mtlLoader.load('src/textures/EverGiven/EverGiven.mtl', (materials) => {
      materials.preload();
      this.loader.setMaterials(materials);

      this.loader.load('src/textures/EverGiven/EverGiven.obj', (object) => {
        this.ship = object;
        this.ship.scale.set(10, 10, 10); // Adjust the scale if needed
        this.ship.castShadow = true;
        this.ship.receiveShadow = true;

        // Rotate the model by 90 degrees around the Y axis
        this.ship.rotation.y = 3 * Math.PI / 2;

        // Compute bounding box to determine the size of the model
        const box = new THREE.Box3().setFromObject(this.ship);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Adjust the position to start at z = 0 and extend along the z-axis
        this.ship.position.set(0, 0, -2000);

        this.scene.add(this.ship);

        // ADD LIGHT TO THE SHIP
        const shipLight = new THREE.PointLight(0xffffff, 1, 500);
        shipLight.position.set(0, 50, 0); // Adjust position relative to the ship
        shipLight.castShadow = true;

        // Add the light to the ship, so it moves with the ship
        this.ship.add(shipLight);
      });
    });

    // Default number of engine cycles
    this.engineCycles = 1;

    const moveConfig = getShipSpeed(this.engineCycles); // Set initial speed based on engine cycles
    this.speed = moveConfig.speed;
    this.angle = moveConfig.angle;

    // Movement keys
    this.moveLeft = false;
    this.moveRight = false;

    this.addEventListeners()
  }

  update(cycles = this.engineCycles) {
    // update engine cycles
    this.engineCycles = cycles;

    // update box movement on z axis
    const updateMove = getShipSpeed(this.engineCycles);
    this.speed = updateMove.speed;
    this.angle = updateMove.angle;

    if (this.angle == 180) {
      this.ship.translateX(this.speed / 0.1);
      // this.ship.position.z += this.speed;
    } else {
      this.ship.position.z -= this.speed;
    }
  }

  addEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyA') {
        console.log('moving left');
        this.moveLeft = true;
      }
      if (event.code === 'KeyD') {
        console.log('moving right');
        this.moveRight = true;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.code === 'KeyA') {
        this.moveLeft = false;
      }
      if (event.code === 'KeyD') {
        this.moveRight = false;
      }
    });
  }
}

export default MovingBox;
