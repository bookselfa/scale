let video = document.getElementById('camera');
let canvas = document.getElementById('canvas');
let startButton = document.getElementById('startButton');
let resultDiv = document.getElementById('result');
let referenceSizeInput = document.getElementById('referenceSize');
let model;

// Load the COCO-SSD model
async function loadModel() {
    model = await cocoSsd.load();
    console.log('Model loaded');
}

// Access the camera
async function startCamera() {
    try {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing camera:', err);
    }
}

// Detect objects and measure length
async function detectObjects() {
    if (!model) {
        console.error('Model not loaded');
        return;
    }

    const referenceSize = parseFloat(referenceSizeInput.value);
    if (isNaN(referenceSize) || referenceSize <= 0) {
        resultDiv.innerText = 'Please enter a valid reference size.';
        return;
    }

    // Draw video frame on canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Detect objects
    const predictions = await model.detect(canvas);
    if (predictions.length > 0) {
        const referenceObject = predictions.find(p => p.class === 'ruler' || p.class === 'book'); // Adjust based on your reference object
        if (referenceObject) {
            const referenceWidth = referenceObject.bbox[2]; // Width in pixels
            const pixelToCmRatio = referenceIt seems the response got cut off. Let me complete the JavaScript code for you:

            const pixelToCmRatio = referenceSize / referenceWidth; // Calculate the ratio of pixels to cm

            // Measure the length of another object in the frame
            const targetObject = predictions.find(p => p.class !== 'ruler' && p.class !== 'book'); // Find a different object
            if (targetObject) {
                const targetWidth = targetObject.bbox[2]; // Width in pixels
                const targetLengthCm = targetWidth * pixelToCmRatio; // Convert to cm
                resultDiv.innerText = `Measured length: ${targetLengthCm.toFixed(2)} cm`;
            } else {
                resultDiv.innerText = 'No target object detected.';
            }
        } else {
            resultDiv.innerText = 'No reference object detected.';
        }
    } else {
        resultDiv.innerText = 'No objects detected.';
    }
}

// Event listener for the start button
startButton.addEventListener('click', () => {
    detectObjects();
});

// Initialize the app
(async function init() {
    await loadModel();
    await startCamera();
})();