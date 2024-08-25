function saveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const locationData = {
                latitude: latitude,
                longitude: longitude,
                timestamp: new Date().toISOString(),
                googleMapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
            };

            fetch('/save-location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(locationData)
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to save location');
                });
        }, (error) => {
            alert('Error getting location: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
