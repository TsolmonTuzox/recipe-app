<template>
  <div class="home">
    <search-filters 
      @filter-change="applyFilters" 
      :cuisines="availableCuisines"
    />
    
    <div class="recipes-grid">
      <recipe-card 
        v-for="recipe in filteredRecipes" 
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
import SearchFilters from '@/components/SearchFilters.vue';
import recipeService from '@/services/recipeService';

export default {
  name: 'HomePage',
  components: {
    RecipeCard,
    RecipeDetail,
    SearchFilters
  },
  data() {
    return {
      recipes: [],
      selectedRecipe: null,
      filters: {
        searchTerm: '',
        cuisine: '',
        ingredients: []
      },
      availableCuisines: []
    };
  },
  computed: {
    filteredRecipes() {
      let result = [...this.recipes];
      
      // Filter by search term
      if (this.filters.searchTerm) {
        const term = this.filters.searchTerm.toLowerCase();
        result = result.filter(recipe => 
          recipe.title.toLowerCase().includes(term) || 
          recipe.description.toLowerCase().includes(term)
        );
      }
      
      // Filter by cuisine
      if (this.filters.cuisine) {
        result = result.filter(recipe => 
          recipe.cuisine === this.filters.cuisine
        );
      }
      
      // Filter by ingredients
      if (this.filters.ingredients.length > 0) {
        result = result.filter(recipe => 
          this.filters.ingredients.every(ingredient => 
            recipe.ingredients.some(i => 
              i.name.toLowerCase().includes(ingredient.toLowerCase())
            )
          )
        );
      }
      
      return result;
    }
  },
  async created() {
    try {
      this.recipes = await recipeService.getRecipes();
      
      // Extract available cuisines
      this.availableCuisines = [...new Set(
        this.recipes.map(recipe => recipe.cuisine)
      )];
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  },
  methods: {
    showRecipeDetail(recipe) {
      this.selectedRecipe = recipe;
    },
    applyFilters(filters) {
      this.filters = { ...filters };
    }
  }
};
</script>

<style scoped>
.home {
  padding: 2rem;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
</style>
