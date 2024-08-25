// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DATABASE_FILE = 'locations.json';

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' folder

// Route to save location data
app.post('/save-location', (req, res) => {
    const locationData = req.body;

    // Read current data
    fs.readFile(DATABASE_FILE, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read database' });
        }

        let locations = [];
        if (data.length > 0) {
            locations = JSON.parse(data);
        }

        // Add new location
        locations.push(locationData);

        // Write updated data back to file
        fs.writeFile(DATABASE_FILE, JSON.stringify(locations, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save data' });
            }

            res.status(200).json({ message: 'Location saved successfully' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});