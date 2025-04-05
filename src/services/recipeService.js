import { firestore, auth } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  collectionGroup
} from 'firebase/firestore';

// Collection references
const recipesCollection = collection(firestore, 'recipes');
const savedRecipesCollection = collection(firestore, 'savedRecipes');
const cuisinesCollection = collection(firestore, 'cuisines');
const ingredientsCollection = collection(firestore, 'ingredients');

export default {
  // Get all recipes with filtering and pagination
  async getRecipes(filters = {}, pageSize = 12, lastVisible = null) {
    try {
      let recipeQuery = query(recipesCollection, orderBy('createdAt', 'desc'));
      
      // Apply filters
      if (filters.searchTerm) {
        // Firebase doesn't support full-text search natively
        // We'll filter client-side for the search term
      }
      
      // Filter by cuisine
      if (filters.cuisine) {
        recipeQuery = query(recipeQuery, where('cuisine', '==', filters.cuisine));
      }
      
      // Filter by cooking time
      if (filters.maxCookingTime) {
        recipeQuery = query(recipeQuery, where('cookingTime', '<=', filters.maxCookingTime));
      }

      // For ingredients, we'll filter client side since Firebase doesn't support array contains any with multiple values easily

      // Apply pagination
      if (lastVisible) {
        recipeQuery = query(recipeQuery, startAfter(lastVisible), limit(pageSize));
      } else {
        recipeQuery = query(recipeQuery, limit(pageSize));
      }
      
      // Execute query
      const snapshot = await getDocs(recipeQuery);
      const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
      
      let recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Client-side filtering for search term
      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        recipes = recipes.filter(recipe => 
          recipe.title.toLowerCase().includes(searchTermLower) || 
          recipe.description.toLowerCase().includes(searchTermLower)
        );
      }
      
      // Client-side filtering for ingredients
      if (filters.ingredients && filters.ingredients.length > 0) {
        recipes = recipes.filter(recipe => 
          filters.ingredients.every(ingredient => 
            recipe.ingredients.some(i => 
              i.name.toLowerCase().includes(ingredient.toLowerCase())
            )
          )
        );
      }
      
      return { 
        recipes, 
        lastVisible: lastVisibleDoc,
        hasMore: snapshot.docs.length === pageSize
      };
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Failed to fetch recipes. Please try again.');
    }
  },

  // Get popular recipes (most saved)
  async getPopularRecipes(limit = 5) {
    try {
      // Count saves for each recipe
      const snapshot = await getDocs(savedRecipesCollection);
      const recipeCountMap = {};
      
      snapshot.docs.forEach(doc => {
        const recipeId = doc.data().recipeId;
        recipeCountMap[recipeId] = (recipeCountMap[recipeId] || 0) + 1;
      });
      
      // Sort recipes by save count
      const popularRecipeIds = Object.keys(recipeCountMap)
        .sort((a, b) => recipeCountMap[b] - recipeCountMap[a])
        .slice(0, limit);
      
      if (popularRecipeIds.length === 0) return [];
      
      // Fetch recipe details
      const recipes = await Promise.all(
        popularRecipeIds.map(id => this.getRecipe(id))
      );
      
      return recipes.filter(Boolean); // Filter out any null values if recipe was deleted
    } catch (error) {
      console.error('Error fetching popular recipes:', error);
      throw new Error('Failed to fetch popular recipes. Please try again.');
    }
  },

  // Search recipes with autocomplete
  async searchRecipes(term, limit = 5) {
    try {
      if (!term || term.length < 2) return [];
      
      const termLower = term.toLowerCase();
      const snapshot = await getDocs(recipesCollection);
      
      // Client-side filtering for search term (simulating autocomplete)
      const matches = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(recipe => 
          recipe.title.toLowerCase().includes(termLower) ||
          recipe.description.toLowerCase().includes(termLower) ||
          recipe.cuisine.toLowerCase().includes(termLower) ||
          recipe.ingredients.some(i => i.name.toLowerCase().includes(termLower))
        )
        .slice(0, limit);
        
      return matches;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw new Error('Search failed. Please try again.');
    }
  },

  // Get all available cuisines
  async getCuisines() {
    try {
      const snapshot = await getDocs(cuisinesCollection);
      return snapshot.docs.map(doc => doc.data().name);
    } catch (error) {
      console.error('Error fetching cuisines:', error);
      throw new Error('Failed to fetch cuisines. Please try again.');
    }
  },

  // Get all available ingredients
  async getIngredients() {
    try {
      const snapshot = await getDocs(ingredientsCollection);
      return snapshot.docs.map(doc => ({ 
        name: doc.data().name,
        category: doc.data().category
      }));
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw new Error('Failed to fetch ingredients. Please try again.');
    }
  },

  // Get a single recipe by ID
  async getRecipe(id) {
    try {
      const docRef = doc(firestore, 'recipes', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      throw new Error('Failed to fetch recipe details. Please try again.');
    }
  },

  // Create a new recipe
  async createRecipe(recipeData) {
    try {
      const userId = auth.currentUser.uid;
      const recipe = {
        ...recipeData,
        userId,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(recipesCollection, recipe);
      return { id: docRef.id, ...recipe };
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw new Error('Failed to create recipe. Please try again.');
    }
  },

  // Update an existing recipe
  async updateRecipe(id, recipeData) {
    try {
      const docRef = doc(firestore, 'recipes', id);
      await updateDoc(docRef, recipeData);
      return { id, ...recipeData };
    } catch (error) {
      console.error(`Error updating recipe ${id}:`, error);
      throw new Error('Failed to update recipe. Please try again.');
    }
  },

  // Delete a recipe
  async deleteRecipe(id) {
    try {
      const docRef = doc(firestore, 'recipes', id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error(`Error deleting recipe ${id}:`, error);
      throw new Error('Failed to delete recipe. Please try again.');
    }
  },

  // Save a recipe to user's favorites
  async saveRecipe(recipeId) {
    try {
      const userId = auth.currentUser.uid;
      await addDoc(savedRecipesCollection, {
        userId,
        recipeId,
        savedAt: serverTimestamp()
      });
    } catch (error) {
      console.error(`Error saving recipe ${recipeId}:`, error);
      throw new Error('Failed to save recipe. Please try again.');
    }
  },

  // Remove a recipe from user's favorites
  async unsaveRecipe(recipeId) {
    try {
      const userId = auth.currentUser.uid;
      const q = query(
        savedRecipesCollection,
        where('userId', '==', userId),
        where('recipeId', '==', recipeId)
      );
      
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error(`Error removing recipe ${recipeId} from favorites:`, error);
      throw new Error('Failed to remove recipe from favorites. Please try again.');
    }
  },

  // Get user's saved recipes
  async getSavedRecipes() {
    try {
      const userId = auth.currentUser.uid;
      const q = query(savedRecipesCollection, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      const savedRecipeIds = snapshot.docs.map(doc => doc.data().recipeId);
      
      if (savedRecipeIds.length === 0) return [];
      
      const recipes = await Promise.all(savedRecipeIds.map(id => this.getRecipe(id)));
      return recipes.filter(Boolean); // Filter out any null values if recipe was deleted
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      throw new Error('Failed to fetch saved recipes. Please try again.');
    }
  },

  // Get user's own recipes
  async getUserRecipes() {
    try {
      const userId = auth.currentUser.uid;
      const q = query(recipesCollection, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      throw new Error('Failed to fetch your recipes. Please try again.');
    }
  },

  // Check if a recipe is saved by current user
  async isRecipeSaved(recipeId) {
    try {
      const userId = auth.currentUser.uid;
      const q = query(
        savedRecipesCollection,
        where('userId', '==', userId),
        where('recipeId', '==', recipeId)
      );
      
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error) {
      console.error(`Error checking if recipe ${recipeId} is saved:`, error);
      return false; // Default to not saved in case of error
    }
  }
};
