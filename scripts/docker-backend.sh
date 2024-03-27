#!/bin/bash

#CONFIG
ZIP_FILE="backend_archive.zip" # output ZIP file name
TEMP_FILE_LIST=$(mktemp) # temp file for list of files to zip

#PREPARE
rm -rf "$ZIP_FILE" ./temp

# Generate file list, excluding .ebignore 
find . -type f ! -path './.ebignore' | grep -v -f <(sed 's:/*$::' .ebignore) > "$TEMP_FILE_LIST"

# Create the ZIP file based on the list
zip -@ "$ZIP_FILE" < "$TEMP_FILE_LIST"

# Cleanup
rm "$TEMP_FILE_LIST"

echo "Created $ZIP_FILE"

unzip "$ZIP_FILE" -d ./temp

cd temp 

docker compose up