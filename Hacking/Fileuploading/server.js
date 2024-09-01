const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check MIME type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// EJS setup
app.set('view engine', 'ejs');

// Public folder setup
app.use(express.static('./public'));

// Upload route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', { msg: err });
        } else {
            if (req.file === undefined) {
                res.render('index', { msg: 'No file selected!' });
            } else {
                res.render('index', {
                    msg: 'File uploaded successfully!',
                    file: `/uploads/${req.file.filename}`
                });
            }
        }
    });
});

// Main route to render the form
app.get('/', (req, res) => res.render('index'));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
