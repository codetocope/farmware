var gui;
var baseOptions = ['ring', 'bracelet', 'earring'];
var type = 'ring';

var ringSize = 30;
var ringDefaultSize = 30;
var ringSizeMin = 26;
var ringSizeMax = 34;
var ringInsetSize = ringInsetDefaultSize = 28;
var ringInsetSizeMin = 20;
var ringInsetSizeMax = 35;

var braceletLength = 210;
var braceletDefaultLength = 210;
var braceletLengthMin = 205;
var braceletLengthMax = 220;

var earringSize = 30;
var earringDefaultSize = 30;
var earringsizeMin = 20;
var earringsizeMax = 40;

var insetRingOptions = ['heart', 'triangle', 'circle', 'square'];
var insetOption1 = insetOption2 = insetOption3 = ['circle', 'square', 'heart', 'triangle'];

var selectedInsets = [];

var fileName = "";
var exportFile = false;

var allGuis = [];
var defaultGuiPos = [20, 190];

var canvas;

function setup() {
  canvas = createCanvas(windowWidth * .2, windowHeight * .4);
  //canvas.mouseClicked(updateModel);

  background(0, 0, 0, 0);

  gui = createGui('Options');
  gui.addGlobals('baseOptions', 'fileName');

  ringGui = createGui('Ring');
  ringGui.addGlobals('ringSize', 'insetRingOptions', 'ringInsetSize', 'exportFile');

  braceletGui = createGui('Bracelet');
  braceletGui.addGlobals('braceletLength', 'insetOption1', 'insetOption2', 'insetOption3', 'exportFile');

  earringGui = createGui('Earrings');
  earringGui.addGlobals('earringSize', 'exportFile');

  allGuis = [ringGui, braceletGui, earringGui];

  noLoop();
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    updateModel();
  }
}

function draw() {

  switch (baseOptions) {
    case 'ring':
      setBaseModel(0);
      type = 'ring';
      break;
    case 'bracelet':
      setBaseModel(1);
      type = 'bracelet';
      break;
    case 'earring':
      setBaseModel(2);
      type = 'earring';
      break;
  }

  if (exportFile) {
    saveFile();
    exportFile = false;
  }

}

function setModelOptions(type) {

  switch (allGuis[type]) {
    case ringGui:
      switch (insetRingOptions) {
        case 'heart':
          updateModelOptions('ring', 'heart', 0);
          break;
        case 'circle':
          updateModelOptions('ring', 'circle', 0);
          break;
        case 'triangle':
          updateModelOptions('ring', 'triangle', 0);
          break;
        case 'square':
          updateModelOptions('ring', 'square', 0);
          break;
      }
      break;

    case braceletGui:
      switch (insetOption1) {
        case 'circle':
          updateModelOptions('bracelet', 'circle', 1);
          selectedInsets[0] = 'circle';
          break;
        case 'heart':
          updateModelOptions('bracelet', 'heart', 1);
          selectedInsets[0] = 'heart';
          break;
        case 'triangle':
          updateModelOptions('bracelet', 'triangle', 1);
          selectedInsets[0] = 'trianlge';
          break;
        case 'square':
          updateModelOptions('bracelet', 'square', 1);
          selectedInsets[0] = 'square';
          break;
      }
      switch (insetOption2) {
        case 'circle':
          updateModelOptions('bracelet', 'circle', 2);
          selectedInsets[1] = 'circle';
          break;
        case 'heart':
          updateModelOptions('bracelet', 'heart', 2);
          selectedInsets[1] = 'heart';
          break;
        case 'triangle':
          updateModelOptions('bracelet', 'triangle', 2);
          selectedInsets[1] = 'triangle';
          break;
        case 'square':
          updateModelOptions('bracelet', 'square', 2);
          selectedInsets[1] = 'square';
          break;
      }
      switch (insetOption3) {
        case 'circle':
          updateModelOptions('bracelet', 'circle', 3);
          selectedInsets[2] = 'circle';
          break;
        case 'heart':
          updateModelOptions('bracelet', 'heart', 3);
          selectedInsets[2] = 'heart';
          break;
        case 'triangle':
          updateModelOptions('bracelet', 'triangle', 3);
          selectedInsets[2] = 'triangle';
          break;
        case 'square':
          updateModelOptions('bracelet', 'square', 3);
          selectedInsets[2] = 'square';
          break;
      }
      break;
  }
}

function setBaseModel(type) {

  for (var i = 0; i < allGuis.length; i++) {
    allGuis[i].setPosition(defaultGuiPos[0], defaultGuiPos[1]);
    allGuis[i].hide();
  }

  allGuis[type].show();
}