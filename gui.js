/*
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth - 20 , window.innerHeight - 20);
renderer.setClearColor(0x242d45, 1);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
//controls.addEventListener('change', render) 

const gridHelper = new THREE.GridHelper(36, 1);
scene.add(gridHelper);

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 2;

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth - 20, window.innerHeight - 20)
    render()
}

const gui = new dat.GUI();
const cubeFolder = gui.addFolder("Cube");
cubeFolder.add(cube.rotation, "x", 0, Math.PI * 2, 0.01);
cubeFolder.add(cube.rotation, "y", 0, Math.PI * 2, 0.01);
cubeFolder.add(cube.rotation, "z", 0, Math.PI * 2, 0.01);
cubeFolder.open();
const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "z", 0, 10, 0.01);
cameraFolder.open();

var animate = function () {
    requestAnimationFrame(animate);

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    render();

};

function render() {
    renderer.render(scene, camera);
}
//render()
animate();
*/

/*
// Listen to changes within the GUI
gui.add(obj, "name").onChange(function(newValue) {
	console.log("Value changed to:  ", newValue);
});

// Listen to changes outside the GUI - GUI will update when changed from outside
gui.add(obj, "name").listen();
*/

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
    insetSizes: [30, 30, 30]
};


function updateAllInsets() {
    objOptions.insets = [objOptions.inset1, objOptions.inset2, objOptions.inset3];
}

var exportBtn = {
    export: function () {
        saveFile(objOptions.fileName);
    }
};

const gui = new dat.GUI({width: 300, height: 800 });

gui.domElement.id = 'gui';

const baseOpt = gui.addFolder("Base Options");
baseOpt.add(objOptions, "fileName").name('File Name');

baseOpt.add(objOptions, "type", ['Bracelet', 'Ring']).onChange(function (newValue) {
    updateModel(newValue.toLowerCase() + 'Base');
    setUI(newValue);
}).name('Base Type');

baseOpt.add(exportBtn, 'export').name('Export to STL');
baseOpt.open();

function setUI(type) {

    for (var i = 0; i < Object.keys(gui.__folders).length; i++) {

        // Clear previous UI subfolders

        if (Object.keys(gui.__folders)[i] != "Base Options")
            gui.removeFolder(Object.values(gui.__folders)[i]);
    }

    if (type == "Ring") {
        const ringOpt = gui.addFolder("Ring Options");

        ringOpt.add(objOptions, "inset1", ['heart', 'circle', 'triangle', 'square']).onChange(function (newValue) {
            updateModelOptions(newValue);
        }).name("Inset Shape");

        ringOpt.add(objOptions, "scale1", 28, 34, 1).name('Inset Size').onChange(function (newValue) {
            objOptions.insetSizes[0] = newValue;

            setInsetScale(0, newValue / 30);
        });
        ringOpt.open();

    } else if (type == "Bracelet") {
        const braceletOpt = gui.addFolder("Bracelet Options");

        braceletOpt.add(objOptions, "inset1", ['heart', 'circle', 'triangle', 'square']).onChange(function (newValue) {
            objOptions.inset1 = newValue;
            updateAllInsets();

            updateModelOptions(objOptions.insets, true);
            //currInsetIndex = 0;
        }).name("Inset Shape 1");

        braceletOpt.add(objOptions, "scale1", 28, 34, 1).name('Inset Size 1').onChange(function (newValue) {
            objOptions.insetSizes[0] = newValue;

            setInsetScale(0, newValue / 30);
            
        });


        braceletOpt.add(objOptions, "inset2", ['heart', 'circle', 'triangle', 'square']).onChange(function (newValue) {
            objOptions.inset2 = newValue;
            updateAllInsets();

            updateModelOptions(objOptions.insets, true);
            //currInsetIndex = 1;
        }).name("Inset Shape 2");

        braceletOpt.add(objOptions, "scale1", 28, 34, 1).name('Inset Size 2').onChange(function (newValue) {
            objOptions.insetSizes[1] = newValue;

            setInsetScale(1, newValue / 30);
            
        });


        braceletOpt.add(objOptions, "inset3", ['heart', 'circle', 'triangle', 'square']).onChange(function (newValue) {
            objOptions.inset3 = newValue;
            updateAllInsets();

            updateModelOptions(objOptions.insets, true);
            //currInsetIndex = 2;
        }).name("Inset Shape 3");

        braceletOpt.add(objOptions, "scale2", 28, 34, 1).name('Inset Size 3').onChange(function (newValue) {
            objOptions.insetSizes[2] = newValue;

            setInsetScale(2, newValue / 30);
            
        });


        braceletOpt.open();
    }

}