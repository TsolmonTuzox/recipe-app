import { db, auth } from './firebaseConfig';
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function getCurrentUserId() {
  return auth.currentUser ? auth.currentUser.uid : null;
}

async function addRecipe(recipeData) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not logged in");
  try {
    const docRef = await addDoc(collection(db, 'recipes'), {
      ...recipeData,
      createdBy: userId,
      createdAt: new Date(),
    });
    console.log("Recipe added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

async function getUserRecipes() {
  const userId = getCurrentUserId();
  if (!userId) return [];
  const q = query(collection(db, 'recipes'), where("createdBy", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function saveRecipeToFavorites(recipeId) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not logged in");
  const userDocRef = doc(db, 'users', userId);
  try {
    await updateDoc(userDocRef, {
      savedRecipes: arrayUnion(recipeId)
    });
    console.log(`Recipe ${recipeId} saved for user ${userId}`);
  } catch (e) {
    console.error("Error saving recipe: ", e);
    throw e;
  }
}

async function getSavedRecipeIds() {
    const userId = getCurrentUserId();
    if (!userId) return [];
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().savedRecipes) {
        return userDoc.data().savedRecipes;
    }
    return [];
}

async function getRecipesByIds(recipeIds) {
    if (!recipeIds || recipeIds.length === 0) return [];
    const q = query(collection(db, 'recipes'), where('__name__', 'in', recipeIds.slice(0, 10)));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export {
  addRecipe,
  getUserRecipes,
  saveRecipeToFavorites,
  getSavedRecipeIds,
  getRecipesByIds,
};
