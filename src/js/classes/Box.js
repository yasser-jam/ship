// MovingBox.js
import * as THREE from 'three';
import { getSpeed } from './../physics.js';

class MovingBox {
    constructor(scene) {
        this.scene = scene;
        const geometry = new THREE.BoxGeometry(20, 20, 20);
        const material = new THREE.MeshStandardMaterial({ roughness: 0 });
        this.box = new THREE.Mesh(geometry, material);
        this.box.castShadow = true;
        this.box.receiveShadow = true;
        this.scene.add(this.box);

        this.engineCycles = 1; // Default number of engine cycles
        this.speed = getSpeed(this.engineCycles); // Set initial speed based on engine cycles

        this.box.position.y = 10; // Default position
        this.box.rotation.x = 0;
        this.box.rotation.z = 0;

        this.addEventListeners();
    }

    updateSpeed() {
        this.speed = getSpeed(this.engineCycles);
    }

    update() {
        if (this.moveForward) {
            this.box.position.z -= this.speed;
        }
        if (this.moveBackward) {
            this.box.position.z += this.speed;
        }
    }

    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowUp') {
                this.moveForward = true;
            }
            if (event.code === 'ArrowDown') {
                this.moveBackward = true;
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.code === 'ArrowUp') {
                this.moveForward = false;
            }
            if (event.code === 'ArrowDown') {
                this.moveBackward = false;
            }
        });
    }
}

export default MovingBox;
