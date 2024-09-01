const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json({ limit: '50mb' })); // Limit payload size
app.use(express.static('public')); // Serve static files

app.post('/upload', (req, res) => {
    const imageData = req.body.image;
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const filePath = path.join(__dirname, 'uploads', `image_${Date.now()}.png`);

    fs.writeFile(filePath, base64Data, 'base64', err => {
        if (err) {
            console.error('Error saving image:', err);
            res.status(500).send('Error saving image');
        } else {
            res.json({ message: 'Image saved successfully!' });
        }
    });
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
