<template>
  <div class="recipe-card">
    <img :src="recipe.imageUrl" :alt="recipe.title" class="recipe-image" />
    <div class="recipe-content">
      <h3>{{ recipe.title }}</h3>
      <p class="recipe-cuisine">{{ recipe.cuisine }}</p>
      <p class="recipe-description">{{ truncatedDescription }}</p>
      <div class="recipe-actions">
        <button @click="viewRecipe" class="view-button">View Recipe</button>
        <button 
          v-if="isLoggedIn" 
          @click="toggleSaveRecipe" 
          class="save-button"
          :class="{ 'saved': isSaved }"
        >
          {{ isSaved ? 'Unsave' : 'Save Recipe' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import recipeService from '../services/recipeService';

export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLoggedIn: false,
      isSaved: false
    };
  },
  computed: {
    truncatedDescription() {
      return this.recipe.description.length > 100 
        ? this.recipe.description.substring(0, 100) + '...' 
        : this.recipe.description;
    }
  },
  created() {
    onAuthStateChanged(auth, async user => {
      this.isLoggedIn = !!user;
      if (this.isLoggedIn) {
        this.checkIfSaved();
      }
    });
  },
  methods: {
    viewRecipe() {
      this.$emit('view-recipe', this.recipe);
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

<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';

.recipe-card {
  border-radius: 8px;
  overflow: hidden;
  @include box-shadow;
  background-color: $white;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  &-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  &-content {
    padding: 1rem;

    .recipe-cuisine {
      color: darken($background-color, 50%);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }

    .recipe-description {
      margin-bottom: 1rem;
      color: $text-color;
    }
  }

  &-actions {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    .view-button {
      background-color: $primary-color;
      color: $white;
    }

    .save-button {
      background-color: $secondary-color;
      color: $white;

      &.saved {
        background-color: #f44336;
      }
    }
  }
}</style>
</style>
