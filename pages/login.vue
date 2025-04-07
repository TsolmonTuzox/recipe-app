<template>
  <div>
    <h1>Login Page</h1>
    <p>Please log in using Facebook to manage your recipes.</p>
    <button @click="loginWithFacebook" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login with Facebook' }}
    </button>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <br/>
    <NuxtLink to="/">Back to Home</NuxtLink>
  </div>
</template>

<script>
// Import necessary functions from Firebase SDK
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";

export default {
  name: 'LoginPage',
  data() {
    return {
      loading: false,
      error: null,
    }
  },
  methods: {
    async loginWithFacebook() {
      this.loading = true;
      this.error = null;
      if (!this.$auth) {
         this.error = 'Auth service not available.';
         this.loading = false;
         return;
      }

      const provider = new FacebookAuthProvider();
      // --- CHANGE HERE: Explicitly request only public_profile ---
      // By default, Firebase might ask for email too. Let's be specific.
      // Note: Depending on SDK version, even this might implicitly add email sometimes.
      // If this still fails, further customization might be needed, but try this first.
      // provider.addScope('public_profile'); // Often implicit, adding it explicitly *might* help or might be redundant. Let's try *without* adding any scope first.
      // Let Firebase handle default scopes, which *should* just be public_profile if email isn't auto-approved.

      // If the above doesn't work, uncommenting this might help, or using setCustomParameters:
      // provider.setCustomParameters({
      //   'scope': 'public_profile'
      // });


      try {
        console.log("Attempting Facebook sign-in...");
        const result = await signInWithPopup(this.$auth, provider);

        console.log('Successfully logged in:', result.user.displayName);
        // Note: result.user.email might be null now if the email scope wasn't granted
        console.log('User email (might be null):', result.user.email);

        this.$router.push('/'); // Redirect to homepage after successful login
      } catch (error) {
        console.error("Facebook Login failed:", error);
        this.error = `Login failed: ${error.message} (Code: ${error.code})`;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
