# 🔐 Keycloak Authentication Tool

Tools untuk autentikasi dan refresh token Keycloak.

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Prerequisites](#prerequisites)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Penggunaan](#penggunaan)
  - [Windows](#windows)
  - [Mac / Linux](#mac--linux)
- [Struktur File](#struktur-file)
- [Troubleshooting](#troubleshooting)
- [Catatan Penting](#catatan-penting)

## ✨ Fitur

- **Login** - Mendapatkan token baru dengan autentikasi username/password
- **Refresh Token** - Memperbarui token yang sudah ada menggunakan refresh token
- **Auto-save** - Token otomatis disimpan ke file `token.json`
- **Cross Platform** - Bisa digunakan di Windows, Mac, dan Linux

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v14 atau lebih baru)
- [npm](https://www.npmjs.com/) (biasanya sudah termasuk dengan Node.js)
- Akses jaringan ke server Keycloak

## 🚀 Instalasi

1. **Clone atau download repository ini**

```bash
git clone <repository-url>
cd keycloak
```

2. **Install dependencies**

```bash
npm install axios dotenv
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
----------------------------------------
[L] Login - Dapatkan token baru
[R] Refresh - Perbarui token yang ada
[Q] Quit - Keluar
----------------------------------------
Choose [L/R/Q]:
```

- **L (Login)**: Melakukan autentikasi lengkap (username/password) dan mendapatkan token baru
- **R (Refresh)**: Memperbarui token menggunakan refresh token dari file `token.json`
- **Q (Quit)**: Keluar dari program

## 📁 Struktur File

```
keycloak/
├── 📄 auth.js                 # Modul autentikasi utama
├── 📄 auth-refresh-token.js   # Modul refresh token
├── 📄 keycloak_auth.bat       # Launcher untuk Windows
├── 📄 keycloak_auth.sh        # Launcher untuk Mac/Linux
├── 📄 makefile                # Alternatif launcher untuk Mac/Linux
├── 📄 .env                    # Konfigurasi (tidak di commit)
├── 📄 .env.example            # Template konfigurasi
├── 📄 .gitignore              # File yang diabaikan git
├── 📄 token.json              # Hasil token (akan dibuat otomatis)
├── 📄 package.json            # Dependencies
└── 📄 README.md               # Dokumentasi ini
```

## 🔧 Troubleshooting

### 1. Error: "Cannot find module 'axios'"

```bash
npm install axios dotenv
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

### 5. Permission denied (Mac/Linux)

```bash
chmod +x keycloak_auth.sh
```

## 📝 Catatan Penting

1. **Keamanan**:
   - Jangan pernah commit file `.env` ke repository
   - File `token.json` berisi token sensitif, jangan dibagikan
   - Hapus file token jika sudah tidak digunakan

2. **Expired Token**:
   - Access token biasanya memiliki masa berlaku terbatas
   - Gunakan opsi [R] Refresh untuk memperbarui sebelum expired
   - Jika refresh gagal, lakukan login ulang dengan opsi [L]

3. **Network**:
   - Pastikan bisa mengakses server Keycloak
   - Jika menggunakan VPN, pastikan koneksi stabil

4. **Multiple Environment**:
   - Bisa membuat multiple file .env untuk environment berbeda
   - Contoh: `.env.production`, `.env.staging`

## 🆘 Bantuan

Jika menemui kendala:

1. Cek koneksi jaringan ke server Keycloak
2. Pastikan credentials di `.env` benar
3. Lihat error message untuk petunjuk lebih lanjut
4. Jalankan ulang dari awal dengan opsi Login

---

**Happy Coding!** 🚀
