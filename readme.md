# 🔐 Keycloak Authentication Tool

Tools untuk autentikasi dan refresh token Keycloak, dilengkapi dengan Token Viewer untuk melihat dan mengelola token.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Prerequisites](#prerequisites)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Penggunaan](#penggunaan)
  - [Windows](#windows)
  - [Mac / Linux](#mac--linux)
- [Token Viewer](#token-viewer)
  - [Fitur Viewer](#fitur-viewer)
  - [Cara Menggunakan Viewer](#cara-menggunakan-viewer)
- [Struktur File](#struktur-file)
- [Troubleshooting](#troubleshooting)
- [Catatan Penting](#catatan-penting)

## ✨ Fitur

- **Login** - Mendapatkan token baru dengan autentikasi username/password
- **Refresh Token** - Memperbarui token yang sudah ada menggunakan refresh token
- **Token Viewer** - Antarmuka web untuk melihat dan mengelola token
  - Menampilkan Access Token, Refresh Token, dan Session State
  - Decode JWT untuk melihat informasi seperti username, roles, expiry time
  - Progress bar visual untuk masa berlaku token
  - Countdown real-time sisa waktu token
  - Copy token ke clipboard dengan satu klik
  - Auto-refresh setiap 30 detik
- **Cross Platform** - Bisa digunakan di Windows, Mac, dan Linux

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v14 atau lebih baru)
- [npm](https://www.npmjs.com/) (biasanya sudah termasuk dengan Node.js)
- Akses jaringan ke server Keycloak
- Browser modern (Chrome, Firefox, Edge, Safari)

## 🚀 Instalasi

1. **Clone atau download repository ini**

```bash
git clone <repository-url>
cd keycloak
```

2. **Install dependencies**

```bash
npm install axios dotenv express open
```

3. **Buat file environment**

```bash
cp .env.example .env
# atau buat manual file .env
```

## ⚙️ Konfigurasi

Edit file `.env` dan sesuaikan dengan konfigurasi server:

```env
# Keycloak Configuration
KEYCLOAK_BASE_URL=http://localhost
KEYCLOAK_SERVER_URL=http://localhost:8080
KEYCLOAK_REALM=master
KEYCLOAK_CLIENT_ID=admin-cli
KEYCLOAK_USERNAME=admin
KEYCLOAK_PASSWORD=admin
KEYCLOAK_REDIRECT_URI=http://localhost:3000/callback
KEYCLOAK_EXECUTION_ID=12345678-1234-1234-1234-123456789012

# File paths
TOKEN_FILE_PATH=token.json

# Server Configuration
PORT=3000
DEBUG_MODE=false
```

> ⚠️ **Penting**: Jangan commit file `.env` ke git! File ini sudah termasuk di `.gitignore`

## 🎮 Penggunaan

### Windows

Jalankan batch file dengan double-click atau dari Command Prompt:

```batch
keycloak_auth.bat
```

Atau dari Command Prompt:

```batch
cd D:\DevProjects\besmart\keycloak
keycloak_auth.bat
```

### Mac / Linux

1. **Beri permission execute pada script**

```bash
chmod +x keycloak_auth.sh
```

2. **Jalankan script**

```bash
./keycloak_auth.sh
```

Atau menggunakan Makefile:

```bash
make menu
```

### Menu Options

```
========================================
   KEYCLOAK AUTHENTICATION TOOL
========================================

[L] Login - Dapatkan token baru
[R] Refresh - Perbarui token yang ada
[V] View - Buka Token Viewer
[Q] Quit - Keluar
----------------------------------------
Choose [L/R/V/Q]:
```

- **L (Login)**: Melakukan autentikasi lengkap (username/password) dan mendapatkan token baru
- **R (Refresh)**: Memperbarui token menggunakan refresh token dari file `token.json`
- **V (View)**: Membuka Token Viewer di browser (server berjalan di jendela terpisah)
- **Q (Quit)**: Keluar dari program

## 🖥️ Token Viewer

Token Viewer adalah antarmuka web untuk melihat dan mengelola token Keycloak dengan mudah.

### Fitur Viewer

| Fitur | Deskripsi |
|-------|-----------|
| **Informasi Token** | Menampilkan Session State, Access Token, Refresh Token |
| **Decode JWT** | Menampilkan username, roles, issued at, dan expiry dari token |
| **Countdown Real-time** | Menampilkan sisa waktu token yang terus berdetak setiap detik |
| **Progress Bar** | Visualisasi persentase masa berlaku token |
| **Copy Token** | Salin token ke clipboard dengan satu klik |
| **Copy All** | Salin semua informasi token sekaligus |
| **Auto-refresh** | Data token otomatis diperbarui setiap 30 detik |
| **Hover Tooltip** | Lihat token lengkap dengan hover (token dipotong dengan ellipsis) |

### Cara Menggunakan Viewer

1. **Dari Menu Utama**
   - Jalankan `keycloak_auth.bat` atau `./keycloak_auth.sh`
   - Pilih `[V] View`
   - Server akan berjalan di jendela baru dan browser terbuka otomatis

2. **Langsung dari Terminal**
   - Windows: Double-click `start-viewer.bat`
   - Mac/Linux: `./start-viewer.sh`

3. **Akses Manual**
   - Buka browser dan akses `http://localhost:3000`
   - (Ganti port jika diubah di `.env`)

### Tampilan Token Viewer

Token Viewer menampilkan informasi:

```
🔑 Session State: a66ef33e-2dee-4dcb-9f5c-ce55a6274edb [Copy]
🎫 Access Token: eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lk... [Copy]
🔄 Refresh Token: eyJhbGciOiJIUzUxMiIsInR5cCIgOiAiSldUIiwia2lk... [Copy]
⏰ Token Expiry (JWT): 31/03/2026 10:23:18 (1 jam 30 menit 45 detik)
📅 Issued At (JWT): 31/03/2026 08:53:18
🔖 Token Type: Bearer
📝 Scope: profile email openid organization
👤 Username: adminscm
🎭 Roles: scm-admin, uma_protection, scm-user
```

## 📁 Struktur File

```
keycloak/
├── 📄 auth.js                    # Modul autentikasi utama
├── 📄 auth-refresh-token.js      # Modul refresh token
├── 📄 server.js                  # Server untuk Token Viewer
├── 📄 token-viewer.html          # HTML Viewer (antarmuka web)
├── 📄 start-viewer.bat           # Launcher viewer (Windows)
├── 📄 start-viewer.sh            # Launcher viewer (Mac/Linux)
├── 📄 keycloak_auth.bat          # Menu utama (Windows)
├── 📄 keycloak_auth.sh           # Menu utama (Mac/Linux)
├── 📄 makefile                   # Alternatif launcher (Mac/Linux)
├── 📄 .env                       # Konfigurasi (tidak di commit)
├── 📄 .env.example               # Template konfigurasi
├── 📄 .gitignore                 # File yang diabaikan git
├── 📄 token.json                 # Hasil token (akan dibuat otomatis)
├── 📄 package.json               # Dependencies
└── 📄 README.md                  # Dokumentasi ini
```

## 🔧 Troubleshooting

### 1. Error: "Cannot find module 'axios'"

```bash
npm install axios dotenv express open
```

### 2. Error: "Konfigurasi tidak lengkap"

Pastikan file `.env` sudah dibuat dan semua variabel terisi dengan benar.

### 3. Error: "File token.json tidak ditemukan" (saat refresh)

Jalankan login terlebih dahulu untuk mendapatkan token awal:

```
Pilih [L] Login
```

### 4. Error: "refresh_token tidak ditemukan"

File token.json mungkin korup atau sudah expired total. Lakukan login ulang.

### 5. Token Viewer tidak bisa diakses

- Pastikan server sudah berjalan (ada jendela CMD/terminal dengan server.js)
- Cek port yang digunakan di file `.env` (default: 3000)
- Coba akses manual: `http://localhost:3000`

### 6. Permission denied (Mac/Linux)

```bash
chmod +x keycloak_auth.sh
chmod +x start-viewer.sh
```

### 7. Port 3000 sudah digunakan

- Ubah `PORT` di file `.env` ke port lain (misal: 8080)
- Restart viewer server

## 📝 Catatan Penting

1. **Keamanan**:
   - Jangan pernah commit file `.env` ke repository
   - File `token.json` berisi token sensitif, jangan dibagikan
   - Hapus file token jika sudah tidak digunakan
   - Token Viewer hanya berjalan di localhost, tidak bisa diakses dari luar

2. **Expired Token**:
   - Access token biasanya memiliki masa berlaku terbatas
   - Token Viewer menampilkan countdown real-time sisa waktu token
   - Gunakan opsi `[R] Refresh` untuk memperbarui sebelum expired
   - Jika refresh gagal, lakukan login ulang dengan opsi `[L]`

3. **Network**:
   - Pastikan bisa mengakses server Keycloak
   - Jika menggunakan VPN, pastikan koneksi stabil

4. **Multiple Environment**:
   - Bisa membuat multiple file .env untuk environment berbeda
   - Contoh: `.env.production`, `.env.staging`

5. **Token Viewer Server**:
   - Server berjalan di jendela/terminal terpisah
   - Tutup jendela server untuk menghentikan Token Viewer
   - Token Viewer bisa diakses selama server berjalan

## 🆘 Bantuan

Jika menemui kendala:

1. Cek koneksi jaringan ke server Keycloak
2. Pastikan credentials di `.env` benar
3. Lihat error message untuk petunjuk lebih lanjut
4. Jalankan ulang dari awal dengan opsi Login
5. Periksa apakah server Keycloak berjalan dengan baik

---

**Happy Coding!** 🚀
