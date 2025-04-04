#!/usr/bin/env sh

# Abort on errors
set -e

# Build
npm run build

# Navigate to the build output directory
cd dist

# If you are deploying to a personal repository
git init
git add -A
git commit -m 'Deploy to GitHub Pages'

# If deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# If deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:nashatech/recipe-app.git main:gh-pages

cd -