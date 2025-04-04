import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

Vue.config.productionTip = false;

let app;

// Wait for Firebase auth to initialize before creating the app
onAuthStateChanged(auth, () => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});
