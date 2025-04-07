<template>
  <div>
    <h1>My Created Recipes</h1>
    <p>List of recipes created by the logged-in user...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { getUserRecipes } from '@/firebaseService';

const myRecipes = ref([]);

onMounted(async () => {
  // myRecipes.value = await getUserRecipes();
  console.log('Fetching my recipes...');
});
</script>

<style scoped lang="scss">
h1 {
  color: blue;
}
</style>
