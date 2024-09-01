const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { PassThrough } = require('stream');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json({ limit: '10mb' }));

// Create a stream to hold the latest frame
const frameStream = new PassThrough({ encoding: 'binary' });

// Endpoint to handle incoming video frames
app.post('/stream', (req, res) => {
    const { image } = req.body;
    if (image) {
        // Decode the base64 image and write to the frame stream
        const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');
        frameStream.end(Buffer.from(base64Data, 'base64'));
    }
    res.sendStatus(200);
});

// Endpoint to serve the latest video frame
app.get('/video', (req, res) => {
    res.setHeader('Content-Type', 'image/jpeg');
    frameStream.pipe(res);
});

// Serve the live stream page
app.get('/live', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/live.html'));
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
