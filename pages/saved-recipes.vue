<template>
  <div>
    <h1>My Saved Recipes</h1>
    <p>List of recipes saved/favorited by the logged-in user...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { getSavedRecipes } from '@/firebaseService';

const savedRecipes = ref([]);

onMounted(async () => {
  // savedRecipes.value = await getSavedRecipes();
  console.log('Fetching saved recipes...');
});
</script>

<style scoped lang="scss">
h1 {
  color: green;
}
</style>
