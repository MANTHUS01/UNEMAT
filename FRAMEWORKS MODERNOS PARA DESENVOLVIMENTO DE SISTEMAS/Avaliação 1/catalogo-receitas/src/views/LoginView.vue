<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>🔐 Login - Receitas Saudáveis</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form @submit.prevent="login" ref="loginForm">
              <v-text-field
                v-model="credentials.username"
                label="Usuário"
                prepend-icon="mdi-account"
                variant="outlined"
                :rules="[v => !!v || 'Usuário é obrigatório']"
                required
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="credentials.password"
                label="Senha"
                prepend-icon="mdi-lock"
                variant="outlined"
                :type="showPassword ? 'text' : 'password'"
                :rules="[v => !!v || 'Senha é obrigatória']"
                required
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              ></v-text-field>

              <!-- Mensagem de erro -->
              <v-alert
                v-if="error"
                type="error"
                variant="outlined"
                class="mt-4"
              >
                {{ error }}
              </v-alert>

              <!-- Usuários de teste -->
              <v-expansion-panels class="mt-4">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <v-icon start>mdi-information</v-icon>
                    Usuários para teste
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="text-caption">
                      <strong>Administrador:</strong> admin / admin123<br>
                      <strong>Chef:</strong> chef / chef123<br>
                      <strong>Usuário:</strong> usuario / user123
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="login" 
              :loading="loading"
              size="large"
            >
              <v-icon start>mdi-login</v-icon>
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Link para voltar -->
        <div class="text-center mt-4">
          <v-btn to="/" variant="text" color="grey">
            <v-icon start>mdi-arrow-left</v-icon>
            Voltar para Receitas
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Dados dos usuários
const usersData = {
  users: [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      name: "Administrador",
      email: "admin@receitas.com"
    },
    {
      id: 2,
      username: "chef",
      password: "chef123", 
      name: "Chef Cozinha",
      email: "chef@receitas.com"
    },
    {
      id: 3,
      username: "usuario",
      password: "user123",
      name: "Usuário Teste", 
      email: "user@receitas.com"
    }
  ]
};

export default {
  name: 'LoginView',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false,
      error: ''
    }
  },
  methods: {
    async login() {
      // Validar formulário
      const { valid } = await this.$refs.loginForm.validate()
      if (!valid) {
        this.error = 'Preencha todos os campos obrigatórios'
        return
      }

      this.loading = true
      this.error = ''

      // Simular delay de rede
      setTimeout(() => {
        // Buscar usuário
        const user = usersData.users.find(u => 
          u.username === this.credentials.username && 
          u.password === this.credentials.password
        )

        if (user) {
          // Login bem-sucedido
          localStorage.setItem('currentUser', JSON.stringify(user))
          this.$router.push('/recipes')
        } else {
          // Login falhou
          this.error = 'Usuário ou senha incorretos'
        }
        
        this.loading = false
      }, 1000)
    }
  },
  mounted() {
    // Se já estiver logado, redirecionar
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      this.$router.push('/recipes')
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>