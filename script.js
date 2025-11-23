document.addEventListener('DOMContentLoaded', () => {
    const cardContainerContinuistas = document.getElementById('card-container-continuistas');
    const cardContainerAssistentes = document.getElementById('card-container-assistentes');
    const buscaContinuistasInput = document.getElementById('busca-continuistas-input');
    const buscaAssistentesInput = document.getElementById('busca-assistentes-input');
    const carregarMaisContinuistasBtn = document.getElementById('carregar-mais-continuistas');
    const carregarMaisAssistentesBtn = document.getElementById('carregar-mais-assistentes');

    let todosContinuistas = [];
    let todosAssistentes = [];
    let continuistasFiltrados = [];
    let assistentesFiltrados = [];

    const ITENS_POR_PAGINA = 8;
    let continuistasVisiveis = 0;
    let assistentesVisiveis = 0;

    // Função para criar o card de um profissional
    const criarCard = (profissional) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${profissional.foto}" alt="Foto de ${profissional.nome}" class="card-foto">
            <div class="card-info">
                <h3 class="card-nome">${profissional.nome}</h3>
                <p class="card-cidade">${profissional.cidade.replace(/,/g, ', ')}</p>
                ${profissional.idiomas ? `<p class="card-idiomas"><strong>Idiomas:</strong> ${profissional.idiomas.replace(/,/g, ', ')}</p>` : ''}
                ${profissional.skills ? `<p class="card-skills"><strong>Skills:</strong> ${profissional.skills.replace(/,/g, ', ')}</p>` : ''}
            </div>
            <div class="card-botoes">
                <a href="perfil.html?nome=${encodeURIComponent(profissional.nome)}" class="botao-perfil">Ver Perfil</a>
                ${profissional.whatsapp ? `<a href="https://wa.me/${profissional.whatsapp}" target="_blank" class="botao-whatsapp">WhatsApp</a>` : ''}
            </div>
        `;
        return card;
    };

    // Função para renderizar os cards
    const renderizarCards = (container, profissionais, visiveis, botao) => {
        container.innerHTML = ''; // Limpa apenas na primeira renderização ou busca
        const fatiaParaExibir = profissionais.slice(0, visiveis);

        if (fatiaParaExibir.length === 0) {
            container.innerHTML = '<p class="sem-resultados">Nenhum resultado encontrado.</p>';
        } else {
            fatiaParaExibir.forEach(profissional => {
                container.appendChild(criarCard(profissional));
            });
        }

        // Controla a visibilidade do botão "Carregar Mais"
        if (profissionais.length > visiveis) {
            botao.style.display = 'block';
        } else {
            botao.style.display = 'none';
        }
    };


    // Função genérica de busca
    const buscarProfissionais = (termoBusca, profissionais) => {
        // Função auxiliar para remover acentos de uma string
        const removerAcentos = (texto) => {
            if (!texto) return "";
            return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }

        const termoNormalizado = removerAcentos(termoBusca.toLowerCase());
        const termos = termoNormalizado.split(' ').filter(term => term.trim() !== '');

        if (termos.length === 0) {
            return profissionais;
        }

        return profissionais.filter(profissional => {
            const textoProfissionalOriginal = [
                profissional.nome,
                profissional.cidade,
                profissional.idiomas,
                profissional.skills,
                profissional.bio
            ].join(' ').replace(/,/g, ' ');
            const textoProfissionalNormalizado = removerAcentos(textoProfissionalOriginal.toLowerCase());
            return termos.every(termo => textoProfissionalNormalizado.includes(termo));
        });
    };

    // Carrega e exibe os Continuístas
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            todosContinuistas = data;
            continuistasFiltrados = [...todosContinuistas];
            sessionStorage.setItem('continuistas', JSON.stringify(data)); // Salva os dados
            continuistasVisiveis = ITENS_POR_PAGINA;
            renderizarCards(cardContainerContinuistas, continuistasFiltrados, continuistasVisiveis, carregarMaisContinuistasBtn);
        });

    // Carrega e exibe os Assistentes
    fetch('assistentes.json')
        .then(response => response.json())
        .then(data => {
            todosAssistentes = data;
            assistentesFiltrados = [...todosAssistentes];
            sessionStorage.setItem('assistentes', JSON.stringify(data)); // Salva os dados
            assistentesVisiveis = ITENS_POR_PAGINA;
            renderizarCards(cardContainerAssistentes, assistentesFiltrados, assistentesVisiveis, carregarMaisAssistentesBtn);
        });

    // Lógica para os botões "Carregar Mais"
    carregarMaisContinuistasBtn.addEventListener('click', () => {
        continuistasVisiveis += ITENS_POR_PAGINA;
        // A renderização agora apenas adiciona novos cards
        const novaFatia = continuistasFiltrados.slice(continuistasVisiveis - ITENS_POR_PAGINA, continuistasVisiveis);
        novaFatia.forEach(p => cardContainerContinuistas.appendChild(criarCard(p)));
        if (continuistasFiltrados.length <= continuistasVisiveis) {
            carregarMaisContinuistasBtn.style.display = 'none';
        }
    });

    carregarMaisAssistentesBtn.addEventListener('click', () => {
        assistentesVisiveis += ITENS_POR_PAGINA;
        const novaFatia = assistentesFiltrados.slice(assistentesVisiveis - ITENS_POR_PAGINA, assistentesVisiveis);
        novaFatia.forEach(p => cardContainerAssistentes.appendChild(criarCard(p)));
        if (assistentesFiltrados.length <= assistentesVisiveis) {
            carregarMaisAssistentesBtn.style.display = 'none';
        }
    });

    // Funções globais para os botões de busca (chamadas pelo onclick no HTML)
    window.iniciarBuscaContinuistas = () => {
        const termoBusca = buscaContinuistasInput.value;
        continuistasFiltrados = buscarProfissionais(termoBusca, todosContinuistas);
        continuistasVisiveis = ITENS_POR_PAGINA;
        renderizarCards(cardContainerContinuistas, continuistasFiltrados, continuistasVisiveis, carregarMaisContinuistasBtn);
    };

    window.iniciarBuscaAssistentes = () => {
        const termoBusca = buscaAssistentesInput.value;
        assistentesFiltrados = buscarProfissionais(termoBusca, todosAssistentes);
        assistentesVisiveis = ITENS_POR_PAGINA;
        renderizarCards(cardContainerAssistentes, assistentesFiltrados, assistentesVisiveis, carregarMaisAssistentesBtn);
    };

    // Adiciona busca em tempo real enquanto o usuário digita
    buscaContinuistasInput.addEventListener('input', () => {
        iniciarBuscaContinuistas();
    });

    buscaAssistentesInput.addEventListener('input', () => {
        iniciarBuscaAssistentes();
    });

    // Permite buscar pressionando Enter
    buscaContinuistasInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            iniciarBuscaContinuistas();
        }
    });

    buscaAssistentesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            iniciarBuscaAssistentes();
        }
    });
});
