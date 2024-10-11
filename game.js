document.addEventListener('DOMContentLoaded', () => {
    const nivelDificuldade = localStorage.getItem('dificuldade') || 'fácil';
    const nivelElement = document.getElementById('nivel-dificuldade');
    const board = document.getElementById('game-board');
    const errorCountElement = document.getElementById('error-count');
    let errorCount = 0;
    let flippedCards = [];
    let pairsFound = 0;
    let timer; // Variável para armazenar o temporizador
    let startTime; // Para armazenar o tempo de início
    let numberOfPairs; // Número de pares de cartas

    // Define a dificuldade e o layout do tabuleiro
    nivelElement.textContent = nivelDificuldade;

    switch (nivelDificuldade) {
        case 'fácil':
            board.classList.add('easy');
            numberOfPairs = 6;  // 12 cartas no total
            break;
        case 'médio':
            board.classList.add('medium');
            numberOfPairs = 8;  // 16 cartas no total
            break;
        case 'difícil':
            board.classList.add('hard');
            numberOfPairs = 10;  // 20 cartas no total
            break;
    }

    // Função para embaralhar as cartas
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Gerar as cartas com pares
    function generateCards(pairs) {
        const cards = [];
        for (let i = 1; i <= pairs; i++) {
            cards.push(i, i); // Adiciona duas cartas iguais para cada par
        }
        return shuffle(cards);
    }

    // Renderizar as cartas no tabuleiro
    function createBoard() {
        board.innerHTML = ''; // Limpa o tabuleiro
        const cards = generateCards(numberOfPairs);

        cards.forEach((cardValue, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = cardValue;
            card.addEventListener('click', handleCardClick);
            board.appendChild(card);
        });
    }

    createBoard(); // Chama a função para criar o tabuleiro inicialmente
    startTimer(); // Inicia o temporizador

    // Função de clique nas cartas
    function handleCardClick() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            this.textContent = this.dataset.value;
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }
    }

    // Verificar se as cartas são iguais
    function checkForMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            pairsFound++;
            flippedCards = [];

            // Verifica se encontrou todos os pares
            if (pairsFound === numberOfPairs) {
                setTimeout(showGameOverModal, 500); // Mostra o modal após 500ms
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
                flippedCards = [];
                errorCount++;
                errorCountElement.textContent = errorCount;
            }, 1000);
        }
    }

    // Função para mostrar o modal de fim de jogo
    function showGameOverModal() {
        clearInterval(timer); // Para o temporizador
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Tempo total em segundos
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        // Mensagem do modal
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = `Você encontrou todos os pares!\nTempo total: ${minutes}:${seconds.toString().padStart(2, '0')}\nErros: ${errorCount}`;

        // Exibe o modal
        const modal = document.getElementById('game-modal');
        modal.style.display = 'flex'; // Mostra o modal
    }

    // Lógica para fechar o modal
    document.getElementById('close-modal').addEventListener('click', () => {
        const modal = document.getElementById('game-modal');
        modal.style.display = 'none'; // Esconde o modal ao clicar em fechar
    });

    // Lógica para reiniciar o jogo
    document.getElementById('restart-game').addEventListener('click', () => {
        window.location.href = 'choose.html';// Chama a função para reiniciar o jogo
    });

    // Função para reiniciar o jogo
    function resetGame() {
        // Reinicie as variáveis
        errorCount = 0;
        pairsFound = 0;
        flippedCards = [];
        errorCountElement.textContent = errorCount; // Atualiza contador de erros
        startTimer(); // Reinicia o temporizador
        createBoard(); // Reinicia o tabuleiro
    }

    // Inicia o temporizador
    function startTimer() {
        startTime = Date.now();
        timer = setInterval(updateTimer, 1000); // Atualiza a cada segundo
    }

    // Atualiza o temporizador na tela
    function updateTimer() {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Tempo em segundos
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        const timerElement = document.getElementById('timer');
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
});
