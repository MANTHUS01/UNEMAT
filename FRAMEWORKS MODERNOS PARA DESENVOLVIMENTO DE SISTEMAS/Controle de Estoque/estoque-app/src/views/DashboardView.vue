<template>
  <v-container>
    <!-- Cabeçalho -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h3 mb-2">Dashboard</h1>
            <p class="text-body-1 text-grey">Bem-vindo, {{ userName }}! Aqui está o resumo do seu estoque.</p>
          </div>
          <v-btn
            color="primary"
            to="/produto/novo"
            prepend-icon="mdi-plus"
            size="large"
            class="btn-novo"
          >
            Novo Produto
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Cards de Estatísticas -->
    <v-row class="mb-8">
      <v-col cols="12" md="4">
        <v-card color="primary" theme="dark" class="stat-card">
          <v-card-text class="d-flex align-center">
            <div class="stat-icon">
              <v-icon size="48">mdi-package-variant</v-icon>
            </div>
            <div class="stat-content">
              <div class="text-h3">{{ statistics.totalProdutos }}</div>
              <div class="text-body-1">Produtos no Estoque</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="warning" theme="dark" class="stat-card">
          <v-card-text class="d-flex align-center">
            <div class="stat-icon">
              <v-icon size="48">mdi-alert</v-icon>
            </div>
            <div class="stat-content">
              <div class="text-h3">{{ statistics.baixoEstoque }}</div>
              <div class="text-body-1">Estoque Baixo</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="success" theme="dark" class="stat-card">
          <v-card-text class="d-flex align-center">
            <div class="stat-icon">
              <v-icon size="48">mdi-cash</v-icon>
            </div>
            <div class="stat-content">
              <div class="text-h3">{{ statistics.valorTotal }}</div>
              <div class="text-body-1">Valor Total</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabela de Produtos Recentes -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="table-card">
          <v-card-title class="d-flex justify-space-between align-center pa-4">
            <div>
              <span class="text-h5">Produtos Recentes</span>
              <v-chip color="primary" variant="flat" size="small" class="ml-2">
                {{ produtos.length }} itens
              </v-chip>
            </div>
            <v-btn
              to="/estoque"
              variant="text"
              prepend-icon="mdi-arrow-right"
              color="primary"
              class="btn-ver-todos"
            >
              Ver Todos
            </v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-0">
            <v-data-table
              :headers="headers"
              :items="produtos"
              :loading="loading"
              :items-per-page="5"
              hide-default-footer
              class="dashboard-table"
            >
              <!-- Coluna Imagem -->
              <template #item.imagem_url="{ item }">
                <v-avatar size="40" rounded class="table-image">
                  <v-img
                    :src="item.imagem_url || 'https://via.placeholder.com/40'"
                    :alt="item.nome"
                    cover
                  >
                    <template #placeholder>
                      <v-icon icon="mdi-package-variant" size="20"></v-icon>
                    </template>
                  </v-img>
                </v-avatar>
              </template>

              <!-- Coluna Quantidade -->
              <template #item.quantidade="{ item }">
                <v-chip
                  :color="getQuantidadeColor(item.quantidade)"
                  variant="flat"
                  size="small"
                  class="table-quantity"
                >
                  {{ item.quantidade }}
                </v-chip>
              </template>

              <!-- Coluna Preço -->
              <template #item.preco="{ item }">
                <span class="font-weight-medium table-price">
                  R$ {{ formatPreco(item.preco) }}
                </span>
              </template>

              <!-- Coluna Ações - COM ÍCONES EM SVG -->
              <template #item.actions="{ item }">
                <div class="d-flex justify-center table-actions">
                  <!-- Botão Visualizar -->
                  <v-btn
                    variant="text"
                    size="small"
                    color="info"
                    :to="`/produto/detalhes/${item.id}`"
                    class="table-btn"
                    title="Visualizar"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" class="table-icon">
                      <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                    </svg>
                  </v-btn>

                  <!-- Botão Editar -->
                  <v-btn
                    variant="text"
                    size="small"
                    color="primary"
                    :to="`/produto/${item.id}`"
                    class="table-btn"
                    title="Editar"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" class="table-icon">
                      <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                    </svg>
                  </v-btn>

                  <!-- Botão Excluir -->
                  <v-btn
                    variant="text"
                    size="small"
                    color="error"
                    @click="confirmDelete(item)"
                    class="table-btn"
                    title="Excluir"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" class="table-icon">
                      <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                  </v-btn>
                </div>
              </template>

              <!-- Mensagem vazia -->
              <template #no-data>
                <div class="py-8 text-center">
                  <v-icon icon="mdi-package-variant-closed" size="48" class="mb-4 text-grey-lighten-1"></v-icon>
                  <p class="text-body-1 text-grey">Nenhum produto cadastrado</p>
                  <v-btn
                    color="primary"
                    to="/produto/novo"
                    variant="text"
                    class="mt-2"
                  >
                    Adicionar Primeiro Produto
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráfico e Ações Rápidas -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-chart-bar" class="mr-2"></v-icon>
            Distribuição por Categoria
          </v-card-title>
          <v-card-text>
            <div v-if="categorias.length > 0">
              <div v-for="cat in categorias.slice(0, 5)" :key="cat.nome" class="mb-3">
                <div class="d-flex justify-space-between mb-1">
                  <span class="text-body-2">{{ cat.nome }}</span>
                  <span class="text-body-2 font-weight-medium">{{ cat.quantidade }} produtos</span>
                </div>
                <v-progress-linear
                  :model-value="(cat.quantidade / statistics.totalProdutos) * 100"
                  color="primary"
                  height="10"
                  rounded
                  class="category-bar"
                ></v-progress-linear>
              </div>
              <div v-if="categorias.length > 5" class="text-center mt-4">
                <v-chip variant="outlined" size="small">
                  +{{ categorias.length - 5 }} outras categorias
                </v-chip>
              </div>
            </div>
            <div v-else class="text-center py-6">
              <v-icon icon="mdi-chart-line" size="48" class="mb-4 text-grey-lighten-1"></v-icon>
              <p class="text-body-1 text-grey">Sem dados para exibir</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-lightning-bolt" class="mr-2"></v-icon>
            Ações Rápidas
          </v-card-title>
          <v-card-text>
            <v-list class="quick-actions">
              <v-list-item
                v-for="action in quickActions"
                :key="action.title"
                :to="action.to"
                @click="action.click ? action.click() : null"
                class="quick-action-item"
                :class="{ 'disabled': action.loading }"
              >
                <template v-slot:prepend>
                  <v-avatar :color="action.color" size="40" class="action-icon">
                    <v-icon :icon="action.icon" size="20"></v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-1 font-weight-medium">
                  {{ action.title }}
                  <v-progress-circular
                    v-if="action.loading"
                    indeterminate
                    size="20"
                    width="2"
                    class="ml-2"
                  ></v-progress-circular>
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption">
                  {{ action.subtitle }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
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
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const produtos = ref([])
const loading = ref(false)
const deleteDialog = ref(false)
const produtoParaExcluir = ref(null)
const deleting = ref(false)
const gerandoPDF = ref(false) // Novo estado para controle do PDF

// Computed properties
const userName = computed(() => {
  return authStore.user?.user_metadata?.full_name ||
         authStore.user?.email?.split('@')[0] ||
         'Usuário'
})

const statistics = computed(() => {
  const total = produtos.value.length
  const baixoEstoque = produtos.value.filter(p => p.quantidade < 10).length
  const valorTotal = produtos.value.reduce((sum, p) => sum + (p.preco * p.quantidade), 0)

  return {
    totalProdutos: total,
    baixoEstoque: baixoEstoque,
    valorTotal: formatCurrency(valorTotal)
  }
})

const categorias = computed(() => {
  const categoriasMap = {}

  produtos.value.forEach(produto => {
    const cat = produto.categoria || 'Sem categoria'
    if (!categoriasMap[cat]) {
      categoriasMap[cat] = { nome: cat, quantidade: 0 }
    }
    categoriasMap[cat].quantidade++
  })

  return Object.values(categoriasMap)
    .sort((a, b) => b.quantidade - a.quantidade)
})

// IMPORTANTE: As chaves DEVEM corresponder aos nomes dos campos
const headers = [
  {
    title: '',
    key: 'imagem_url',
    width: '60px',
    sortable: false,
    align: 'center'
  },
  {
    title: 'Nome',
    key: 'nome',
    align: 'start'
  },
  {
    title: 'Marca',
    key: 'marca',
    width: '120px',
    align: 'start'
  },
  {
    title: 'Quantidade',
    key: 'quantidade',
    align: 'center',
    width: '120px'
  },
  {
    title: 'Preço',
    key: 'preco',
    align: 'end',
    width: '120px'
  },
  {
    title: 'Ações',
    key: 'actions',
    align: 'center',
    width: '160px',
    sortable: false
  }
]

// Ações rápidas - ATUALIZADO com função de clique
const quickActions = computed(() => [
  {
    title: 'Adicionar Produto',
    subtitle: 'Cadastrar novo item',
    icon: 'mdi-plus-circle',
    to: '/produto/novo',
    color: 'primary'
  },
  {
    title: 'Ver Estoque Completo',
    subtitle: 'Listar todos os produtos',
    icon: 'mdi-warehouse',
    to: '/estoque',
    color: 'blue'
  },
  {
    title: 'Relatório PDF',
    subtitle: 'Gerar relatório em PDF',
    icon: 'mdi-file-pdf-box',
    color: 'red',
    click: gerarRelatorioPDF,
    loading: gerandoPDF.value
  }
])

// Helper functions
function formatPreco(valor) {
  return parseFloat(valor).toFixed(2).replace('.', ',')
}

function formatCurrency(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',')
}

function getQuantidadeColor(quantidade) {
  if (quantidade < 5) return 'error'
  if (quantidade < 10) return 'warning'
  return 'success'
}

// Função para gerar relatório PDF (versão simples sem jsPDF)
async function gerarRelatorioPDF() {
  try {
    gerandoPDF.value = true

    // Buscar todos os produtos
    const { data: produtosCompletos, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome')

    if (error) throw error

    // Calcular estatísticas
    const totalProdutos = produtosCompletos.length
    const baixoEstoque = produtosCompletos.filter(p => p.quantidade < 10).length
    const criticos = produtosCompletos.filter(p => p.quantidade < 5).length
    const valorTotal = produtosCompletos.reduce((sum, p) => sum + (p.preco * p.quantidade), 0)

    // Criar tabela HTML
    let tabelaHTML = `
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
        <thead style="background-color: #1976d2; color: white;">
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Marca</th>
            <th>Categoria</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `

    produtosCompletos.forEach(produto => {
      const nivelEstoque = produto.quantidade < 5 ? 'CRÍTICO' :
                          produto.quantidade < 10 ? 'BAIXO' : 'NORMAL'
      const corStatus = produto.quantidade < 5 ? 'color: #c62828; font-weight: bold;' :
                       produto.quantidade < 10 ? 'color: #ef6c00; font-weight: bold;' : 'color: #2e7d32;'

      tabelaHTML += `
        <tr>
          <td>${produto.codigo || '-'}</td>
          <td>${produto.nome}</td>
          <td>${produto.marca || '-'}</td>
          <td>${produto.categoria || 'Sem categoria'}</td>
          <td style="text-align: center;">${produto.quantidade}</td>
          <td style="text-align: right;">R$ ${parseFloat(produto.preco).toFixed(2).replace('.', ',')}</td>
          <td style="${corStatus}">${nivelEstoque}</td>
        </tr>
      `
    })

    tabelaHTML += '</tbody></table>'

    // Criar conteúdo HTML completo
    const conteudoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Estoque</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #1976d2;
            padding-bottom: 20px;
          }
          h1 {
            color: #1976d2;
            margin-bottom: 5px;
          }
          .info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
          }
          .statistics {
            background-color: #f5f9ff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #1976d2;
          }
          .stat-item {
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
          }
          .alert-section {
            background-color: #ffebee;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #c62828;
          }
          .alert-title {
            color: #c62828;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .warning-section {
            background-color: #fff3e0;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ef6c00;
          }
          .warning-title {
            color: #ef6c00;
            font-weight: bold;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #1976d2;
            color: white;
            padding: 10px;
            text-align: left;
          }
          td {
            padding: 8px;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RELATÓRIO DE ESTOQUE</h1>
          <p>Sistema de Controle de Estoque</p>
        </div>

        <div class="info">
          <div>
            <strong>Gerado por:</strong> ${userName.value}<br>
            <strong>Empresa:</strong> Controle de Estoque
          </div>
          <div style="text-align: right;">
            <strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}<br>
            <strong>Hora:</strong> ${new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>

        <div class="statistics">
          <h3 style="color: #1976d2; margin-top: 0;">ESTATÍSTICAS GERAIS</h3>
          <div class="stat-item">
            <span>Total de Produtos:</span>
            <strong>${totalProdutos}</strong>
          </div>
          <div class="stat-item">
            <span>Produtos com Estoque Baixo (&lt;10):</span>
            <strong style="color: #ef6c00;">${baixoEstoque}</strong>
          </div>
          <div class="stat-item">
            <span>Produtos Críticos (&lt;5):</span>
            <strong style="color: #c62828;">${criticos}</strong>
          </div>
          <div class="stat-item">
            <span>Valor Total em Estoque:</span>
            <strong style="color: #2e7d32;">R$ ${valorTotal.toFixed(2).replace('.', ',')}</strong>
          </div>
        </div>

        <h3 style="color: #1976d2;">LISTA COMPLETA DE PRODUTOS</h3>
        ${tabelaHTML}

        ${baixoEstoque > 0 ? `
          <div class="alert-section">
            <div class="alert-title">⚠️ ALERTAS DE ESTOQUE BAIXO</div>
            <p>Os seguintes produtos estão com estoque abaixo do recomendado:</p>
            <ul>
              ${produtosCompletos
                .filter(p => p.quantidade < 5)
                .map(p => `<li><strong>${p.nome}</strong> - Estoque: ${p.quantidade} (CRÍTICO)</li>`)
                .join('')}
            </ul>
          </div>

          <div class="warning-section">
            <div class="warning-title">⚠️ PRODUTOS COM ESTOQUE ATENÇÃO</div>
            <p>Os seguintes produtos estão com estoque abaixo de 10 unidades:</p>
            <ul>
              ${produtosCompletos
                .filter(p => p.quantidade >= 5 && p.quantidade < 10)
                .map(p => `<li><strong>${p.nome}</strong> - Estoque: ${p.quantidade}</li>`)
                .join('')}
            </ul>
          </div>
        ` : ''}

        <div class="footer">
          <p>Relatório gerado automaticamente pelo Sistema de Controle de Estoque</p>
          <p>Para mais informações, acesse o sistema ou entre em contato com o administrador.</p>
        </div>

        <script>
          // Função para imprimir o relatório
          window.onload = function() {
            // Auto-print opcional (comentado para não forçar impressão)
            // window.print();

            // Adicionar botão de impressão
            const printBtn = document.createElement('button');
            printBtn.innerHTML = '🖨️ Imprimir Relatório';
            printBtn.style.cssText = \`
              position: fixed;
              bottom: 20px;
              right: 20px;
              background-color: #1976d2;
              color: white;
              border: none;
              padding: 12px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              z-index: 1000;
              box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            \`;
            printBtn.onclick = function() {
              window.print();
            };
            document.body.appendChild(printBtn);
          };
        <\/script>
      </body>
      </html>
    `

    // Abrir nova janela com o relatório
    const novaJanela = window.open('', '_blank')
    novaJanela.document.write(conteudoHTML)
    novaJanela.document.close()

    // Focar na nova janela
    novaJanela.focus()

    // Mostrar mensagem de sucesso
    alert('Relatório gerado com sucesso! Uma nova janela foi aberta com o relatório completo.\n\nVocê pode imprimir o relatório ou salvá-lo como PDF usando a opção "Imprimir" do navegador.')

  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    alert('Erro ao gerar relatório. Verifique se há produtos cadastrados e tente novamente.')
  } finally {
    gerandoPDF.value = false
  }
}

// Carregar produtos
async function loadProdutos() {
  try {
    loading.value = true

    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8)

    if (error) throw error

    produtos.value = data || []
    console.log('Produtos carregados no dashboard:', produtos.value.length)

  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
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
    alert('Erro ao excluir produto')
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

/* Cards de estatísticas */
.stat-card {
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  min-height: 120px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2) !important;
}

.stat-icon {
  margin-right: 20px;
  opacity: 0.9;
  display: flex;
  align-items: center;
}

.stat-content .text-h3 {
  font-weight: 800 !important;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

/* Tabela */
.table-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
  margin-top: 20px;
}

/* Garantir que a tabela ocupe espaço correto */
.dashboard-table {
  width: 100% !important;
  table-layout: fixed !important;
}

/* Ações visíveis */
.dashboard-table :deep(.v-data-table__td) {
  padding: 12px 16px !important;
  vertical-align: middle !important;
}

.dashboard-table :deep(.v-data-table__td:last-child) {
  padding-right: 16px !important;
}

/* Cabeçalho da tabela */
.dashboard-table :deep(.v-data-table-header) {
  background-color: #f1f8ff !important;
  border-bottom: 2px solid #e3f2fd;
}

.dashboard-table :deep(th) {
  font-weight: 700 !important;
  color: #1e3a8a !important;
  font-size: 0.875rem !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px !important;
  height: 60px !important;
}

/* Linhas da tabela */
.dashboard-table :deep(tbody tr) {
  height: 72px !important;
  border-bottom: 1px solid #f0f0f0 !important;
}

.dashboard-table :deep(tbody tr:hover) {
  background-color: #f8fbff !important;
}

/* Botões de ação visíveis */
.table-actions {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 8px !important;
  min-width: 150px !important;
}

.table-btn {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  visibility: visible !important;
  opacity: 1 !important;
}

.table-btn:hover {
  transform: translateY(-2px) scale(1.1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Estilos para os ícones SVG */
.table-icon {
  width: 18px !important;
  height: 18px !important;
  fill: currentColor;
  transition: all 0.2s ease;
}

.table-btn:hover .table-icon {
  transform: scale(1.15);
}

/* Cores específicas para os botões */
.table-btn:first-child {
  color: #0288d1 !important;
}

.table-btn:nth-child(2) {
  color: #1976d2 !important;
}

.table-btn:last-child {
  color: #d32f2f !important;
}

/* Botão Visualizar */
.table-btn:first-child:hover {
  background-color: #e3f2fd !important;
}

/* Botão Editar */
.table-btn:nth-child(2):hover {
  background-color: #e8eaf6 !important;
}

/* Botão Excluir */
.table-btn:last-child:hover {
  background-color: #ffebee !important;
}

/* Imagem na tabela */
.table-image {
  border: 3px solid #e3f2fd;
  transition: all 0.3s ease;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.table-image:hover {
  border-color: #1976d2;
  transform: scale(1.08);
}

/* Chip de quantidade */
.table-quantity {
  font-weight: 700;
  min-width: 60px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Preço na tabela */
.table-price {
  color: #1e40af;
  font-size: 1rem;
  font-weight: 600;
}

/* Botões principais */
.btn-novo {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  padding: 0 28px;
  height: 48px;
  font-size: 1rem;
  letter-spacing: 0.3px;
}

.btn-ver-todos {
  text-transform: none;
  font-weight: 500;
  padding: 8px 16px;
}

/* Barras de categoria */
.category-bar {
  border-radius: 10px;
  overflow: hidden;
}

/* Ações rápidas */
.quick-actions {
  padding: 8px 0;
}

.quick-action-item {
  border-radius: 12px;
  margin-bottom: 8px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.quick-action-item:hover:not(.disabled) {
  background-color: #f0f7ff !important;
  transform: translateX(8px);
  border-color: #bbdefb;
}

.quick-action-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-icon {
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsividade */
@media (max-width: 960px) {
  .v-container {
    padding: 16px !important;
  }

  .stat-card .d-flex {
    flex-direction: column;
    text-align: center;
    padding: 16px !important;
  }

  .stat-icon {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .text-h3 {
    font-size: 2.125rem !important;
  }

  .table-actions {
    flex-wrap: wrap;
    justify-content: flex-start !important;
    gap: 4px !important;
  }

  .table-btn {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px !important;
  }

  .table-icon {
    width: 16px !important;
    height: 16px !important;
  }
}

@media (max-width: 600px) {
  .table-card {
    border-radius: 12px;
  }

  .dashboard-table :deep(.v-data-table__td) {
    padding: 8px !important;
  }

  .table-actions {
    min-width: 120px !important;
  }
}

/* Animações */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card, .table-card, .v-card {
  animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.table-card { animation-delay: 0.4s; }
.v-card { animation-delay: 0.5s; }

/* Animação para o botão de PDF */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

.quick-action-item:nth-child(3):hover {
  animation: pulse 1.5s infinite;
}
</style>
