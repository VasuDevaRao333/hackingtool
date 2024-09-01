const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set up multer for file uploads
const upload = multer({
    dest: 'uploads/', // Directory where uploaded files will be saved
});

// Create uploads directory if it does not exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve static files from the current directory
app.use(express.static(__dirname));

// Endpoint to handle image uploads
app.post('/upload-image', upload.single('image'), (req, res) => {
    console.log('Image uploaded:', req.file);
    res.send('Image uploaded successfully');
});

// Endpoint to handle audio uploads
app.post('/upload-audio', upload.single('audio'), (req, res) => {
    console.log('Audio uploaded:', req.file);
    res.send('Audio uploaded successfully');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
