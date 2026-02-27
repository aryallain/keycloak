import axios from 'axios';
import https from 'node:https';
import fs from 'node:fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class KeycloakAuthenticator {
  constructor(config) {
    this.config = config;
    this.cookieJar = new Map();

    this.client = axios.create({
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      withCredentials: true,
    });

    // Interceptor untuk menyimpan cookies
    this.client.interceptors.response.use((response) => {
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        cookies.forEach((cookie) => {
          const [cookiePair, ...options] = cookie.split(';');
          const [name, value] = cookiePair.split('=');

          this.cookieJar.set(name, value);

          options.forEach((option) => {
            const [optName, optValue] = option.trim().split('=');
            if (optName.toLowerCase() === 'path') {
              this.cookieJar.set(`${name}_path`, optValue);
            }
          });
        });
      }
      return response;
    });

    // Interceptor untuk mengirim cookies
    this.client.interceptors.request.use((config) => {
      if (this.cookieJar.size > 0) {
        const cookieStrings = [];
        this.cookieJar.forEach((value, name) => {
          if (!name.endsWith('_path')) {
            cookieStrings.push(`${name}=${value}`);
          }
        });

        const cookieHeader = cookieStrings.join('; ');
        config.headers = config.headers || {};
        config.headers.Cookie = cookieHeader;
      }
      return config;
    });
  }

  extractQueryFromKcContext(html) {
    const queryMatch = html.match(/"query":\s*"([^"]+)"/);
    return queryMatch ? queryMatch[1] : null;
  }

  async step1GetAuthPage() {
    const url = `${this.config.keycloakUrl}/realms/${this.config.realm}/protocol/openid-connect/auth`;
    const params = {
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'openid profile email',
    };

    try {
      const response = await this.client.get(url, { params });

      if (response.data && typeof response.data === 'string') {
        const html = response.data;
        const queryString = this.extractQueryFromKcContext(html);

        if (queryString) {
          const queryParams = new URLSearchParams(queryString);

          const loginActionUrl = `${this.config.keycloakUrl}/realms/${this.config.realm}/login-actions/authenticate`;
          const loginParams = {
            session_code: queryParams.get('session_code'),
            execution: this.config.executionId,
            client_id: this.config.clientId,
            tab_id: queryParams.get('tab_id'),
            client_data: queryParams.get('client_data'),
          };

          // Hapus undefined
          Object.keys(loginParams).forEach((key) => loginParams[key] === undefined && delete loginParams[key]);

          return `${loginActionUrl}?${new URLSearchParams(loginParams)}`;
        }
      }

      throw new Error('Tidak dapat menemukan URL login');
    } catch (error) {
      if (error.response?.status === 302) {
        return error.response.headers.location;
      }
      throw error;
    }
  }

  async step2SubmitLogin(loginUrl) {
    const formData = new URLSearchParams({
      username: this.config.username,
      password: this.config.password,
      credentialId: '',
    });

    try {
      const response = await this.client.post(loginUrl, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });

      if (response.headers.location) {
        return this.extractCodeAndSession(response.headers.location);
      }

      throw new Error('Tidak mendapatkan redirect setelah login');
    } catch (error) {
      if (error.response?.status === 302) {
        return this.extractCodeAndSession(error.response.headers.location);
      }
      throw error;
    }
  }

  extractCodeAndSession(url) {
    const [baseUrl, fragment] = url.split('#');
    let code = null;
    let session_state = null;

    const baseCodeMatch = baseUrl.match(/code=([^&]+)/);
    if (baseCodeMatch) {
      code = decodeURIComponent(baseCodeMatch[1]);
    }

    const baseSessionMatch = baseUrl.match(/session_state=([^&]+)/);
    if (baseSessionMatch) {
      session_state = baseSessionMatch[1];
    }

    if ((!code || !session_state) && fragment) {
      const fragmentCodeMatch = fragment.match(/code=([^&]+)/);
      if (fragmentCodeMatch) {
        code = decodeURIComponent(fragmentCodeMatch[1]);
      }

      const fragmentSessionMatch = fragment.match(/session_state=([^&]+)/);
      if (fragmentSessionMatch) {
        session_state = fragmentSessionMatch[1];
      }
    }

    return { code, session_state };
  }

  async step3ExchangeToken(code, session_state) {
    const url = `${this.config.baseUrl}/api/msf_iam/auth/token`;

    const formData = new URLSearchParams({
      client_id: this.config.clientId,
      grant_type: 'authorization_code',
      redirect_uri: this.config.redirectUri,
      code,
      session_state,
    });

    try {
      const response = await this.client.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json, text/plain, */*',
          Cookie: 'i18next=en',
        },
        maxRedirects: 5,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('❌ Token exchange failed:', error.response.status);
      }
      throw error;
    }
  }

  async authenticate() {
    this.cookieJar.clear();

    try {
      const loginUrl = await this.step1GetAuthPage();
      const { code, session_state } = await this.step2SubmitLogin(loginUrl);

      if (!code || !session_state) {
        throw new Error('Code atau session_state tidak ditemukan');
      }

      console.log('📦 Session State:', session_state);

      const tokenData = await this.step3ExchangeToken(code, session_state);
      console.log('📦 Access Token:', tokenData.access_token);

      return tokenData;
    } catch (error) {
      console.error('❌ Autentikasi gagal:', error.message);
      throw error;
    }
  }
}

// ===============================
// Konfigurasi dari environment variables
// ===============================
const config = {
  baseUrl: process.env.KEYCLOAK_BASE_URL,
  keycloakUrl: process.env.KEYCLOAK_SERVER_URL,
  realm: process.env.KEYCLOAK_REALM,
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  username: process.env.KEYCLOAK_USERNAME,
  password: process.env.KEYCLOAK_PASSWORD,
  redirectUri: process.env.KEYCLOAK_REDIRECT_URI,
  executionId: process.env.KEYCLOAK_EXECUTION_ID,
};

// Validasi konfigurasi
const requiredConfigs = ['baseUrl', 'keycloakUrl', 'realm', 'clientId', 'username', 'password', 'redirectUri', 'executionId'];
const missingConfigs = requiredConfigs.filter((key) => !config[key]);

if (missingConfigs.length > 0) {
  console.error('❌ Konfigurasi tidak lengkap. Variabel berikut tidak ditemukan di .env:');
  missingConfigs.forEach((key) => console.error(`   - ${key}`));
  process.exit(1);
}

// ===============================
// Eksekusi
// ===============================
try {
  const auth = new KeycloakAuthenticator(config);
  const tokenData = await auth.authenticate();
  const tokenFilePath = process.env.TOKEN_FILE_PATH || 'token.json';

  fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2));
  console.log('\n💾 Token disimpan ke', tokenFilePath);
} catch (error) {
  console.error('\n❌ Autentikasi gagal:', error.message);
  process.exit(1);
}
