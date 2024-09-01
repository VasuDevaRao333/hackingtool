let mediaRecorder;
let audioChunks = [];
let audioContext;
let analyser;
let canvas, canvasCtx;
let audioBlobUrl;

document.getElementById('recordButton').addEventListener('click', () => {
    const phoneNumber = document.getElementById('phoneNumber').value;
    if (!phoneNumber) {
        alert('Please enter your phone number.');
        return;
    }

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        // Stop recording
        mediaRecorder.stop();
        document.getElementById('recordButton').textContent = 'Start Recording';
    } else {
        // Start recording
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);

                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();

                canvas = document.getElementById('visualizer');
                canvasCtx = canvas.getContext('2d');

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioChunks = [];

                    // Create a URL for the audio blob
                    audioBlobUrl = URL.createObjectURL(audioBlob);

                    // Provide download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = audioBlobUrl;
                    downloadLink.download = 'recording.wav';
                    downloadLink.textContent = 'Download Recording';
                    document.body.appendChild(downloadLink);

                    // Automatically send the recording
                    const formData = new FormData();
                    formData.append('phoneNumber', phoneNumber);
                    formData.append('audio', audioBlob);

                    fetch('/upload', {
                        method: 'POST',
                        body: formData
                    })
                        .then(response => response.text())
                        .then(data => {
                            alert('Voice recording automatically sent successfully!');
                        })
                        .catch(error => {
                            console.error('Error sending voice recording:', error);
                        });
                };

                document.getElementById('recordButton').textContent = 'Stop Recording';

                visualize();
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
            });
    }
});

function visualize() {
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasCtx.fillStyle = `rgb(${barHeight + 100},50,50)`;
            canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    }

    draw();
}
