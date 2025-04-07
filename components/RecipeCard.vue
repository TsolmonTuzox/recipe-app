<template>
  <NuxtLink :to="'/recipes/' + recipe.id" class="recipe-card-link">
    <div class="recipe-card">
      <img v-if="recipe.imageUrl" :src="recipe.imageUrl" :alt="recipe.name" width="150" height="150">
      <h3>{{ recipe.name }}</h3>
      <p>{{ recipe.description }}</p>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.recipe-card-link {
  text-decoration: none;
  color: inherit; /* Prevent default link blue */
}
.recipe-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin: 10px;
  display: inline-block; /* Or use flex/grid layout */
  width: 200px; /* Example width */
  vertical-align: top;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out;
}
.recipe-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.recipe-card img {
  max-width: 100%;
  height: auto;
  display: block;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}
</style>
