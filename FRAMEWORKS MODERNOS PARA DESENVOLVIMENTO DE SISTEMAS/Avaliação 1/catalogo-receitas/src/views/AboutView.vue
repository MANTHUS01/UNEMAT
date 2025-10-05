<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4">
          ℹ️ Sobre o Sistema
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8" class="mx-auto">
        <v-card variant="outlined">
          <v-card-text class="pa-6">
            <!-- Informações do Sistema -->
            <section class="mb-6">
              <h2 class="text-h5 mb-3 text-primary">
                Catálogo de Receitas Saudáveis
              </h2>
              <p class="text-body-1 mb-4">
                Este sistema foi desenvolvido como parte da avaliação da disciplina de 
                <strong>Frameworks Modernos para Desenvolvimento de Sistemas</strong> 
                do curso <strong>TADS da UNEMAT</strong>.
              </p>
              
              <v-alert type="info" variant="outlined" class="mb-4">
                <strong>Versão do Sistema:</strong> 1.0.0<br>
                <strong>Data de Desenvolvimento:</strong> 2024
              </v-alert>
            </section>

            <!-- Funcionalidades -->
            <section class="mb-6">
              <h3 class="text-h6 mb-3">📋 Funcionalidades Implementadas</h3>
              <v-list lines="two" density="comfortable">
                <v-list-item
                  v-for="feature in features"
                  :key="feature.title"
                  :prepend-icon="feature.icon"
                >
                  <v-list-item-title class="font-weight-medium">
                    {{ feature.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ feature.description }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </section>

            <!-- Tecnologias -->
            <section class="mb-6">
              <h3 class="text-h6 mb-3">🛠️ Tecnologias Utilizadas</h3>
              <div class="d-flex flex-wrap gap-2">
                <v-chip
                  v-for="tech in technologies"
                  :key="tech"
                  color="primary"
                  variant="outlined"
                >
                  {{ tech }}
                </v-chip>
              </div>
            </section>

            <!-- Dicas de Saúde -->
            <section class="mb-6">
              <h3 class="text-h6 mb-3">🥗 Dicas para uma Alimentação Saudável</h3>
              <v-list density="comfortable">
                <v-list-item
                  v-for="tip in healthTips"
                  :key="tip"
                  prepend-icon="mdi-check-circle"
                  color="success"
                >
                  <v-list-item-title class="text-body-2">
                    {{ tip }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </section>

            <!-- Estatísticas -->
            <section>
              <h3 class="text-h6 mb-3">📊 Estatísticas do Sistema</h3>
              <v-row>
                <v-col cols="6" sm="3">
                  <v-card variant="flat" color="surface" class="text-center pa-3">
                    <div class="text-h4 text-primary">{{ stats.totalRecipes }}</div>
                    <div class="text-caption">Receitas Cadastradas</div>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-card variant="flat" color="surface" class="text-center pa-3">
                    <div class="text-h4 text-secondary">{{ stats.totalTags }}</div>
                    <div class="text-caption">Tags Únicas</div>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-card variant="flat" color="surface" class="text-center pa-3">
                    <div class="text-h4 text-info">{{ stats.avgTime }}</div>
                    <div class="text-caption">Tempo Médio (min)</div>
                  </v-card>
                </v-col>
                <v-col cols="6" sm="3">
                  <v-card variant="flat" color="surface" class="text-center pa-3">
                    <div class="text-h4 text-success">{{ stats.easyRecipes }}</div>
                    <div class="text-caption">Receitas Fáceis</div>
                  </v-card>
                </v-col>
              </v-row>
            </section>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      features: [
        {
          icon: 'mdi-plus-circle',
          title: 'CRUD Completo',
          description: 'Criar, listar, editar e excluir receitas com validação'
        },
        {
          icon: 'mdi-magnify',
          title: 'Busca e Filtros',
          description: 'Buscar receitas por título, ingredientes ou tags'
        },
        {
          icon: 'mdi-card-bulleted',
          title: 'Interface Responsiva',
          description: 'Design adaptável para desktop e mobile'
        },
        {
          icon: 'mdi-content-save',
          title: 'Persistência Local',
          description: 'Dados salvos no localStorage do navegador'
        },
        {
          icon: 'mdi-palette',
          title: 'Modo Claro/Escuro',
          description: 'Toggle entre temas claro e escuro'
        }
      ],
      technologies: [
        'Vue 3',
        'Vuetify 3',
        'Vue Router 4',
        'Composition API',
        'LocalStorage'
      ],
      healthTips: [
        'Consuma pelo menos 5 porções de frutas e vegetais por dia',
        'Prefira grãos integrais aos refinados',
        'Reduza o consumo de sal e açúcar',
        'Mantenha-se hidratado bebendo água regularmente',
        'Inclua proteínas magras em suas refeições',
        'Pratique exercícios físicos regularmente'
      ]
    }
  },
  computed: {
    stats() {
      const recipes = JSON.parse(localStorage.getItem('recipes') || '[]')
      const totalRecipes = recipes.length
      const allTags = recipes.flatMap(recipe => recipe.tags)
      const totalTags = [...new Set(allTags)].length
      const avgTime = totalRecipes > 0 
        ? Math.round(recipes.reduce((sum, recipe) => sum + recipe.cookingTime, 0) / totalRecipes)
        : 0
      const easyRecipes = recipes.filter(recipe => 
        recipe.difficulty === 'Muito Fácil' || recipe.difficulty === 'Fácil'
      ).length

      return {
        totalRecipes,
        totalTags,
        avgTime,
        easyRecipes
      }
    }
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>