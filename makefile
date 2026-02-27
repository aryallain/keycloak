# ============================================
# Keycloak Authentication Tool - Makefile
# Untuk Mac/Linux
# ============================================

.PHONY: help menu login refresh clean install setup

# Warna untuk output
GREEN := \033[0;32m
BLUE := \033[0;34m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := menu

## Menampilkan menu interaktif
menu:
	@while true; do \
		clear; \
		echo "$(BLUE)----------------------------------------$(NC)"; \
		echo "$(GREEN)[L]$(NC) Login - Dapatkan token baru"; \
		echo "$(GREEN)[R]$(NC) Refresh - Perbarui token yang ada"; \
		echo "$(GREEN)[I]$(NC) Info - Lihat informasi token"; \
		echo "$(GREEN)[C]$(NC) Clean - Hapus file token"; \
		echo "$(RED)[Q]$(NC) Quit - Keluar"; \
		echo "$(BLUE)----------------------------------------$(NC)"; \
		read -n 1 -p "$$(echo "$(YELLOW)Choose [L/R/I/C/Q]:$(NC) ")" choice; \
		echo ""; \
		case $$choice in \
			[Ll]) make login ;; \
			[Rr]) make refresh ;; \
			[Ii]) make info ;; \
			[Cc]) make clean ;; \
			[Qq]) echo "$(BLUE)Exiting...$(NC)"; exit 0 ;; \
			*) echo "$(RED)Invalid choice! Please select L, R, I, C, or Q$(NC)"; sleep 1 ;; \
		esac; \
	done

## Login - Mendapatkan token baru
login:
	@clear
	@echo "$(YELLOW)🔐 Melakukan login...$(NC)"
	@echo ""
	@node auth.js
	@echo ""
	@echo "$(GREEN)✅ Login selesai$(NC)"
	@read -n 1 -s -r -p "Press any key to continue..."

## Refresh - Memperbarui token yang ada
refresh:
	@clear
	@echo "$(YELLOW)🔄 Merefresh token...$(NC)"
	@echo ""
	@node auth-refresh-token.js
	@echo ""
	@echo "$(GREEN)✅ Refresh selesai$(NC)"
	@read -n 1 -s -r -p "Press any key to continue..."

## Info - Melihat informasi token yang tersimpan
info:
	@clear
	@echo "$(BLUE)📋 Informasi Token$(NC)"
	@echo "$(BLUE)----------------------------------------$(NC)"
	@if [ -f token.json ]; then \
		echo "$(GREEN)✅ File token.json ditemukan$(NC)"; \
		echo ""; \
		echo "📦 Token Info:"; \
		cat token.json | python3 -m json.tool 2>/dev/null || cat token.json | jq '.' 2>/dev/null || cat token.json; \
		echo ""; \
		echo "📊 Expires in:"; \
		node -e "try { \
			const token = require('./token.json'); \
			if (token.expires_in) { \
				const hours = Math.floor(token.expires_in / 3600); \
				const minutes = Math.floor((token.expires_in % 3600) / 60); \
				console.log('   ⏰ ' + hours + ' jam ' + minutes + ' menit'); \
			} \
			if (token.refresh_expires_in) { \
				const hours = Math.floor(token.refresh_expires_in / 3600); \
				const minutes = Math.floor((token.refresh_expires_in % 3600) / 60); \
				console.log('   🔄 Refresh: ' + hours + ' jam ' + minutes + ' menit'); \
			} \
		} catch(e) { \
			console.log('   ❌ Gagal membaca token'); \
		}" 2>/dev/null || echo "   ⚠️  Tidak bisa membaca informasi token"; \
	else \
		echo "$(RED)❌ File token.json tidak ditemukan$(NC)"; \
		echo "$(YELLOW}💡 Jalankan 'make login' terlebih dahulu$(NC)"; \
	fi
	@echo ""
	@read -n 1 -s -r -p "Press any key to continue..."

## Clean - Menghapus file token
clean:
	@clear
	@echo "$(YELLOW)🧹 Membersihkan file token...$(NC)"
	@if [ -f token.json ]; then \
		rm token.json; \
		echo "$(GREEN)✅ File token.json berhasil dihapus$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  File token.json tidak ditemukan$(NC)"; \
	fi
	@if [ -f .env ]; then \
		echo "$(YELLOW)📝 File .env masih ada (tidak dihapus)$(NC)"; \
	fi
	@echo ""
	@read -n 1 -s -r -p "Press any key to continue..."

## Install dependencies
install:
	@clear
	@echo "$(YELLOW)📦 Menginstall dependencies...$(NC)"
	@npm install axios dotenv
	@echo "$(GREEN)✅ Dependencies berhasil diinstall$(NC)"
	@echo ""
	@read -n 1 -s -r -p "Press any key to continue..."

## Setup awal (copy .env.example dan install dependencies)
setup:
	@clear
	@echo "$(YELLOW)🚀 Setup Authentication Tool$(NC)"
	@echo "$(BLUE)----------------------------------------$(NC)"
	@if [ ! -f .env ]; then \
		if [ -f .env.example ]; then \
			cp .env.example .env; \
			echo "$(GREEN)✅ File .env berhasil dibuat dari .env.example$(NC)"; \
			echo "$(YELLOW)⚠️  Silakan edit file .env dengan credentials yang benar$(NC)"; \
		else \
			echo "$(RED)❌ File .env.example tidak ditemukan$(NC)"; \
		fi \
	else \
		echo "$(YELLOW)⚠️  File .env sudah ada, tidak diubah$(NC)"; \
	fi
	@echo ""
	@make install

## Help - Menampilkan bantuan
help:
	@clear
	@echo "$(BLUE)===========================================$(NC)"
	@echo "$(GREEN)Keycloak Authentication Tool$(NC)"
	@echo "$(BLUE)===========================================$(NC)"
	@echo ""
	@echo "$(YELLOW)Usage:$(NC)"
	@echo "  make menu        - Menampilkan menu interaktif"
	@echo "  make login       - Login dan dapatkan token baru"
	@echo "  make refresh     - Refresh token yang ada"
	@echo "  make info        - Lihat informasi token"
	@echo "  make clean       - Hapus file token"
	@echo "  make install     - Install dependencies"
	@echo "  make setup       - Setup awal (copy .env + install)"
	@echo "  make help        - Tampilkan help ini"
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo "  make setup       # Setup pertama kali"
	@echo "  make menu        # Jalankan menu interaktif"
	@echo "  make login       # Langsung login"
	@echo ""
	@echo "$(BLUE)----------------------------------------$(NC)"
	@echo "💡 Tips: Jalankan 'make setup' untuk pertama kali"
	@echo ""

## Status - Cek status environment
status:
	@clear
	@echo "$(BLUE)🔍 Status Environment$(NC)"
	@echo "$(BLUE)----------------------------------------$(NC)"
	@echo "📁 Directory: $$(pwd)"
	@echo ""
	@echo "📦 Node version: $$(node --version 2>/dev/null || echo 'Not installed')"
	@echo "📦 NPM version: $$(npm --version 2>/dev/null || echo 'Not installed')"
	@echo ""
	@echo "📄 Files:"
	@for file in .env .env.example token.json package.json; do \
		if [ -f $$file ]; then \
			echo "   $(GREEN)✅$$(NC) $$file"; \
		else \
			echo "   $(RED)❌$$(NC) $$file"; \
		fi \
	done
	@echo ""
	@echo "📦 Dependencies:"
	@if [ -d node_modules ]; then \
		echo "   $(GREEN)✅ node_modules$(NC)"; \
		for pkg in axios dotenv; do \
			if [ -d node_modules/$$pkg ]; then \
				echo "      $(GREEN)✅$$(NC) $$pkg"; \
			else \
				echo "      $(RED)❌$$(NC) $$pkg"; \
			fi \
		done \
	else \
		echo "   $(RED)❌ node_modules tidak ditemukan$(NC)"; \
	fi
	@echo ""
	@read -n 1 -s -r -p "Press any key to continue..."