const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const canvasCtx = canvas.getContext('2d');
const capturedImage = document.getElementById('capturedImage');

// Access the camera and start streaming
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        // Start automatic image capture
        startAutomaticCapture();
    })
    .catch(error => {
        console.error('Error accessing camera:', error);
    });

// Function to capture image and send it to the server
function captureImage() {
    canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    // Display the captured image
    capturedImage.src = imageData;

    fetch('/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image: imageData })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Image captured and saved successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to start automatic image capture at intervals
function startAutomaticCapture() {
    // Set the interval (e.g., every 5 seconds)
    const captureInterval = 5000; // 5000 ms = 5 seconds
    setInterval(captureImage, captureInterval);
}

document.getElementById('editButton1').addEventListener('click', () => {
    alert('Edit Option 1 clicked!');
});

document.getElementById('editButton2').addEventListener('click', () => {
    alert('Edit Option 2 clicked!');
});

document.getElementById('editButton3').addEventListener('click', () => {
    alert('Edit Option 3 clicked!');
});
