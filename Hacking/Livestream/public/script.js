document.getElementById('startCamera').addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('videoElement');
        video.srcObject = stream;
        video.play();

        // Create a canvas to capture frames
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set up a loop to capture and send frames
        setInterval(async () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL('image/jpeg');

            // Send frame data to the server
            try {
                await fetch('/stream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: dataURL }),
                });
            } catch (error) {
                console.error('Error sending frame to the server:', error);
            }
        }, 100); // Send frames every 100ms (10 FPS)

    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
});

// Add this part to continuously fetch and display the live stream
setInterval(async () => {
    try {
        const response = await fetch('/video');
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        document.getElementById('liveStream').src = url;
    } catch (error) {
        console.error('Error fetching live stream:', error);
    }
}, 100); // Update live stream every 100ms (10 FPS)
