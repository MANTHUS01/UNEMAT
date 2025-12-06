import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pkjauvjkfvbwlebrsxxk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBramF1dmprZnZid2xlYnJzeHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDA3NjgsImV4cCI6MjA4MDAxNjc2OH0.v8PsMwU9JPfZTYUTqq6aJx2pBSV3FdLJY1V1fca-ybw'

// Configuração do cliente
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    flowType: 'pkce'
  }
})

// Teste de conexão (apenas para debug)
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Erro de conexão com Supabase:', error.message)
    console.log('📌 Verifique:')
    console.log('1. Se a URL está correta:', supabaseUrl)
    console.log('2. Se a chave está correta')
    console.log('3. Se o Site URL está configurado no Supabase Dashboard')
  } else {
    console.log('✅ Conexão com Supabase OK')
  }
})