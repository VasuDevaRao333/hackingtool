const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Setup multer for file uploading
const upload = multer({ dest: 'uploads/' });

// Serve static files (including HTML, CSS, and JS)
app.use(express.static('public'));

// Handle video file upload
app.post('/upload', upload.single('video'), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'uploads', req.file.originalname);

    // Move file from temporary location to the target path
    fs.rename(tempPath, targetPath, (err) => {
        if (err) {
            console.error('Error moving file:', err);
            return res.sendStatus(500);
        }

        console.log(`Saved video: ${req.file.originalname}`);
        res.send('File uploaded and saved successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
