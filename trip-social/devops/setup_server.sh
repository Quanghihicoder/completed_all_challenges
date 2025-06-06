#!/bin/bash

# Set to true to use Let's Encrypt, false for a self-signed certificate
USE_LETSENCRYPT=false

# Update and upgrade the system
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt install net-tools -y

# Install Certbot
sudo apt install -y nginx ufw

# Enable UFW firewall & allow necessary traffic
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create certificate
if [ "$USE_LETSENCRYPT" = true ]; then
    # Install Certbot
    sudo apt install -y certbot python3-certbot-nginx

    # Obtain SSL certificate
    sudo certbot --nginx -d ${domain_name} --non-interactive --agree-tos -m ${email} --redirect

    SSL_CERT="/etc/letsencrypt/live/${domain_name}/fullchain.pem"
    SSL_KEY="/etc/letsencrypt/live/${domain_name}/privkey.pem"
else
    # Generate a self-signed certificate
    sudo mkdir -p /etc/self-signed
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/self-signed/selfsigned.key -out /etc/self-signed/selfsigned.crt -subj "/CN=${domain_name}"
    
    SSL_CERT="/etc/self-signed/selfsigned.crt"
    SSL_KEY="/etc/self-signed/selfsigned.key"
fi

# Create NGINX configuration
sudo cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;
    server_name ${domain_name};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name ${domain_name};

    ssl_certificate $SSL_CERT;
    ssl_certificate_key $SSL_KEY;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Test and restart nginx
sudo nginx -t && sudo systemctl restart nginx

# Setup auto-renewal
if [ "$USE_LETSENCRYPT" = true ]; then
    # Setup auto-renewal for Let's Encrypt
    sudo echo "0 0 1 * * root certbot renew --quiet" >> /etc/crontab
fi

# Install Node.js and npm
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL and set root user password
sudo apt-get install mysql-server -y
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'root';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Start MySQL and Node.js services
sudo systemctl start mysql
sudo systemctl enable mysql

# Install PM2
sudo npm install -g pm2

# Create Downloads directory if it doesn't exist
sudo mkdir -p ~/Downloads

# Clone the Git repository to the Downloads folder
# Name your repo as XO_Game
cd ~/Downloads
sudo git clone ${github_url}

# Set permissions for the cloned repository
sudo chmod -R 777 ~/Downloads/XO_Game

# Navigate to the cloned repository folder
cd ./XO_Game

# Run script 
sudo chmod 755 ./setup_mac.sh
./setup_mac.sh -u root -p root -r -a https://${domain_name}