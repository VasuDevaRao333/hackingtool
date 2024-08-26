let intervalId;

document.getElementById('start-tracking').addEventListener('click', () => {
    if (navigator.geolocation) {
        document.getElementById('status').textContent = 'Tracking...';
        const startTime = Date.now();
        intervalId = setInterval(() => {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                fetch('/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ latitude, longitude })
                });
            }, error => {
                console.error('Error getting location:', error);
            });

            // Stop tracking after 1 hour
            if (Date.now() - startTime >= 3600000) { // 1 hour in milliseconds
                clearInterval(intervalId);
                document.getElementById('status').textContent = 'Tracking stopped.';
            }
        }, 10000); // Send location every 10 seconds
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

document.getElementById('stop-tracking').addEventListener('click', () => {
    if (intervalId) {
        clearInterval(intervalId);
        document.getElementById('status').textContent = 'Tracking stopped.';
    }
});
