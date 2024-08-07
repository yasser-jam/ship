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
    // const geometry = new THREE.BoxGeometry(20, 20, 20);
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
        });
    });

    this.engineCycles = 1; // Default number of engine cycles
    // this.speed = getSpeed(this.engineCycles); // Set initial speed based on engine cycles
    const move = getShipSpeed(this.engineCycles); // Set initial speed based on engine cycles

    this.speed = move.speed;
    this.angle = move.angle;

    this.moveForward = true;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.addEventListeners();
  }

  updateSpeed() {
    return this.speed;
  }

  update(cycles = 1) {
    // update engine cycles
    this.engineCycles = cycles;

    // update box movement on z axis
    const updateMove = getShipSpeed(this.engineCycles);
    this.speed = updateMove.speed;
    this.angle = updateMove.angle;

    if (this.angle == 180) {
      this.ship.position.z += this.speed * 100;
    } else {
      this.ship.position.z -= this.speed * 100;
    }
    // if (this.moveBackward) {
    //   this.ship.position.z += this.speed;
    // }
    // if (this.moveLeft) {
    //   this.ship.position.x -= this.speed;
    // }
    // if (this.moveRight) {
    //   this.ship.position.x += this.speed;
    // }
  }

  addEventListeners() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'KeyW') {
        this.moveForward = true;
      }
      if (event.code === 'KeyS') {
        this.moveBackward = true;
      }
      if (event.code === 'KeyA') {
        this.moveLeft = true;
      }
      if (event.code === 'KeyD') {
        this.moveRight = true;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.code === 'KeyW') {
        this.moveForward = false;
      }
      if (event.code === 'KeyS') {
        this.moveBackward = false;
      }
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
