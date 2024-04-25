const express = require('express');
const upload = require('../multer');

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({ imageUrl: req.file.path });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
