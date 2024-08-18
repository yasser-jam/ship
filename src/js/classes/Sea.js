import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';

class CustomSea {
    constructor(scene, sunDirection) {
        this.scene = scene;

        // تكبير رقعة البحر
        const waterGeometry = new THREE.PlaneGeometry(100000, 100000);

        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('ttps://threejs.org/examples/textures/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: sunDirection,
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        });

        this.water.rotation.x = -Math.PI / 2;
        this.scene.add(this.water);

        // Load and play wave sound continuously
        this.waveSound = new Audio('src/sounds/waves.mp3');
        this.waveSound.loop = true; // Loop the sound
        this.waveSound.play();
    }

    update() {
        this.water.material.uniforms['time'].value += 1.0 / 60.0;
    }
}

export default CustomSea;
