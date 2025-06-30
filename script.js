document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    const erroDiv = document.createElement('div');
    erroDiv.className = 'error';
    erroDiv.id = 'erro';
    document.getElementById('principal').appendChild(erroDiv);
    
    // Elementos de resultado
    const resultadoElements = {
        logradouro: document.getElementById('logradouro'),
        bairro: document.getElementById('bairro'),
        localidade: document.getElementById('localidade'),
        uf: document.getElementById('uf')
    };
    
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
    });
    
    cepInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscarCEP();
        }
    });
    
    // Função para buscar o CEP
    function buscarCEP() {
        const cep = cepInput.value.trim();
        
        if (cep.length !== 8 || !/^\d+$/.test(cep)) {
            showError('Por favor, digite um CEP válido com 8 dígitos numéricos.');
            return;
        }
        
        erroDiv.style.display = 'none';
        
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    throw new Error('CEP não encontrado');
                }
                
                displayCEPData(data);
            })
            .catch(error => {
                showError(error.message || 'Ocorreu um erro ao buscar o CEP. Por favor, tente novamente.');
            });
    }
    
    function displayCEPData(data) {
        // Preenche os resultados
        resultadoElements.logradouro.value = data.logradouro || 'Não informado';
        resultadoElements.bairro.value = data.bairro || 'Não informado';
        resultadoElements.localidade.value = data.localidade || 'Não informado';
        resultadoElements.uf.value = data.uf || 'Não informado';
    }
    
    function showError(message) {
        erroDiv.textContent = message;
        erroDiv.style.display = 'block';
    }
    
    // Adiciona botão de busca dinamicamente
    const buscarBtn = document.createElement('button');
    buscarBtn.textContent = 'Buscar';
    buscarBtn.style.cssText = `
        background-color: #2e7d32;
        color: white;
        border: none;
        padding: 12px 0;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        margin-top: 20px;
        width: 100%;
        font-size: 16px;
        transition: background-color 0.3s;
    `;
    
    // Efeito hover no botão
    buscarBtn.addEventListener('mouseenter', () => {
        buscarBtn.style.backgroundColor = '#1b5e20';
    });
    buscarBtn.addEventListener('mouseleave', () => {
        buscarBtn.style.backgroundColor = '#2e7d32';
    });
    
    buscarBtn.addEventListener('click', buscarCEP);
    
    // Insere o botão após o último campo do formulário
    document.querySelector('.form-group:last-child').insertAdjacentElement('afterend', buscarBtn);
});