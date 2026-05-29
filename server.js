/**
 * VIRTUAL SELF: VOICE BOT - ZERO-DEPENDENCY NATIVE LOCAL SERVER
 * 
 * Serves the static Voice Bot page on http://localhost:3000.
 * Running via HTTP is critical because modern browsers restrict microphone access 
 * and local storage permissions under raw file:// protocols.
 * 
 * How to Run:
 *   node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Load local .env variables securely on startup (zero-dependency)
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const firstEquals = trimmed.indexOf('=');
        if (firstEquals !== -1) {
          const key = trimmed.substring(0, firstEquals).trim();
          const val = trimmed.substring(firstEquals + 1).trim().replace(/^['"]|['"]$/g, '');
          if (key) {
            process.env[key] = val;
          }
        }
      }
    });
    console.log('📝  Successfully loaded local environment configurations from .env');
  }
} catch (envError) {
  console.warn('⚠️  Could not load local .env configurations:', envError.message);
}

const PORT = 3000;
const PUBLIC_DIR = __dirname; // Serves files from this folder

// MIME types lookup
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);

  // Handle serverless API route locally if requested
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const { prompt } = JSON.parse(body);
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Gemini API Key (GEMINI_API_KEY) is not configured in local environment.' }));
          return;
        }

        const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const apiResponse = await fetch(apiURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              maxOutputTokens: 150,
              temperature: 0.7
            }
          })
        });

        const data = await apiResponse.json();
        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
          const answer = data.candidates[0].content.parts[0].text.trim();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ answer }));
          return;
        }
        throw new Error(data.error?.message || "Invalid response from Gemini API");
      } catch (err) {
        console.error("Gemini local error:", err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Strip query parameters if any (e.g. /style.css?v=1.0.9 -> /style.css)
  const urlPath = req.url.split('?')[0];

  // Normalize URL path to resolve file matching
  let filePath = urlPath === '/' || urlPath === '/index.html' 
    ? path.join(PUBLIC_DIR, 'index.html') 
    : path.join(PUBLIC_DIR, urlPath);

  // Prevent directory traversal attacks
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Access Denied');
    return;
  }

  // Check file extension
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Read and serve files asynchronously
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        console.warn(`[404] File not found: ${filePath}`);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end('<h1>404 Not Found</h1><p>The requested asset does not exist.</p>');
      } else {
        // Internal server error
        console.error(`[500] Server error reading file: ${err.message}`);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Internal Server Error: ${err.code}`);
      }
    } else {
      // Success serve
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(content);
    }
  });
});

// Bind to localhost port
server.listen(PORT, '127.0.0.1', () => {
  const localUrl = `http://localhost:${PORT}`;
  console.log('\n======================================================');
  console.log('🚀  VIRTUAL SELF VOICE BOT SERVER STARTED RUNNING!');
  console.log(`🌐  Local URL: \x1b[36m${localUrl}\x1b[0m`);
  console.log('======================================================\n');
  console.log('🎙️   Microphone permissions are enabled under this host.');
  console.log('⌨️   Press Ctrl+C to terminate the local server.\n');

  // Automatically trigger Chrome or Safari browser launch on MacOS
  try {
    console.log('🔗  Automatically launching the Voice Bot in your browser...');
    exec(`open ${localUrl}`);
  } catch (error) {
    console.warn(`Failed to auto-open browser: ${error.message}. Please navigate manually to ${localUrl}`);
  }
});
