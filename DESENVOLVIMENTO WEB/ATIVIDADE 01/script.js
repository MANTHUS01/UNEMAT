document.addEventListener("DOMContentLoaded", () => {
    // Validação do Formulário
    document.getElementById("contact-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            alert("Todos os campos são obrigatórios.");
            return;
        }

        alert("Mensagem enviada com sucesso!");
        e.target.reset();
    });
});


    document.addEventListener("DOMContentLoaded", () => {
        const prevBtn = document.querySelector(".prev");
        const nextBtn = document.querySelector(".next");
        const carrossel = document.querySelector(".carrossel");
        let index = 0;
    
        function updateCarrossel() {
            const offset = -index * 100;
            carrossel.style.transform = `translateX(${offset}%)`;
        }
    
        nextBtn.addEventListener("click", () => {
            index = (index + 1) % carrossel.children[0].children.length;
            updateCarrossel();
        });
    
        prevBtn.addEventListener("click", () => {
            index = (index - 1 + carrossel.children[0].children.length) % carrossel.children[0].children.length;
            updateCarrossel();
        });

        const listaArtigos = document.getElementById("lista-artigos");
        const btnExibir = document.getElementById("listar-artigo");
    
        let artigosVisiveis = false;
    
        btnExibir.addEventListener("click", () => {
            artigosVisiveis = !artigosVisiveis;
            listaArtigos.style.display = artigosVisiveis ? "block" : "none";
            btnExibir.textContent = artigosVisiveis ? "Ocultar Artigos" : "Exibir Artigos";
        });
    
        // Oculta os artigos por padrão ao carregar a página
        listaArtigos.style.display = "none";
});
