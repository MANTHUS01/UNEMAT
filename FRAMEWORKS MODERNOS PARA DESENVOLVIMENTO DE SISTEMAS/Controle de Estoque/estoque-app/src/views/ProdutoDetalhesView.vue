<!-- src/views/ProdutoDetalhesView.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          @click="$router.back()"
          class="mb-4"
        >
          Voltar
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="produto">
      <v-col cols="12" md="6">
        <v-card>
          <v-img
            :src="produto.imagem_url || 'https://via.placeholder.com/400'"
            :alt="produto.nome"
            height="400"
            cover
            class="rounded"
          ></v-img>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-h4">{{ produto.nome }}</v-card-title>

          <v-card-text>
            <v-row class="mb-4">
              <v-col cols="6">
                <p class="text-caption text-grey">Código</p>
                <p class="text-h6">{{ produto.codigo }}</p>
              </v-col>
              <v-col cols="6">
                <p class="text-caption text-grey">Marca</p>
                <v-chip color="primary">{{ produto.marca }}</v-chip>
              </v-col>
            </v-row>

            <v-row class="mb-4">
              <v-col cols="6">
                <p class="text-caption text-grey">Categoria</p>
                <v-chip>{{ produto.categoria }}</v-chip>
              </v-col>
              <v-col cols="6">
                <p class="text-caption text-grey">Estoque</p>
                <div class="d-flex align-center">
                  <v-chip
                    :color="getQuantidadeColor(produto.quantidade)"
                    class="mr-2"
                  >
                    {{ produto.quantidade }} unidades
                  </v-chip>
                  <v-icon
                    :color="produto.quantidade < 10 ? 'warning' : 'success'"
                    :icon="produto.quantidade < 10 ? 'mdi-alert' : 'mdi-check'"
                  ></v-icon>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <div class="mb-4">
              <p class="text-caption text-grey">Preço Unitário</p>
              <p class="text-h4 text-primary">
                R$ {{ formatPreco(produto.preco) }}
              </p>
            </div>

            <div class="mb-4">
              <p class="text-caption text-grey">Valor Total em Estoque</p>
              <p class="text-h5 text-success">
                R$ {{ formatPreco(produto.preco * produto.quantidade) }}
              </p>
            </div>

            <div class="mb-4">
              <p class="text-caption text-grey">Descrição</p>
              <p>{{ produto.descricao || 'Sem descrição' }}</p>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="text-caption text-grey">
              <p><strong>Cadastrado em:</strong> {{ formatDate(produto.created_at) }}</p>
              <p><strong>Última atualização:</strong> {{ formatDate(produto.updated_at) }}</p>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              :to="`/produto/${produto.id}`"
              prepend-icon="mdi-pencil"
            >
              Editar Produto
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              variant="outlined"
              @click="confirmDelete"
              prepend-icon="mdi-delete"
            >
              Excluir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center py-8">
            <v-progress-circular
              indeterminate
              color="primary"
              class="mb-4"
            ></v-progress-circular>
            <p>Carregando produto...</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '@/config/supabase'

const route = useRoute()
const router = useRouter()
const produto = ref(null)
const loading = ref(false)

function formatPreco(valor) {
  return parseFloat(valor).toFixed(2).replace('.', ',')
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

function getQuantidadeColor(quantidade) {
  if (quantidade < 5) return 'error'
  if (quantidade < 10) return 'warning'
  return 'success'
}

async function loadProduto() {
  try {
    loading.value = true

    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    produto.value = data

  } catch (error) {
    console.error('Erro ao carregar produto:', error)
    alert('Produto não encontrado')
    router.push('/estoque')
  } finally {
    loading.value = false
  }
}

function confirmDelete() {
  if (confirm(`Tem certeza que deseja excluir "${produto.value.nome}"?`)) {
    deleteProduto()
  }
}

async function deleteProduto() {
  try {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', produto.value.id)

    if (error) throw error

    alert('Produto excluído com sucesso!')
    router.push('/estoque')

  } catch (error) {
    console.error('Erro ao excluir:', error)
    alert('Erro ao excluir produto')
  }
}

onMounted(() => {
  loadProduto()
})
</script>
