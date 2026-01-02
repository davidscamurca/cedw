// 🔊 Som habilitado
const SOUND_ENABLED = false;

// 📋 Lista de figurinhas/presentes
// Para usar imagem: troque o emoji por "img:nome-do-arquivo" (ex: "img:cafe.png")
const GIFTS = [
    // Página 1 - Mimos e experiências leves
    { id: 1, emoji: '☕', title: 'Cafézinho', value: 10 },
    { id: 2, emoji: '🧁', title: 'Docinho', value: 20 },
    { id: 3, emoji: '🌹', title: 'Florzinha', value: 30 },
    { id: 4, emoji: '🍕', title: 'Pizzaria', value: 50 },
    { id: 5, emoji: '🍣', title: 'Japonês', value: 80 },
    { id: 6, emoji: '🍷', title: 'Vinho', value: 100 },
    { id: 7, emoji: '🎬', title: 'Cinema', value: 120 },
    { id: 8, emoji: '🍽️', title: 'Jantar', value: 150 },
    { id: 9, emoji: '💆', title: 'Spa Day', value: 200 },
    
    // Página 2 - Experiências especiais
    { id: 10, emoji: '🎭', title: 'Teatro', value: 250 },
    { id: 11, emoji: '🎵', title: 'Show', value: 300 },
    { id: 12, emoji: '🏖️', title: 'Praia', value: 400 },
    { id: 13, emoji: '🎁', title: 'Surpresa', value: 500 },
    { id: 14, emoji: '🌅', title: 'Pôr do Sol', value: 600 },
    { id: 15, emoji: '🚗', title: 'Road Trip', value: 750 },
    { id: 16, emoji: '🏨', title: 'Hotel', value: 1000 },
    { id: 17, emoji: '🎿', title: 'Aventura', value: 1200 },
    { id: 18, emoji: '✈️', title: 'Viagem', value: 1500 },
    
    // Página 3 - Sonhos grandes
    { id: 19, emoji: '🗼', title: 'Paris', value: 1800 },
    { id: 20, emoji: '🏝️', title: 'Resort', value: 2000 },
    { id: 21, emoji: '🏔️', title: 'Montanhas', value: 2200 },
    { id: 22, emoji: '🌊', title: 'Cruzeiro', value: 2500 },
    { id: 23, emoji: '🗺️', title: 'Mochilão', value: 2700 },
    { id: 24, emoji: '💎', title: 'Especial', value: 2800 },
    { id: 25, emoji: '🎭', title: 'Broadway', value: 2900 },
    { id: 26, emoji: '🏰', title: 'Castelo', value: 2950 },
    { id: 27, emoji: '🌍', title: 'Lua de Mel', value: 3000 },
];

// Configuração de paginação
const ITEMS_PER_PAGE = 9;
const TOTAL_PAGES = 3;

// =====================================================
// ESTADO
// =====================================================
let currentPage = 1;

// Audio context para sons
let audioContext = null;

// =====================================================
// SISTEMA DE SOM
// =====================================================

/**
 * Inicializa o contexto de áudio (precisa de interação do usuário)
 */
function initAudio() {
    if (!audioContext && SOUND_ENABLED) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

/**
 * Toca um som suave de "click" usando Web Audio API
 * Som gerado proceduralmente - sem arquivos externos
 */
function playFlipSound() {
    if (!SOUND_ENABLED || !audioContext) return;
    
    try {
        // Criar oscilador para tom suave
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Conectar
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configurar som suave e agradável (tipo "pop")
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        // Volume suave com fade out
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        // Tocar
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    } catch (e) {
        // Silenciosamente ignora erros de áudio
    }
}

/**
 * Toca som de sucesso (quando copia PIX)
 */
function playSuccessSound() {
    if (!SOUND_ENABLED || !audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Som ascendente agradável
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        // Silenciosamente ignora erros de áudio
    }
}

// =====================================================
// ELEMENTOS DOM
// =====================================================
const cardsGrid = document.getElementById('cardsGrid');
const toast = document.getElementById('toast');
const pageButtons = document.querySelectorAll('.page-btn');
const swipeLeft = document.getElementById('swipeLeft');
const swipeRight = document.getElementById('swipeRight');

// =====================================================
// FUNÇÕES UTILITÁRIAS
// =====================================================

const _0x = '4cjN5YzMjVTYiJmMtMmM4EWLkZjM00yN5EWOtQTZxUGMxYmN';
const _$ = (s) => s.split('').reduce((a, c, i, arr) => a + arr[arr.length - 1 - i], '');
const PIX_KEY = ((d) => atob(d))(_$(_0x));

/**
 * Formata valor para exibição
 */
function formatValue(value) {
    if (value >= 1000) {
        return value.toLocaleString('pt-BR');
    }
    return value.toString();
}

/**
 * Gera URL do QR Code usando API gratuita
 * O QR Code contém os dados do PIX Copia e Cola
 */
function generateQRCodeURL(value) {
    // Texto que será codificado no QR (PIX Copia e Cola simplificado)
    const pixText = `${PIX_KEY}`;
    
    // Usando API gratuita do QR Server
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pixText)}&bgcolor=ffffff&color=2d5a3d`;
    
    return qrApiUrl;
}

/**
 * Copia texto para a área de transferência
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (e) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * Mostra toast de confirmação
 */
function showToast(message = 'PIX copiado!') {
    const toastText = toast.querySelector('.toast-text');
    toastText.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// =====================================================
// RENDERIZAÇÃO
// =====================================================

/**
 * Renderiza o conteúdo do sticker (emoji ou imagem)
 */
function renderStickerContent(emoji) {
    // Se começar com "img:", usa imagem da pasta imgs
    if (emoji.startsWith('img:')) {
        const imageName = emoji.replace('img:', '');
        return `<img src="imgs/${imageName}" alt="Figurinha" loading="lazy">`;
    }
    // Caso contrário, usa emoji
    return emoji;
}

/**
 * Cria HTML de um card
 */
function createCardHTML(gift) {
    const stickerContent = renderStickerContent(gift.emoji);
    const isImage = gift.emoji.startsWith('img:');
    const qrCodeUrl = generateQRCodeURL(gift.value);
    
    return `
        <div class="card-container">
            <div class="card" data-id="${gift.id}" data-value="${gift.value}">
                <!-- Frente - Figurinha -->
                <div class="card-face card-front">
                    <div class="sticker ${isImage ? 'has-image' : ''}">
                        ${stickerContent}
                    </div>
                    <span class="card-title">${gift.title}</span>
                    <span class="card-value">${formatValue(gift.value)}</span>
                </div>
                
                <!-- Verso - QR Code -->
                <div class="card-face card-back">
                    <div class="qr-wrapper" data-pix="${PIX_KEY}">
                        <img class="qr-code" src="${qrCodeUrl}" alt="QR Code PIX" loading="lazy">
                    </div>
                    <span class="qr-hint">
                        <span class="copy-icon">📋</span>
                        Toque para copiar
                    </span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Renderiza os cards da página atual
 */
function renderCards() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageGifts = GIFTS.slice(startIndex, endIndex);
    
    // Limpa grid
    cardsGrid.innerHTML = '';
    
    // Adiciona cards
    pageGifts.forEach(gift => {
        cardsGrid.innerHTML += createCardHTML(gift);
    });
    
    // Adiciona event listeners
    attachCardListeners();
}

/**
 * Atualiza estado visual da paginação
 */
function updatePagination() {
    pageButtons.forEach(btn => {
        const page = parseInt(btn.dataset.page);
        btn.classList.toggle('active', page === currentPage);
    });
    
    // Atualiza indicadores de swipe
    updateSwipeIndicators();
}

/**
 * Mostra/esconde indicadores de swipe baseado na página atual
 */
function updateSwipeIndicators() {
    // Mostra seta esquerda se não estiver na primeira página
    if (swipeLeft) {
        swipeLeft.classList.toggle('visible', currentPage > 1);
    }
    
    // Mostra seta direita se não estiver na última página
    if (swipeRight) {
        swipeRight.classList.toggle('visible', currentPage < TOTAL_PAGES);
    }
}

// =====================================================
// EVENT HANDLERS
// =====================================================

/**
 * Fecha todos os cards abertos
 */
function closeAllCards() {
    const flippedCards = document.querySelectorAll('.card.flipped');
    flippedCards.forEach(card => card.classList.remove('flipped'));
}

/**
 * Anexa listeners aos cards
 */
function attachCardListeners() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Flip do card
        card.addEventListener('click', (e) => {
            // Se clicou no QR wrapper, copia o PIX
            const qrWrapper = e.target.closest('.qr-wrapper');
            if (qrWrapper && card.classList.contains('flipped')) {
                e.stopPropagation();
                handleCopyPix(qrWrapper);
                return;
            }
            
            // Se este card já está aberto, fecha
            if (card.classList.contains('flipped')) {
                card.classList.remove('flipped');
            } else {
                // Fecha outros cards antes de abrir este
                closeAllCards();
                card.classList.add('flipped');
            }
        });
    });
}

/**
 * Handler para copiar PIX
 */
async function handleCopyPix(qrWrapper) {
    const pixKey = qrWrapper.dataset.pix;
    const success = await copyToClipboard(pixKey);
    
    if (success) {
        showToast('PIX copiado! 💚');
        
        // Feedback visual
        qrWrapper.style.transform = 'scale(0.9)';
        setTimeout(() => {
            qrWrapper.style.transform = '';
        }, 150);
    } else {
        showToast('Erro ao copiar 😕');
    }
}

/**
 * Handler para mudança de página
 */
function handlePageChange(page) {
    if (page === currentPage) return;
    
    // Fecha cards abertos antes de mudar
    closeAllCards();
    
    currentPage = page;
    
    // Anima saída
    cardsGrid.style.opacity = '0';
    cardsGrid.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        renderCards();
        updatePagination();
        
        // Anima entrada
        cardsGrid.style.opacity = '1';
        cardsGrid.style.transform = 'translateY(0)';
    }, 200);
}

// =====================================================
// SWIPE NAVIGATION
// =====================================================

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const SWIPE_THRESHOLD = 50; // Mínimo de pixels para considerar swipe

/**
 * Inicializa detecção de swipe
 */
function initSwipe() {
    const container = document.querySelector('.container');
    
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
}

/**
 * Processa o gesto de swipe
 */
function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Só processa se o swipe horizontal for maior que o vertical
    // (evita conflito com scroll)
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;
    
    // Verifica se passou do threshold
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    
    if (deltaX < 0 && currentPage < TOTAL_PAGES) {
        // Swipe para esquerda → próxima página
        handlePageChange(currentPage + 1);
    } else if (deltaX > 0 && currentPage > 1) {
        // Swipe para direita → página anterior
        handlePageChange(currentPage - 1);
    }
}

// =====================================================
// INICIALIZAÇÃO
// =====================================================

function init() {
    // Adiciona transição ao grid
    cardsGrid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    
    // Renderiza primeira página
    renderCards();
    updatePagination();
    
    // Event listeners da paginação
    pageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            handlePageChange(page);
        });
    });
    
    // Inicializa swipe
    initSwipe();
    
    // Previne zoom no double tap em iOS
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
}

let lastTouchEnd = 0;

// Inicia quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

