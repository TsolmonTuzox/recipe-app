# NashaTech Recipe Management App

**[➡️ View Live Demo](https://nashatechrecipe.netlify.app/)**

[![Netlify Status](https://api.netlify.com/api/v1/badges/<YOUR_NETLIFY_SITE_ID>/deploy-status)](https://app.netlify.com/sites/<YOUR_NETLIFY_SITE_NAME>/deploys)

A full-featured recipe management web application built with Vue.js and Firebase, allowing users to discover, save, create, and manage recipes.

## Key Features

* 🔐 **Facebook Authentication:** Secure login using Firebase Authentication.
* 🍽 **Recipe Discovery:** Browse and search for recipes (e.g., by name, ingredients - *add specifics here*).
* 💾 **Save Favorite Recipes:** Logged-in users can save recipes to their personal list.
* ✏️ **Personal Recipe Management:** Logged-in users can create, view, edit ( *add edit/delete if implemented*), and manage their own recipes.
* 🔍 **Advanced Recipe Filtering:** Filter recipes based on categories, cuisine, etc. (*add specifics here*).

## Tech Stack

* **Frontend:** Vue.js 3 (Composition API)
* **Routing:** Vue Router
* **Styling:** SCSS
* **Backend:**
    * Firebase Authentication (Facebook Provider)
    * Cloud Firestore Database
* **Hosting:** Netlify

## Prerequisites

* Node.js (v14+ recommended)
* npm or Yarn
* Firebase Account

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/TsolmonTuzox/recipe-app.git](https://www.google.com/search?q=https://github.com/TsolmonTuzox/recipe-app.git)
    cd recipe-app
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Firebase Configuration:**
    * Create a Firebase project at [firebase.google.com](https://firebase.google.com/).
    * Enable Authentication: Add the Facebook sign-in provider and configure it.
    * Create a Cloud Firestore Database. Ensure security rules are appropriately set.
    * Obtain your Firebase project configuration credentials.

4.  **Environment Variables:**
    * Create a `.env` file in the root of the project.
    * Add your Firebase credentials to the `.env` file. These are typically used in your `src/firebase.js` or `src/firebaseConfig.js` file.
        ```dotenv
        VUE_APP_FIREBASE_API_KEY=your_api_key
        VUE_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
        VUE_APP_FIREBASE_PROJECT_ID=your_project_id
        # Add other necessary Firebase config variables (storageBucket, messagingSenderId, appId) if used
        ```

## Development Server

Run the app locally:
```bash
npm run serve
