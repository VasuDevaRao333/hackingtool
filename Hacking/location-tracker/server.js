const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Handle location data
app.post('/location', (req, res) => {
    const { latitude, longitude } = req.body;
    const data = `Latitude: ${latitude}, Longitude: ${longitude}, Timestamp: ${new Date().toISOString()}\n`;

    // Save data to a file
    fs.appendFile(path.join(__dirname, 'data', 'locations.txt'), data, err => {
        if (err) {
            console.error('Error saving location data:', err);
            return res.status(500).send('Error saving location data');
        }
        res.send('Location data saved');
    });
});

// Serve tracking data
app.get('/tracking-data', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'locations.txt'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading location data:', err);
            return res.status(500).send('Error reading location data');
        }
        res.send(data);
    });
});

app.use('/display', express.static(path.join(__dirname, 'public-display')));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});





