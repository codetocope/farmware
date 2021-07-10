// console.log('ml5 version:', ml5.version);

// REFERENCES:
// https://github.com/ml5js/ml5-examples/blob/development/p5js/KNNClassification/KNNClassification_Video/sketch.js
// https://editor.p5js.org/ml5/sketches/KNNClassification_Video
        

function modelLoaded() {
    console.log('Model loaded!');
}

function keyPressed() {
    const logits = features.infer(video);

    if (key == 'h') {
        console.log("Training Healthy...");
        knnClassifier.addExample(logits, 'healthy');
    } else if (key == 'u') {
        console.log("Training Unhealthy...");
        knnClassifier.addExample(logits, 'unhealthy');
    } else if (key == 'e') {
        console.log("Training Empty...");
        knnClassifier.addExample(logits, 'empty');
    } else if (key == 'b') {
        console.log("Training Seed...");
        knnClassifier.addExample(logits, 'seed');
    } else if (key == 'p') {
        console.log('Prediction Start!!');
        classify();
        state = 'prediction';
    } else if (key == 's') {
        knnClassifier.save('plantHealthDataset');
        console.log('model saved');
    } else if (key == 'l') {
        knnClassifier.load('plantHealthDataset2.json', function () {
            console.log('model loaded');
        });
    }
}




function classify() {
    // Get the total number of labels from knnClassifier
    const numLabels = knnClassifier.getNumLabels();
    if (numLabels <= 0) {
        console.error('No examples found');
        return;
    }

    // Get the features of the input video
    const f = features.infer(video);

    knnClassifier.classify(f, gotResults);
}

function gotResults(err, result) {
    // Display any error
    if (err) {
        console.error(err);
    }
    let msg;

    console.log(getLabel(result));
    //console.log('Classify - Result : ' + JSON.stringify(result));

    /*
    if (result.classIndex == 0) {
        msg = 'healthy';
    } else if (result.classIndex == 1) {
        msg = 'unhealthy';
    }
    */

    msg = getLabel(result);

    select('#category').html('Your plant is: ' + msg);
    //console.log(result);
    //console.log(result.confidencesByLabel);

    classify();
}

// https://github.com/ml5js/ml5-library/issues/775
function getLabel(result) {
    const entries = Object.entries(result.confidencesByLabel);
    let greatestConfidence = entries[0];
    for (let i = 0; i < entries.length; i++) {
        if (entries[i][1] > greatestConfidence[1]) {
            greatestConfidence = entries[i];
        }
    }
    return greatestConfidence[0];
}