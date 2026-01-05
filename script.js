// 📅 Data do casamento
const WEDDING_DATE = new Date('2026-04-14T00:00:00');

// 🖼️ Imagens customizadas (padrão: VALOR_Texto_Aqui.extensão)
// Adicione o nome do arquivo aqui quando colocar na pasta img/
const CUSTOM_IMAGES = [
    '10_cafezinho.jpeg',
    '20_Tacaca.jpeg',
    '30_2x_Caboquinho.jpeg',
    '50_Banana_Pacovan.jpg',
    '80_4_Espetinhos_Frango.jpeg',
    '100_Rodada_Hot_Dog.jpeg',
    '120_Rodada_Top_Frozen.jpg',
    '150_Carne_Sol_Pedra.jpg',
    '200_Tambaqui_Assado.jpeg',
    '250_Almoco_Tambaqui_de_Banda.jpg',
    '300_1_Tanque_de_Gasolina.webp',
    '400_Jantar_no_Roseiral.webp',
    '500_Almoco_no_Caxiri.webp',
    '600_FDS_em_Presidente_Figueiredo.jpg',
    '1800_Sessao_de_Fotos.jpg',
    '2000_Mercado_do_Mes.jpg',
    '2200_1_Parcela_a_menos.jpg',
    '2500_Fatura_do_Cartao.jpg',
    '2700_Indo_para_SP_de_Supetao.jpg',
    '2800_Voltando_de_SP_de_Supetao.jpg',
    '2900_Lua_de_Mel_1.jpg',
    '2950_Lua_de_Mel_2.jpg',
    '3000_Lua_de_Mel_3.jpg'
];

// Parseia e cria mapa de imagens por valor
const IMAGES_BY_VALUE = {};
CUSTOM_IMAGES.forEach(filename => {
    const match = filename.match(/^(\d+)_(.+)\.(jpg|jpeg|png|gif|webp)$/i);
    if (match) {
        IMAGES_BY_VALUE[parseInt(match[1])] = {
            path: `img/${filename}`,
            title: match[2].replace(/_/g, ' ')
        };
    }
});

// 📋 Lista de figurinhas/presentes (emoji e título são fallback)
const GIFTS = [
    // Página 1 - Mimos e experiências leves
    { id: 1, emoji: '☕', title: 'Cafézinho', value: 10 },
    { id: 2, emoji: '🍫', title: 'Chocolate', value: 20 },
    { id: 3, emoji: '🌺', title: 'Vitória-Régia', value: 30 },
    { id: 4, emoji: '🦋', title: 'Borboleta', value: 50 },
    { id: 5, emoji: '🥭', title: 'Frutas', value: 80 },
    { id: 6, emoji: '🍷', title: 'Vinho', value: 100 },
    { id: 7, emoji: '🦜', title: 'Arara', value: 120 },
    { id: 8, emoji: '🍽️', title: 'Jantar', value: 150 },
    { id: 9, emoji: '💆', title: 'Spa Day', value: 200 },
    
    // Página 2 - Experiências especiais
    { id: 10, emoji: '🐢', title: 'Tartaruga', value: 250 },
    { id: 11, emoji: '🎵', title: 'Show', value: 300 },
    { id: 12, emoji: '🏖️', title: 'Praia', value: 400 },
    { id: 13, emoji: '🎁', title: 'Surpresa', value: 500 },
    { id: 14, emoji: '🌅', title: 'Pôr do Sol', value: 600 },
    { id: 15, emoji: '🛶', title: 'Canoa', value: 750 },
    { id: 16, emoji: '🏨', title: 'Hotel', value: 1000 },
    { id: 17, emoji: '🐆', title: 'Onça', value: 1200 },
    { id: 18, emoji: '✈️', title: 'Viagem', value: 1500 },
    
    // Página 3 - Sonhos grandes
    { id: 19, emoji: '🌴', title: 'Açaí', value: 1800 },
    { id: 20, emoji: '🏝️', title: 'Resort', value: 2000 },
    { id: 21, emoji: '🌳', title: 'Floresta', value: 2200 },
    { id: 22, emoji: '🚤', title: 'Lancha', value: 2500 },
    { id: 23, emoji: '🗺️', title: 'Expedição', value: 2700 },
    { id: 24, emoji: '💎', title: 'Especial', value: 2800 },
    { id: 25, emoji: '🐊', title: 'Jacaré', value: 2900 },
    { id: 26, emoji: '🌿', title: 'Natureza', value: 2950 },
    { id: 27, emoji: '🌍', title: 'Lua de Mel', value: 3000 },
];

// Configuração de paginação
const ITEMS_PER_PAGE = 9;
const TOTAL_PAGES = 3;

// =====================================================
// ESTADO
// =====================================================
let currentPage = 1;

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

const _0x = 'OUFDQTQwMzZvdG5lbWFzYUM5MDUwMzEyNk9MVUFQIE9BUzkwMDZhY3J1bWFDIG9obmlyYm9TIGRpdmFEMjI5NVJCMjA4NTY4OTMwMzUwMDAwNDAyNW9hY2Fyb2MgZWQgc29tZWNlZGFyZ0EyMjIwODc2OTYzYzVhYmIyLWMyOGEtZDYyNC03OWE5LTRlMWUwMWY2NjMxMHhpcC5iY2Iudm9nLnJiNDEwMDQ4NjIxMTIwMTAxMDIwMDAK';
const _$ = (s) => s.split('').reduce((a, c, i, arr) => a + arr[arr.length - 1 - i], '');
const PIX_KEY = _$(atob(_0x)).trim(); 

/**
 * Calcula e exibe contador regressivo
 */
function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;
    const countdownEl = document.getElementById('countdown');
    
    if (!countdownEl) return;
    
    if (diff <= 0) {
        countdownEl.textContent = 'Hoje é o grande dia!';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 1) {
        countdownEl.textContent = 'Falta 1 dia';
    } else {
        countdownEl.textContent = `Faltam ${days} dias`;
    }
}

/**
 * Vibra o dispositivo (se suportado)
 */
function vibrate() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

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
 * Retorna o caminho do QR Code estático
 */
function generateQRCodeURL(value) {
    return 'img/qr.jpg';
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
 * Cria HTML de um card
 */
function createCardHTML(gift) {
    const customImg = IMAGES_BY_VALUE[gift.value];
    const hasImage = !!customImg;
    const displayTitle = hasImage ? customImg.title : gift.title;
    const qrCodeUrl = generateQRCodeURL(gift.value);
    
    // Layout diferente para cards com imagem (imagem ocupa card todo)
    if (hasImage) {
        return `
            <div class="card-container">
                <div class="card card-with-image" data-id="${gift.id}" data-value="${gift.value}">
                    <!-- Frente - Imagem full -->
                    <div class="card-face card-front">
                        <img src="${customImg.path}" alt="${customImg.title}" class="card-bg-image">
                        <div class="card-overlay"></div>
                        <div class="card-info">
                            <span class="card-title">${displayTitle}</span>
                            <span class="card-value">${formatValue(gift.value)}</span>
                        </div>
                    </div>
                    
                    <!-- Verso - QR Code -->
                    <div class="card-face card-back">
                        <div class="qr-wrapper" data-pix="${PIX_KEY}">
                            <img class="qr-code" src="${qrCodeUrl}" alt="QR Code PIX" loading="lazy">
                        </div>
                        <span class="qr-hint">Toque para copiar</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Layout padrão com emoji
    return `
        <div class="card-container">
            <div class="card" data-id="${gift.id}" data-value="${gift.value}">
                <!-- Frente - Emoji -->
                <div class="card-face card-front">
                    <div class="sticker">
                        <span class="sticker-emoji">${gift.emoji}</span>
                    </div>
                    <span class="card-title">${displayTitle}</span>
                    <span class="card-value">${formatValue(gift.value)}</span>
                </div>
                
                <!-- Verso - QR Code -->
                <div class="card-face card-back">
                    <div class="qr-wrapper" data-pix="${PIX_KEY}">
                        <img class="qr-code" src="${qrCodeUrl}" alt="QR Code PIX" loading="lazy">
                    </div>
                    <span class="qr-hint">Toque para copiar</span>
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
        // Vibração + mensagem de agradecimento
        vibrate();
        showToast('PIX Copia e Cola! Obrigado 💚');
        
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
    // Atualiza contador regressivo
    updateCountdown();
    
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
