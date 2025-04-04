import Vue from 'vue';
import VueRouter from 'vue-router';
import { auth } from '../firebase';

import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import SavedRecipes from '../views/SavedRecipes.vue';
import MyRecipes from '../views/MyRecipes.vue';
import RecipeEditor from '../views/RecipeEditor.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/saved-recipes',
    name: 'SavedRecipes',
    component: SavedRecipes,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-recipes',
    name: 'MyRecipes',
    component: MyRecipes,
    meta: { requiresAuth: true }
  },
  {
    path: '/recipe-editor/:id?',
    name: 'RecipeEditor',
    component: RecipeEditor,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;
