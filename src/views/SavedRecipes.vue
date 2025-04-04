<template>
  <div class="saved-recipes">
    <h1>Saved Recipes</h1>
    
    <div v-if="loading" class="loading">Loading your saved recipes...</div>
    
    <div v-else-if="recipes.length === 0" class="empty-state">
      <p>You haven't saved any recipes yet.</p>
      <router-link to="/" class="browse-btn">Browse Recipes</router-link>
    </div>
    
    <div v-else class="recipes-grid">
      <recipe-card 
        v-for="recipe in recipes" 
        :key="recipe.id" 
        :recipe="recipe"
        @view-recipe="showRecipeDetail"
      />
    </div>
    
    <recipe-detail 
      v-if="selectedRecipe" 
      :recipe="selectedRecipe"
      @close="selectedRecipe = null"
    />
  </div>
</template>

<script>
import RecipeCard from '@/components/RecipeCard.vue';
import RecipeDetail from '@/components/RecipeDetail.vue';
import recipeService from '@/services/recipeService';

export default {
  name: 'SavedRecipes',
  components: {
    RecipeCard,
    RecipeDetail
  },
  data() {
    return {
      recipes: [],
      selectedRecipe: null,
      loading: true
    };
  },
  async created() {
    await this.fetchSavedRecipes();
  },
  methods: {
    async fetchSavedRecipes() {
      this.loading = true;
      try {
        this.recipes = await recipeService.getSavedRecipes();
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      } finally {
        this.loading = false;
      }
    },
    showRecipeDetail(recipe) {
      this.selectedRecipe = recipe;
    }
  }
};
</script>

<style scoped>
.saved-recipes {
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: #666;
}

.browse-btn {
  display: inline-block;
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}
</style>
