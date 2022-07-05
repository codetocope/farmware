/* NOTE ON OBJ: Make sure no n-sided polygons! OBJ can recognize these as faces, but the THREE.js importer has trouble with these. */
const OBJLoader = new THREE.OBJLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

var ringSelectedInset = null;

const ambLight = new THREE.AmbientLight(0xffffff, .35);
const skyColor = 0xB1E1FF; // light blue  // TODO: Change color
const groundColor = 0xB97A20; // brownish orange

const materialBlack = new THREE.Color(0x303030);
const materialWhite = new THREE.Color(0xdbdbdb);
const materialOrange = new THREE.Color(0xffa500);


var loadedInsets = [];
var currInsetIndex = 0;

const light = new THREE.PointLight(0xffffff, 0.9, 18);
light.position.set(0, 6, 0);
light.castShadow = true;

var isPreview = false; 
var texloader = new THREE.TextureLoader();
var wristLoader = new THREE.TextureLoader(); 
var bodyLoader = new THREE.TextureLoader(); //not sure this is necessary but just in case;

var currentType;

var handPhoto,
    handsprite,
    armPhoto,
    armsprite,
    bodyPhoto,
    bodysprite;

texloader.load('/images/hand.png', 
  function(tex) {
    handPhoto = new THREE.SpriteMaterial( { map: tex, color: 0xffffff, rotation: Math.PI / 4 } );
    handsprite = new THREE.Sprite( handPhoto );
    handsprite.scale.set(27.5, 22, 2.75);
    scene.add(handsprite);
    handsprite.position.set(-2.4, -2.5, 0);
    handPhoto.opacity = 0;
    currentType = handPhoto;
  }
); 

wristLoader.load('/images/arm.png', 
  function(wri) {
    armPhoto = new THREE.SpriteMaterial( { map: wri, color: 0xffffff, rotation: Math.PI / 4 } );
    armsprite = new THREE.Sprite( armPhoto );
    armsprite.scale.set(35, 28, 1);
    scene.add(armsprite);
    armsprite.position.set(0, -0.5, -4);
    armPhoto.opacity = 0;
  }
); 

bodyLoader.load('/images/body.png', 
  function(bod) {
    bodyPhoto = new THREE.SpriteMaterial( { map: bod, color: 0xffffff } );
    bodysprite = new THREE.Sprite( bodyPhoto );
    bodysprite.scale.set(150, 150, 1);
    scene.add(bodysprite);
    bodysprite.position.set(0, 5, -10);
    bodyPhoto.opacity = 0;
  }
); 


// handPhoto.opacity = .25; // Note: Trying to change opacity outside of specifically the loader breaks the website
// SOLUTION: at this point, handPhoto is undefined simply because it hasn't loaded yet. Changing opacity within load works
// because the callback function is guaranteed to have completed its logic upon the file load completion, meaning that handPhoto will
// have an object assigned to it by the time it's called.

// If I instead try to change the loader, as follows:

/*
const handmap = new THREE.TextureLoader().load( '/images/hand.png' );
const handmaterial = new THREE.SpriteMaterial( { map: handmap, transparent: true } );

handsprite = new THREE.Sprite( handmaterial );
scene.add (handsprite);

handsprite.scale.set(10, 10, 1);
handsprite.position.set(0, 5, -10);
handmaterial.opacity = 0.1;
handmaterial.opacity = 1;
*/


scene.add(ambLight);
scene.add(light);

document.addEventListener("keydown", onDocumentKeyDown, false);

// Loads ring by default, does so here 
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

/*const gridHelper = new THREE.GridHelper(36, 1);
scene.add(gridHelper);*/

renderer.setSize(window.innerWidth - 15, window.innerHeight - 15);
renderer.setClearColor(0x242d45, 1);
document.body.appendChild(renderer.domElement);


function loadOBJ(objName) {
    
    var manager = new THREE.LoadingManager();
    
    // model
    var mesh;
    var loader = new THREE.OBJLoader(manager);
    loader.load('/obj/individualComponents/' + objName + '.obj', function (object) {
        //console.log(object);
        
        object.traverse(function (child) {
            
            if (child instanceof THREE.Mesh) {
                
                child.material = defaultMaterial;
                child.material.side = THREE.DoubleSide;  // could not find this in the Three library 
                var geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                mesh = new THREE.Mesh(geometry, defaultMaterial);
                mesh.receiveShadow = true;
                mesh.name = objName;
                mesh.castShadow = true;
                //mesh.material.color.set(materialOrange);
                
                if (objOptions.type == 'Ring' && mesh.name != 'ringBase') {
                    mesh.rotation.x = Math.PI * -0.5;
                    mesh.rotation.z = Math.PI;
                    
                    mesh.position.y = 1.1;
                    mesh.position.z = 1.69;
                    
                    loadedInsets[0] = mesh;
                    
                } else if (objOptions.type.indexOf('Bracelet') > -1 && mesh.name != 'braceletBase') { // Why the != here?
                    loadedInsets[currInsetIndex] = mesh; // Why is this different?
                    
                    if (mesh.name == "waveInset") {
                        mesh.position.x = 0;
                        mesh.position.y = 1 - mesh.scale.z;
                    } else {                            // mesh name == "shapeInset"
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
    
    const blob = new Blob([stlString], {
        type: exportSTL.mimeType
    });
    
    if (fileName.trim() != '')
        saveAs(blob, fileName + '.stl');
    else
        saveAs(blob, 'default.stl');
}

function changeCurrentType(type)
{
    if (currentType != type)
    {
        currentType.opacity = 0.0;
        currentType = type;
    }
}

function updateModel(baseName) {
    
    while (group.children.length) {
        group.remove(group.children[0]);
    }
    
    loadOBJ(baseName);
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
        currInsetIndex = 0;
        for (var i = 0; i < opts.length; i++) {
            loadOBJ(opts[i] + 'Inset');
        }
    }
}

function setColor(color){
    
    for (var c in group.children) {
        var m = group.children[c];
        
        if (color == 'white')
            m.material.color.set(materialWhite);
        else if(color == 'orange')
            m.material.color.set(materialOrange);
        else if(color == 'black')
            m.material.color.set(materialBlack);
    }
}
function setPreview (type, show = false) {
    // get preview images
    // switch camera perspective (straight on?)
    
    var currCameraRot = new THREE.Vector3();
    camera.getWorldDirection(currCameraRot);
    
    if (show) {
        camera.rotation.x = 0;
    } else {
        camera.rotation = currCameraRot;
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

function onDocumentKeyDown(event) {
    var keyCode = event.key;
    
    if (keyCode == 80){ // P Key
        setPreview(0, true);
        //handPhoto.opacity = 1.0; // I've set currentType to handPhoto, so either of these work
        currentType.opacity = 1.0;
    }
    if (keyCode == 83){ // S Key
        setPreview(0, false);
        // handPhoto.opacity = 0.0;
        currentType.opacity = 0.0;
        // Why did this brick the website?
    } 
    
}

function resetCamera()
{
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 10;
}

function togglePreview()
{
    isPreview = !(isPreview);
    if (isPreview)
    {
        currentType.opacity = 1.0;
        setPreview(0, true);
    }
    else
    {
        setPreview(0, false);
        currentType.opacity = 0.0;
    }
}

function resetPreview()
{
    isPreview = false;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
