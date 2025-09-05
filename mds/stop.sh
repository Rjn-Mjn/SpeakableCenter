#!/bin/bash

# Stop script for Speakable application

echo "Stopping Speakable Application..."

# Kill Node processes
pkill -f "node.*server.js"
pkill -f "npm.*dev"

echo "Application stopped"
