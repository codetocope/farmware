/* NOTE ON OBJ: Make sure no n-sided polygons! OBJ can recognize these as faces, but the THREE.js importer has trouble with these. */

const OBJLoader = new THREE.OBJLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

var ringSelectedInset = null;

const ambLight = new THREE.AmbientLight(0xffffff, .35);
const skyColor = 0xB1E1FF; // light blue
const groundColor = 0xB97A20; // brownish orange

var loadedInsets = [];
var currInsetIndex = 0;

const light = new THREE.PointLight(0xffffff, 0.9, 18);
light.position.set(0, 6, 0);
light.castShadow = true;

scene.add(ambLight);
scene.add(light);

loadOBJ('ringBase');

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50, 10, 10),
    new THREE.MeshPhongMaterial({
        color: 0xffffff
    })
);

plane.rotation.x = Math.PI * -.5;
plane.position.y = -1;

const defaultMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wireframe: false,
});

camera.position.z = 7;
camera.position.y = 3;

var group = new THREE.Object3D();
scene.add(group);

keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(backLight);

const gridHelper = new THREE.GridHelper(36, 1);
scene.add(gridHelper);

renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);
renderer.setClearColor(0x242d45, 1);
document.body.appendChild(renderer.domElement);

function loadOBJ(objName) {

    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {

        //console.log(item, loaded, total);

    };


    // model
    var mesh;
    var loader = new THREE.OBJLoader(manager);
    loader.load('/obj/individualComponents/' + objName + '.obj', function (object) {
        console.log(object);
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                child.material = defaultMaterial;
                child.material.side = THREE.DoubleSide;
                var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                mesh = new THREE.Mesh(geometry, defaultMaterial);
                mesh.receiveShadow = true;
                mesh.name = objName;
                mesh.castShadow = true;

                if (objOptions.type == 'Ring' && mesh.name != 'ringBase') {
                    mesh.rotation.x = Math.PI * -0.5;
                    mesh.rotation.z = Math.PI;

                    mesh.position.y = 1.1;
                    mesh.position.z = 1.69;

                    loadedInsets[0] = mesh;

                } else if (objOptions.type.indexOf('Bracelet') > -1 && mesh.name != 'braceletBase') {
                    loadedInsets[currInsetIndex] = mesh;

                    if (mesh.name == "waveInset") {
                        mesh.position.x = 0;
                        mesh.position.y = 1 - mesh.scale.z;
                    } else {
                        //console.log(currInsetIndex)
                        mesh.rotation.y = Math.PI;
                        mesh.position.x = currInsetIndex * 3.75 - 2.8335;
                        currInsetIndex++;
                    }
                } else if (objOptions.type == 'Necklace') {
                    loadedInsets[0] = mesh;
                }
                group.add(mesh);
            }

        });
    });
}

function saveFile(fileName) {

    const exportSTL = new THREE.STLExporter();

    var newGeo = new THREE.Geometry();

    for (var c in group.children) {
        group.children[c].updateMatrix();
        newGeo.merge(group.children[c].geometry, group.children[c].matrix);
    }

    var exportItem = new THREE.Mesh(newGeo, defaultMaterial);

    var stlString = exportSTL.parse(exportItem);
    //console.log(group);

    const blob = new Blob([stlString], {
        type: exportSTL.mimeType
    });

    if (fileName.trim() != '')
        saveAs(blob, fileName + '.stl');
    else
        saveAs(blob, 'default.stl');
}

function updateModel(baseName) {

    while (group.children.length) {
        group.remove(group.children[0]);
    }

    loadOBJ(baseName);
    //console.log(group);

    scene.add(group);

}

function updateModelOptions(opts, multiFlag = false, clearAll = false) {

    // TODO: find better solution for clearing old options than clearing and loading everytime

    if (clearAll) {
        while (group.children.length) {
            group.remove(group.children[0]);
            loadedInsets = [];
        }
    } else {
        while (group.children.length > 1) {
            group.remove(group.children[1]);
            loadedInsets = [];
        }
    }

    if (!multiFlag) { // check if options is an array i.e. there are multiple insets
        currInsetIndex = 0;
        loadOBJ(opts + 'Inset');
    } else {
        //console.log(opts.length);
        currInsetIndex = 0;
        for (var i = 0; i < opts.length; i++) {
            //currInsetIndex = i;
            //console.log(currInsetIndex)
            loadOBJ(opts[i] + 'Inset');
        }
    }
}

function setInsetScale(meshIndex, newValue, axis = 0) {
    if (axis == 0)
        loadedInsets[meshIndex].scale.x = loadedInsets[meshIndex].scale.y = loadedInsets[meshIndex].scale.z = newValue;
    else
        loadedInsets[meshIndex].scale[axis] = newValue;
}

function windowResized() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    setCanvasDimensions(renderer.domElement, width, height);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();