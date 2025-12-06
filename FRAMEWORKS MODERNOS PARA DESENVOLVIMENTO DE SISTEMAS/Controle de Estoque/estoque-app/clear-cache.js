// clear-cache.js
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🧹 =================================')
console.log('🧹 LIMPANDO CACHE DO PROJETO')
console.log('🧹 =================================')

// Lista de pastas e arquivos para limpar
const itemsToClear = [
  'node_modules/.vite',
  'node_modules/.cache',
  'dist',
  '.vite',
  '.vite-cache',
  'src/.vite'
]

let clearedCount = 0

itemsToClear.forEach(item => {
  const fullPath = path.join(__dirname, item)

  try {
    if (fs.existsSync(fullPath)) {
      console.log(`🧹 Removendo: ${item}`)
      fs.rmSync(fullPath, { recursive: true, force: true })
      clearedCount++
    } else {
      console.log(`✅ ${item} não existe`)
    }
  } catch (error) {
    console.log(`❌ Erro ao remover ${item}:`, error.message)
  }
})

// Limpar cache do npm local
console.log('🧹 Limpando cache do npm...')
try {
  execSync('npm cache clean --force', { stdio: 'inherit' })
} catch (error) {
  console.log('⚠️  Não foi possível limpar cache do npm:', error.message)
}

// Verificar se há duplicatas no package.json
console.log('🔍 Verificando package.json...')
try {
  const packageJsonPath = path.join(__dirname, 'package.json')
  const packageContent = fs.readFileSync(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageContent)

  // Verificar chaves duplicadas
  const keys = Object.keys(packageJson)
  const uniqueKeys = [...new Set(keys)]

  if (keys.length !== uniqueKeys.length) {
    console.log('⚠️  ATENÇÃO: Possíveis chaves duplicadas no package.json!')
    console.log('   Considere verificar manualmente o arquivo.')
  } else {
    console.log('✅ package.json parece estar OK')
  }
} catch (error) {
  console.log('❌ Erro ao verificar package.json:', error.message)
}

console.log('🧹 =================================')
console.log(`✅ Cache limpo: ${clearedCount} itens removidos`)
console.log('✅ Execute: npm run dev')
console.log('✅ Ou: npm run fresh (limpa e inicia)')
console.log('🧹 =================================')

// Criar diretórios necessários após limpeza
const requiredDirs = [
  'node_modules/.vite',
  'src/assets',
  'src/components',
  'src/views',
  'src/stores'
]

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir)
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true })
      console.log(`📁 Criado: ${dir}`)
    } catch (error) {
      console.log(`⚠️  Não foi possível criar ${dir}:`, error.message)
    }
  }
})
