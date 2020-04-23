import { TargetChaserStroke } from "./strokes/target-chaser-stroke";

export class Character {
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
    var targetProps = {
      loc: this.getGridCenterLoc(Math.floor(random(this.numCells))),
    };
    var chaserProps = {
      initLoc: this.getGridCenterLoc(Math.floor(random(this.numCells))),
      initVel: this.getUnitVectorFromInt(Math.floor(random(9))).mult(8),
    };
    var duration = random(10, 30);
    return new TargetChaserStroke({ chaserProps, targetProps, duration });
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
      this.paths.push(this.currentStroke.getPath());
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
