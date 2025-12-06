import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/config/supabase'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Login com Google
  const loginWithGoogle = async () => {
    try {
      loading.value = true
      error.value = null
      
      console.log('Login Google iniciado...')
      
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (authError) {
        console.error('Erro OAuth:', authError)
        throw authError
      }
      
      console.log('Redirecionamento OAuth:', data?.url)
      
      // O Supabase vai redirecionar automaticamente
      
    } catch (err) {
      console.error('Erro no login:', err)
      error.value = err.message || 'Erro ao fazer login com Google'
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      loading.value = true
      
      // Limpar usuário teste
      localStorage.removeItem('test_user')
      
      // Logout do Supabase
      const { error: logoutError } = await supabase.auth.signOut()
      if (logoutError) throw logoutError
      
      // Limpar state
      user.value = null
      
      // Redirecionar
      router.push('/login')
      
    } catch (err) {
      console.error('Erro no logout:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Inicializar auth
  const init = async () => {
    try {
      console.log('Inicializando auth store...')
      
      // Verificar sessão Supabase
      const { data, error: sessionError } = await supabase.auth.getSession()
      
      if (!sessionError && data?.session) {
        user.value = data.session.user
        console.log('Sessão restaurada:', user.value.email)
      }
      
    } catch (err) {
      console.error('Erro na inicialização:', err)
    }
  }

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    init
  }
})