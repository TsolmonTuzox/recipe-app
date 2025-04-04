<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/">Recipe App</router-link>
    </div>
    <div class="navbar-menu">
      <router-link to="/" class="navbar-item">Home</router-link>
      <template v-if="isLoggedIn">
        <router-link to="/saved-recipes" class="navbar-item">Saved Recipes</router-link>
        <router-link to="/my-recipes" class="navbar-item">My Recipes</router-link>
        <a @click="signOut" class="navbar-item">Sign Out</a>
      </template>
      <router-link v-else to="/login" class="navbar-item">Sign In</router-link>
    </div>
  </nav>
</template>

<script>
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default {
  name: 'NavBar',
  data() {
    return {
      isLoggedIn: false
    };
  },
  created() {
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn = !!user;
    });
  },
  methods: {
    async signOut() {
      try {
        await signOut(auth);
        this.$router.push('/login');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ff6b6b;
  color: white;
}

.navbar a {
  color: white;
  text-decoration: none;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
}

.navbar-item {
  cursor: pointer;
}

.navbar-item:hover {
  text-decoration: underline;
}
</style>
