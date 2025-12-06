import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/AuthCallbackView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/estoque',
      name: 'estoque',
      component: () => import('@/views/EstoqueView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/produto/novo',
      name: 'novo-produto',
      component: () => import('@/views/ProdutoFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/produto/detalhes/:id',
      name: 'detalhes-produto',
      component: () => import('@/views/ProdutoDetalhesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/produto/:id',
      name: 'editar-produto',
      component: () => import('@/views/ProdutoFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ]
})

// Guarda de navegação FIXADA
router.beforeEach((to, from, next) => {
  console.log(`[Router] ${from.path} -> ${to.path}`)

  // Rotas públicas que não requerem auth
  const publicRoutes = ['/login', '/auth/callback']
  if (publicRoutes.includes(to.path)) {
    next()
    return
  }

  // Verificar autenticação
  const hasAuth = () => {
    // Verificar usuário teste
    if (localStorage.getItem('test_user')) return true

    // Verificar token Supabase
    const supabaseToken = localStorage.getItem('supabase.auth.token') ||
                         localStorage.getItem('sb-pkjauvjkfvbwlebrsxxk-auth-token')
    return !!supabaseToken
  }

  if (to.meta.requiresAuth && !hasAuth()) {
    console.log('[Router] Acesso negado, redirecionando para login')
    next('/login')
  } else {
    next()
  }
})

export default router
