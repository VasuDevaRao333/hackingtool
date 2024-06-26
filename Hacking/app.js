const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myFile'); // Name of the input field

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Public folder
app.use(express.static('./public'));

app.get('/', (req, res) => res.send('index.html'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send(`Error: ${err}`);
    } else {
      if (req.file == undefined) {
        res.send('Error: No File Selected!');
      } else {
        res.send(`File Uploaded: ${req.file.filename}`);
      }
    }
  });
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
