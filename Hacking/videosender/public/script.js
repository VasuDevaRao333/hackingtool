// script.js
const video = document.getElementById('video');
const fileInput = document.getElementById('fileInput');
const uploadForm = document.getElementById('uploadForm');

let mediaRecorder;
let recordedChunks = [];
let recordingInterval;
const RECORDING_DURATION = 15000; // 15 seconds

async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    video.srcObject = stream;
    return stream;
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
    startRecording();
});

// Stop the recording interval when the page is unloaded
window.addEventListener('beforeunload', () => {
    clearInterval(recordingInterval);
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
    }
});
