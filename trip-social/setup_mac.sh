#!/bin/bash

# Default values for MySQL username, password, and remote flag
MYSQL_USER=""
MYSQL_PASSWORD=""
REMOTE=false
API_URL="http://localhost:8000"

# Parse command line arguments
while getopts u:p:ra: flag
do
    case "${flag}" in
        u) MYSQL_USER=${OPTARG};;
        p) MYSQL_PASSWORD=${OPTARG};;
        r) REMOTE=true;;
        a) API_URL=${OPTARG};;
    esac
done

# Prompt for MySQL username if not provided
if [ -z "$MYSQL_USER" ]; then
    read -p "Enter MySQL username: " MYSQL_USER
fi

# Prompt for MySQL password if not provided
if [ -z "$MYSQL_PASSWORD" ]; then
    read -sp "Enter MySQL password: " MYSQL_PASSWORD
    echo
fi

# Login to MySQL and run init.sql
mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" < ./backend/sql/init.sql

# Change directory to frontend and install npm packages
cd frontend
npm install

# Delete all .env files and create a new one with the specified content
rm -f .env
echo "REACT_APP_API_URL=$API_URL" > .env

# Run npm build for macOS
npm run build-mac

# Change directory to backend and install npm packages
cd ../backend
npm install

# Delete all .env files and create a new one with the specified content
rm -f .env
{
  echo "DB_NAME=xogame"
  echo "DB_USER=$MYSQL_USER"
  echo "DB_PASSWORD=$MYSQL_PASSWORD"
  echo "DB_HOST=localhost"
  echo "DB_DIALECT=mysql"
  echo "ALLOW_ORIGIN=$API_URL"
} > .env

# Clear MySQL username and password variables
unset MYSQL_USER
unset MYSQL_PASSWORD

# Start the backend
if [ "$REMOTE" = true ]; then
    pm2 start npm --name "XO_Game" -- start
    pm2 startup systemd
    pm2 save
else
    npm start
fi