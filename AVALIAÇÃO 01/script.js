    /* Função do campo de busca */ 
function ativarbusca() {
    // Obtém o valor do campo de busca e converte para minúsculas
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    
    // Switch case para verificar a página correspondente a busca feita.
    switch (searchValue) {
        case "bcaa":
            window.location.href = "bcaa.html";
            break;
        case "creatina":
            window.location.href = "creatina.html";
            break;
        case "whey":
            window.location.href = "whey.html";
            break;
        default:
            alert("Produto não encontrado. Por favor, tente novamente.");
    }
}

// Função que verifica se a tecla Enter foi pressionada
function checkEnter(event) {
    if (event.key === "Enter") {
        ativarbusca();
    }
}

    /* Função Tela de Cadastro */
document.getElementById('formcadastro').addEventListener('submit', function(event) {
    event.preventDefault(); 

    // Coleta os dados do formulário
    const email = document.getElementById('Email').value;
    const cpf = document.getElementById('CPF').value;
    const nome = document.getElementById('Nome').value;
    const nascimento = document.getElementById('Nascimento').value;
    const celular = document.getElementById('celular').value;
    const fixo = document.getElementById('Fixo').value;
    const promocoes = document.getElementById('promocões').checked;
    const mensagens = document.getElementById('mensagens').checked;
    const pedidos = document.getElementById('pedidos').checked;

    // JSON de validação de CPF
    const cpfValidator = {
        validate: function(cpf) {
            cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
            if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Verifica padrão inválido
            let soma = 0, resto;
            for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpf.substring(9, 10))) return false;
            soma = 0;
            for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            return resto === parseInt(cpf.substring(10, 11));
        }
    };

    // Função para adicionar asterisco nos campos vazios
    function marcarCampoVazio(campoId) {
        const campo = document.getElementById(campoId);
        if (!campo.value) {
            campo.style.borderColor = 'red';
            campo.placeholder = '* ' + campo.placeholder;
        } else {
            campo.style.borderColor = '';
            campo.placeholder = campo.placeholder.replace('* ', '');
        }
    }

    // Verifica se todos os campos obrigatórios estão preenchidos
    const camposObrigatorios = ['Email', 'CPF', 'Nome', 'Nascimento', 'celular'];
    const camposPreenchidos = camposObrigatorios.every(campoId => {
        marcarCampoVazio(campoId);
        return document.getElementById(campoId).value;
    });

    // Valida o CPF
    if (!camposPreenchidos) {
        alert('Por favor, preencha todos os campos obrigatórios.');
    } else if (!cpfValidator.validate(cpf)) {
        alert('CPF inválido. Por favor, verifique os dados.');
    } else {
        alert('Cadastro realizado com sucesso!');
    }

    
});

 /* Função validar Email - Tela de Login */
function validarEmail() {
    const email = document.getElementById('Email').value;

    // Expressão regular para validar formato de e-mail
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Impede o envio do formulário
    if (!regex.test(email)) {
        alert('Por favor, insira um e-mail no formato correto.');
        return false; 
    } else { // Permite o envio do formulário
        alert('E-mail válido!');
        return true; 
    }
}

    /* Função de Alert do botão Comprar */
function AlertaComprar() {
   

    // Mostra o alert
    alert('Você será redirecionado para a página de cadastro.');

    // Redireciona para tela de cadastro após o clique no alert
    window.location.href = 'cadastro.html';
}