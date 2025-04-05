import { firestore } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

async function checkDatabaseContents() {
  try {
    // Check Cuisines
    const cuisinesRef = collection(firestore, 'cuisines');
    const cuisinesSnapshot = await getDocs(cuisinesRef);
    console.log('Cuisines Count:', cuisinesSnapshot.size);
    
    // Check Ingredients
    const ingredientsRef = collection(firestore, 'ingredients');
    const ingredientsSnapshot = await getDocs(ingredientsRef);
    console.log('Ingredients Count:', ingredientsSnapshot.size);

    // Optionally log the first few items
    console.log('First Cuisine:', 
      cuisinesSnapshot.docs.length > 0 ? cuisinesSnapshot.docs[0].data().name : 'No cuisines'
    );
    console.log('First Ingredient:', 
      ingredientsSnapshot.docs.length > 0 ? ingredientsSnapshot.docs[0].data().name : 'No ingredients'
    );
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

export default checkDatabaseContents;