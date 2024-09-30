// backend/server.js
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sharp = require('sharp'); 

const app = express();
const PORT = 5000;
// CORS configuration
app.use(cors({
  origin: 'https://upload-and-preview-file-lbmp.vercel.app', 
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.get("/" , (req, res)=>{
  res.json('hello')
})

const storage = multer.memoryStorage();
const upload = multer({ storage });

// File upload and manipulation route
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Use Sharp to manipulate the image
    const resizedImage = await sharp(req.file.buffer)
      .resize(300, 300) // Resize to 300x300 pixels
      .toFormat('jpeg') // Convert to JPEG format
      .toBuffer();

    // Send back a response with the manipulated image
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': resizedImage.length
    });
    res.end(resizedImage); // Send the manipulated image as a response
  } catch (error) {
    console.error('Error processing the image:', error);
    res.status(500).send('Error processing the image.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
