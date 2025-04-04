<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Recipe App</h1>
      <p>Sign in to manage your recipes</p>
      <button @click="signInWithFacebook" class="facebook-btn">
        Sign in with Facebook
      </button>
    </div>
  </div>
</template>

<script>
import { auth, fbProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export default {
  name: 'Login',
  methods: {
    async signInWithFacebook() {
      try {
        await signInWithPopup(auth, fbProvider);
        this.$router.push('/');
      } catch (error) {
        console.error('Authentication error:', error);
        alert('Failed to sign in: ' + error.message);
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.facebook-btn {
  background-color: #4267B2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.facebook-btn:hover {
  background-color: #365899;
}
</style>
