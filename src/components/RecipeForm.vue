<template>
  <div class="recipe-form">
    <h2>{{ isEditing ? 'Edit Recipe' : 'Create New Recipe' }}</h2>
    <form @submit.prevent="saveRecipe">
      <div class="form-group">
        <label for="title">Recipe Title</label>
        <input 
          id="title" 
          v-model="recipe.title" 
          type="text" 
          required
        />
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="recipe.description" 
          rows="3" 
          required
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="cuisine">Cuisine</label>
        <input 
          id="cuisine" 
          v-model="recipe.cuisine" 
          type="text" 
          required
        />
      </div>
      
      <div class="form-group">
        <label for="imageUrl">Image URL</label>
        <input 
          id="imageUrl" 
          v-model="recipe.imageUrl" 
          type="url" 
          required
        />
      </div>
      
      <div class="form-group">
        <label>Ingredients</label>
        <div 
          v-for="(ingredient, index) in recipe.ingredients" 
          :key="index"
          class="ingredient-row"
        >
          <input 
            v-model="ingredient.quantity" 
            type="text" 
            placeholder="Quantity" 
          />
          <input 
            v-model="ingredient.unit" 
            type="text" 
            placeholder="Unit" 
          />
          <input 
            v-model="ingredient.name" 
            type="text" 
            placeholder="Ingredient name" 
            required
          />
          <button 
            type="button" 
            @click="removeIngredient(index)"
            class="remove-btn"
          >
            &times;
          </button>
        </div>
        <button 
          type="button" 
          @click="addIngredient"
          class="add-btn"
        >
          Add Ingredient
        </button>
      </div>
      
      <div class="form-group">
        <label for="instructions">Instructions</label>
        <textarea 
          id="instructions" 
          v-model="recipe.instructions" 
          rows="6" 
          required
        ></textarea>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="cancel" class="cancel-btn">Cancel</button>
        <button type="submit" class="save-btn">Save Recipe</button>
      </div>
    </form>
  </div>
</template>

<script>
import recipeService from '@/services/recipeService';

export default {
  name: 'RecipeForm',
  props: {
    recipeId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      recipe: {
        title: '',
        description: '',
        cuisine: '',
        imageUrl: '',
        ingredients: [],
        instructions: ''
      },
      isEditing: false
    };
  },
  async created() {
    if (this.recipeId) {
      this.isEditing = true;
      try {
        const recipe = await recipeService.getRecipe(this.recipeId);
        if (recipe) {
          this.recipe = recipe;
        }
      } catch (error) {
        console.error('Error fetching recipe for editing:', error);
      }
    } else {
      this.addIngredient(); // Add one empty ingredient by default
    }
  },
  methods: {
    addIngredient() {
      this.recipe.ingredients.push({
        quantity: '',
        unit: '',
        name: ''
      });
    },
    removeIngredient(index) {
      this.recipe.ingredients.splice(index, 1);
    },
    async saveRecipe() {
      try {
        if (this.isEditing) {
          await recipeService.updateRecipe(this.recipeId, this.recipe);
        } else {
          await recipeService.createRecipe(this.recipe);
        }
        this.$emit('saved');
      } catch (error) {
        console.error('Error saving recipe:', error);
      }
    },
    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>
.recipe-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.ingredient-row {
  display: grid;
  grid-template-columns: 1fr 1fr 3fr auto;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.remove-btn {
  background-color: #f44336;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  border: none;
}

.add-btn {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  background-color: #9e9e9e;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background-color: #2196f3;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
