import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import open from 'open';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Flag untuk memastikan browser hanya dibuka sekali
let browserOpened = false;

// Middleware untuk mengizinkan akses ke file token.json
app.use((req, res, next) => {
  // CORS headers untuk development
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files dari current directory
app.use(express.static(__dirname));

// Endpoint khusus untuk token.json dengan cache control
app.get('/token.json', (req, res) => {
  const tokenPath = path.join(__dirname, process.env.TOKEN_FILE_PATH || 'token.json');

  if (fs.existsSync(tokenPath)) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.sendFile(tokenPath);
  } else {
    res.status(404).json({ error: 'token.json not found. Please login first.' });
  }
});

// Endpoint untuk melihat status token
app.get('/api/token-status', (req, res) => {
  const tokenPath = path.join(__dirname, process.env.TOKEN_FILE_PATH || 'token.json');

  if (!fs.existsSync(tokenPath)) {
    return res.json({ exists: false, message: 'Token file not found' });
  }

  try {
    const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = tokenData.created_at ? tokenData.created_at + tokenData.expires_in : null;
    const isValid = expiresAt ? expiresAt > now : false;

    res.json({
      exists: true,
      isValid: isValid,
      expires_in: tokenData.expires_in,
      session_state: tokenData.session_state,
      timeLeft: isValid ? expiresAt - now : 0,
    });
  } catch {
    res.json({ exists: true, error: 'Invalid JSON format' });
  }
});

// Route utama
app.get('/', (req, res) => {
  const viewerPath = path.join(__dirname, 'token-viewer.html');
  if (fs.existsSync(viewerPath)) {
    res.sendFile(viewerPath);
  } else {
    res.status(404).send('token-viewer.html not found');
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Token Viewer Server berjalan di:`);
  console.log(`   📱 http://localhost:${PORT}`);
  console.log(`   🌐 http://127.0.0.1:${PORT}`);
  console.log(`\n📋 Tekan Ctrl+C untuk menghentikan server\n`);

  // Buka browser otomatis hanya sekali (hanya jika DEBUG_MODE tidak true)
  if (!browserOpened && process.env.DEBUG_MODE !== 'true') {
    browserOpened = true;
    setTimeout(() => {
      open(`http://localhost:${PORT}`).catch(() => {
        console.log('⚠️ Tidak bisa membuka browser otomatis, buka manual di:', `http://localhost:${PORT}`);
      });
    }, 500); // Delay 500ms untuk memastikan server benar-benar siap
  }
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Server dihentikan...');
  server.close(() => {
    process.exit(0);
  });
});
