// const vector = {
//     force: 1, // الشدة
//     dist: 0  // angle between the vector and the horizontal line
// }

import { derivative } from "mathjs";

// شعاع الدفع
const forceVector = {
  force: 1,
  dist: 0,
};

// شعاع المقاومة
const resVector = {
  force: 1,
  dist: 180,
};

// get engine speed from n (the number of cycles of that engine)
export const getSpeed = (n) => {
  return n * 10;
};

// Calculate Velocity
const getVelocity = (acceleration, time, initialVelocity = 0) => {
  // Calculate the final velocity using the kinematic equation
  const velocity = initialVelocity + acceleration * time;

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

export const getShipSpeed = (cycles) => {
    // get the engine force
    const engForce = getEngineForce(cycles)
    // get the engine accelaration
    const engAcc = getAcceleration(engForce.force, 10)

    // get the engine speed
    const engSpeed = getVelocity(engAcc, 10, 0)
    console.log(engSpeed);
    // get the resistence force

    // get the resistance acceleration

    // get the resistance speed
    return engSpeed
}

// Force Powers are:
// - Engine (get Engine Force)
export const collectForce = () => {};

// - Water Resistence
export const collectRes = () => {};

export const collectVectors = (vec1, vec2, angle) => {
  let targetAngle;
  let targetForce;

  // on the same handle (check if the two vectors are on same handle)
  let isOnSameHandle = false;
  let isOnOppositHandle = false;

  const vectorsHandle = vec1.dist - vec2.dist;

  if (vectorsHandle == 0 || vectorsHandle == 360) isOnSameHandle = true;

  if (vectorsHandle == 180) isOnOppositHandle = true;

  if (isOnSameHandle) {
    targetAngle = vec1.angle;
    targetForce = vec1.force + vec2.force;
  } else if (isOnOppositHandle) {
    const biggerVec = vec1.force > vec2.force ? vec1 : vec2;

    targetAngle = biggerVec.angle;
    targetForce = Math.abs(vec1.force - vec2.force);
  }

  return {
    force: targetForce,
    angle: targetAngle,
  };
};
