import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { getShipSpeed } from './../physics.js';

class MovingBox {
    constructor(scene) {
        this.scene = scene;
        this.loader = new OBJLoader();
        this.mtlLoader = new MTLLoader();

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
        this.speed = getShipSpeed(this.engineCycles); // Set initial speed based on engine cycles

        this.moveForward = false;
        this.moveBackward = false;
        this.rotateLeft = false;
        this.rotateRight = false;

        this.rotationSpeed = 0.05; // سرعة الدوران
        this.angle = 0; // زاوية السفينة

        this.addEventListeners();
    }

    updateSpeed() {
        this.speed = getSpeed(this.engineCycles);
    }

    update() {
        if (this.ship) {
            // حساب القوة الناتجة من المحرك
            const engineForce = getEngineForce(this.engineCycles);
            function getEngineForce(engineCycles) {
                // اكتب المنطق الذي يحدد القوة الناتجة بناءً على عدد دورات المحرك
                return {
                    force: engineCycles * 10, // كمثال بسيط، القوة قد تعتمد بشكل خطي على عدد دورات المحرك
                    dist: 0 // افتراض أن الاتجاه للأمام (0 درجات)
                };
            }
            
            // حساب القوة الناتجة عن مقاومة الماء (بافتراض أن المقاومة تعمل بزاوية 180 درجة مقابل الاتجاه)
            const resistanceForce = {
                force: 1, // قوة المقاومة (يمكن تعديلها حسب الحاجة)
                dist: 180 // زاوية المقاومة (عكس اتجاه الحركة)
            };

            // دمج القوى الناتجة من المحرك والمقاومة للحصول على القوة النهائية المؤثرة على السفينة
            const netForce = collectVectors(engineForce, resistanceForce ); // مثال على تمرير زاوية صفرية


            // حساب التسارع بناءً على القوة النهائية وكتلة السفينة
            const acceleration = getAcceleration(netForce.force, 10); // نفترض أن كتلة السفينة هي 10

            // حساب السرعة النهائية بناءً على التسارع
            const velocity = getVelocity(acceleration, 1, this.speed);

            // تحديث السرعة الحالية بالسفينة
            this.speed = velocity;

            // حساب الاتجاه الجديد بناءً على زاوية الدوران
            const directionX = Math.sin(this.angle);
            const directionZ = Math.cos(this.angle);

            if (this.moveForward) {
                this.ship.position.x -= directionX * this.speed;
                this.ship.position.z -= directionZ * this.speed;
            }
            if (this.moveBackward) {
                this.ship.translateX(this.speed) ;
                // this.ship.position.x += directionX * this.speed;
                // this.ship.position.z += directionZ * this.speed;
            }

            if (this.rotateLeft) {
                this.angle += this.rotationSpeed;
                this.ship.rotation.y += this.rotationSpeed;
            }
            if (this.rotateRight) {
                this.angle -= this.rotationSpeed;
                this.ship.rotation.y -= this.rotationSpeed;
            }
        }
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
                this.rotateLeft = true;
            }
            if (event.code === 'KeyD') {
                this.rotateRight = true;
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
                this.rotateLeft = false;
            }
            if (event.code === 'KeyD') {
                this.rotateRight = false;
            }
        });
    }
}

export default MovingBox;
