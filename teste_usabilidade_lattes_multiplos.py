from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from datetime import datetime
import time
import traceback
import statistics

# ─────────────────────────────────────────────
# CONFIGURAÇÃO
# ─────────────────────────────────────────────

URLS_CURRICULOS = [
    # ESTUDANTES
    "coloque aqui as URLs dos currículos de estudantes",

    # GRADUADOS
    "coloque aqui as URLs dos currículos de graduados",

    # PÓS / MESTRADO
    "coloque aqui as URLs dos currículos de pós-graduados"
]

TEMPO_ESPERA = 60
ARQUIVO_RELATORIO = "relatorio_usabilidade_lattes_multiplos.txt"
ARQUIVO_DETALHADO = "detalhes_tempos.csv"


# ─────────────────────────────────────────────
# FUNÇÕES
# ─────────────────────────────────────────────

def iniciar_driver():
    opcoes = webdriver.ChromeOptions()
    opcoes.add_argument("--start-maximized")
    opcoes.add_argument("--disable-notifications")
    opcoes.add_argument("--disable-blink-features=AutomationControlled")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=opcoes
    )
    return driver


def registrar(linhas, texto, arquivo=None):
    """Registra texto no console e na lista de linhas"""
    print(texto)
    linhas.append(texto)
    
    # Se um arquivo for especificado, escreve também
    if arquivo:
        with open(arquivo, "a", encoding="utf-8") as f:
            f.write(texto + "\n")


def aguardar_captcha(driver):
    """Verifica e aguarda resolução do CAPTCHA, retornando se houve CAPTCHA"""
    print("\n⏳ Verificando se há CAPTCHA...")
    time.sleep(2)

    apareceu = False
    tempo_captcha = 0
    inicio_captcha = None

    while True:
        fonte = driver.page_source.lower()

        tem_captcha = (
            "captcha" in fonte or
            "recaptcha" in fonte or
            "não sou um robô" in fonte or
            "nao sou um robo" in fonte
        )

        if tem_captcha:
            if not apareceu:
                print("\n⚠️ CAPTCHA detectado!")
                print("👉 Resolva o CAPTCHA e clique em 'Submeter'.")
                print("⏳ O cronômetro do CAPTCHA começou...\n")
                apareceu = True
                inicio_captcha = time.perf_counter()

            time.sleep(1)

        else:
            if apareceu:
                tempo_captcha = round(time.perf_counter() - inicio_captcha, 2)
                print(f"✔ CAPTCHA resolvido em {tempo_captcha}s!")
            else:
                print("✔ Nenhum CAPTCHA encontrado.")

            return apareceu, tempo_captcha


def testar_curriculo(driver, url, linhas, tempos, captcha_tempos, idx):
    """Testa um currículo individual e retorna métricas detalhadas"""
    
    # Timestamp para identificação
    timestamp = datetime.now().strftime("%H:%M:%S")
    
    registrar(linhas, f"\n{'='*55}")
    registrar(linhas, f"🔁 Testando currículo #{idx + 1}")
    registrar(linhas, f"URL: {url}")
    registrar(linhas, f"⏰ Início: {timestamp}")
    registrar(linhas, f"{'='*55}")

    # ===================================================
    # PASSO 1: ABRE A URL E RESOLVE CAPTCHA
    # ===================================================
    inicio_total = time.perf_counter()
    
    driver.get(url)

    # Aguarda o usuário resolver o CAPTCHA
    captcha_ocorreu, tempo_captcha = aguardar_captcha(driver)
    captcha_tempos.append(tempo_captcha if captcha_ocorreu else 0)

    # ===================================================
    # PASSO 2: AGORA COMEÇA A CONTAGEM REAL (SEM CAPTCHA)
    # ===================================================
    
    inicio_carregamento = time.perf_counter()

    WebDriverWait(driver, TEMPO_ESPERA).until(
        EC.presence_of_element_located((By.TAG_NAME, "body"))
    )

    WebDriverWait(driver, TEMPO_ESPERA).until(
        lambda d: len(d.title) > 0
    )

    fim_carregamento = time.perf_counter()

    # ===================================================
    # PASSO 3: COLETA DE MÉTRICAS
    # ===================================================
    
    tempo_carregamento = round(fim_carregamento - inicio_carregamento, 2)
    tempo_total = round(fim_carregamento - inicio_total, 2)

    tempos.append(tempo_carregamento)

    # Informações da página
    titulo = driver.title
    url_atual = driver.current_url
    
    # Verifica produção
    texto = driver.find_element(By.TAG_NAME, "body").text.lower()
    encontrou = (
        "produção" in texto or
        "produções" in texto or
        "artigos" in texto or
        "publicações" in texto or
        "publica" in texto
    )

    # Links
    links = driver.find_elements(By.TAG_NAME, "a")

    # ===================================================
    # PASSO 4: REGISTRO DOS RESULTADOS
    # ===================================================
    
    registrar(linhas, f"📌 Resumo do teste #{idx + 1}:")
    registrar(linhas, f"   ✅ Título: {titulo[:50]}...")
    registrar(linhas, f"   ⏱ Tempo de carregamento (sem CAPTCHA): {tempo_carregamento}s")
    if captcha_ocorreu:
        registrar(linhas, f"   ⏱ Tempo gasto no CAPTCHA: {tempo_captcha}s")
    registrar(linhas, f"   ⏱ Tempo total (com CAPTCHA): {tempo_total}s")
    registrar(linhas, f"   📚 Produções encontradas: {'✅ SIM' if encontrou else '❌ NÃO'}")
    registrar(linhas, f"   🔗 Total de links: {len(links)}")
    registrar(linhas, f"   🌐 URL final: {url_atual}")

    # Rola a página para garantir carregamento total
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(1)

    # Retorna métricas para análise
    return {
        'idx': idx,
        'url': url,
        'tempo_carregamento': tempo_carregamento,
        'tempo_captcha': tempo_captcha,
        'tempo_total': tempo_total,
        'captcha_ocorreu': captcha_ocorreu,
        'encontrou_producao': encontrou,
        'total_links': len(links),
        'titulo': titulo
    }


def gerar_relatorio_completo(linhas, tempos, captcha_tempos, dados_detalhados):
    """Gera relatório completo com análises estatísticas"""
    
    # =============================================
    # ANÁLISE ESTATÍSTICA BÁSICA
    # =============================================
    
    total = sum(tempos)
    media = statistics.mean(tempos) if tempos else 0
    mediana = statistics.median(tempos) if tempos else 0
    desvio = statistics.stdev(tempos) if len(tempos) > 1 else 0
    minimo = min(tempos) if tempos else 0
    maximo = max(tempos) if tempos else 0
    
    # Tempo da primeira execução
    primeira_execucao = tempos[0] if tempos else 0
    
    # =============================================
    # ANÁLISE DE CAPTCHA
    # =============================================
    
    captcha_ocorreu_count = sum(1 for t in captcha_tempos if t > 0)
    total_captcha = sum(captcha_tempos)
    media_captcha = statistics.mean([t for t in captcha_tempos if t > 0]) if any(t > 0 for t in captcha_tempos) else 0
    
    # =============================================
    # RELATÓRIO
    # =============================================
    
    linhas.append("\n" + "="*55)
    linhas.append("📊 RELATÓRIO FINAL - ANÁLISE DE TEMPOS")
    linhas.append("="*55)
    
    linhas.append("\n📈 ESTATÍSTICAS DE CARREGAMENTO (SEM CAPTCHA):")
    linhas.append(f"   📌 Total de currículos testados: {len(tempos)}")
    linhas.append(f"   📌 Tempo da PRIMEIRA execução: {primeira_execucao}s")
    linhas.append(f"   📌 Média: {media:.2f}s")
    linhas.append(f"   📌 Mediana: {mediana:.2f}s")
    linhas.append(f"   📌 Desvio padrão: {desvio:.2f}")
    linhas.append(f"   📌 Mínimo: {minimo:.2f}s")
    linhas.append(f"   📌 Máximo: {maximo:.2f}s")
    linhas.append(f"   📌 Tempo total acumulado: {total:.2f}s")
    
    linhas.append("\n🔐 ANÁLISE DE CAPTCHA:")
    linhas.append(f"   📌 Total de CAPTCHAs detectados: {captcha_ocorreu_count}/{len(tempos)}")
    linhas.append(f"   📌 Tempo médio resolvendo CAPTCHA: {media_captcha:.2f}s")
    linhas.append(f"   📌 Tempo total gasto com CAPTCHA: {total_captcha:.2f}s")
    linhas.append(f"   📌 Tempo total gasto com CAPTCHA: {round(total_captcha/60, 2)} minutos")
    
    # =============================================
    # ANÁLISE DA PRIMEIRA EXECUÇÃO
    # =============================================
    
    linhas.append("\n🔄 ANÁLISE DA PRIMEIRA EXECUÇÃO:")
    
    if primeira_execucao > media:
        diferenca = primeira_execucao - media
        linhas.append(f"   ⚠️ Primeira execução foi {diferenca:.2f}s MAIS LENTA que a média")
        linhas.append(f"   📌 Primeira execução: {primeira_execucao}s vs Média: {media:.2f}s")
        linhas.append(f"   📌 Diferença: {diferenca:.2f}s ({round((diferenca/media)*100, 1)}% mais lenta)")
    elif primeira_execucao < media:
        diferenca = media - primeira_execucao
        linhas.append(f"   ✅ Primeira execução foi {diferenca:.2f}s MAIS RÁPIDA que a média")
        linhas.append(f"   📌 Primeira execução: {primeira_execucao}s vs Média: {media:.2f}s")
    else:
        linhas.append(f"   📌 Primeira execução igual à média: {primeira_execucao}s")
    
    # =============================================
    # DETALHES POR CURRÍCULO
    # =============================================
    
    linhas.append("\n📋 DETALHES POR CURRÍCULO:")
    linhas.append("   # | Tempo(s) | CAPTCHA(s) | Produção | Status")
    linhas.append("   " + "-"*50)
    
    for i, dados in enumerate(dados_detalhados):
        status = "✅ OK" if dados['encontrou_producao'] else "⚠️ Sem publicações"
        captcha_str = f"{dados['tempo_captcha']:.2f}" if dados['captcha_ocorreu'] else "0.00"
        linhas.append(f"   {i+1:2} | {dados['tempo_carregamento']:7.2f} | {captcha_str:10} | {dados['encontrou_producao']!s:8} | {status}")
    
    # =============================================
    # RESPONDENDO PERGUNTAS ESPECÍFICAS
    # =============================================
    
    linhas.append("\n❓ RESPOSTAS ÀS PERGUNTAS:")
    linhas.append(f"   1. O tempo de clicar no CAPTCHA pode ter mascarado o resultado?")
    linhas.append(f"      ✅ O relatório separa: Carregamento: {media:.2f}s | CAPTCHA: {media_captcha:.2f}s")
    linhas.append(f"      ✅ O CAPTCHA adicionou {round(total_captcha, 2)}s ao tempo total")
    
    if primeira_execucao > media:
        linhas.append(f"\n   2. Tempo da primeira execução/consulta?")
        linhas.append(f"      ✅ Maior que a média em {round(primeira_execucao - media, 2)}s")
    else:
        linhas.append(f"\n   2. Tempo da primeira execução/consulta?")
        linhas.append(f"      ✅ Menor ou igual à média")
    
    linhas.append(f"\n   3. Tempo de cada consulta?")
    linhas.append(f"      ✅ Ver tabela 'DETALHES POR CURRÍCULO' acima")
    
    # =============================================
    # SALVAR ARQUIVOS
    # =============================================
    
    with open(ARQUIVO_RELATORIO, "w", encoding="utf-8") as f:
        f.write("\n".join(linhas))
    
    # Salvar CSV detalhado
    with open(ARQUIVO_DETALHADO, "w", encoding="utf-8") as f:
        f.write("Curriculo,Tempo_Carregamento,Tempo_CAPTCHA,Tempo_Total,CAPTCHA_Ocorreu,Producoes,Total_Links\n")
        for dados in dados_detalhados:
            f.write(f"{dados['idx']+1},{dados['tempo_carregamento']:.2f},{dados['tempo_captcha']:.2f},{dados['tempo_total']:.2f},{dados['captcha_ocorreu']},{dados['encontrou_producao']},{dados['total_links']}\n")
    
    print(f"\n📁 Relatório salvo em: {ARQUIVO_RELATORIO}")
    print(f"📁 Dados detalhados salvos em: {ARQUIVO_DETALHADO}")


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    linhas = []
    tempos = []
    captcha_tempos = []
    dados_detalhados = []

    print("🚀 Iniciando testes com múltiplos currículos...")
    print("="*55)
    print(f"📌 Total de currículos: {len(URLS_CURRICULOS)}")
    print(f"⏱️  Tempo máximo de espera: {TEMPO_ESPERA}s")
    print("="*55)

    driver = iniciar_driver()

    try:
        for idx, url in enumerate(URLS_CURRICULOS):
            # Testa cada currículo
            dados = testar_curriculo(driver, url, linhas, tempos, captcha_tempos, idx)
            dados_detalhados.append(dados)
            
            # Pausa entre requisições para evitar bloqueio
            if idx < len(URLS_CURRICULOS) - 1:
                print("\n⏳ Aguardando 5 segundos antes do próximo teste...")
                time.sleep(5)

    except Exception as e:
        print("\n❌ ERRO:", e)
        traceback.print_exc()

    finally:
        driver.quit()
        # Gera relatório completo
        gerar_relatorio_completo(linhas, tempos, captcha_tempos, dados_detalhados)
        print("\n✅ Testes finalizados!")


if __name__ == "__main__":
    main()