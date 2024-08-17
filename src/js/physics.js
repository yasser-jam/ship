import { setAccc, setSpeed, setTime } from "./stat";

// SCENE TIME
let startSceneTime = Date.now();

// SHIP WEIGHT
// const shipWeight = 10000
const shipWeight = 187000000

// BASIC CALCULATIONS

// Calculate Velocity
const getVelocity = (acceleration, initialVelocity = 0, time) => {
  // get time
  let sceneTime = time ? time : (Date.now() - startSceneTime) / 1000;

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

export const collectVectors = (vec1, vec2) => {
  // Convert angles from degrees to radians
  const angle1Rad = (vec1.angle * Math.PI) / 180;
  const angle2Rad = (vec2.angle * Math.PI) / 180;

  // Calculate the x and y components of each vector
  const vec1X = vec1.force * Math.cos(angle1Rad);
  const vec1Y = vec1.force * Math.sin(angle1Rad);

  const vec2X = vec2.force * Math.cos(angle2Rad);
  const vec2Y = vec2.force * Math.sin(angle2Rad);

  // Sum the x and y components to get the resultant vector components
  const totalX = vec1X + vec2X;
  const totalY = vec1Y + vec2Y;

  // Calculate the magnitude of the resultant vector
  const targetForce = Math.sqrt(totalX * totalX + totalY * totalY);

  // Calculate the angle of the resultant vector (in radians)
  let targetAngleRad = Math.atan2(totalY, totalX);

  // Convert the angle back to degrees
  let targetAngle = (targetAngleRad * 180) / Math.PI;

  // Normalize the angle to the range [0, 360)
  if (targetAngle < 0) {
    targetAngle += 360;
  }

  return {
    force: targetForce,
    angle: targetAngle,
  };
};

// EOF Basics

// Define the function to calculate thrust force
const getEngineForce = (cycles, angle) => {
  const rho = 1027; // Density of seawater in kg/m^3

  const D = 10
  const pitch = 0.2

  const vw = 10.3 // water speed

  // get the angle from box
  const vecAngle = angle;

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
  const engForce = getEngineForce(cycles, 0);

  // get the engine accelaration
  const engineAcc = getAcceleration(engForce.force, shipWeight);

  // get the engine speed (velocity) in the initial time
  const engSpeed = getVelocity(engineAcc, 0, 1);

  return engSpeed
};

export const shutDown = (speed) => {
  
}

// initial speed
let initialSpeed = 0

// cycles: number of cycles in second for the engine (engine speed)
// angle: the angle of the ship
export const getShipSpeed = (cycles, angle) => {
  // get engine force
  const engForce = getEngineForce(cycles, angle)

  // get the drag force (resistance force)
  const resForce = getResForce(cycles);

  // console.log('Eng Force', engForce);
  // console.log('Res Forc', resForce);

  // get the collective vector (engine and resistence)
  const collectiveVector = collectVectors(engForce, resForce);
  console.log(collectiveVector);
  // get the collective accelaration
  const acc = getAcceleration(collectiveVector.force, shipWeight);

  // update acceleration in stat
  setAccc(acc)
  // get the final speed (velocity)
  initialSpeed = getVelocity(acc, initialSpeed)
  const speed = getVelocity(acc, initialSpeed);

  // upate stat
  setSpeed(speed)

  return {
    speed,
    angle: collectiveVector.angle
  };
};

// Get time to rotate to certain angle
export const getRotationTime = (angle) => {
  const r = angle // نصف قطر الدوران
  const s = 10^6 // عزم الدوران
  const m = shipWeight


  const I = 1/2 * m * r * r // عزم القصور الذاتي

  const w = I / s // السرعة الزاوية

  const t = w * Math.PI / 180

  return t
}