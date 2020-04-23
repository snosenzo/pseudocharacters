export class BaseStroke {
  constructor({ strokeWeightFunc, duration }) {
    this.strokeWeight = strokeWeightFunc;
    this.duration = duration;
    this.path = [];
    this.loc;
    this.pastStroke;
    this.pastLoc;
  }

  update() {
    this.duration--;
  }

  draw() {}

  print() {
    while (!this.done()) {
      this.update();
      this.draw();
    }
  }

  getPath() {
    return this.path;
  }

  done() {
    return this.duration < 0;
  }
}
