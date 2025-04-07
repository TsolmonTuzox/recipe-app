<template>
  <div class="recipe-detail-container" v-if="recipe">
    <h1>{{ recipe.name }}</h1>
    <img v-if="recipe.imageUrl" :src="recipe.imageUrl" :alt="recipe.name" class="recipe-image">
    <p><strong>Cuisine:</strong> {{ recipe.cuisine || 'N/A' }}</p>
    <p>{{ recipe.description }}</p>

    <div v-if="recipe.ingredients && recipe.ingredients.length">
      <h2>Ingredients</h2>
      <ul>
        <li v-for="(ingredient, index) in recipe.ingredients" :key="'ing-'+index">
          {{ ingredient }}
        </li>
      </ul>
    </div>

    <div v-if="recipe.instructions && recipe.instructions.length">
      <h2>Instructions</h2>
      <ol> <li v-for="(instruction, index) in recipe.instructions" :key="'ins-'+index">
          {{ instruction }}
        </li>
      </ol> </div>

    <NuxtLink to="/">Back to Recipes</NuxtLink>
  </div>
  <div v-else-if="loading">Loading recipe details...</div>
  <div v-else>
     <p>{{ error || 'Recipe not found.' }}</p>
     <NuxtLink to="/">Back to Recipes</NuxtLink>
  </div>
</template>

<script>
import { doc, getDoc } from "firebase/firestore";

export default {
  name: 'RecipeDetailPage',
  async asyncData({ params, $db, error: nuxtError }) {
    const recipeId = params.id; // Get the ID from the route parameter
    if (!$db) {
      nuxtError({ statusCode: 500, message: 'Firestore service () not available.' });
      return { recipe: null, loading: false, error: 'Database not configured.' };
    }

    try {
      console.log(`Workspaceing recipe with ID: ${recipeId}`);
      const recipeRef = doc($db, "recipes", recipeId);
      const recipeSnap = await getDoc(recipeRef);

      if (recipeSnap.exists()) {
        console.log("Recipe data:", recipeSnap.data());
        return { recipe: { id: recipeSnap.id, ...recipeSnap.data() }, loading: false, error: null };
      } else {
        console.log("No such recipe!");
        nuxtError({ statusCode: 404, message: 'Recipe not found' });
        return { recipe: null, loading: false, error: 'Recipe not found.' };
      }
    } catch (e) {
      console.error("Error fetching recipe details: ", e);
      nuxtError({ statusCode: 500, message: 'Could not fetch recipe details. ' + e.message });
      return { recipe: null, loading: false, error: 'Could not fetch recipe details.' };
    }
  },
  data() {
    // Initial state (overwritten by asyncData)
    return {
      recipe: null,
      loading: true,
      error: null
    };
  },
  head() {
    // Set the page title dynamically
    return {
      title: this.recipe ? this.recipe.name : 'Recipe Detail'
    }
  }
}
</script>

<style scoped>
.recipe-detail-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.recipe-image {
  max-width: 100%;
  max-height: 400px;
  display: block;
  margin: 15px auto;
}
h1, h2 {
  margin-bottom: 10px;
}
ul, ol {
  margin-left: 20px;
  margin-bottom: 15px;
}
li {
  margin-bottom: 5px;
}
</style>
