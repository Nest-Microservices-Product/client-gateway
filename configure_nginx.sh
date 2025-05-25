#!/bin/bash

set -e

APP_NAME=$1

echo "Configuring Nginx for ${APP_NAME}"

# Update package list and install Nginx if not already installed
sudo apt update

# Check if Nginx is already installed
if ! dpkg -s nginx > /dev/null 2>&1; then
    echo "Nginx not found, installing..."
    sudo apt install -y nginx
else
    echo "Nginx is already installed."
fi

# Create the Nginx sites-available directory if it doesn't exist
sudo mkdir -p /etc/nginx/sites-available/

# Copy the Nginx config file to the sites-available directory
sudo cp /tmp/${APP_NAME}.nginx.conf /etc/nginx/sites-available/${APP_NAME}

# Remove default site symlink if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
fi

# Create a symbolic link to enable the new site config
sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/

# Test Nginx configuration for syntax errors
sudo nginx -t

# Reload Nginx to apply the new configuration
sudo systemctl reload nginx

echo "Nginx configured successfully." 