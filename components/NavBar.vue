<template>
  <nav>
    <NuxtLink to="/">Home</NuxtLink> |
    <NuxtLink v-if="user" to="/my-recipes">My Recipes</NuxtLink> <span v-if="user">|</span>
    <NuxtLink v-if="user" to="/saved-recipes">Saved Recipes</NuxtLink> <span v-if="user">|</span>
    <NuxtLink v-if="!user" to="/login">Login</NuxtLink>
    <button v-if="user" @click="logout">Logout</button>
    <span v-if="user"> (Logged in as {{ user.displayName || user.email }})</span>
  </nav>
</template>

<script>
import { signOut } from "firebase/auth";

export default {
  name: 'NavBar',
  data() {
    return {
      user: null // Will be populated by the auth listener
    }
  },
  mounted() {
    // Use the injected  service to listen for state changes
    if (this.$auth) {
      this.$auth.onAuthStateChanged(firebaseUser => {
        console.log('NavBar Auth state changed:', firebaseUser ? firebaseUser.email : 'No user');
        this.user = firebaseUser; // Update the local user data property
      });
    } else {
      console.error('Firebase Auth () not properly injected in NavBar.');
    }
  },
  methods: {
    async logout() {
      if (!this.$auth) {
        alert('Auth service not available.');
        return;
      }
      try {
        await signOut(this.$auth);
        console.log('User logged out successfully.');
        // User state will be set to null by onAuthStateChanged
        // Optionally redirect to login page after logout:
        // this..push('/login');
      } catch (error) {
        console.error("Logout failed:", error);
        alert('Logout failed: ' + error.message);
      }
    }
  }
}
</script>

<style scoped>
nav {
  padding: 10px;
  background-color: #f0f0f0;
  margin-bottom: 20px;
}
nav a, nav button {
  margin: 0 5px;
  text-decoration: none;
  color: #007bff;
  cursor: pointer;
}
nav button {
  border: none;
  background: none;
  padding: 0;
}
nav a.nuxt-link-exact-active {
  font-weight: bold;
  color: #35495e;
}
</style>
