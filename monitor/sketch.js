const knnClassifier = ml5.KNNClassifier(modelLoaded, 2, 1);
features = ml5.featureExtractor('MobileNet', modelLoaded);
state = 'prediction'; // set to 'training' to enable training the data
data = null;

function preload() {
    data = loadJSON('plantHealthDataset2.json');
}

function setup() {

    frameRate(12);
    //cnv = createCanvas(720, 454);
    let videoWidth = windowWidth/4;
    cnv = createCanvas((windowWidth/3) * (4/3), windowWidth/3);
    video = createCapture(VIDEO);
    background(0);
    //video.size(360, 227);
    video.size(videoWidth * (4/3), videoWidth);
    //video.hide();

    cnv.parent('cnvContainer');

    screenshotBtn = select('#screenshotBtn');

    screenshotBtn.elt.addEventListener('click', (event) => {
        html2canvas(document.body).then(canvas => {
            saveAs(canvas.toDataURL(), 'screenshot.jpg');
        });
    });

    //video.elt.style.height = '0px';
    //video.elt.style.width = '0px';
    video.elt.style.opacity = 0;
    video.elt.style.position = 'absolute';
    video.elt.style.zIndex = -1000;

    video.elt.addEventListener('loadeddata', (event) => {
        if (data != null) {
            knnClassifier.load('plantHealthDataset2.json', function () {
                console.log('dataset loaded');
    
                classify();
                state = 'prediction';
            });
        } else {
            console.log('failed to load JSON data');
        }
    }); 
}

function draw() {
    background(0);
    image(video, 0, 0, width, height);
}

function saveAs(uri, filename) {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {

        link.href = uri;
        link.download = filename;

        link.click();
        
        document.body.removeChild(link);

    } else {

        window.open(uri);

    }
}