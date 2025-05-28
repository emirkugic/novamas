#!/bin/bash

# Install required dependencies
echo "Installing required dependencies..."
npm install --save node-fetch@2.6.7

# Create a directory for the scripts
mkdir -p scripts

# Copy the static generator script
echo "Setting up static HTML generator..."
cp generate-static-blog-pages.js scripts/

# Update package.json to include the new script
echo "Updating package.json..."
npx json -I -f package.json -e "this.scripts.postbuild = 'node scripts/generate-static-blog-pages.js'"

echo "Setup complete! Run 'npm run build' to build your site with proper SEO meta tags."