# NashaTech Recipe Management App

## Project Overview

A full-featured recipe management web application built with Vue.js and Firebase, allowing users to discover, save, create, and manage recipes.

### Key Features

- 🔐 Facebook Authentication
- 🍽 Recipe Discovery
- 💾 Save Favorite Recipes
- ✏️ Personal Recipe Management
- 🔍 Advanced Recipe Filtering

## Tech Stack

- **Frontend**: Vue.js 3
- **State Management**: Vue Router
- **Styling**: SCSS
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Hosting

## Prerequisites

- Node.js (v14+ recommended)
- npm or Yarn
- Firebase Account

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/nashatech/recipe-app.git
cd recipe-app
```

2. Install Dependencies
```bash
npm install
```

3. Firebase Configuration
- Create a Firebase project
- Enable Authentication (Facebook)
- Create Firestore Database
- Copy configuration to `src/firebase.js`

4. Environment Variables
Create a `.env` file with:
```
VUE_APP_FIREBASE_API_KEY=your_api_key
VUE_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
VUE_APP_FIREBASE_PROJECT_ID=your_project_id
```

## Development Server

```bash
npm run serve
```

## Build for Production

```bash
npm run build
```

## Deployment

### Netlify
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Initialize site: `netlify init`

### GitHub Pages
```bash
npm run deploy:gh
```

## Testing

```bash
npm run test
```

## Linting

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

Distributed under the MIT License.

## Contact

NashaTech Team - [Your Email]

Project Link: [https://github.com/nashatech/recipe-app](https://github.com/nashatech/recipe-app)