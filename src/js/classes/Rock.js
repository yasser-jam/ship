import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';


class Rock {
  constructor(scene) {
    this.scene = scene;
    this.loader = new OBJLoader();
    this.mtlLoader = new MTLLoader();

    // Rock
    this.mtlLoader.load('../src/textures/Rock1/Rock1.mtl', (materials) => {
      materials.preload();
      this.loader.setMaterials(materials);

      this.loader.load('../src/textures/Rock1/Rock1.obj', (object) => {
        this.rock = object;
        this.rock.scale.set(1000, 1000, 1000); // Adjust the scale if needed
        this.rock.castShadow = false;
        this.rock.receiveShadow = false;

        // Compute bounding rock to determine the size of the model
        const box = new THREE.Box3().setFromObject(this.rock);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Adjust the position to start at z = 0 and extend along the z-axis
        this.rock.position.set(0, -200, -7000);

        this.scene.add(this.rock);
      });
    });

    // Default number of engine cycles
    this.engineCycles = 1;

    this.speed = 0 ;
    this.angle = 0 ;

  }
}

export default Rock;
