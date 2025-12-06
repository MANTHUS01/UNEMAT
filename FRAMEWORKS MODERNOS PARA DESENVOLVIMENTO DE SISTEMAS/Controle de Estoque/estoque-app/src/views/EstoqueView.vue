<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <h1 class="text-h3">Estoque de Produtos</h1>
          <v-btn
            color="primary"
            to="/produto/novo"
            prepend-icon="mdi-plus"
            size="large"
          >
            Novo Produto
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <!-- Filtros -->
            <div class="d-flex flex-wrap gap-2 mb-6">
              <v-text-field
                v-model="search"
                placeholder="Buscar produtos..."
                density="compact"
                hide-details
                style="max-width: 300px;"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                class="search-field"
              ></v-text-field>

              <v-select
                v-model="filterCategoria"
                :items="categoriasFiltro"
                label="Categoria"
                density="compact"
                hide-details
                style="max-width: 200px;"
                clearable
                variant="outlined"
              ></v-select>

              <v-select
                v-model="filterMarca"
                :items="marcasFiltro"
                label="Marca"
                density="compact"
                hide-details
                style="max-width: 200px;"
                clearable
                variant="outlined"
              ></v-select>

              <v-spacer></v-spacer>

              <v-btn
                variant="outlined"
                @click="resetFilters"
                prepend-icon="mdi-filter-remove"
                color="grey"
              >
                Limpar Filtros
              </v-btn>
            </div>

            <!-- Tabela -->
            <v-data-table
              :headers="headers"
              :items="produtosFiltrados"
              :loading="loading"
              :search="search"
              :items-per-page="10"
              class="elevation-1 estoque-table"
            >
              <!-- Coluna Imagem -->
              <template v-slot:item.imagem_url="{ item }">
                <div class="d-flex justify-center">
                  <v-avatar size="48" rounded class="product-image">
                    <v-img
                      :src="item.imagem_url || 'https://via.placeholder.com/48'"
                      :alt="item.nome"
                      cover
                    >
                      <template v-slot:placeholder>
                        <v-icon icon="mdi-package-variant" size="24"></v-icon>
                      </template>
                    </v-img>
                  </v-avatar>
                </div>
              </template>

              <!-- Coluna Quantidade -->
              <template v-slot:item.quantidade="{ item }">
                <v-chip
                  :color="getQuantidadeColor(item.quantidade)"
                  variant="flat"
                  size="small"
                  :class="`quantity-chip quantity-${getQuantidadeLevel(item.quantidade)}`"
                >
                  {{ item.quantidade }}
                </v-chip>
              </template>

              <!-- Coluna Preço -->
              <template v-slot:item.preco="{ item }">
                <span class="font-weight-bold price-text">
                  R$ {{ formatPreco(item.preco) }}
                </span>
              </template>

              <!-- Coluna Ações - COM ÍCONES EM SVG -->
              <template v-slot:item.actions="{ item }">
                <div class="d-flex justify-center action-buttons">
                  <!-- Botão Visualizar -->
                  <v-btn
                    variant="text"
                    size="small"
                    color="info"
                    :to="`/produto/detalhes/${item.id}`"
                    class="action-btn"
                    title="Visualizar"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" class="action-icon">
                      <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                    </svg>
                  </v-btn>

                  <!-- Botão Editar -->
                  <v-btn
                    variant="text"
                    size="small"
                    color="primary"
                    :to="`/produto/${item.id}`"
                    class="action-btn"
                    title="Editar"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" class="action-icon">
                      <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                    </svg>
                  </v-btn>

                  <!-- Botão Excluir -->
                  <v-btn
                    variant="text"
                    size="small"
                    color="error"
                    @click="confirmDelete(item)"
                    class="action-btn"
                    title="Excluir"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" class="action-icon">
                      <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                  </v-btn>
                </div>
              </template>

              <!-- Mensagem vazia -->
              <template v-slot:no-data>
                <div class="py-8 text-center">
                  <v-icon icon="mdi-package-variant-closed" size="64" class="mb-4 text-grey"></v-icon>
                  <p class="text-h6 text-grey">Nenhum produto encontrado</p>
                  <p class="text-grey">Adicione produtos ao estoque</p>
                </div>
              </template>

              <!-- Loading -->
              <template v-slot:loading>
                <div class="py-8 text-center">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="32"
                    class="mb-4"
                  ></v-progress-circular>
                  <p class="text-grey">Carregando produtos...</p>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diálogo de Exclusão -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon icon="mdi-alert" color="warning" class="mr-2"></v-icon>
          Confirmar Exclusão
        </v-card-title>
        <v-card-text>
          <p>Tem certeza que deseja excluir o produto <strong>"{{ produtoParaExcluir?.nome }}"</strong>?</p>
          <p class="text-caption text-grey mt-2">Esta ação não pode ser desfeita.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false" variant="text">Cancelar</v-btn>
          <v-btn color="error" @click="deleteProduto" :loading="deleting">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/config/supabase'

const produtos = ref([])
const loading = ref(false)
const search = ref('')
const filterCategoria = ref(null)
const filterMarca = ref(null)
const deleteDialog = ref(false)
const produtoParaExcluir = ref(null)
const deleting = ref(false)

// IMPORTANTE: As chaves DEVEM corresponder aos nomes dos campos
const headers = [
  {
    title: 'Imagem',
    key: 'imagem_url',
    width: '80px',
    sortable: false,
    align: 'center'
  },
  {
    title: 'Código',
    key: 'codigo',
    width: '120px',
    align: 'start'
  },
  {
    title: 'Nome',
    key: 'nome',
    align: 'start'
  },
  {
    title: 'Marca',
    key: 'marca',
    width: '140px',
    align: 'start'
  },
  {
    title: 'Categoria',
    key: 'categoria',
    width: '150px',
    align: 'start'
  },
  {
    title: 'Quantidade',
    key: 'quantidade',
    align: 'center',
    width: '140px'
  },
  {
    title: 'Preço',
    key: 'preco',
    align: 'end',
    width: '140px'
  },
  {
    title: 'Ações',
    key: 'actions',
    align: 'center',
    width: '180px',
    sortable: false
  }
]

// Computed properties
const categoriasFiltro = computed(() => {
  const cats = [...new Set(produtos.value.map(p => p.categoria).filter(Boolean))]
  return cats.sort()
})

const marcasFiltro = computed(() => {
  const marcas = [...new Set(produtos.value.map(p => p.marca).filter(Boolean))]
  return marcas.sort()
})

const produtosFiltrados = computed(() => {
  let filtered = produtos.value

  if (filterCategoria.value) {
    filtered = filtered.filter(p => p.categoria === filterCategoria.value)
  }

  if (filterMarca.value) {
    filtered = filtered.filter(p => p.marca === filterMarca.value)
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.nome.toLowerCase().includes(searchLower) ||
      p.codigo.toLowerCase().includes(searchLower) ||
      (p.descricao && p.descricao.toLowerCase().includes(searchLower))
    )
  }

  return filtered
})

// Helper functions
function formatPreco(valor) {
  return parseFloat(valor).toFixed(2).replace('.', ',')
}

function getQuantidadeColor(quantidade) {
  if (quantidade < 5) return 'error'
  if (quantidade < 10) return 'warning'
  return 'success'
}

function getQuantidadeLevel(quantidade) {
  if (quantidade < 5) return 'low'
  if (quantidade < 10) return 'medium'
  return 'high'
}

function resetFilters() {
  search.value = ''
  filterCategoria.value = null
  filterMarca.value = null
}

// Carregar produtos
async function loadProdutos() {
  try {
    loading.value = true

    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome')

    if (error) throw error

    produtos.value = data || []
    console.log('Produtos carregados no estoque:', produtos.value.length)

  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    alert('Erro ao carregar produtos')
  } finally {
    loading.value = false
  }
}

// Confirmar exclusão
function confirmDelete(produto) {
  produtoParaExcluir.value = produto
  deleteDialog.value = true
}

// Excluir produto
async function deleteProduto() {
  if (!produtoParaExcluir.value) return

  try {
    deleting.value = true

    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', produtoParaExcluir.value.id)

    if (error) throw error

    // Recarregar lista
    await loadProdutos()

    deleteDialog.value = false
    produtoParaExcluir.value = null

  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    alert('Erro ao excluir produto. Tente novamente.')
  } finally {
    deleting.value = false
  }
}

// Carregar ao montar
onMounted(() => {
  loadProdutos()
})
</script>

<style scoped>
/* Estilos gerais */
.v-container {
  max-width: 1400px;
  padding: 24px !important;
}

.v-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08) !important;
}

/* Campo de busca */
.search-field {
  background-color: #f8f9fa;
  border-radius: 10px;
}

.search-field :deep(.v-field__outline) {
  border-radius: 10px !important;
}

/* Filtros */
.d-flex.flex-wrap {
  gap: 12px;
  align-items: center;
}

/* Chips de quantidade */
.quantity-chip {
  min-width: 70px;
  font-weight: 700;
  height: 32px;
  transition: all 0.3s ease;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.quantity-chip.quantity-low {
  background-color: #fee !important;
  color: #c62828 !important;
  border: 1px solid #ffcdd2;
}

.quantity-chip.quantity-medium {
  background-color: #fff3e0 !important;
  color: #ef6c00 !important;
  border: 1px solid #ffe0b2;
}

.quantity-chip.quantity-high {
  background-color: #f1f8e9 !important;
  color: #2e7d32 !important;
  border: 1px solid #dcedc8;
}

/* Texto de preço */
.price-text {
  color: #1a237e;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* CORREÇÃO: Botões de ação visíveis */
.action-buttons {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 8px !important;
  min-width: 160px !important;
  height: 100% !important;
  padding: 4px 0 !important;
}

.action-btn {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  border-radius: 10px !important;
  transition: all 0.25s ease !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.action-btn:hover {
  transform: translateY(-3px) scale(1.12) !important;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2) !important;
}

/* Estilos para os ícones SVG */
.action-icon {
  width: 20px !important;
  height: 20px !important;
  fill: currentColor;
  transition: all 0.2s ease;
}

.action-btn:hover .action-icon {
  transform: scale(1.15);
}

/* Cores específicas para os botões */
.action-btn:first-child {
  color: #0277bd !important;
}

.action-btn:nth-child(2) {
  color: #1565c0 !important;
}

.action-btn:last-child {
  color: #c62828 !important;
}

/* Botão Visualizar */
.action-btn:first-child:hover {
  background-color: #e3f2fd !important;
}

/* Botão Editar */
.action-btn:nth-child(2):hover {
  background-color: #e8eaf6 !important;
}

/* Botão Excluir */
.action-btn:last-child:hover {
  background-color: #ffebee !important;
}

/* Imagem do produto */
.product-image {
  border: 3px solid #f0f0f0;
  transition: all 0.3s ease;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.product-image:hover {
  border-color: #2196f3;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

/* Cabeçalho da tabela */
.estoque-table :deep(.v-data-table-header) {
  background-color: #f5f9ff !important;
  border-bottom: 2px solid #e3f2fd !important;
}

.estoque-table :deep(.v-data-table-header th) {
  font-weight: 700 !important;
  color: #1e3a8a !important;
  font-size: 0.9rem !important;
  height: 64px !important;
  padding: 0 16px !important;
  white-space: nowrap !important;
}

/* Células da tabela */
.estoque-table :deep(.v-data-table__td) {
  padding: 16px !important;
  vertical-align: middle !important;
  height: 76px !important;
}

.estoque-table :deep(.v-data-table__td:last-child) {
  padding-right: 16px !important;
}

/* Linhas da tabela */
.estoque-table :deep(.v-data-table tbody tr) {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f5f5f5 !important;
}

.estoque-table :deep(.v-data-table tbody tr:hover) {
  background-color: #f8fbff !important;
  box-shadow: inset 0 0 0 1px #bbdefb;
}

/* Diálogo de exclusão */
.v-dialog .v-card {
  border-radius: 20px;
  padding: 4px;
}

/* Responsividade */
@media (max-width: 960px) {
  .v-container {
    padding: 16px !important;
  }

  .d-flex.flex-wrap {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .search-field,
  .v-select {
    width: 100% !important;
    max-width: 100% !important;
    margin-bottom: 4px;
  }

  /* Ajuste de tabela em mobile */
  .estoque-table :deep(.v-data-table) {
    display: block;
    overflow-x: auto;
  }

  .action-buttons {
    min-width: 140px !important;
    gap: 4px !important;
  }

  .action-btn {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
  }
}

@media (max-width: 600px) {
  /* Ajuste fino para telas pequenas */
  .estoque-table :deep(.v-data-table__td) {
    padding: 12px 8px !important;
    height: auto !important;
  }

  .estoque-table :deep(.v-data-table-header th) {
    padding: 0 8px !important;
    font-size: 0.8rem !important;
  }

  .quantity-chip {
    min-width: 60px;
    font-size: 0.875rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px !important;
    min-width: 80px !important;
  }

  .action-btn {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
  }

  .action-icon {
    width: 18px !important;
    height: 18px !important;
  }
}

/* Animações */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.estoque-table {
  animation: fadeIn 0.5s ease;
}
</style>
