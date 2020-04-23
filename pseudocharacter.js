const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
import {
  TargetChaserStroke,
  Target,
  Chaser,
} from "./strokes/target-chaser-stroke";
new p5();
var character = null;
var currentCharLoc = null;
var colors2 = ["#f3320b", "#fbec64", "#fe9469", "#530aca"];
var colors = ["#300a5c", "#f9a443", "#fed263", "#e0cbbc"];
var characterParams = {
  numStrokes: 5,
  sizeX: 250,
  sizeY: 250,
  xGrid: 3,
  yGrid: 3,
};
var bgColor = colors[3];

const settings = {
  dimensions: [2000, 2000],
  p5: true,
  animate: true,
};

const sketch = () => {
  setup();
  return ({ width, height }) => {
    draw();
  };
};

function setup() {
  // put setup code here
  background(255);
  // noFill();
  character = new Character(characterParams);
  // currentCharLoc = createVector(characterParams.sizeX, characterParams.sizeY);
  currentCharLoc = createVector(0, 0);
  smooth();
}

function draw() {
  applyMatrix();
  translate(currentCharLoc.x, currentCharLoc.y);
  character.print();
  strokeWeight(1);
  smooth();
  stroke(0);
  character.paths.forEach((path) => {
    beginShape();
    path.forEach((pt) => {
      vertex(pt.x, pt.y);
    });
    endShape();
  });
  if (character.done) {
    // rect(
    //   -0.5 * characterParams.sizeX,
    //   -0.5 * characterParams.sizeY,
    //   2 * characterParams.sizeX,
    //   2 * characterParams.sizeY
    // );
    characterParams.numStrokes = Math.floor(random(3, 5));
    character = new Character(characterParams);
    currentCharLoc.x += characterParams.sizeX * 1.5;
    if (currentCharLoc.x + characterParams.sizeX * 0.5 > width) {
      currentCharLoc.x = characterParams.sizeX;
      currentCharLoc.y += characterParams.sizeY * 1.5;
      if (currentCharLoc.y > height - characterParams.sizeY) {
        noLoop();
      }
    }
  }
  resetMatrix();
}

function keyPressed() {
  console.log(key);
  if (key == "R") {
    reset();
  }
  if (key == "S") {
    saveCanvas(new Date().getTime() + "pseudochars", "png");
  }
  if (key == "C") {
    reset();
  }
}
function reset() {
  background(bgColor);
  loop();
  character = new Character(characterParams);
  currentCharLoc = createVector(
    characterParams.sizeX * 0.3,
    characterParams.sizeY * 0.3
  );
}
class Character {
  constructor({ numStrokes, sizeX, sizeY, xGrid, yGrid }) {
    this.numStrokes = numStrokes;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.xGrid = xGrid; //int
    this.yGrid = yGrid; //int
    this.cellX = sizeX / xGrid;
    this.cellY = sizeY / yGrid;
    this.numCells = xGrid * yGrid;
    this.currentStroke = this.randomStroke();
    this.done = false;
    this.paths = []; // array of arrays
    this.boundingBox = {
      minX: Number.MAX_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER,
    };
  }

  //returns vector
  getGridCenterLoc(intLoc) {
    // integer index in grid
    return createVector(
      this.cellX / 2.0 + (intLoc % this.xGrid) * this.cellX,
      this.cellY / 2.0 + Math.floor(intLoc / this.xGrid) * this.cellY
    );
  }

  getUnitVectorFromInt(dir) {
    return createVector(-1 + (dir % 3), -1 + Math.floor(dir / 3));
  }
  getRowCol(intLoc) {
    return [intLoc / this.xGrid, intLoc % this.xGrid];
  }
  isOutsideLoc(intLoc) {
    const [row, col] = getRowCol[intLoc];
    if (row === 0 || row === this.xGrid - 1) {
      return true;
    }
    if (col === 0 || col === this.yGrid - 1) {
      return true;
    }
    return false;
  }

  getControlledUnitVectorBasedOffLoc(loc) {}

  randomStroke() {
    var target = new Target(
      this.getGridCenterLoc(Math.floor(random(this.numCells)))
    );
    var chaser = new Chaser(
      this.getGridCenterLoc(Math.floor(random(this.numCells))),
      this.getUnitVectorFromInt(Math.floor(random(9))).mult(8)
    );
    var duration = random(10, 30);
    return new TargetChaserStroke({ chaser, target, duration });
  }

  print() {
    while (this.numStrokes > 0) {
      const currStroke = this.randomStroke();
      currStroke.print();
      this.paths.push(currStroke.getPath());
      this.numStrokes--;
    }
    this.done = true;
  }

  draw() {
    if (this.currentStroke.done()) {
      if (this.numStrokes !== 0) {
        this.currentStroke = this.randomStroke();
        this.numStrokes--;
      } else {
        this.done = true;
      }
    } else {
      this.currentStroke.update();
      this.currentStroke.draw();
    }
  }
}

canvasSketch(sketch, settings);
