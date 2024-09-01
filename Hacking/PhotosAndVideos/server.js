const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Set up multer for file handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Handle file upload
app.post('/upload', upload.single('audio'), (req, res) => {
    res.json({ message: 'File uploaded successfully.' });
});

// Create 'uploads' directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
