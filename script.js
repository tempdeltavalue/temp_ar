

var isSceneConfigured = false;

var watch_obj;
const loader = new THREE.OBJLoader();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 20 );


var renderer = new THREE.WebGLRenderer( {antialias: true, alpha: true} ); //
//renderer.setClearAlpha(0.0);

function configureScene(height, width) {
    var container = document.getElementById( 'canvas' );
    
    renderer.setSize( width, height ); //container.clientHeight - 5

    container.appendChild( renderer.domElement );

    //var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //var cube = new THREE.Mesh( geometry, material );
    //scene.add( cube );

    // load a resource
    loader.load(
        // resource URL
        '/watch-003.obj',
        // called when resource is loaded
        function ( object ) {

            for (var i = 0; i < object.children.length; i++) {
                object.children[i].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
            }
            console.log(object.children.length);
    //        object.children[0].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //        object.children[1].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //        object.children[2].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //        object.children[3].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //        object.children[4].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    //        object.children[5].material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

            object.scale.set(5,5,5)
            watch_obj = object;
            scene.add( object );

        },
        // called when loading is in progresses
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    );

    camera.position.z = 1;
    renderer.render(scene, camera);

    //var animate = function () {
    //	requestAnimationFrame( animate );
    //
    //	watch_obj.rotation.x += 0.1;
    //	watch_obj.rotation.y += 0.1;
    //
    //	renderer.render(scene, camera);
    //};
    //
    //animate();
}



import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

const demosSection = document.getElementById("demos");
let handLandmarker = undefined;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;
// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: runningMode,
        numHands: 2
    });
    demosSection.classList.remove("invisible");
};
createHandLandmarker();
/********************************************************************
// Demo 1: Grab a bunch of images from the page and detection them
// upon click.
********************************************************************/
// In this demo, we have put all our clickable images in divs with the
// CSS class 'detectionOnClick'. Lets get all the elements that have
// this class.
const imageContainers = document.getElementsByClassName("detectOnClick");
// Now let's go through all of these and add a click event listener.
for (let i = 0; i < imageContainers.length; i++) {
    // Add event listener to the child element whichis the img element.
    imageContainers[i].children[0].addEventListener("click", handleClick);
}

/********************************************************************
// Demo 2: Continuously grab image from webcam stream and detect it.
********************************************************************/
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
// Check if webcam access is supported.
const hasGetUserMedia = () => { var _a; return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); };
// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
}
else {
    console.warn("getUserMedia() is not supported by your browser");
}
// Enable the live webcam view and start detection.
function enableCam(event) {
    if (!handLandmarker) {
        console.log("Wait! objectDetector not loaded yet.");
        return;
    }
    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    }
    else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }
    // getUsermedia parameters.
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        
        const videoTrack = stream.getVideoTracks()[0];
        const settings = videoTrack.getSettings();

        console.log('Video Width:', settings.width);
        console.log('Video Height:', settings.height);
        
        configureScene(settings.height, settings.width);

        
        video.addEventListener("loadeddata", predictWebcam);
    });
}
let lastVideoTime = -1;
let results = undefined;
console.log(video);

    
async function onOpenCvReady() { 
    console.log("VOVAVA");

    window.cv = await window.cv 
}


async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    
//    if (!isSceneConfigured) {
//        isSceneConfigured = true;
//    }
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await handLandmarker.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTimeMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    if (results.landmarks) {
        
        
        if (results.landmarks.length) {

            
            var wrist = results.landmarks[0][0];
            var finger_mcp_kp = results.landmarks[0][5];
            var pinky_mcp_kp = results.landmarks[0][17];
            let bones_dist = Math.abs(finger_mcp_kp.x - pinky_mcp_kp.x); //It will simulate z coordinate
            

            
            
            if (watch_obj != null) {
//                watch_obj.rotation.x += 0.1;
//                watch_obj.rotation.y += 0.1;
//                const sign = bones_dist < 0 ? -1 : 1;

                let z =  Math.pow(Math.abs(bones_dist) - 1, 1);
                console.log("bones_dist", bones_dist);

                let hand_min = 0.02;
                let hand_max = 0.22;
                
                let watch_min = -5;
                let watch_max = 0.1;
                
                let value = Math.min(Math.max(bones_dist, hand_min), hand_max);

                // Calculate the normalized position of the value in the input range
                const normalized = (value - hand_min) / (hand_max - hand_min);

                // Interpolate the value in the output range
                const result = watch_min + normalized * (watch_max - watch_min);
                console.log("res", result);
                console.log("res123", wrist.x);

                const viewpointZ = -5; // Use the minimum z-coordinate as the viewpoint for this example
                const parallaxFactor = result; 
                
                console.log("WRIST", wrist.x, wrist.y);
                watch_obj.position.set(wrist.x, 
                                       -wrist.y,
                                       result);

    //            watch_obj.x += minY_item.x * 600;
    //            watch_obj.y += minY_item.y * 600;
    //            
                renderer.render(scene, camera);
            }
            

            
            canvasCtx.fillStyle = "red";
            const x2D = wrist.x * canvasElement.width;
            const y2D = wrist.y * canvasElement.height;
            canvasCtx.fillRect(x2D, y2D, 100, 100);

        }
        
        for (const landmarks of results.landmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
        }
    }
    

//    let mat = cv.imread(canvasElement);
//    cv.cvtColor(mat, mat, cv.COLOR_RGB2GRAY, 0);
//    cv.Canny(mat, mat, 50, 100, 3, false);
//    
    canvasCtx.restore();
    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }
}