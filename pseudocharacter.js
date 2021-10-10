const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
import { sqGridPaddingCallback } from "./utils/formatting-callbacks";
import { Character } from "./character";
import { gui } from "./gui-settings";
new p5();
var character = null;
var currentCharLoc = null;

var colors2 = ["#f3320b", "#fbec64", "#fe9469", "#530aca"];

var colors = ["#300a5c", "#f9a443", "#fed263", "#e0cbbc"];

const guiSettings = {
  debugLines: false,
  drawChars: true,
};
const folder = gui.addFolder("General");
folder.add(guiSettings, "debugLines");
folder.add(guiSettings, "drawChars");

var characterParams = {
  numStrokes: 5,
  sizeX: 150,
  sizeY: 150,
  xGrid: 3,
  yGrid: 3,
};
var bgColor = colors[3];

const settings = {
  dimensions: [2500, 2500],
  p5: true,
  animate: true,
};

let charParams = [];
const sketch = (sketchContext) => {
  const { play, stop, pause, render } = sketchContext;
  setup();
  window.addEventListener("keydown", (event) => {
    const { key } = event;
    if (key == "s") {
      saveCanvas(new Date().getTime() + "pseudochars", "png");
    }
    if (key == "c") {
      setup();
      stop();
      play();
      render();
    }
  });
  return ({ width, height }) => {
    if (guiSettings.drawChars) {
      drawCharactersFromGrid();
      // drawCharacters(sketchContext);
    } else {
      printGrid(sketchContext);
      sketchContext.stop();
    }
  };
};

function setup() {
  // put setup code here
  background(255);
  // noFill();
  charParams = getGridCharParams();
  // currentCharLoc = createVector(characterParams.sizeX, characterParams.sizeY);
  currentCharLoc = createVector(
    characterParams.sizeX * 0.5,
    characterParams.sizeY * 0.5
  );
  smooth();
}

function drawCharactersFromGrid(sketchContext) {
  if (charParams.length === 0) {
    return;
  }
  if (!charParams[0].character) {
    charParams[0].character = new Character(charParams[0].currParams);
  }
  const curr = charParams[0];
  applyMatrix();
  translate(...curr.translation);
  curr.character.draw();
  if (settings.debugLines) {
    curr.character.debugLines();
  }

  resetMatrix();
  if (curr.character.done) {
    charParams.shift();
  }
  if (charParams.length === 0) {
    sketchContext.pause();
  }
}
function drawCharacters(sketchContext) {
  applyMatrix();
  translate(currentCharLoc.x, currentCharLoc.y);
  character.draw();
  strokeWeight(1);
  smooth();
  stroke(0);
  if (guiSettings.debugLines) {
    character.paths.forEach((path) => {
      noFill();
      beginShape();
      path.forEach((pt) => {
        vertex(pt.x, pt.y);
      });
      endShape();
    });
  }
  if (character.done) {
    characterParams.numStrokes = Math.floor(random(3, 5));
    character = new Character(characterParams);
    currentCharLoc.x += characterParams.sizeX * 1.5;
    if (currentCharLoc.x + characterParams.sizeX * 0.5 > width) {
      currentCharLoc.x = characterParams.sizeX * 0.5;
      currentCharLoc.y += characterParams.sizeY * 1.5;
      if (currentCharLoc.y > height - characterParams.sizeY) {
        sketchContext.pause();
      }
    }
    resetMatrix();
  }
}

const getGridCharParams = () => {
  const charParams = [];
  const padding = 150;
  sqGridPaddingCallback(
    0,
    0,
    2500,
    5,
    padding
  )((gridX, gridY, sizeX, sizeY) => {
    const currParams = {
      ...characterParams,
      sizeX,
      sizeY,
    };
    const translation = [gridX - padding * 0.5, gridY - padding * 0.5];
    charParams.push({ translation, currParams });
  });
  return charParams;
};

const printGrid = () => {
  const padding = 150;
  sqGridPaddingCallback(
    0,
    0,
    2500,
    5,
    padding
  )((gridX, gridY, sizeX, sizeY) => {
    applyMatrix();
    translate(gridX - padding * 0.5, gridY - padding * 0.5);
    const currParams = {
      ...characterParams,
      sizeX,
      sizeY,
    };
    const char = new Character(currParams);
    char.print();
    resetMatrix();
  });
};

canvasSketch(sketch, settings);
