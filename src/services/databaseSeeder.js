import { firestore } from '../firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';

const cuisines = [
  'Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese', 
  'Thai', 'French', 'Greek', 'Spanish', 'Lebanese',
  'Korean', 'Vietnamese', 'Turkish', 'Brazilian', 'Ethiopian',
  'Moroccan', 'Russian', 'German', 'Caribbean', 'Malaysian',
  'Persian', 'Indonesian', 'British', 'American', 'Canadian',
  'Argentine', 'Chilean', 'Peruvian', 'Syrian', 'Pakistani',
  'Sri Lankan', 'Kenyan', 'Nigerian', 'South African', 'Egyptian',
  'Australian', 'New Zealand', 'Swiss', 'Dutch', 'Swedish',
  'Norwegian', 'Danish', 'Belgian', 'Portuguese', 'Irish',
  'Scottish', 'Polish', 'Czech', 'Hungarian', 'Romanian',
  'Bulgarian', 'Serbian', 'Croatian', 'Bosnian', 'Slovenian'
];

const ingredients = [
  // Proteins
  'Chicken', 'Beef', 'Pork', 'Lamb', 'Fish', 'Shrimp', 'Tofu', 'Eggs', 
  'Turkey', 'Duck', 'Crab', 'Salmon', 'Tuna', 'Cod', 'Quinoa',

  // Vegetables
  'Tomato', 'Onion', 'Garlic', 'Potato', 'Carrot', 'Spinach', 'Broccoli', 
  'Cauliflower', 'Bell Pepper', 'Cucumber', 'Zucchini', 'Eggplant', 'Kale', 
  'Lettuce', 'Mushroom', 'Peas', 'Corn', 'Asparagus', 'Artichoke',

  // Fruits
  'Apple', 'Banana', 'Orange', 'Lemon', 'Lime', 'Strawberry', 'Blueberry', 
  'Mango', 'Pineapple', 'Avocado', 'Coconut', 'Grape', 'Peach', 'Pear',

  // Grains and Staples
  'Rice', 'Pasta', 'Bread', 'Flour', 'Noodles', 'Couscous', 'Bulgur', 
  'Polenta', 'Oats', 'Barley', 'Corn Tortilla', 'Wheat Tortilla',

  // Dairy and Alternatives
  'Milk', 'Cheese', 'Yogurt', 'Cream', 'Butter', 'Sour Cream', 'Almond Milk', 
  'Coconut Milk', 'Tofu', 'Tempeh',

  // Herbs and Spices
  'Salt', 'Pepper', 'Cumin', 'Paprika', 'Turmeric', 'Cinnamon', 'Ginger', 
  'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Cilantro', 'Parsley', 'Mint', 
  'Chili Powder', 'Curry Powder', 'Nutmeg', 'Cardamom'
];

async function seedDatabase() {
  const batch = writeBatch(firestore);

  // Seed Cuisines
  const cuisinesRef = collection(firestore, 'cuisines');
  cuisines.forEach((cuisine, index) => {
    const docRef = doc(cuisinesRef, `cuisine_${index + 1}`);
    batch.set(docRef, { 
      name: cuisine,
      id: `cuisine_${index + 1}`,
      createdAt: new Date()
    });
  });

  // Seed Ingredients
  const ingredientsRef = collection(firestore, 'ingredients');
  ingredients.forEach((ingredient, index) => {
    const docRef = doc(ingredientsRef, `ingredient_${index + 1}`);
    batch.set(docRef, { 
      name: ingredient,
      id: `ingredient_${index + 1}`,
      category: determineIngredientCategory(ingredient),
      createdAt: new Date()
    });
  });

  // Commit the batch
  await batch.commit();
  console.log('Database seeded successfully!');
}

function determineIngredientCategory(ingredient) {
  const proteinCategories = ['Chicken', 'Beef', 'Pork', 'Lamb', 'Fish', 'Shrimp', 'Tofu', 'Eggs', 'Turkey', 'Duck', 'Crab', 'Salmon', 'Tuna', 'Cod', 'Quinoa'];
  const vegetableCategories = ['Tomato', 'Onion', 'Garlic', 'Potato', 'Carrot', 'Spinach', 'Broccoli', 'Cauliflower', 'Bell Pepper', 'Cucumber', 'Zucchini', 'Eggplant', 'Kale', 'Lettuce', 'Mushroom', 'Peas', 'Corn', 'Asparagus', 'Artichoke'];
  const fruitCategories = ['Apple', 'Banana', 'Orange', 'Lemon', 'Lime', 'Strawberry', 'Blueberry', 'Mango', 'Pineapple', 'Avocado', 'Coconut', 'Grape', 'Peach', 'Pear'];
  const grainsCategories = ['Rice', 'Pasta', 'Bread', 'Flour', 'Noodles', 'Couscous', 'Bulgur', 'Polenta', 'Oats', 'Barley', 'Corn Tortilla', 'Wheat Tortilla'];
  const dairyCategories = ['Milk', 'Cheese', 'Yogurt', 'Cream', 'Butter', 'Sour Cream', 'Almond Milk', 'Coconut Milk', 'Tofu', 'Tempeh'];
  const herbsAndSpicesCategories = ['Salt', 'Pepper', 'Cumin', 'Paprika', 'Turmeric', 'Cinnamon', 'Ginger', 'Basil', 'Oregano', 'Thyme', 'Rosemary', 'Cilantro', 'Parsley', 'Mint', 'Chili Powder', 'Curry Powder', 'Nutmeg', 'Cardamom'];

  if (proteinCategories.includes(ingredient)) return 'Proteins';
  if (vegetableCategories.includes(ingredient)) return 'Vegetables';
  if (fruitCategories.includes(ingredient)) return 'Fruits';
  if (grainsCategories.includes(ingredient)) return 'Grains';
  if (dairyCategories.includes(ingredient)) return 'Dairy';
  if (herbsAndSpicesCategories.includes(ingredient)) return 'Herbs and Spices';
  
  return 'Other';
}

export default seedDatabase;