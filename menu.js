document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuNavegacao = document.querySelector('.menu-navegacao');

    if (menuToggle && menuNavegacao) {
        menuToggle.addEventListener('click', () => {
            menuNavegacao.classList.toggle('ativo');
            const isExpanded = menuNavegacao.classList.contains('ativo');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            // Alterna entre ícone de hambúrguer e 'X'
            menuToggle.innerHTML = isExpanded ? '&times;' : '&#9776;';
        });
    }
});