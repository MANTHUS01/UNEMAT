import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

// Dados iniciais com imagens das receitas
const sampleRecipes = [
  {
    id: 1,
    title: 'Quibe de Abóbora',
    tags: ['vegana', 'saudável', 'low carb'],
    ingredients: [
      'abóbora paulista',
      'cebola',
      'farinha de quibe',
      'azeite de oliva',
      'sal a gosto',
      'pimenta do reino'
    ],
    ingredientImages: [
      '/img/ingredientes/abobora-paulista.jpg',
      '/img/ingredientes/cebola.jpg',
      '/img/ingredientes/farinha-de-quibe.jpg',
      '/img/ingredientes/azeite-de-oliva.jpg',
      '/img/ingredientes/sal.jpg',
      '/img/ingredientes/pimenta-do-reino.jpg'
    ],
    recipeImage: '/img/receitas/quibe-de-abobora.jpg',
    instructions: `1. Descascar e ralar a abóbora\n2. Picar a cebola finamente\n3. Misturar todos os ingredientes\n4. Modelar no formato de quibe\n5. Assar por 30 minutos a 180°C`,
    cookingTime: 45,
    difficulty: 'Médio',
    author: 'Chef Saudável'
  },
  {
    id: 2,
    title: 'Omelete Rápido',
    tags: ['proteína', 'rápido', 'café da manhã'],
    ingredients: [
      'ovos',
      'cebolinha',
      'tomate',
      'fatias de queijo',
      'azeite de oliva',
      'sal a gosto'
    ],
    ingredientImages: [
      '/img/ingredientes/ovo.jpg',
      '/img/ingredientes/cebolinha.jpg',
      '/img/ingredientes/tomate.jpg',
      '/img/ingredientes/fatias-de-queijo.jpg',
      '/img/ingredientes/azeite-de-oliva.jpg',
      '/img/ingredientes/sal.jpg'
    ],
    recipeImage: '/img/receitas/omelete-rapido.jpg',
    instructions: `1. Bater os ovos em uma tigela\n2. Picar os ingredientes e misturar\n3. Aquecer o azeite na frigideira\n4. Despejar a mistura e cozinhar por 5 minutos\n5. Virar e cozinhar por mais 3 minutos`,
    cookingTime: 10,
    difficulty: 'Fácil',
    author: 'Chef Rápido'
  },
  {
    id: 3,
    title: 'Strogonoff Fit com Batata Doce',
    tags: ['fit', 'proteína', 'low carb'],
    ingredients: [
      'peito de frango',
      'batata doce',
      'cebola',
      'molho de tomate',
      'iogurte natural',
      'tempero verde'
    ],
    ingredientImages: [
      '/img/ingredientes/peito-de-frango.jpg',
      '/img/ingredientes/batata-doce.jpg',
      '/img/ingredientes/cebola.jpg',
      '/img/ingredientes/molho-de-tomate.jpg',
      '/img/ingredientes/iogurte-natural.jpg',
      '/img/ingredientes/tempero-verde.jpg'
    ],
    recipeImage: '/img/receitas/strogonoff-fit.jpg',
    instructions: `1. Cortar o frango em cubos\n2. Refogar com cebola\n3. Adicionar molho de tomate\n4. Cozinhar a batata doce\n5. Misturar iogurte no final\n6. Finalizar com tempero verde`,
    cookingTime: 30,
    difficulty: 'Médio',
    author: 'Chef Fitness'
  },
  {
    id: 4,
    title: 'Pão de Queijo de Inhame',
    tags: ['saudável', 'sem glúten', 'lanche'],
    ingredients: [
      '1 + 1/2 xícara de polvilho doce',
      '1 xícara de polvilho azedo',
      '100 g de queijo minas padrão',
      'sal a gosto',
      '1/2 xícara de óleo',
      '1/2 xícara de água',
      '2 inhames cozidos e amassados como um purê',
      '1 colher (sopa) de chia'
    ],
    ingredientImages: [
      '/img/ingredientes/polvilho-doce.jpg',
      '/img/ingredientes/polvilho-azedo.jpg',
      '/img/ingredientes/queijo-minas.jpg',
      '/img/ingredientes/sal.jpg',
      '/img/ingredientes/oleo.jpg',
      '/img/ingredientes/agua.jpg',
      '/img/ingredientes/inhame.jpg',
      '/img/ingredientes/chia.jpg'
    ],
    recipeImage: '/img/receitas/pao-de-queijo-inhame.jpg',
    instructions: `1. Em uma tigela, misture o polvilho doce, o polvilho azedo, o queijo, o sal e o óleo.\n2. Misture bem.\n3. Adicione a água, o purê de inhame e a chia.\n4. Misture bem até formar uma massa homogênea.\n5. Faça bolinhas com a massa.\n6. Coloque-as em uma forma untada com óleo.\n7. Leve ao forno preaquecido (200° C) por cerca de 30 minutos.`,
    cookingTime: 40,
    difficulty: 'Fácil',
    author: 'Chef Saudável'
  }
]

// Inicializar localStorage
if (!localStorage.getItem('recipes')) {
  localStorage.setItem('recipes', JSON.stringify(sampleRecipes))
}

// Criar e montar a aplicação
const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')