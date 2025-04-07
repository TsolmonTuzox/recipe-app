- Netlify deployment issue with Nuxt 3.16.2
  - Problem: Build fails with "Build script returned non-zero exit code: 2"
  - Error: `Failed to resolve loader: cache-loader` from `vue-cli-service build`
  - Root cause: Lingering Vue CLI dependencies and outdated build scripts
  - Solution steps:
    1. Remove Vue CLI related dependencies
    2. Update build scripts to use Nuxt 3 native commands
    3. Configure Netlify build command to `npm run build`
    4. Ensure publish directory is set correctly (likely `.output/public` or `dist`)
  - Troubleshooting tips:
    - Verify no Vue CLI specific configs remain in `package.json`
    - Use `nuxt build` for local builds
    - Clean install dependencies before deploying
  - Verify Netlify configuration matches Nuxt 3 build requirements