<template>
  <div class="recipe-detail-overlay" @click.self="close">
    <div class="recipe-detail">
      <button @click="close" class="close-btn">&times;</button>
      
      <div class="recipe-header">
        <img :src="recipe.imageUrl" :alt="recipe.title" class="recipe-image" />
        <div class="recipe-info">
          <h2>{{ recipe.title }}</h2>
          <p class="recipe-cuisine">{{ recipe.cuisine }}</p>
          <p class="recipe-description">{{ recipe.description }}</p>
          
          <button 
            v-if="isLoggedIn && !isUserRecipe" 
            @click="toggleSaveRecipe" 
            class="save-button"
            :class="{ 'saved': isSaved }"
          >
            {{ isSaved ? 'Unsave' : 'Save Recipe' }}
          </button>
        </div>
      </div>
      
      <div class="recipe-content">
        <div class="ingredients-section">
          <h3>Ingredients</h3>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
              <span v-if="ingredient.quantity">{{ ingredient.quantity }}</span>
              <span v-if="ingredient.unit"> {{ ingredient.unit }}</span>
              <span> {{ ingredient.name }}</span>
            </li>
          </ul>
        </div>
        
        <div class="instructions-section">
          <h3>Instructions</h3>
          <div class="instructions">
            {{ recipe.instructions }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import recipeService from '../services/recipeService';

export default {
  name: 'RecipeDetail',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLoggedIn: false,
      isSaved: false,
      isUserRecipe: false
    };
  },
  created() {
    onAuthStateChanged(auth, async user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.checkIfSaved();
        this.isUserRecipe = this.recipe.userId === user.uid;
      }
    });
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async checkIfSaved() {
      if (!this.isLoggedIn) return;
      this.isSaved = await recipeService.isRecipeSaved(this.recipe.id);
    },
    async toggleSaveRecipe() {
      if (!this.isLoggedIn) {
        this.$router.push('/login');
        return;
      }
      
      try {
        if (this.isSaved) {
          await recipeService.unsaveRecipe(this.recipe.id);
        } else {
          await recipeService.saveRecipe(this.recipe.id);
        }
        this.isSaved = !this.isSaved;
      } catch (error) {
        console.error('Error toggling save recipe:', error);
      }
    }
  }
};
</script>

<style scoped>
.recipe-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.recipe-detail {
  background-color: white;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
  position: relative;
  padding: 2rem;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.recipe-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.recipe-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.recipe-info h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.recipe-cuisine {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.recipe-description {
  margin-bottom: 1.5rem;
}

.save-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  background-color: #ff9800;
  color: white;
}

.save-button.saved {
  background-color: #f44336;
}

.recipe-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.ingredients-section, .instructions-section {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.ingredients-list {
  list-style-type: none;
  padding: 0;
}

.ingredients-list li {
  margin-bottom: 0.5rem;
}

.instructions {
  white-space: pre-line;
}

@media (max-width: 768px) {
  .recipe-header, .recipe-content {
    grid-template-columns: 1fr;
  }
}
</style>
