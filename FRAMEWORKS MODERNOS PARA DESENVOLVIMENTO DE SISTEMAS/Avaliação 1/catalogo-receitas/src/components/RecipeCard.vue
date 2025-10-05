<template>
  <v-card class="recipe-card" v-if="recipe">
    <v-img
      height="200"
      :src="recipeImage"
      cover
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-icon size="64" color="grey lighten-2">mdi-chef-hat</v-icon>
        </v-row>
      </template>
    </v-img>

    <v-card-title class="text-h6 font-weight-bold">
      {{ recipe.title }}
    </v-card-title>

    <v-card-subtitle class="pb-2">
      <div class="d-flex flex-wrap">
        <v-chip v-for="tag in recipe.tags" :key="tag" class="tag-chip" size="small" color="primary" variant="outlined">
          {{ tag }}
        </v-chip>
      </div>
    </v-card-subtitle>

    <v-card-text>
      <!-- Autor -->
      <div class="text-caption text-medium-emphasis mb-2" v-if="recipe.author">
        Por: {{ recipe.author }}
      </div>

      <div class="d-flex justify-space-between mb-2">
        <v-chip size="small" color="secondary" variant="flat">
          <v-icon start size="small">mdi-clock-outline</v-icon>
          {{ recipe.cookingTime }} min
        </v-chip>
        <v-chip size="small" color="info" variant="flat">
          <v-icon start size="small">mdi-gauge</v-icon>
          {{ recipe.difficulty }}
        </v-chip>
      </div>

      <!-- INGREDIENTES COM IMAGENS -->
      <div class="mb-2">
        <div class="text-body-2 mb-2">
          <strong>{{ recipe.ingredients ? recipe.ingredients.length : 0 }}</strong> ingredientes
        </div>
        
        <!-- Miniaturas das imagens dos ingredientes -->
        <div v-if="hasIngredientImages" class="d-flex flex-wrap gap-1 mt-2">
          <v-tooltip
            v-for="(image, index) in validIngredientImages"
            :key="index"
            :text="getIngredientName(index)"
            location="top"
          >
            <template v-slot:activator="{ props }">
              <v-avatar 
                size="32" 
                v-bind="props"
                class="ingredient-thumb"
              >
                <v-img :src="image" cover></v-img>
              </v-avatar>
            </template>
          </v-tooltip>
        </div>

        <div v-else-if="recipe.ingredientImages" class="text-caption text-medium-emphasis">
          📷 Alguns ingredientes têm imagens
        </div>
      </div>
      
      <div class="text-caption line-clamp-3 mt-2">
        {{ truncatedInstructions }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn 
        color="primary" 
        variant="text" 
        @click="$emit('view-details')"
        prepend-icon="mdi-eye"
      >
        Detalhes
      </v-btn>
      
      <v-spacer></v-spacer>

      <!-- BOTÃO EDITAR NO CARD -->
      <v-btn 
        color="warning" 
        variant="text"
        :to="`/recipes/edit/${recipe.id}`"
        icon
        title="Editar receita"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'RecipeCard',
  props: {
    recipe: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'view'
    }
  },
  emits: ['view-details', 'edit', 'delete'],
  computed: {
    truncatedInstructions() {
      if (!this.recipe.instructions) return ''
      const maxLength = 120
      return this.recipe.instructions.length > maxLength 
        ? this.recipe.instructions.substring(0, maxLength) + '...' 
        : this.recipe.instructions
    },
    
    recipeImage() {
      // PRIMEIRO: Usa a imagem principal da receita se existir
      if (this.recipe.recipeImage && this.recipe.recipeImage.startsWith('data:image')) {
        return this.recipe.recipeImage
      }
      
      // SEGUNDO: Usa a imagem da receita do public folder
      if (this.recipe.recipeImage && this.recipe.recipeImage.startsWith('/img/')) {
        return this.recipe.recipeImage
      }
      
      // TERCEIRO: Usa a primeira imagem de ingrediente válida
      if (this.recipe.ingredientImages && Array.isArray(this.recipe.ingredientImages)) {
        const firstImage = this.recipe.ingredientImages.find(img => 
          img && img !== 'null' && (img.startsWith('data:image') || img.startsWith('/img/'))
        )
        if (firstImage) return firstImage
      }
      
      // PADRÃO: Imagem fallback
      return 'https://cdn.vuetifyjs.com/images/cards/cooking.png'
    },
    
    // Verifica se tem imagens de ingredientes válidas
    hasIngredientImages() {
      return this.validIngredientImages.length > 0
    },
    
    // Filtra apenas imagens válidas
    validIngredientImages() {
      if (!this.recipe.ingredientImages || !Array.isArray(this.recipe.ingredientImages)) {
        return []
      }
      return this.recipe.ingredientImages
        .filter(img => img && img !== 'null' && (img.startsWith('data:image') || img.startsWith('/img/')))
        .slice(0, 6) // Mostra no máximo 6 imagens
    }
  },
  methods: {
    // Obtém o nome do ingrediente para o tooltip
    getIngredientName(imageIndex) {
      if (!this.recipe.ingredients || !Array.isArray(this.recipe.ingredients)) {
        return 'Ingrediente'
      }
      
      // Encontra o índice real da imagem no array original
      let realIndex = -1
      let count = 0
      for (let i = 0; i < this.recipe.ingredientImages.length; i++) {
        if (this.recipe.ingredientImages[i] && 
            (this.recipe.ingredientImages[i].startsWith('data:image') || this.recipe.ingredientImages[i].startsWith('/img/'))) {
          if (count === imageIndex) {
            realIndex = i
            break
          }
          count++
        }
      }
      
      return realIndex >= 0 && this.recipe.ingredients[realIndex] 
        ? this.recipe.ingredients[realIndex] 
        : 'Ingrediente'
    }
  }
}
</script>

<style scoped>
.ingredient-thumb {
  margin: 2px;
  border: 2px solid #e0e0e0;
  cursor: pointer;
}

.gap-1 {
  gap: 4px;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-card {
  transition: transform 0.3s ease;
  height: 100%;
}

.recipe-card:hover {
  transform: translateY(-5px);
}
</style>