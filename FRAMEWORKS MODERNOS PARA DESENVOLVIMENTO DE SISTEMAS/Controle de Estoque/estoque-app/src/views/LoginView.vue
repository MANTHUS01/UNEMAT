<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <!-- Coluna do Slogan (visível apenas em telas médias e grandes) -->
      <v-col cols="12" md="6" class="hidden-sm-and-down">
        <div class="slogan-container pa-8">
          <!-- Logo Orion -->
          <div class="logo-container mb-8">
            <div class="logo-circle">
              <span class="logo-text">O</span>
            </div>
            <h1 class="logo-title">ORION</h1>
          </div>

          <!-- Slogan -->
          <div class="slogan-content">
            <h2 class="slogan-title mb-4">
              Controle de Estoque <span class="highlight">Inteligente</span>
            </h2>
            <p class="slogan-subtitle mb-6">
              Gerencie seu estoque com precisão, eficiência e visão de futuro.
              Tudo em um só lugar.
            </p>

            <!-- Recursos do sistema -->
            <v-list class="features-list" bg-color="transparent">
              <v-list-item class="feature-item">
                <template v-slot:prepend>
                  <v-icon color="primary" class="feature-icon">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="feature-text">Controle em tempo real do estoque</v-list-item-title>
              </v-list-item>
              <v-list-item class="feature-item">
                <template v-slot:prepend>
                  <v-icon color="blue" class="feature-icon">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="feature-text">Relatórios detalhados e exportáveis</v-list-item-title>
              </v-list-item>
              <v-list-item class="feature-item">
                <template v-slot:prepend>
                  <v-icon color="green" class="feature-icon">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="feature-text">Alertas automáticos de reposição</v-list-item-title>
              </v-list-item>
              <v-list-item class="feature-item">
                <template v-slot:prepend>
                  <v-icon color="orange" class="feature-icon">mdi-check-circle</v-icon>
                </template>
                <v-list-item-title class="feature-text">Interface intuitiva e responsiva</v-list-item-title>
              </v-list-item>
            </v-list>

            <!-- Elementos decorativos -->
            <div class="decoration-elements">
              <div class="circle circle-1"></div>
              <div class="circle circle-2"></div>
              <div class="star star-1">✦</div>
              <div class="star star-2">✦</div>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Coluna do Login -->
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6 login-card">
          <!-- Logo para mobile -->
          <div class="mobile-logo mb-4 d-md-none">
            <div class="logo-circle-small">
              <span class="logo-text">O</span>
            </div>
            <h2 class="logo-title-small">ORION</h2>
          </div>

          <v-card-title class="text-center mb-4">
            <h2 class="text-h4">Controle de Estoque</h2>
            <p class="text-body-1 text-grey mt-2">Faça login para continuar</p>
          </v-card-title>

          <v-card-text>
            <!-- Status de Redirecionamento -->
            <v-alert
              v-if="redirecting"
              type="info"
              class="mb-4"
            >
              Redirecionando para dashboard...
            </v-alert>

            <!-- Botão Google -->
            <v-btn
              color="blue darken-1"
              block
              size="large"
              @click="loginWithGoogle"
              :loading="loading"
              :disabled="redirecting"
              prepend-icon="mdi-google"
              class="mb-4"
            >
              <span class="text-white">Entrar com Google</span>
            </v-btn>

            <!-- Botão de Teste (sem auth) -->
            <v-btn
              color="green"
              block
              size="large"
              @click="loginTeste"
              :disabled="redirecting"
              prepend-icon="mdi-test-tube"
              variant="outlined"
              class="mb-4"
            >
              Entrar como Teste
            </v-btn>

            <!-- Botão de Debug -->
            <v-btn
              color="orange"
              block
              size="small"
              @click="showDebug = !showDebug"
              prepend-icon="mdi-bug"
              variant="text"
              class="mb-2"
            >
              {{ showDebug ? 'Ocultar Debug' : 'Mostrar Debug' }}
            </v-btn>

            <!-- Status -->
            <v-alert
              v-if="error"
              type="error"
              class="mt-4"
            >
              {{ error }}
            </v-alert>

            <!-- Painel de Debug -->
            <v-expansion-panels v-if="showDebug" class="mt-4">
              <v-expansion-panel>
                <v-expansion-panel-title>Informações de Debug</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="text-caption">
                    <p><strong>Status:</strong> {{ statusMessage }}</p>
                    <p><strong>Usuário:</strong> {{ authStore.user ? authStore.user.email : 'Nenhum' }}</p>
                    <p><strong>Redirecionando:</strong> {{ redirecting ? 'Sim' : 'Não' }}</p>
                    <p><strong>LocalStorage test_user:</strong> {{ hasTestUser ? 'Sim' : 'Não' }}</p>
                    <p><strong>LocalStorage supabase:</strong> {{ hasSupabaseToken ? 'Sim' : 'Não' }}</p>

                    <div class="d-flex flex-wrap gap-2 mt-2">
                      <v-btn
                        @click="forceLogin"
                        size="small"
                        variant="outlined"
                        color="primary"
                      >
                        Forçar Login Teste
                      </v-btn>

                      <v-btn
                        @click="clearAllStorage"
                        size="small"
                        variant="outlined"
                        color="error"
                      >
                        Limpar Tudo
                      </v-btn>

                      <v-btn
                        @click="goToDashboard"
                        size="small"
                        variant="outlined"
                        color="warning"
                      >
                        Ir para Dashboard
                      </v-btn>

                      <v-btn
                        @click="testGoogleOAuth"
                        size="small"
                        variant="outlined"
                        color="info"
                      >
                        Testar Google OAuth
                      </v-btn>
                    </div>

                    <v-alert
                      v-if="debugMessage"
                      :type="debugMessage.type"
                      density="compact"
                      class="mt-2"
                    >
                      {{ debugMessage.text }}
                    </v-alert>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

const authStore = useAuthStore()
const router = useRouter()
const redirecting = ref(false)
const showDebug = ref(false)
const debugMessage = ref(null)
const statusMessage = ref('Carregando...')
const loading = ref(false)
const error = ref(null)

// Computed properties
const hasTestUser = computed(() => {
  return !!localStorage.getItem('test_user')
})

const hasSupabaseToken = computed(() => {
  return !!localStorage.getItem('supabase.auth.token') ||
         !!localStorage.getItem('sb-pkjauvjkfvbwlebrsxxk-auth-token')
})

// Verificar autenticação inicial
const checkAuthStatus = async () => {
  console.log('=== VERIFICANDO STATUS DE AUTH ===')

  try {
    // 1. Verificar se há usuário teste
    if (hasTestUser.value) {
      console.log('Usuário teste encontrado no localStorage')
      const testUser = JSON.parse(localStorage.getItem('test_user'))

      // Verificar se o usuário teste ainda é válido
      if (testUser && testUser.id) {
        statusMessage.value = 'Usuário teste detectado'
        authStore.user = testUser
        startRedirect()
        return
      }
    }

    // 2. Verificar Supabase
    console.log('Verificando sessão Supabase...')
    const { data, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError)
      statusMessage.value = 'Erro na sessão'
      return
    }

    if (data.session) {
      console.log('Sessão Supabase ativa:', data.session.user.email)
      statusMessage.value = 'Usuário Supabase autenticado'
      authStore.user = data.session.user
      startRedirect()
      return
    }

    // 3. Nenhuma sessão ativa
    console.log('Nenhuma sessão ativa encontrada')
    statusMessage.value = 'Por favor, faça login'

  } catch (err) {
    console.error('Erro ao verificar auth status:', err)
    statusMessage.value = 'Erro ao verificar autenticação'
  }
}

// Iniciar redirecionamento
const startRedirect = () => {
  if (redirecting.value) return

  console.log('Iniciando redirecionamento para dashboard...')
  redirecting.value = true
  statusMessage.value = 'Redirecionando...'

  // Pequeno delay para mostrar o status
  setTimeout(() => {
    router.push('/dashboard')
  }, 500)
}

// Login com Google
const loginWithGoogle = async () => {
  if (redirecting.value) return

  try {
    loading.value = true
    error.value = null
    statusMessage.value = 'Iniciando login com Google...'

    console.log('Iniciando OAuth com PKCE...')

    // URL de callback para o Supabase processar
    const redirectUrl = `${window.location.origin}/auth/callback`
    console.log('Redirect URL configurada:', redirectUrl)

    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })

    if (oauthError) {
      console.error('Erro no OAuth:', oauthError)
      throw oauthError
    }

    console.log('OAuth iniciado, redirecionando para:', data.url)

    // O Supabase vai redirecionar automaticamente

  } catch (err) {
    console.error('Erro no login Google:', err)
    error.value = err.message || 'Erro ao conectar com Google'
    statusMessage.value = 'Erro no login'

    // Fallback: mostrar URL manualmente se houver erro
    if (err.message.includes('redirect')) {
      debugMessage.value = {
        type: 'warning',
        text: 'Configure o Site URL no Supabase Dashboard: http://localhost:3000'
      }
    }
  } finally {
    loading.value = false
  }
}

// Testar Google OAuth
const testGoogleOAuth = async () => {
  try {
    loading.value = true

    // Construir URL manualmente
    const siteUrl = 'https://pkjauvjkfvbwlebrsxxk.supabase.co'
    const redirectTo = encodeURIComponent('http://localhost:3000/auth/callback')
    const oauthUrl = `${siteUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`

    console.log('URL OAuth:', oauthUrl)

    // Abrir em nova janela
    window.open(oauthUrl, 'Google Login', 'width=600,height=700')

    debugMessage.value = {
      type: 'info',
      text: 'Janela de login aberta. Se for bloqueada, permita popups.'
    }

  } catch (err) {
    console.error('Erro teste OAuth:', err)
    debugMessage.value = {
      type: 'error',
      text: `Erro: ${err.message}`
    }
  } finally {
    loading.value = false
  }
}

// Login de teste
const loginTeste = () => {
  if (redirecting.value) return

  console.log('Criando usuário teste...')

  // Criar usuário falso
  const testUser = {
    id: 'test-' + Date.now(),
    email: 'teste@estoque.com',
    user_metadata: {
      full_name: 'Usuário Teste',
      avatar_url: 'https://ui-avatars.com/api/?name=Usuario+Teste&background=4CAF50&color=fff'
    },
    app_metadata: {
      provider: 'test'
    }
  }

  // Salvar
  authStore.user = testUser
  localStorage.setItem('test_user', JSON.stringify(testUser))

  debugMessage.value = {
    type: 'success',
    text: 'Usuário teste criado com sucesso!'
  }

  startRedirect()
}

// Forçar login (debug)
const forceLogin = () => {
  console.log('Forçando login teste...')
  loginTeste()
}

// Limpar tudo
const clearAllStorage = () => {
  console.log('Limpando todo o storage...')

  // Limpar localStorage
  localStorage.removeItem('test_user')
  localStorage.removeItem('supabase.auth.token')
  localStorage.removeItem('sb-pkjauvjkfvbwlebrsxxk-auth-token')

  // Limpar sessionStorage
  sessionStorage.clear()

  // Limpar state
  authStore.user = null

  // Limpar sessão Supabase
  supabase.auth.signOut()

  debugMessage.value = {
    type: 'info',
    text: 'Todos os dados foram limpos. Recarregando...'
  }

  // Recarregar
  setTimeout(() => {
    location.reload()
  }, 1000)
}

// Ir para dashboard (debug)
const goToDashboard = () => {
  console.log('Indo para dashboard...')
  router.push('/dashboard')
}

// Watcher para redirecionar quando o usuário for definido
watch(() => authStore.user, (newUser) => {
  if (newUser && !redirecting.value) {
    console.log('Usuário alterado, iniciando redirecionamento...')
    startRedirect()
  }
})

// Executar ao montar
onMounted(() => {
  console.log('=== LOGIN VIEW INICIADA ===')

  // Verificar auth status
  checkAuthStatus()

  // Configurar listener do Supabase
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state change:', event, session?.user?.email)

    if (event === 'SIGNED_IN' && session) {
      authStore.user = session.user
    }
  })
})
</script>

<style scoped>
/* Layout principal */
.fill-height {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Container do slogan */
.slogan-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
  padding: 0 48px !important;
}

/* Logo Orion */
.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}

.logo-circle {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.logo-text {
  font-size: 32px;
  font-weight: 900;
  color: #667eea;
}

.logo-title {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(to right, #ffffff, #e6e6e6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* Logo para mobile */
.mobile-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.logo-circle-small {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-title-small {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(to right, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Conteúdo do slogan */
.slogan-content {
  position: relative;
  z-index: 2;
}

.slogan-title {
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;
}

.highlight {
  background: linear-gradient(90deg, #ff7e5f, #feb47b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff7e5f, #feb47b);
  border-radius: 2px;
}

.slogan-subtitle {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  max-width: 400px;
}

/* Lista de recursos */
.features-list {
  background: transparent !important;
  margin-top: 24px;
}

.feature-item {
  padding-left: 0 !important;
  margin-bottom: 8px;
}

.feature-icon {
  margin-right: 12px;
}

.feature-text {
  color: white !important;
  font-size: 14px !important;
  opacity: 0.9;
}

/* Card de login */
.login-card {
  border-radius: 16px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Elementos decorativos */
.decoration-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: 50px;
  left: -75px;
  background: rgba(255, 255, 255, 0.05);
  animation-delay: -5s;
}

.star {
  position: absolute;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.3);
  animation: twinkle 3s infinite ease-in-out;
}

.star-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.star-2 {
  top: 60%;
  right: 25%;
  font-size: 24px;
  animation-delay: -1.5s;
}

/* Animações */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(20px, 20px) rotate(120deg);
  }
  66% {
    transform: translate(-15px, 15px) rotate(240deg);
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* Responsividade */
@media (max-width: 960px) {
  .slogan-title {
    font-size: 32px;
  }

  .slogan-subtitle {
    font-size: 14px;
  }

  .logo-circle {
    width: 60px;
    height: 60px;
  }

  .logo-text {
    font-size: 28px;
  }

  .logo-title {
    font-size: 36px;
  }
}

@media (max-width: 600px) {
  .login-card {
    border-radius: 12px !important;
    margin: 16px;
  }

  .mobile-logo {
    margin-bottom: 16px;
  }

  .logo-circle-small {
    width: 36px;
    height: 36px;
  }

  .logo-title-small {
    font-size: 24px;
  }
}

/* Utilidades */
.gap-2 {
  gap: 8px;
}

.d-flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.text-white {
  color: white !important;
}

/* Efeitos de hover no card */
.login-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25) !important;
  transition: all 0.3s ease;
}

/* Estilização dos botões dentro do card */
.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
