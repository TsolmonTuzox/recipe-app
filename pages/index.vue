<template>
  <div>
    <h1>Recipe Home Page</h1>
    <div v-if="loading">Loading recipes...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="recipe-list">
      <recipe-card
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
    </div>
</template>

<script>
// Import Firestore functions (v9 syntax)
import { collection, getDocs } from "firebase/firestore";
// RecipeCard is auto-imported by Nuxt 2

export default {
  name: 'IndexPage',
  // asyncData is called server-side (or client-side on navigation)
  // It receives the Nuxt context, including our injected 
  async asyncData({ $db, error: nuxtError }) {
    if (!$db) {
      nuxtError({ statusCode: 500, message: 'Firestore service () not available.' });
      return { recipes: [], loading: false, error: 'Database not configured.' };
    }
    try {
      console.log('Fetching recipes from Firestore...');
      const recipesCol = collection($db, 'recipes');
      const recipeSnapshot = await getDocs(recipesCol);
      const fetchedRecipes = recipeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched recipes:', fetchedRecipes.length);
      return { recipes: fetchedRecipes, loading: false, error: null };
    } catch (e) {
      console.error("Error fetching recipes: ", e);
      // Use Nuxt's error page helper
      nuxtError({ statusCode: 500, message: 'Could not fetch recipes. ' + e.message });
      return { recipes: [], loading: false, error: 'Could not fetch recipes.' };
    }
  },
  data() {
    // Initial state (will be overwritten by asyncData)
    return {
      recipes: [],
      loading: true, // Set initial loading state if needed (though asyncData runs first on server)
      error: null
    };
  },
  // You could also use fetch() hook if you prefer client-side fetching
  // or need access to 'this' (component instance)
}
</script>

<style scoped>
.recipe-list {
  margin-top: 20px;
  /* Add styles for layout if needed, e.g., using flexbox or grid */
  /* display: flex;
  flex-wrap: wrap;
  gap: 10px; */
}
</style>
