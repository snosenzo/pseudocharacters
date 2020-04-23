import { BaseStroke } from "./base";
const p5 = require("p5");

var colors2 = ["#f3320b", "#fbec64", "#fe9469", "#530aca"];
var colors = ["#300a5c", "#f9a443", "#fed263", "#e0cbbc"];

const NUM_STEPS_FOR_STROKE = 20;

export class TargetChaserStroke extends BaseStroke {
  constructor(args) {
    super(args);
    const { chaserProps, targetProps } = args;
    this.path = [];
    this.chaser = new Chaser(chaserProps);
    this.target = new Target(targetProps);
    this.numSteps = NUM_STEPS_FOR_STROKE;
    this.loc = this.chaser.loc;
    this.pastLoc = null;
    this.pastStroke = 1;
  }

  update() {
    // update particles guiding stroke
    this.chaser.seek(this.target.loc);
    this.chaser.update();
    this.loc = this.chaser.loc;
    this.duration--;
  }

  // use the movement of the chaser to draw the stroke
  displayChaserStroke() {
    const { chaser, duration, pastLoc, pastStroke, loc } = this;
    const { maxSpeed, vel } = chaser;
    const xVelNormalized = map(vel.x, -maxSpeed, maxSpeed, 0, 1);
    stroke(lerpColor(color(colors[1]), color(colors[2]), xVelNormalized));
    let strokeSize = getVelStrokeWeight(vel.mag());
    // taper off stroke at the end
    if (duration < 20) strokeSize *= duration / 20;
    // strokeWeight(strokeSize);
    let pathToAppend = [];
    if (pastLoc) {
      pathToAppend = lerpPointWithStroke(
        pastLoc,
        loc,
        pastStroke,
        strokeSize,
        NUM_STEPS_FOR_STROKE,
        ellipseStroke
      );
    }
    this.pastStroke = strokeSize;
    this.pastLoc = new createVector(loc.x, loc.y);
    this.path = this.path.concat(pathToAppend);
  }

  draw() {
    this.displayChaserStroke();
  }
}

export class Target {
  constructor({ loc }) {
    this.loc = loc;
  }

  displayLoc() {
    const { loc } = this;
    point(loc.x, loc.y);
  }
}

export class Chaser {
  constructor({ initLoc, initVel }) {
    this.loc = initLoc;
    this.vel = initVel;
    this.acc = createVector(0, 0);
    this.maxForce = 0.6;
    this.maxSpeed = 10.0;
  }

  update() {
    var { loc, vel, acc, maxSpeed } = this;
    vel.add(acc);
    vel.limit(maxSpeed);
    loc.add(vel);
    acc.mult(0);
  }

  seek(target) {
    var { loc, vel, acc, maxSpeed, maxForce } = this;
    var desired = p5.Vector.sub(target, loc);
    var dist = desired.mag();
    desired.normalize();
    desired.mult(maxSpeed);
    var steer = p5.Vector.sub(desired, vel);
    steer.mult(dist * dist * 0.001);
    steer.limit(maxForce);
    acc.add(steer);
  }

  displayLoc() {
    const { loc } = this;
    point(loc.x, loc.y);
  }

  displayVel() {
    const { loc, vel } = this;
    line(loc.x, loc.y, loc.x + vel.x, loc.y + vel.y);
  }
  // show point of chaser and velocity
  display() {
    stroke(0);
    this.displayLoc();
    stroke(255, 0, 0);
    this.displayVel();
  }
}

const ellipseStroke = (loc, strokeSize) => {
  ellipseMode(CENTER);
  ellipse(loc.x, loc.y, strokeSize, strokeSize);
};

const rectStroke = (loc, strokeSize) => {
  rectMode(CENTER);
  rect(loc.x, loc.y, 1, strokeSize);
};
const diagonalLineStroke = (loc, strokeSize) => {
  line(
    loc.x + strokeSize,
    loc.y + strokeSize,
    loc.x - strokeSize,
    loc.y - strokeSize
  );
};
const diagonalLineNoiseStroke = (loc, strokeSize) => {
  line(
    loc.x + strokeSize,
    loc.y + strokeSize * noise(strokeSize),
    loc.x - strokeSize * noise(strokeSize),
    loc.y - strokeSize
  );
};

const noneStroke = (loc, strokeSize) => {};

const noiseLineStroke = (loc, strokeSize) => {
  const xOffset = strokeSize * (-0.5 + noise(loc.x / 10.0));
  const yOffset = strokeSize * (-0.5 + noise(loc.y / 10.0));
  ellipse(loc.x + xOffset, loc.y + yOffset, strokeSize, strokeSize);
};

const lerpPointWithStroke = (
  startLoc,
  endLoc,
  startStroke,
  endStroke,
  numSteps,
  displayStroke
) => {
  const path = [];
  const stepSize = 1.0 / numSteps;
  const incLoc = startLoc.copy();
  let incStroke = startStroke;
  for (let i = 0; i <= 1; i += stepSize) {
    incLoc.x = lerp(startLoc.x, endLoc.x, i);
    incLoc.y = lerp(startLoc.y, endLoc.y, i);
    incStroke = lerp(startStroke, endStroke, i);
    path.push(incLoc);
    displayStroke(incLoc, incStroke);
  }
  return path;
};

const getVelStrokeWeight = (velMag) => {
  return map(velMag * velMag, 0, 100, 30, 12);
};
