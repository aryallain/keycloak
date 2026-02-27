#!/bin/bash

# Title
echo -e "\033]0;Keycloak Authentication Tool\007"

# Change to the project directory
cd "$(dirname "$0")" || exit

# Function to display menu
show_menu() {
    clear
    echo "----------------------------------------"
    echo "[L] Login - Dapatkan token baru"
    echo "[R] Refresh - Perbarui token yang ada"
    echo "[Q] Quit - Keluar"
    echo "----------------------------------------"
}

# Main menu loop
while true; do
    show_menu
    
    # Read user input
    read -n 1 -p "Choose [L/R/Q]: " choice
    echo # New line after input
    
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
        [Qq])
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid choice! Please select L, R, or Q"
            sleep 1
            ;;
    esac
done