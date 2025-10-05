# 🥗 Catálogo de Receitas Saudáveis

Um sistema web moderno para gerenciar e compartilhar receitas saudáveis, desenvolvido com Vue 3 e Vuetify 3 como parte da disciplina de **Frameworks Modernos para Desenvolvimento de Sistemas** do curso TADS da UNEMAT.

## ✨ Funcionalidades

### 🍽️ Gestão de Receitas
- **CRUD Completo**: Criar, visualizar, editar e excluir receitas
- **Imagens dos Ingredientes**: Cada ingrediente pode ter sua própria imagem
- **Imagem Principal**: Foto da receita pronta
- **Categorização por Tags**: Organize receitas por categorias (vegana, low carb, proteína, etc.)
- **Informações Detalhadas**: Tempo de preparo, dificuldade e autor

### 🔍 Busca e Filtros
- **Busca Inteligente**: Encontre receitas por título, ingredientes ou tags
- **Filtro por Tags**: Filtre receitas por categorias específicas
- **Ordenação**: Ordene por título, tempo de preparo ou dificuldade
- **Visualização Responsiva**: Interface adaptável para desktop e mobile

### 👤 Sistema de Autenticação
- **Login Seguro**: Sistema de autenticação com usuários pré-cadastrados
- **Proteção de Rotas**: Apenas usuários autenticados podem adicionar/editar receitas
- **Diferentes Perfis**: Administrador, Chef e Usuário comum

### 🎨 Interface Moderna
- **Design Material**: Interface seguindo o Material Design com Vuetify
- **Modo Claro/Escuro**: Alternância entre temas
- **Cards Interativos**: Visualização atrativa das receitas
- **Snackbars**: Feedback visual para ações do usuário

## 🚀 Tecnologias Utilizadas

- **Vue 3** - Framework JavaScript progressivo
- **Vuetify 3** - Biblioteca de componentes Material Design
- **Vue Router 4** - Roteamento para Single Page Application
- **Composition API** - Sistema de composição do Vue 3
- **LocalStorage** - Persistência local dos dados
- **Vite** - Build tool e dev server rápido

## 📦 Estrutura do Projeto

```
catalogo-receitas/
├── public/
│   └── img/
│       ├── ingredientes/     # Imagens dos ingredientes
│       └── receitas/         # Imagens das receitas prontas
├── src/
│   ├── components/
│   │   ├── ConfirmDialog.vue # Modal de confirmação
│   │   └── RecipeCard.vue    # Card de exibição de receita
│   ├── views/
│   │   ├── HomeView.vue      # Página inicial com listagem
│   │   ├── RecipeFormView.vue # Formulário de CRUD
│   │   ├── AboutView.vue     # Página sobre o sistema
│   │   └── LoginView.vue     # Página de autenticação
│   ├── router/
│   │   └── index.js          # Configuração de rotas
│   ├── plugins/
│   │   └── vuetify.js        # Configuração do Vuetify
│   ├── App.vue               # Componente principal
│   └── main.js               # Ponto de entrada
└── package.json
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Passos para execução

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd catalogo-receitas
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute em modo desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:3000
```

### Build para produção
```bash
npm run build
```

## 👥 Usuários para Teste

O sistema vem com usuários pré-cadastrados para teste:

| Usuário | Senha | Perfil |
|---------|-------|---------|
| `admin` | `admin123` | Administrador |
| `chef` | `chef123` | Chef Cozinha |
| `usuario` | `user123` | Usuário Comum |

## 📋 Receitas Incluídas

### 1. 🥗 Quibe de Abóbora
- **Tags**: vegana, saudável, low carb
- **Tempo**: 45 minutos
- **Dificuldade**: Médio

### 2. 🍳 Omelete Rápido
- **Tags**: proteína, rápido, café da manhã
- **Tempo**: 10 minutos
- **Dificuldade**: Fácil

### 3. 🍗 Strogonoff Fit com Batata Doce
- **Tags**: fit, proteína, low carb
- **Tempo**: 30 minutos
- **Dificuldade**: Médio

### 4. 🥖 Pão de Queijo de Inhame
- **Tags**: saudável, sem glúten, lanche
- **Tempo**: 40 minutos
- **Dificuldade**: Fácil

## 🖼️ Sistema de Imagens

### Estrutura de Imagens
- **Ingredientes**: Imagens individuais para cada ingrediente
- **Receitas**: Fotos das receitas prontas
- **Upload**: Sistema de upload de imagens com preview
- **Fallback**: Placeholders para imagens não encontradas

### Formatos Suportados
- JPG, PNG, GIF
- Tamanho máximo: 2MB por imagem
- Redimensionamento automático

## 🔒 Funcionalidades de Segurança

- **Validação de Formulários**: Campos obrigatórios e validação de tipos
- **Proteção de Rotas**: Apenas usuários autenticados podem modificar receitas
- **Persistência Segura**: Dados salvos localmente no navegador
- **Feedback Visual**: Confirmações para ações destrutivas (excluir)

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Tablet**: Layout adaptado para tablets
- **Desktop**: Experiência completa para desktop
- **Navegação Touch**: Otimizado para touch screens

## 🎯 Funcionalidades Técnicas

### Performance
- **Carregamento Rápido**: Otimizado com Vite
- **Lazy Loading**: Carregamento sob demanda de componentes
- **Estado Local**: Gerenciamento eficiente do estado da aplicação

### UX/UI
- **Feedback Imediato**: Snackbars para todas as ações
- **Navegação Intuitiva**: Breadcrumbs e indicação visual da rota atual
- **Estados Vazios**: Mensagens amigáveis para listas vazias
- **Loading States**: Indicadores de carregamento

## 🌐 Deploy

### GitHub Pages
```bash
npm run build
# Faça upload da pasta dist/ para o GitHub Pages
```

### Outras Plataformas
- Netlify
- Vercel
- Firebase Hosting
- Qualquer servidor estático

## 📊 Estatísticas do Sistema

A página "Sobre" inclui estatísticas em tempo real:
- Total de receitas cadastradas
- Número de tags únicas
- Tempo médio de preparo
- Quantidade de receitas fáceis

## 🚧 Desenvolvimento Futuro

Funcionalidades planejadas para versões futuras:
- [ ] Sistema de favoritos
- [ ] Compartilhamento de receitas
- [ ] Lista de compras automática
- [ ] Modo offline completo
- [ ] Backup em nuvem
- [ ] Sistema de avaliações
- [ ] Calculadora nutricional

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da disciplina de Frameworks Modernos para Desenvolvimento de Sistemas do curso TADS da UNEMAT.

## 👨‍💻 Desenvolvido por

**Aluno**: [Seu Nome]
**Disciplina**: Frameworks Modernos para Desenvolvimento de Sistemas
**Curso**: TADS - UNEMAT
**Ano**: 2024

---

**🍽️ Bon Appétit!** Explore, crie e compartilhe receitas saudáveis!
