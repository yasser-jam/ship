import { setSpeed, setTime } from "./stat";

// SCENE TIME
let startSceneTime = Date.now();

// SHIP WEIGHT
// const shipWeight = 10000
const shipWeight = 187000000 

// BASIC CALCULATIONS

// Calculate Velocity
const getVelocity = (acceleration, initialVelocity = 0, time) => {
  // get time
  let sceneTime = time ? time : (Date.now() - startSceneTime) / 100;

  // Calculate the final velocity using the kinematic equation
  const velocity = initialVelocity + acceleration * sceneTime;

  // update state
  setTime(sceneTime)

  // Return the final velocity
  return velocity;
};

// Calculate Acceleration
const getAcceleration = (force, weight) => {
  return force / weight;
};

// EOF Basics

// Define the function to calculate thrust force
const getEngineForce = (cycles) => {
  const rho = 1027; // Density of seawater in kg/m^3

  const D = 10
  const pitch = 0.2

  const vw = 10.3 // water speed

  // always engine force angle 0 (always forward)
  const vecAngle = 0;

  // Calculate the thrust force using the derived formula
  // Todo: check laws
  // const vecForce = mu * k * cycles * Math.sqrt(2 * rho * A);
  const vecForce = rho * D * D * pitch * pitch * cycles;
  // const vecForce = rho * A * vw * vw

  // Return the thrust force
  return {
    angle: vecAngle,
    force: vecForce,
  };
};

// Define the function to calculate drag force
const getResForce = (cycles) => {
  const rho = 1025; // Density of seawater in kg/m^3
  const A = 23.635; // Reference Area Todo: should be calculated // const calculated by  h = v / l* w
  const Cd = 0.6; // Drag Coefficient

  const v = getEnginSpeed(cycles)

  // always engine force angle 0 (always backward)
  const resAngle = 180;

  // Calculate the thrust force using the derived formula
  // Todo: check law
  const resForce = 0.5 * rho * (v * v) * Cd * A;
  // const resForce = 0.5 * rho * (v) * Cd * A;

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
  const engineAcc = getAcceleration(engForce.force, shipWeight);

  // get the engine speed (velocity) in the initial time
  const engSpeed = getVelocity(engineAcc, 0, 1);

  return engSpeed
};

export const getShipSpeed = (cycles) => {
  // get engine force
  const engForce = getEngineForce(cycles)

  // get the drag force (resistance force)
  const resForce = getResForce(cycles);

  // console.log('Eng Force', engForce);
  // console.log('Res Forc', resForce);

  // get the collective vector (engine and resistence)
  const collectiveVector = collectVectors(engForce, resForce);

  // get the collective accelaration
  const acc = getAcceleration(collectiveVector.force, shipWeight);

  // get the final speed (velocity)
  const speed = getVelocity(acc, 0);

  // upate stat
  setSpeed(speed)

  return {
    speed,
    angle: collectiveVector.angle
  };
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
