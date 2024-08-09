import { abs } from "mathjs";

// SCENE TIME
let startSceneTime = Date.now();

// BASIC CALCULATIONS

// Calculate Velocity
const getVelocity = (acceleration, initialVelocity = 0) => {
  // get time
  let sceneTime = (Date.now() - startSceneTime) / 1000;

  // Calculate the final velocity using the kinematic equation
  const velocity = initialVelocity + acceleration * sceneTime;

  // Return the final velocity
  return velocity;
};

// Calculate Acceleration
const getAcceleration = (force, weight) => {
  return force / weight;
};

// Define the function to calculate thrust force
const getEngineForce = (cycles) => {
  const mu = 0.8; // Efficiency coefficient
  const rho = 1025; // Density of seawater in kg/m^3
  const S = 50; // Reference area in m^2
  const k = 0.1; // Proportionality constant (example value)

  // always engine force angle 0 (always forward)
  const vecAngle = 0;

  // Calculate the thrust force using the derived formula
  const vecForce = mu * k * cycles * Math.sqrt(2 * rho * S);

  // Return the thrust force
  return {
    angle: vecAngle,
    force: vecForce,
  };
};

// Define the function to calculate drag force
const getResForce = (cycles) => {
  const rho = 1025; // Density of seawater in kg/m^3
  const A = 50; // Reference Area Todo: should be calculated
  const Cd = 0.6; // Drag Coefficient
  const v = getEnginSpeed(cycles); // velocity of the object relative to the fluid

  // always engine force angle 0 (always backward)
  const resAngle = 180;

  // Calculate the thrust force using the derived formula
  const resForce = 0.5 * rho * (v * v) * Cd * A;

  // Return the thrust force
  return {
    angle: resAngle,
    force: resForce,
  };
};

export const getEnginSpeed = (cycles) => {
  // get the engine force
  const engForce = getEngineForce(cycles);

  // get the engine accelaration
  const engineAcc = getAcceleration(engForce.force, 10000);

  // get the engine speed (velocity)
  const engSpeed = getVelocity(engineAcc, 0);

  return engSpeed
};

export const getShipSpeed = (cycles) => {
  // get engine force
  const engForce = getEngineForce(cycles)

  // get the drag force (resistance force)
  const resForce = getResForce(cycles);

  // get the collective vector (engine and resistence)
  const collectiveVector = collectVectors(engForce, resForce);

  // get the collective accelaration
  const acc = getAcceleration(collectiveVector.force, 10);

  // get the final speed (velocity)
  const speed = getVelocity(acc, 0);

  return speed;
};

export const collectVectors = (vec1, vec2, angle) => {
  let targetAngle;
  let targetForce;

  // on the same handle (check if the two vectors are on same handle)
  let onSameDirection = Math.abs(vec1.angle - vec2.angle) == 0 || Math.abs(vec1.angle - vec2.angle) == 360;
  let onOppositeDirection = Math.abs(vec1.angle - vec2.angle) == 180;

  const vectorsHandle = vec1.angle - vec2.angle;

  if (onSameDirection) {
    targetAngle = vec1.angle;
    targetForce = vec1.force + vec2.force;
  } else  {
    const biggerVec = vec1.force > vec2.force ? vec1 : vec2;

    targetAngle = biggerVec.angle;
    targetForce = Math.abs(vec1.force - vec2.force);
  }

  return {
    force: targetForce,
    angle: targetAngle,
  };
};

// Force Powers are:
// - Engine (get Engine Force)
export const collectForce = () => {};

// - Water Resistence
export const collectRes = () => {};
