<template>
  <div class="my-recipes">
    <div class="header">
      <h1>My Recipes</h1>
      <button @click="createRecipe" class="create-btn">Create New Recipe</button>
    </div>
    
    <div v-if="loading" class="loading">Loading your recipes...</div>
    
    <div v-else-if="recipes.length === 0" class="empty-state">
      <p>You haven't created any recipes yet.</p>
      <button @click="createRecipe" class="create-btn">Create Your First Recipe</button>
    </div>
    
    <div v-else class="recipes-grid">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
        <recipe-card 
          :recipe="recipe" 
          @view-recipe="viewRecipe"
        />
        <div class="card-actions">
          <button @click="editRecipe(recipe)" class="edit-btn">Edit</button>
          <button @click="deleteRecipe(recipe)" class="delete-btn">Delete</button>
        </div>
      </div>
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
  name: 'MyRecipes',
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
    await this.fetchRecipes();
  },
  methods: {
    async fetchRecipes() {
      this.loading = true;
      try {
        this.recipes = await recipeService.getUserRecipes();
      } catch (error) {
        console.error('Error fetching user recipes:', error);
      } finally {
        this.loading = false;
      }
    },
    createRecipe() {
      this.$router.push('/recipe-editor');
    },
    editRecipe(recipe) {
      this.$router.push(`/recipe-editor/${recipe.id}`);
    },
    viewRecipe(recipe) {
      this.selectedRecipe = recipe;
    },
    async deleteRecipe(recipe) {
      if (!confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
        return;
      }
      
      try {
        await recipeService.deleteRecipe(recipe.id);
        this.recipes = this.recipes.filter(r => r.id !== recipe.id);
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  }
};
</script>

<style scoped>
.my-recipes {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-btn {
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-state p {
  margin-bottom: 1.5rem;
  color: #666;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.recipe-card {
  display: flex;
  flex-direction: column;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.edit-btn, .delete-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.edit-btn {
  background-color: #2196f3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}
</style>
