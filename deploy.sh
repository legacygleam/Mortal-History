#!/bin/bash
set -e

echo "Building frontend..."
npm run build

echo "Frontend built at dist/"

echo "To deploy to Arweave Permaweb:"
echo "  npx arweave-deploy --key-file ../wallet.json dist/index.html"
echo ""
echo "Or deploy the entire dist/ folder to a permapage app."
