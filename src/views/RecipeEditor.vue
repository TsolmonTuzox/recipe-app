<template>
  <div class="recipe-editor">
    <recipe-form 
      :recipeId="recipeId" 
      @saved="onSaved" 
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import RecipeForm from '@/components/RecipeForm.vue';

export default {
  name: 'RecipeEditor',
  components: {
    RecipeForm
  },
  computed: {
    recipeId() {
      return this.$route.params.id;
    }
  },
  methods: {
    onSaved() {
      this.$router.push('/my-recipes');
    },
    onCancel() {
      this.$router.push('/my-recipes');
    }
  }
};
</script>

<style scoped>
.recipe-editor {
  padding: 2rem;
}
</style>
