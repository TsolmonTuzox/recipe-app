import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { auth, firestore } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getCountFromServer } from 'firebase/firestore';
import seedDatabase from './services/databaseSeeder';
import checkDatabaseContents from './services/databaseChecker';

Vue.config.productionTip = false;

let app;

async function checkAndSeedDatabase() {
  try {
    // Check if cuisines collection is empty
    const cuisinesRef = collection(firestore, 'cuisines');
    const cuisinesSnapshot = await getCountFromServer(cuisinesRef);
    
    // If no documents exist, seed the database
    if (cuisinesSnapshot.data().count === 0) {
      console.log('Seeding database...');
      await seedDatabase();
    }

    // Always check and log database contents
    await checkDatabaseContents();
  } catch (error) {
    console.error('Error checking/seeding database:', error);
  }
}

// Wait for Firebase auth to initialize before creating the app
onAuthStateChanged(auth, async () => {
  // Seed database if needed
  await checkAndSeedDatabase();

  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});