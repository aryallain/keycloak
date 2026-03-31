#!/bin/bash

# Title
echo -e "\033]0;Keycloak Authentication Tool\007"

# Change to script directory
cd "$(dirname "$0")" || exit

# Function to display menu
show_menu() {
    clear
    echo "========================================"
    echo "   KEYCLOAK AUTHENTICATION TOOL"
    echo "========================================"
    echo
    echo "[L] Login - Dapatkan token baru"
    echo "[R] Refresh - Perbarui token yang ada"
    echo "[V] View - Buka Token Viewer"
    echo "[Q] Quit - Keluar"
    echo
    echo "----------------------------------------"
}

# Main menu loop
while true; do
    show_menu
    read -n 1 -p "Choose [L/R/V/Q]: " choice
    echo
    
    case $choice in
        [Ll])
            clear
            echo
            node auth.js
            echo
            read -n 1 -s -r -p "Press any key to continue..."
            ;;
        [Rr])
            clear
            echo
            node auth-refresh-token.js
            echo
            read -n 1 -s -r -p "Press any key to continue..."
            ;;
        [Vv])
            clear
            echo
            ./start-viewer.sh
            ;;
        [Qq])
            clear
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid choice! Please select L, R, V, or Q"
            sleep 1
            ;;
    esac
done