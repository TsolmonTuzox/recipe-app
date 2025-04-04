<template>
  <div class="search-filters">
    <div class="search-bar">
      <input 
        v-model="filters.searchTerm" 
        type="text" 
        placeholder="Search recipes..."
        @input="emitFilterChange"
      />
    </div>
    
    <div class="filter-options">
      <div class="filter-group">
        <label for="cuisine">Cuisine</label>
        <select 
          id="cuisine" 
          v-model="filters.cuisine"
          @change="emitFilterChange"
        >
          <option value="">All Cuisines</option>
          <option 
            v-for="cuisine in cuisines" 
            :key="cuisine" 
            :value="cuisine"
          >
            {{ cuisine }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="ingredients">Ingredients (comma separated)</label>
        <input 
          id="ingredients" 
          v-model="ingredientsInput" 
          type="text" 
          placeholder="e.g. tomato, cheese, basil"
          @input="updateIngredients"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilters',
  props: {
    cuisines: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filters: {
        searchTerm: '',
        cuisine: '',
        ingredients: []
      },
      ingredientsInput: ''
    };
  },
  methods: {
    updateIngredients() {
      this.filters.ingredients = this.ingredientsInput
        .split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient !== '');
      
      this.emitFilterChange();
    },
    emitFilterChange() {
      this.$emit('filter-change', { ...this.filters });
    }
  }
};
</script>

<style scoped>
.search-filters {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-bar {
  margin-bottom: 1rem;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filter-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

select, input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .filter-options {
    grid-template-columns: 1fr;
  }
}
</style>
