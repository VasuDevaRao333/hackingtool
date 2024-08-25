let mediaRecorder;
let audioChunks = [];
let recordButton = document.getElementById('recordButton');

recordButton.addEventListener('click', async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        // Stop recording if already recording
        mediaRecorder.stop();
        recordButton.textContent = 'Start Recording';
        return;
    }

    // Start recording
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                alert('Recording uploaded successfully.');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while uploading the recording.');
            });
    });

    mediaRecorder.start();
    recordButton.textContent = 'Stop Recording';

    // Automatically stop recording after 15 seconds
    setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            recordButton.textContent = 'Start Recording';
        }
    }, 15000); // 15 seconds
});
