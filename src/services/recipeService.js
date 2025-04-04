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
  serverTimestamp 
} from 'firebase/firestore';

const recipesCollection = collection(firestore, 'recipes');
const savedRecipesCollection = collection(firestore, 'savedRecipes');

export default {
  // Get all recipes
  async getRecipes() {
    const snapshot = await getDocs(recipesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Get a single recipe by ID
  async getRecipe(id) {
    const docRef = doc(firestore, 'recipes', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() };
  },

  // Create a new recipe
  async createRecipe(recipeData) {
    const userId = auth.currentUser.uid;
    const recipe = {
      ...recipeData,
      userId,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(recipesCollection, recipe);
    return { id: docRef.id, ...recipe };
  },

  // Update an existing recipe
  async updateRecipe(id, recipeData) {
    const docRef = doc(firestore, 'recipes', id);
    await updateDoc(docRef, recipeData);
    return { id, ...recipeData };
  },

  // Delete a recipe
  async deleteRecipe(id) {
    const docRef = doc(firestore, 'recipes', id);
    await deleteDoc(docRef);
    return id;
  },

  // Save a recipe to user's favorites
  async saveRecipe(recipeId) {
    const userId = auth.currentUser.uid;
    await addDoc(savedRecipesCollection, {
      userId,
      recipeId,
      savedAt: serverTimestamp()
    });
  },

  // Remove a recipe from user's favorites
  async unsaveRecipe(recipeId) {
    const userId = auth.currentUser.uid;
    const q = query(
      savedRecipesCollection,
      where('userId', '==', userId),
      where('recipeId', '==', recipeId)
    );
    
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  },

  // Get user's saved recipes
  async getSavedRecipes() {
    const userId = auth.currentUser.uid;
    const q = query(savedRecipesCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    const savedRecipeIds = snapshot.docs.map(doc => doc.data().recipeId);
    
    if (savedRecipeIds.length === 0) return [];
    
    const promises = savedRecipeIds.map(id => this.getRecipe(id));
    return Promise.all(promises);
  },

  // Get user's own recipes
  async getUserRecipes() {
    const userId = auth.currentUser.uid;
    const q = query(recipesCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Check if a recipe is saved by current user
  async isRecipeSaved(recipeId) {
    const userId = auth.currentUser.uid;
    const q = query(
      savedRecipesCollection,
      where('userId', '==', userId),
      where('recipeId', '==', recipeId)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }
};
