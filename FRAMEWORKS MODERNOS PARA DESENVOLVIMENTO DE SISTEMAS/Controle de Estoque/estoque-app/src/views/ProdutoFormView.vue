<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">
          {{ isEditing ? 'Editar Produto' : 'Novo Produto' }}
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="saveProduto">

              <!-- Nome do Produto -->
              <v-text-field
                v-model="produto.nome"
                label="Nome do Produto"
                required
                :rules="[v => !!v || 'Nome é obrigatório']"
                class="mb-4"
              ></v-text-field>

              <!-- Código -->
              <v-text-field
                v-model="produto.codigo"
                label="Código do Produto"
                required
                :rules="[v => !!v || 'Código é obrigatório']"
                class="mb-4"
              ></v-text-field>

              <v-row>
                <!-- Categoria -->
                <v-col cols="12" md="6">
                  <v-select
                    v-model="produto.categoria"
                    label="Categoria"
                    :items="categorias"
                    class="mb-4"
                  ></v-select>
                </v-col>

                <!-- Marca -->
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="produto.marca"
                    label="Marca"
                    :items="marcas"
                    :rules="[v => !!v || 'Marca é obrigatória']"
                    class="mb-4"
                  ></v-autocomplete>
                </v-col>
              </v-row>

              <v-row>
                <!-- Quantidade -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="produto.quantidade"
                    label="Quantidade em Estoque"
                    type="number"
                    required
                    :rules="[
                      v => !!v || 'Quantidade é obrigatória',
                      v => v >= 0 || 'Quantidade não pode ser negativa'
                    ]"
                    class="mb-4"
                  ></v-text-field>
                </v-col>

                <!-- Preço -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="produto.preco"
                    label="Preço"
                    type="number"
                    prefix="R$"
                    step="0.01"
                    required
                    :rules="[
                      v => !!v || 'Preço é obrigatório',
                      v => v > 0 || 'Preço deve ser maior que zero'
                    ]"
                    class="mb-4"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- URL da Imagem -->
              <v-text-field
                v-model="produto.imagem_url"
                label="URL da Imagem"
                placeholder="https://exemplo.com/imagem.jpg"
                hint="Cole a URL de uma imagem do produto"
                persistent-hint
                class="mb-4"
              >
                <template v-slot:append>
                  <v-btn
                    icon="mdi-image"
                    variant="text"
                    size="small"
                    @click="showImageDialog = true"
                  ></v-btn>
                </template>
              </v-text-field>

              <!-- Preview da Imagem -->
              <div v-if="produto.imagem_url" class="mb-4">
                <p class="text-caption">Preview da imagem:</p>
                <v-img
                  :src="produto.imagem_url"
                  :alt="produto.nome"
                  height="200"
                  cover
                  class="rounded"
                ></v-img>
              </div>

              <!-- Descrição -->
              <v-textarea
                v-model="produto.descricao"
                label="Descrição do Produto"
                rows="3"
                class="mb-6"
              ></v-textarea>

              <!-- Botões -->
              <div class="d-flex justify-end gap-2">
                <v-btn
                  type="button"
                  variant="text"
                  @click="$router.back()"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                >
                  {{ isEditing ? 'Atualizar' : 'Salvar' }}
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Imagens de Exemplo -->
      <v-col cols="12" md="4" lg="6">
        <v-card>
          <v-card-title class="text-body-1">
            <v-icon icon="mdi-lightbulb" class="mr-2"></v-icon>
            URLs de Imagem Exemplo
          </v-card-title>
          <v-card-text>
            <div class="text-caption mb-2">Clique para usar:</div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="(img, index) in imagensExemplo"
                :key="index"
                label
                @click="produto.imagem_url = img.url"
                class="cursor-pointer"
              >
                {{ img.nome }}
              </v-chip>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="text-caption">
              <p><strong>Dica:</strong> Use imagens do Unsplash:</p>
              <p class="text-grey">https://images.unsplash.com/photo-...</p>
              <p>Tamanho recomendado: 500x500px</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo para Upload de Imagem (Futuro) -->
    <v-dialog v-model="showImageDialog" max-width="500">
      <v-card>
        <v-card-title>Upload de Imagem</v-card-title>
        <v-card-text>
          <p class="text-caption mb-4">Funcionalidade em desenvolvimento.</p>
          <p>Por enquanto, use URLs de imagens externas.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showImageDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const showImageDialog = ref(false)

const produto = ref({
  nome: '',
  codigo: '',
  categoria: '',
  marca: '',
  quantidade: 0,
  preco: 0,
  descricao: '',
  imagem_url: ''
})

const categorias = [
  'Eletrônicos',
  'Informática',
  'Móveis',
  'Livros',
  'Roupas',
  'Eletrodomésticos',
  'Smartphones',
  'Games',
  'Ferramentas',
  'Outros'
]

const marcas = [
  'Dell',
  'HP',
  'Lenovo',
  'Apple',
  'Samsung',
  'LG',
  'Sony',
  'Microsoft',
  'Logitech',
  'Canon',
  'Nikon',
  'Xiaomi',
  'Motorola',
  'Asus',
  'Acer',
  'Genérica',
  'Outra'
]

const imagensExemplo = [
  { nome: 'Notebook', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { nome: 'Mouse', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { nome: 'Mesa', url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { nome: 'Livro', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' },
  { nome: 'Monitor', url: 'https://images.unsplash.com/photo-1495954222046-2c427ecb546d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }
]

const isEditing = computed(() => route.params.id)

async function loadProduto() {
  if (isEditing.value) {
    try {
      loading.value = true
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', route.params.id)
        .single()

      if (error) throw error

      if (data) {
        produto.value = data
      }

    } catch (error) {
      console.error('Erro ao carregar produto:', error)
      alert('Erro ao carregar produto')
    } finally {
      loading.value = false
    }
  }
}

async function saveProduto() {
  try {
    loading.value = true

    // Validar campos obrigatórios
    if (!produto.value.nome || !produto.value.codigo || !produto.value.marca) {
      alert('Preencha os campos obrigatórios: Nome, Código e Marca')
      return
    }

    if (isEditing.value) {
      // Atualizar
      const { error } = await supabase
        .from('produtos')
        .update(produto.value)
        .eq('id', route.params.id)

      if (error) throw error

    } else {
      // Criar novo
      const { error } = await supabase
        .from('produtos')
        .insert([produto.value])

      if (error) throw error
    }

    // Redirecionar
    router.push('/estoque')

  } catch (error) {
    console.error('Erro ao salvar produto:', error)

    if (error.code === '23505') {
      alert('Erro: Código do produto já existe!')
    } else {
      alert('Erro ao salvar produto. Tente novamente.')
    }

  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduto()
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
