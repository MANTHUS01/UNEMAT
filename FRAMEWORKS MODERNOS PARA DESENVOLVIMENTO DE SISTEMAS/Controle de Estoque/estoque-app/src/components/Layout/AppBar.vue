<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-title>Controle de Estoque</v-app-bar-title>
    
    <v-btn to="/dashboard" variant="text" prepend-icon="mdi-view-dashboard">
      Dashboard
    </v-btn>
    <v-btn to="/estoque" variant="text" prepend-icon="mdi-package-variant">
      Estoque
    </v-btn>
    <v-btn to="/produto/novo" variant="text" prepend-icon="mdi-plus">
      Novo Produto
    </v-btn>
    
    <v-spacer></v-spacer>
    
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" variant="text" prepend-icon="mdi-account">
          {{ authStore.user?.email || 'Usuário' }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="authStore.logout">
          <v-list-item-title>Sair</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>