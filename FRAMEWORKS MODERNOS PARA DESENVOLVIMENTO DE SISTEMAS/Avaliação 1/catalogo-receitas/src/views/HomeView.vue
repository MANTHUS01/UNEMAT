<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 font-weight-bold mb-2 text-primary">
          🥗 Receitas Saudáveis
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Descubra receitas deliciosas e nutritivas para o seu dia a dia
        </p>
      </v-col>
    </v-row>

    <!-- Filtros e Busca -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Buscar receitas..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-select
          v-model="selectedTag"
          :items="availableTags"
          label="Filtrar por tag"
          variant="outlined"
          clearable
          hide-details
        ></v-select>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          label="Ordenar por"
          variant="outlined"
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <!-- Listagem de Receitas -->
    <v-row>
      <v-col 
        v-for="recipe in filteredAndSortedRecipes" 
        :key="recipe.id"
        cols="12" 
        sm="6" 
        md="4" 
        lg="3"
      >
        <recipe-card 
          :recipe="recipe" 
          mode="view"
          @view-details="viewRecipeDetails(recipe)"
          @delete="deleteRecipe"
        ></recipe-card>
      </v-col>
    </v-row>

    <!-- Estado vazio -->
    <v-row v-if="filteredAndSortedRecipes.length === 0">
      <v-col cols="12" class="empty-state">
        <v-icon size="96" color="grey" class="mb-4">mdi-chef-hat</v-icon>
        <h3 class="text-h5 mb-2">
          {{ search || selectedTag ? 'Nenhuma receita encontrada' : 'Nenhuma receita cadastrada' }}
        </h3>
        <p class="text-body-1 text-medium-emphasis mb-4">
          {{ search || selectedTag ? 'Tente ajustar os termos da busca ou filtros.' : 'Comece adicionando sua primeira receita saudável!' }}
        </p>
        <v-btn 
          color="primary" 
          :to="isAuthenticated ? '/recipes' : '/login'" 
          size="large"
          prepend-icon="mdi-plus"
        >
          {{ isAuthenticated ? 'Adicionar Receita' : 'Fazer Login para Adicionar' }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Dialog de Detalhes -->
    <v-dialog v-model="detailDialog" max-width="600">
      <v-card v-if="selectedRecipe">
        <v-card-title class="text-h5">
          {{ selectedRecipe.title }}
        </v-card-title>
        
        <v-card-text>
          <!-- Autor -->
          <div v-if="selectedRecipe.author" class="mb-4">
            <strong>Autor:</strong> {{ selectedRecipe.author }}
          </div>

          <div class="d-flex flex-wrap gap-2 mb-4">
            <v-chip 
              v-for="tag in selectedRecipe.tags" 
              :key="tag" 
              color="primary"
              variant="outlined"
            >
              {{ tag }}
            </v-chip>
          </div>

          <v-row class="mb-4">
            <v-col cols="6">
              <v-chip color="secondary" variant="flat">
                <v-icon start>mdi-clock-outline</v-icon>
                {{ selectedRecipe.cookingTime }} minutos
              </v-chip>
            </v-col>
            <v-col cols="6">
              <v-chip color="info" variant="flat">
                <v-icon start>mdi-gauge</v-icon>
                {{ selectedRecipe.difficulty }}
              </v-chip>
            </v-col>
          </v-row>

          <!-- INGREDIENTES COM IMAGENS -->
          <div class="mb-4">
            <h4 class="text-h6 mb-2">🍅 Ingredientes:</h4>
            
            <!-- Lista de ingredientes com imagens -->
            <div class="ingredients-list">
              <div 
                v-for="(ingredient, index) in selectedRecipe.ingredients" 
                :key="index"
                class="ingredient-item mb-3"
              >
                <v-card variant="outlined" class="pa-3">
                  <v-row align="center">
                    <!-- Imagem do ingrediente -->
                    <v-col cols="3" v-if="hasIngredientImage(index)">
                      <v-img
                        :src="getIngredientImage(index)"
                        height="60"
                        width="60"
                        class="mx-auto"
                        cover
                      ></v-img>
                    </v-col>
                    
                    <!-- Nome do ingrediente -->
                    <v-col :cols="hasIngredientImage(index) ? 9 : 12">
                      <div class="text-body-1">
                        {{ ingredient }}
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </div>
          </div>

          <h4 class="text-h6 mb-2">👩‍🍳 Modo de Preparo:</h4>
          <p style="white-space: pre-line;" class="text-body-1">{{ selectedRecipe.instructions }}</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          
          <!-- BOTÃO EDITAR -->
          <v-btn 
            color="warning" 
            variant="outlined"
            :to="`/recipes/edit/${selectedRecipe.id}`"
            @click="detailDialog = false"
            prepend-icon="mdi-pencil"
          >
            Editar
          </v-btn>
          
          <v-btn color="primary" @click="detailDialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import RecipeCard from '../components/RecipeCard.vue'

export default {
  name: 'HomeView',
  components: {
    RecipeCard
  },
  inject: ['showSnackbar'],
  data() {
    return {
      search: '',
      selectedTag: null,
      sortBy: 'title',
      detailDialog: false,
      selectedRecipe: null,
      sortOptions: [
        { title: 'Título (A-Z)', value: 'title' },
        { title: 'Tempo (menor primeiro)', value: 'time' },
        { title: 'Dificuldade', value: 'difficulty' }
      ]
    }
  },
  computed: {
    recipes() {
      return JSON.parse(localStorage.getItem('recipes') || '[]')
    },
    availableTags() {
      const allTags = this.recipes.flatMap(recipe => recipe.tags)
      return [...new Set(allTags)].sort()
    },
    filteredAndSortedRecipes() {
      let filtered = this.recipes

      // Aplicar filtro de busca
      if (this.search) {
        const searchTerm = this.search.toLowerCase()
        filtered = filtered.filter(recipe => 
          recipe.title.toLowerCase().includes(searchTerm) ||
          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm)) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }

      // Aplicar filtro de tag
      if (this.selectedTag) {
        filtered = filtered.filter(recipe => 
          recipe.tags.includes(this.selectedTag)
        )
      }

      // Aplicar ordenação
      return this.sortRecipes(filtered)
    },
    isAuthenticated() {
      return !!localStorage.getItem('currentUser')
    }
  },
  methods: {
    sortRecipes(recipes) {
      const sorted = [...recipes]
      
      switch (this.sortBy) {
        case 'title':
          return sorted.sort((a, b) => a.title.localeCompare(b.title))
        case 'time':
          return sorted.sort((a, b) => a.cookingTime - b.cookingTime)
        case 'difficulty':
          const difficultyOrder = { 'Muito Fácil': 1, 'Fácil': 2, 'Médio': 3, 'Difícil': 4 }
          return sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
        default:
          return sorted
      }
    },
    
    viewRecipeDetails(recipe) {
      this.selectedRecipe = recipe
      this.detailDialog = true
    },
    
    // MÉTODOS PARA IMAGENS DOS INGREDIENTES
    hasIngredientImage(index) {
      return this.selectedRecipe.ingredientImages && 
             this.selectedRecipe.ingredientImages[index] && 
             this.selectedRecipe.ingredientImages[index] !== null
    },
    
    getIngredientImage(index) {
      return this.selectedRecipe.ingredientImages[index]
    },

    // MÉTODO PARA EXCLUIR RECEITA
    deleteRecipe(recipeId) {
      if (confirm('Tem certeza que deseja excluir esta receita?')) {
        const recipes = this.recipes.filter(r => r.id !== recipeId)
        localStorage.setItem('recipes', JSON.stringify(recipes))
        this.showSnackbar('Receita excluída com sucesso!', 'success')
        // Forçar atualização da lista
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.ingredient-item {
  transition: transform 0.2s ease;
}

.ingredient-item:hover {
  transform: translateX(5px);
}
</style>