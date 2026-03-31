import axios from 'axios';
import https from 'node:https';
import fs from 'node:fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ quiet: true });

class KeycloakTokenRefresher {
  constructor(config) {
    this.config = config;

    this.client = axios.create({
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 500,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      withCredentials: true,
    });
  }

  async refreshToken(refreshToken) {
    const url = `${this.config.baseUrl}/api/msf_iam/auth/token`;

    const formData = new URLSearchParams({
      client_id: this.config.clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    try {
      const response = await this.client.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json, text/plain, */*',
        },
      });

      if (response.status >= 400) {
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(response.data)}`);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  async refreshFromFile(tokenFilePath = 'token.json') {
    try {
      if (!fs.existsSync(tokenFilePath)) {
        throw new Error(`File ${tokenFilePath} tidak ditemukan`);
      }

      const tokenData = JSON.parse(fs.readFileSync(tokenFilePath, 'utf8'));

      if (!tokenData.refresh_token) {
        throw new Error('refresh_token tidak ditemukan dalam file');
      }

      const newTokenData = await this.refreshToken(tokenData.refresh_token);

      console.log('📦 Session State:', newTokenData.session_state);
      console.log('📦 Access Token:', newTokenData.access_token);

      return newTokenData;
    } catch (error) {
      console.error('❌ Refresh gagal:', error.message);
      throw error;
    }
  }
}

// ===============================
// Konfigurasi dari environment variables
// ===============================
const config = {
  baseUrl: process.env.KEYCLOAK_BASE_URL,
  clientId: process.env.KEYCLOAK_CLIENT_ID,
};

// Validasi konfigurasi
if (!config.baseUrl || !config.clientId) {
  console.error('❌ Konfigurasi tidak lengkap. Pastikan file .env sudah benar.');
  process.exit(1);
}

// ===============================
// Eksekusi
// ===============================
try {
  const refresher = new KeycloakTokenRefresher(config);
  const tokenFilePath = process.env.TOKEN_FILE_PATH || 'token.json';

  const newTokenData = await refresher.refreshFromFile(tokenFilePath);

  fs.writeFileSync(tokenFilePath, JSON.stringify(newTokenData, null, 2));

  console.log('\n💾 Token berhasil diperbarui & disimpan ke', tokenFilePath);
} catch (error) {
  console.error('\n❌ Gagal melakukan refresh token:', error.message);
  process.exit(1);
}

export default KeycloakTokenRefresher;
