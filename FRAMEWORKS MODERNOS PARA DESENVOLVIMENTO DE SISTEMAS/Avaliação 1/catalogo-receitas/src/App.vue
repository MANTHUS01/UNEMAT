<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title class="font-weight-bold">
        🥗 Catálogo de Receitas Saudáveis
      </v-toolbar-title>
      
      <v-spacer></v-spacer>

      <!-- Informações do usuário logado -->
      <div v-if="currentUser" class="d-flex align-center mr-4">
        <v-icon class="mr-2">mdi-account</v-icon>
        <span class="text-caption">{{ currentUser.name }}</span>
      </div>

      <!-- Navegação -->
      <v-btn 
        icon 
        to="/" 
        title="Página inicial"
        :class="{ 'active-route': $route.name === 'home' }"
      >
        <v-icon>mdi-home</v-icon>
      </v-btn>
      
      <v-btn 
        icon 
        :to="currentUser ? '/recipes' : '/login'" 
        :title="currentUser ? 'Nova Receita' : 'Fazer Login'"
        :class="{ 'active-route': $route.name === 'recipes' }"
      >
        <v-icon>mdi-book-plus</v-icon>
      </v-btn>
      
      <v-btn 
        icon 
        to="/about" 
        title="Sobre"
        :class="{ 'active-route': $route.name === 'about' }"
      >
        <v-icon>mdi-information</v-icon>
      </v-btn>

      <!-- Botão Login/Logout -->
      <v-btn 
        v-if="!currentUser"
        to="/login" 
        variant="text"
        class="ml-2"
      >
        <v-icon start>mdi-login</v-icon>
        Login
      </v-btn>
      
      <v-btn 
        v-else
        @click="logout" 
        variant="text"
        class="ml-2"
      >
        <v-icon start>mdi-logout</v-icon>
        Sair
      </v-btn>

      <!-- Toggle de tema -->
      <v-switch
        v-model="isDark"
        inset
        :prepend-icon="isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
        hide-details
        class="ml-4"
        color="secondary"
        @change="toggleTheme"
      ></v-switch>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <!-- Snackbar global para feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      :color="snackbar.color"
      location="bottom right"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isDark: false,
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      currentUser: null
    }
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.global.name = this.isDark ? 'dark' : 'light'
      localStorage.setItem('darkTheme', this.isDark)
    },
    showSnackbar(message, color = 'success') {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.show = true
    },
    logout() {
      localStorage.removeItem('currentUser')
      this.currentUser = null
      this.showSnackbar('Logout realizado com sucesso!')
      this.$router.push('/')
    },
    checkAuth() {
      const user = localStorage.getItem('currentUser')
      this.currentUser = user ? JSON.parse(user) : null
    }
  },
  mounted() {
    // Carregar preferência de tema
    const darkTheme = localStorage.getItem('darkTheme') === 'true'
    this.isDark = darkTheme
    this.$vuetify.theme.global.name = darkTheme ? 'dark' : 'light'

    // Verificar autenticação
    this.checkAuth()

    // Expor método global para snackbar
    this.$root.showSnackbar = this.showSnackbar
  },
  provide() {
    return {
      showSnackbar: this.showSnackbar
    }
  }
}
</script>

<style>
.active-route {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.recipe-card {
  transition: transform 0.3s;
  height: 100%;
}

.recipe-card:hover {
  transform: translateY(-5px);
}

.tag-chip {
  margin: 2px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-2 {
  gap: 8px;
}
</style>