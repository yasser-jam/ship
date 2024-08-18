// import * as THREE from 'three';
// import { Sky } from 'three/addons/objects/Sky.js';

// class CustomSky {
//     constructor(scene, renderer) {
//         this.scene = scene;
//         this.renderer = renderer;
//         this.sun = new THREE.Vector3();

//         this.sky = new Sky();
//         this.sky.scale.setScalar(10000);
//         this.scene.add(this.sky);

//         this.skyUniforms = this.sky.material.uniforms;
//         this.skyUniforms['turbidity'].value = 10;
//         this.skyUniforms['rayleigh'].value = 2;
//         this.skyUniforms['mieCoefficient'].value = 0.005;
//         this.skyUniforms['mieDirectionalG'].value = 0.8;

//         this.parameters = {
//             elevation: 2,
//             azimuth: 180
//         };

//         this.pmremGenerator = new THREE.PMREMGenerator(renderer);

//         this.updateSun();

//         // Load seagull sound
//         this.seagullSound = new Audio('src/sounds/seagull.mp3');

//         // Play seagull sound every 10 seconds
//         setInterval(() => {
//             this.seagullSound.play();
//         }, 18000); // 10000 milliseconds = 10 seconds
//     }

//     updateSun() {
//         const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation);
//         const theta = THREE.MathUtils.degToRad(this.parameters.azimuth);

//         this.sun.setFromSphericalCoords(1, phi, theta);

//         this.sky.material.uniforms['sunPosition'].value.copy(this.sun);

//         const renderTarget = this.pmremGenerator.fromScene(this.scene);
//         this.scene.environment = renderTarget.texture;
//     }
// }

// export default CustomSky;

import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

class CustomSky {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        this.sun = new THREE.Vector3();

        this.sky = new Sky();
        this.sky.scale.setScalar(10000);
        this.scene.add(this.sky);

        this.skyUniforms = this.sky.material.uniforms;
        this.skyUniforms['turbidity'].value = 10;
        this.skyUniforms['rayleigh'].value = 2;
        this.skyUniforms['mieCoefficient'].value = 0.005;
        this.skyUniforms['mieDirectionalG'].value = 0.8;

        this.parameters = {
            elevation: 2,
            azimuth: 180
        };

        this.pmremGenerator = new THREE.PMREMGenerator(renderer);

        this.updateSun();

        // Load seagull sound
        this.seagullSound = new Audio('src/sounds/seagull.mp3');

        // Play seagull sound every 10 seconds
        setInterval(() => {
            this.seagullSound.play();
        }, 18000); // 10000 milliseconds = 10 seconds
    }

    updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - this.parameters.elevation);
        const theta = THREE.MathUtils.degToRad(this.parameters.azimuth);

        this.sun.setFromSphericalCoords(1, phi, theta);

        this.sky.material.uniforms['sunPosition'].value.copy(this.sun);

        const renderTarget = this.pmremGenerator.fromScene(this.scene);
        this.scene.environment = renderTarget.texture;
    }
}

export default CustomSky;