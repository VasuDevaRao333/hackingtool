document.addEventListener('DOMContentLoaded', () => {
    fetch('/tracking-data')
        .then(response => response.text())
        .then(data => {
            document.getElementById('data').textContent = data;
        })
        .catch(error => {
            console.error('Error fetching tracking data:', error);
        });
});
