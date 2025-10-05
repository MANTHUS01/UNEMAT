import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeFormView from '../views/RecipeFormView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Receitas Saudáveis' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login' }
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: RecipeFormView,
    meta: { 
      title: 'Nova Receita',
      requiresAuth: true
    }
  },
  {
    path: '/recipes/edit/:id',
    name: 'edit-recipe',
    component: RecipeFormView,
    meta: { 
      title: 'Editar Receita',
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: 'Sobre o Sistema' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guarda de rota - Verifica autenticação
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - Catálogo de Receitas` : 'Catálogo de Receitas'
  
  if (to.meta.requiresAuth) {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router