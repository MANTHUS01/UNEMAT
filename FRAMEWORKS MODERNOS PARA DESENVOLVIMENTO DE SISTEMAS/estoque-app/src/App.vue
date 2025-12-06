<template>
  <v-app>
    <AppBar v-if="showAppBar" />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppBar from '@/components/Layout/AppBar.vue'

const route = useRoute()
const authStore = useAuthStore()

const showAppBar = computed(() => {
  // Não mostrar AppBar nas páginas de login e callback
  const hideOnRoutes = ['/login', '/auth/callback']
  return !hideOnRoutes.includes(route.path) && authStore.user
})
</script>
