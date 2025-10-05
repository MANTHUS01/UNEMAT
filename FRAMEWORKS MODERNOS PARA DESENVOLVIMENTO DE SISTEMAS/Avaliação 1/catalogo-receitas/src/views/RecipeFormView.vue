<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-4">
          {{ isEditing ? '✏️ Editar Receita' : '➕ Nova Receita' }}
        </h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="saveRecipe" ref="form">
      <v-card>
        <v-card-text class="pa-6">
          <!-- Campo do Autor -->
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="recipe.author"
                label="Nome do autor *"
                :rules="[v => !!v || 'Nome do autor é obrigatório']"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                v-model="recipe.title"
                label="Título da receita *"
                :rules="[v => !!v || 'Título é obrigatório']"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-text-field
                v-model="recipe.cookingTime"
                label="Tempo de preparo (minutos) *"
                type="number"
                :rules="[v => !!v || 'Tempo é obrigatório']"
                variant="outlined"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- IMAGEM DA RECEITA -->
          <v-row>
            <v-col cols="12">
              <h3 class="text-h6 mb-3">🖼️ Imagem da Receita</h3>
              <v-card variant="outlined" class="pa-4">
                <v-row align="center">
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="recipeImageFile"
                      label="Selecione a imagem principal da receita"
                      variant="outlined"
                      accept="image/*"
                      prepend-icon="mdi-camera"
                      @change="handleRecipeImageUpload"
                      hide-details
                    ></v-file-input>
                    <div class="text-caption text-medium-emphasis mt-2">
                      Formatos: JPG, PNG, GIF • Máximo: 2MB
                    </div>
                  </v-col>
                  
                  <v-col cols="12" md="6" class="text-center">
                    <!-- Preview da imagem da receita -->
                    <div v-if="recipe.recipeImage" class="recipe-image-preview">
                      <v-img
                        :src="recipe.recipeImage"
                        height="120"
                        width="120"
                        class="mx-auto mb-2"
                        cover
                        style="border-radius: 8px;"
                      ></v-img>
                      <v-btn
                        color="error"
                        variant="text"
                        size="small"
                        @click="removeRecipeImage"
                        prepend-icon="mdi-delete"
                      >
                        Remover Imagem
                      </v-btn>
                    </div>
                    <div v-else class="text-caption text-medium-emphasis">
                      Nenhuma imagem selecionada
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-combobox
                v-model="recipe.tags"
                label="Tags"
                multiple
                chips
                variant="outlined"
              ></v-combobox>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="recipe.difficulty"
                label="Dificuldade *"
                :rules="[v => !!v || 'Dificuldade é obrigatória']"
                :items="difficultyOptions"
                variant="outlined"
                required
              ></v-select>
            </v-col>
          </v-row>

          <!-- INGREDIENTES COM IMAGENS -->
          <v-row>
            <v-col cols="12">
              <h3 class="text-h6 mb-3">🍅 Ingredientes</h3>
              
              <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="mb-3">
                <v-card variant="outlined" class="pa-3">
                  <v-row align="center">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="recipe.ingredients[index]"
                        :label="`Ingrediente ${index + 1}`"
                        variant="outlined"
                        dense
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" md="4">
                      <v-file-input
                        :label="`Imagem do ingrediente`"
                        variant="outlined"
                        dense
                        accept="image/*"
                        prepend-icon="mdi-camera"
                        @change="handleIngredientImageUpload($event, index)"
                        hide-details
                      ></v-file-input>
                    </v-col>
                    
                    <v-col cols="12" md="2" class="text-center">
                      <!-- Preview da imagem do ingrediente -->
                      <div v-if="getIngredientImage(index)" class="mb-2">
                        <v-img
                          :src="getIngredientImage(index)"
                          height="50"
                          width="50"
                          class="mx-auto"
                          cover
                        ></v-img>
                        <v-btn
                          icon
                          size="small"
                          color="error"
                          @click="removeIngredientImage(index)"
                          class="mt-1"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                      
                      <!-- Botão remover ingrediente -->
                      <v-btn
                        icon
                        color="error"
                        @click="removeIngredient(index)"
                        class="mt-1"
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </div>

              <v-btn
                color="primary"
                variant="outlined"
                @click="addIngredient"
                prepend-icon="mdi-plus"
                class="mt-2"
              >
                Adicionar Ingrediente
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="recipe.instructions"
                label="Modo de preparo *"
                rows="4"
                :rules="[v => !!v || 'Modo de preparo é obrigatório']"
                variant="outlined"
                required
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-btn 
            color="grey" 
            variant="text" 
            to="/" 
            size="large"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            Cancelar
          </v-btn>
          
          <v-spacer></v-spacer>

          <v-btn 
            v-if="isEditing"
            color="error" 
            variant="text" 
            @click="confirmDelete"
            size="large"
          >
            <v-icon start>mdi-delete</v-icon>
            Excluir
          </v-btn>
          
          <v-btn 
            color="primary" 
            type="submit" 
            size="large"
          >
            <v-icon start>{{ isEditing ? 'mdi-content-save' : 'mdi-check' }}</v-icon>
            {{ isEditing ? 'Atualizar Receita' : 'Salvar Receita' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>

    <confirm-dialog
      v-model="deleteDialog"
      title="Excluir Receita"
      :message="deleteMessage"
      type="delete"
      confirm-text="Excluir"
      @confirm="deleteRecipe"
    ></confirm-dialog>
  </v-container>
</template>

<script>
import ConfirmDialog from '../components/ConfirmDialog.vue'

export default {
  name: 'RecipeFormView',
  components: {
    ConfirmDialog
  },
  inject: ['showSnackbar'],
  data() {
    return {
      recipe: {
        id: null,
        title: '',
        tags: [],
        ingredients: [''],
        ingredientImages: [],
        recipeImage: null,
        instructions: '',
        cookingTime: null,
        difficulty: 'Fácil',
        author: ''
      },
      recipeImageFile: null,
      isEditing: false,
      deleteDialog: false,
      difficultyOptions: ['Muito Fácil', 'Fácil', 'Médio', 'Difícil']
    }
  },
  computed: {
    recipes() {
      return JSON.parse(localStorage.getItem('recipes') || '[]')
    },
    deleteMessage() {
      return 'Tem certeza que deseja excluir a receita ' + this.recipe.title + '? Esta ação não pode ser desfeita.'
    }
  },
  mounted() {
    this.loadRecipe()
  },
  methods: {
    // MÉTODO PARA IMAGEM DA RECEITA
    handleRecipeImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          this.showSnackbar('Por favor, selecione apenas imagens', 'error')
          this.recipeImageFile = null
          return
        }

        if (file.size > 2 * 1024 * 1024) {
          this.showSnackbar('A imagem deve ter no máximo 2MB', 'error')
          this.recipeImageFile = null
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          this.recipe.recipeImage = e.target.result
          this.showSnackbar('Imagem da receita adicionada com sucesso!', 'success')
        }
        reader.onerror = () => {
          this.showSnackbar('Erro ao carregar a imagem', 'error')
          this.recipeImageFile = null
        }
        reader.readAsDataURL(file)
      }
    },

    removeRecipeImage() {
      this.recipe.recipeImage = null
      this.recipeImageFile = null
      this.showSnackbar('Imagem da receita removida', 'info')
    },

    // Método seguro para obter imagem do ingrediente
    getIngredientImage(index) {
      return this.recipe.ingredientImages && this.recipe.ingredientImages[index]
        ? this.recipe.ingredientImages[index]
        : null
    },

    addIngredient() {
      this.recipe.ingredients.push('')
      // Garantir que ingredientImages existe
      if (!this.recipe.ingredientImages) {
        this.recipe.ingredientImages = []
      }
      this.recipe.ingredientImages.push(null)
    },

    removeIngredient(index) {
      if (this.recipe.ingredients.length > 1) {
        this.recipe.ingredients.splice(index, 1)
        if (this.recipe.ingredientImages) {
          this.recipe.ingredientImages.splice(index, 1)
        }
      } else {
        this.showSnackbar('A receita precisa ter pelo menos um ingrediente', 'warning')
      }
    },

    handleIngredientImageUpload(event, index) {
      const file = event.target.files[0]
      if (file) {
        if (!file.type.startsWith('image/')) {
          this.showSnackbar('Por favor, selecione apenas imagens', 'error')
          return
        }

        if (file.size > 2 * 1024 * 1024) {
          this.showSnackbar('A imagem deve ter no máximo 2MB', 'error')
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          // Garantir que ingredientImages existe
          if (!this.recipe.ingredientImages) {
            this.recipe.ingredientImages = []
          }
          this.recipe.ingredientImages[index] = e.target.result
          // Força a atualização da reatividade
          this.recipe.ingredientImages = [...this.recipe.ingredientImages]
          
          this.showSnackbar('Imagem do ingrediente adicionada com sucesso!', 'success')
        }
        reader.readAsDataURL(file)
      }
    },

    removeIngredientImage(index) {
      if (this.recipe.ingredientImages) {
        this.recipe.ingredientImages[index] = null
        // Força a atualização da reatividade
        this.recipe.ingredientImages = [...this.recipe.ingredientImages]
      }
    },

    loadRecipe() {
      if (this.$route.params.id) {
        const recipeId = parseInt(this.$route.params.id)
        const recipe = this.recipes.find(r => r.id === recipeId)
        
        if (recipe) {
          // Garantir que todas as propriedades de imagem existam
          this.recipe = { 
            ...recipe,
            ingredientImages: recipe.ingredientImages || [],
            recipeImage: recipe.recipeImage || null
          }
          this.isEditing = true
        } else {
          this.showSnackbar('Receita não encontrada', 'error')
          this.$router.push('/recipes')
        }
      }
    },

    async saveRecipe() {
      // Filtrar ingredientes vazios
      this.recipe.ingredients = this.recipe.ingredients.filter(ing => ing.trim() !== '')
      
      if (this.recipe.ingredients.length === 0) {
        this.showSnackbar('Adicione pelo menos um ingrediente', 'error')
        return
      }

      const { valid } = await this.$refs.form.validate()
      
      if (!valid) {
        this.showSnackbar('Por favor, preencha todos os campos obrigatórios', 'error')
        return
      }

      try {
        const recipes = [...this.recipes]
        
        if (this.isEditing) {
          const index = recipes.findIndex(r => r.id === this.recipe.id)
          if (index !== -1) {
            recipes[index] = { ...this.recipe }
            this.showSnackbar('Receita atualizada com sucesso!', 'success')
          }
        } else {
          const newRecipe = {
            ...this.recipe,
            id: Date.now()
          }
          recipes.push(newRecipe)
          this.showSnackbar('Receita criada com sucesso!', 'success')
        }
        
        localStorage.setItem('recipes', JSON.stringify(recipes))
        this.$router.push('/')
        
      } catch (error) {
        this.showSnackbar('Erro ao salvar receita', 'error')
        console.error('Erro ao salvar receita:', error)
      }
    },

    confirmDelete() {
      this.deleteDialog = true
    },

    deleteRecipe() {
      const recipes = this.recipes.filter(r => r.id !== this.recipe.id)
      localStorage.setItem('recipes', JSON.stringify(recipes))
      this.showSnackbar('Receita excluída com sucesso', 'success')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.recipe-image-preview {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}
</style>