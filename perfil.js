document.addEventListener('DOMContentLoaded', async () => {
    // 1. Pegar o nome do profissional da URL
    const params = new URLSearchParams(window.location.search);
    const nomeProfissional = params.get('nome');

    const container = document.getElementById('perfil-container');

    if (!nomeProfissional) {
        container.innerHTML = '<p>Profissional não encontrado. Volte para a <a href="index.html">página inicial</a>.</p>';
        return;
    }

    // 2. Carregar os dados e encontrar o profissional correto
    const profissional = await buscarProfissional(nomeProfissional);

    // 3. Exibir os dados na página
    if (profissional) {
        // Atualiza o título da página
        document.title = `${profissional.nome} - Continuístas do Brasil`;

        container.innerHTML = `
            <article class="perfil-detalhado">
                <img src="${profissional.foto}" alt="Foto de ${profissional.nome}" class="perfil-foto-grande">
                <div class="perfil-info">
                    <h1>${profissional.nome}</h1>
                    <p><strong>Cidade(s) de atuação:</strong> ${profissional.cidade}</p>
                    ${profissional.idiomas ? `<p><strong>Idiomas:</strong> ${profissional.idiomas}</p>` : ''}
                    ${profissional.skills ? `<p><strong>Habilidades:</strong> ${profissional.skills}</p>` : ''}
                    
                    <h2>Biografia</h2>
                    <p>${profissional.bio || 'Biografia não disponível.'}</p>
                    
                    <div class="perfil-botoes">
                        ${profissional.linkIMDB ? `<a href="${profissional.linkIMDB}" target="_blank" class="botao-imdb">IMDB</a>` : ''}
                        ${profissional.email ? `<a href="mailto:${profissional.email}" class="botao-perfil">E-mail</a>` : ''}
                        ${profissional.whatsapp ? `<a href="https://wa.me/${profissional.whatsapp}" target="_blank" class="botao-perfil botao-whatsapp-perfil">WhatsApp</a>` : ''}
                        <button onclick="history.back()" class="botao-voltar">Voltar</button>
                    </div>

                </div>
            </article>
        `;
    } else {
        container.innerHTML = `<p>Perfil para "${nomeProfissional}" não encontrado. Volte para a <a href="index.html">página inicial</a>.</p>`;
    }
});

async function buscarProfissional(nome) {
    // Busca nos dados salvos na sessão pela página inicial
    const continuistasSalvos = sessionStorage.getItem('continuistas');
    const assistentesSalvos = sessionStorage.getItem('assistentes');
    
    let todosProfissionais = [];
    if (continuistasSalvos) {
        todosProfissionais = todosProfissionais.concat(JSON.parse(continuistasSalvos));
    }
    if (assistentesSalvos) {
        todosProfissionais = todosProfissionais.concat(JSON.parse(assistentesSalvos));
    }

    const profissionalEncontrado = todosProfissionais.find(p => p.nome === nome);

    // Se não encontrar, retorna null. A lógica na outra função já trata disso.
    return profissionalEncontrado || null;
}