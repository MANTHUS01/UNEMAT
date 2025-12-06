<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6 text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-4"
          ></v-progress-circular>

          <v-card-title class="justify-center">
            Processando autenticação...
          </v-card-title>

          <v-card-text>
            <p v-if="error" class="text-error">{{ error }}</p>
            <p v-else>Redirecionando para o dashboard...</p>

            <v-alert
              v-if="debugInfo"
              type="info"
              class="mt-4 text-left"
              density="compact"
            >
              <pre class="text-caption">{{ debugInfo }}</pre>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

const router = useRouter()
const error = ref(null)
const loading = ref(true)
const debugInfo = ref('')

onMounted(async () => {
  try {
    console.log('=== AUTH CALLBACK INICIADO ===')

    debugInfo.value = 'Processando callback de autenticação...\n'

    // Aguardar um momento para o Supabase processar a URL
    await new Promise(resolve => setTimeout(resolve, 1000))

    debugInfo.value += 'Verificando hash da URL...\n'
    console.log('Hash da URL:', window.location.hash)
    console.log('Search da URL:', window.location.search)

    // Tentar obter a sessão
    debugInfo.value += 'Obtendo sessão do Supabase...\n'
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      debugInfo.value += `Erro na sessão: ${sessionError.message}\n`
      throw new Error(`Erro na sessão: ${sessionError.message}`)
    }

    if (!session) {
      debugInfo.value += 'Nenhuma sessão encontrada\n'
      throw new Error('Nenhuma sessão encontrada após login')
    }

    debugInfo.value += `Login bem sucedido! Usuário: ${session.user.email}\n`
    console.log('Login bem sucedido! Usuário:', session.user.email)

    // Aguardar um pouco mais para garantir
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirecionar para dashboard
    debugInfo.value += 'Redirecionando para dashboard...\n'
    router.push('/dashboard')

  } catch (err) {
    console.error('Erro no callback:', err)
    error.value = err.message
    debugInfo.value += `ERRO: ${err.message}\n`

    // Redirecionar para login após 5 segundos
    setTimeout(() => {
      router.push('/login')
    }, 5000)
  } finally {
    loading.value = false
  }
})
</script>
