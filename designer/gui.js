var customOptions = {
    type: 'custom',
    waveHeight: 1
};
var neckOpts = {
    shape: 'spheres',
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1
};

var objOptions = {
    fileName: "default",
    type: '',
    scale1: 30,
    scale2: 30,
    scale3: 30,
    inset1: 'circle',
    inset2: 'circle',
    inset3: 'circle',
    insets: [],
    insetSizes: [30, 30, 30],
    color: 'white'
};

function updateAllInsets() {
    objOptions.insets = [objOptions.inset1, objOptions.inset2, objOptions.inset3];
}

var exportBtn = {
    export: function () {
        saveFile(objOptions.fileName);
    }
};

var previewBtn = {
    preview: function () {
        togglePreview();
    }
};

const gui = new dat.GUI({
    width: 370,
    height: 850
});

gui.domElement.id = 'gui';

const baseOpt = gui.addFolder("Base Options");
baseOpt.add(objOptions, "fileName").name('File Name');

baseOpt.add(objOptions, "type", ['Shapes Bracelet', 'Wave Bracelet', 'Ring', 'Necklace']).onChange(function (newValue) {
    if (newValue.indexOf("Bracelet") > -1) {
        updateModel('bracelet' + 'Base');
    } else if (newValue.indexOf('Neck') > -1){
        updateModel('spheresNeckInset');
    } else {
        updateModel(newValue.toLowerCase() + 'Base');
    }

    setUI(newValue);
}).name('Base Type');

baseOpt.add(previewBtn, 'preview').name('Toggle Preview');
baseOpt.add(exportBtn, 'export').name('Export to STL');
baseOpt.open();

//const customOpts = gui.addFolder("Custom Options");

function clearUI() {

    for (var i = 0; i < Object.keys(gui.__folders).length; i++) {

        // Clear previous UI subfolders        

        if (Object.keys(gui.__folders)[i] != "Base Options")
            gui.removeFolder(Object.values(gui.__folders)[i]);
    }
}

function clearControls(ui) {

    ui.__controllers.forEach(function (controller, i) {
        console.log(controller)
        ui.remove(controller);
    });
}

function setUI(type) {

    clearUI();
    resetPreview();

    if (type == "Ring") {
        changeCurrentType(handPhoto);
        const ringOpt = gui.addFolder("Ring Options");
        
        ringOpt.add(objOptions, "inset1", ['heart', 'circle', 'triangle', 'square']).onChange(function (newValue) {
            updateModelOptions(newValue);
        }).name("Inset Shape");

        ringOpt.add(objOptions, "color", ['white', 'black', 'orange']).onChange(function (newValue) {
            setColor(newValue);
        }).name("Color");

        ringOpt.add(objOptions, "scale1", 28, 40, 1).name('Inset Size').onChange(function (newValue) {
            objOptions.insetSizes[0] = newValue;
            setInsetScale(0, newValue / 30);
        });
        ringOpt.open();

    } else if (type == "Wave Bracelet") {
        changeCurrentType(armPhoto);
        const waveBraceletOptions = gui.addFolder("Wave Bracelet Options");
        updateModelOptions("wave", false);

        waveBraceletOptions.add(objOptions, "color", ['white', 'black', 'orange']).onChange(function (newValue) {
            setColor(newValue);
        }).name("Color");
        
        waveBraceletOptions.add(customOptions, "waveHeight", 0.1, 2, 0.1).onChange(function (newValue) {
            setInsetScale(0, newValue, 'z');
        });
    } else if (type == "Shapes Bracelet") {
        changeCurrentType(armPhoto);
        const shapesBraceletOpt = gui.addFolder("Shapes Bracelet Options");

        shapesBraceletOpt.add(objOptions, "color", ['white', 'black', 'orange']).onChange(function (newValue) {
            setColor(newValue);
        }).name("Color");


        shapesBraceletOpt.add(objOptions, "inset1", ['heart', 'circle', 'triangle', 'square']).onChange(function (newValue) {
            objOptions.inset1 = newValue;
            updateAllInsets();

            updateModelOptions(objOptions.insets, true);
            //currInsetIndex = 0;
        }).name("Inset Shape 1");

        shapesBraceletOpt.add(objOptions, "scale1", 28, 34, 1).name('Inset Size 1').onChange(function (newValue) {
            objOptions.insetSizes[0] = newValue;
            setInsetScale(0, newValue / 30);
        });


        shapesBraceletOpt.add(objOptions, "inset2", ['heart', 'circle', 'triangle', 'square']).onChange(function (newValue) {
            objOptions.inset2 = newValue;
            updateAllInsets();

            updateModelOptions(objOptions.insets, true);
            //currInsetIndex = 1;
        }).name("Inset Shape 2");


        shapesBraceletOpt.add(objOptions, "scale2", 28, 34, 1).name('Inset Size 2').onChange(function (newValue) {
            objOptions.insetSizes[1] = newValue;
            setInsetScale(1, newValue / 30);
        });


        shapesBraceletOpt.add(objOptions, "inset3", ['heart', 'circle', 'triangle', 'square']).onChange(function (newValue) {
            objOptions.inset3 = newValue;
            updateAllInsets();

            updateModelOptions(objOptions.insets, true);
            //currInsetIndex = 2;
        }).name("Inset Shape 3");


        shapesBraceletOpt.add(objOptions, "scale3", 28, 34, 1).name('Inset Size 3').onChange(function (newValue) {
            objOptions.insetSizes[2] = newValue;
            setInsetScale(2, newValue / 30);
        });

        shapesBraceletOpt.open();
    } else if (type == "Necklace"){
        changeCurrentType(bodyPhoto);
        const necklaceOpts = gui.addFolder("Necklace");

        necklaceOpts.add(neckOpts, "shape", ['pyramids', 'spheres', 'wavy', 'boxy']).onChange(function (newValue){
            neckOpts.shape = newValue;
            updateModelOptions(newValue + "Neck", false, true);
        });

        necklaceOpts.add(objOptions, "color", ['white', 'black', 'orange']).onChange(function (newValue) {
            setColor(newValue);
        }).name("Color");

        necklaceOpts.add(neckOpts, "scaleX", 0.3, 2, 0.1).onChange(function (newValue){
            neckOpts.scaleX = newValue;
            setInsetScale(0, newValue, 'x');
        }).name("X Scale");

        necklaceOpts.add(neckOpts, "scaleY", 0.3, 2, 0.1).onChange(function (newValue){
            neckOpts.scaleY = newValue;
            setInsetScale(0, newValue, 'y');
        }).name("Y Scale");

        necklaceOpts.add(neckOpts, "scaleZ", 0.3, 2, 0.1).onChange(function (newValue){
            neckOpts.scaleZ = newValue;
            setInsetScale(0, newValue, 'z');
        }).name("Z Scale");

    } 
}
