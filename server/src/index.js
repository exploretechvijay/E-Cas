const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(compression());
app.use(express.json());

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// The upstream webhook wraps the analysis in { output: "<stringified JSON array>" }.
// Unwrap it so the client always receives the analysis object itself.
function normalizeAnalysis(payload) {
  let data = payload;

  if (data && typeof data === 'object' && !Array.isArray(data) && 'output' in data) {
    data = data.output;
  }

  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (Array.isArray(data)) {
    data = data[0];
  }

  return data;
}

// API endpoint to analyze CAS statement
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const password = req.body.password;
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Create form data for external API
    const formData = new FormData();
    formData.append('data', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });
    formData.append('password', password);

    // Call external API
    const response = await axios.post(
      'https://hexahydric-enamouredly-ricky.ngrok-free.dev/webhook-test/Casparser',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 120000, // 2 minute timeout
      }
    );

    let analysis;
    try {
      analysis = normalizeAnalysis(response.data);
    } catch (parseError) {
      console.error('Could not parse analysis payload:', parseError.message);
      return res.status(502).json({
        error: 'Received an unreadable response from the analysis service.'
      });
    }

    if (!analysis || typeof analysis !== 'object') {
      return res.status(502).json({
        error: 'Analysis service returned an empty response.'
      });
    }

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing CAS:', error.message);

    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data?.message || 'Failed to analyze statement'
      });
    } else if (error.code === 'ECONNABORTED') {
      res.status(504).json({ error: 'Request timeout. Please try again.' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: err.message || 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
