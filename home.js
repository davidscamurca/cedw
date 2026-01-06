// =====================================================
// HOME - Camila & David
// =====================================================

// 📅 Data do casamento
const WEDDING_DATE = new Date('2026-04-14T00:00:00');

// 🔗 URL do Google Apps Script (ofuscada)
const _0xAS = 'Y2V4ZS8xUUtZT0hRc3ZtZnAyQnl2V2tNTmQ2ektlS1Z3ZDVfVHBnRGlheE9oYW85MG5WTDhsNmIybTduU0pIVVNvX2xqN3hiY3lmS0Evcy9zb3JjYW0vbW9jLmVsZ29vZy50cGlyY3MvLzpzcHR0aA==';
const _$r = (s) => s.split('').reduce((a, c, i, arr) => a + arr[arr.length - 1 - i], '');
const APPS_SCRIPT_URL = _$r(atob(_0xAS)).trim();

// =====================================================
// ELEMENTOS DOM
// =====================================================
const btnConfirmar = document.getElementById('btnConfirmar');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const confirmForm = document.getElementById('confirmForm');
const nomeInput = document.getElementById('nomeConvidado');
const submitBtn = document.getElementById('submitBtn');
const submitText = submitBtn?.querySelector('.submit-text');
const submitLoading = submitBtn?.querySelector('.submit-loading');
const modalSuccess = document.getElementById('modalSuccess');
const toast = document.getElementById('toast');

// =====================================================
// FUNÇÕES UTILITÁRIAS
// =====================================================

/**
 * Calcula e exibe contador regressivo
 */
function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;
    const countdownEl = document.getElementById('homeCountdown');
    
    if (!countdownEl) return;
    
    if (diff <= 0) {
        countdownEl.textContent = '🎉 Hoje é o grande dia!';
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
 * Mostra toast de confirmação
 */
function showToast(message = 'Confirmado!') {
    const toastText = toast.querySelector('.toast-text');
    toastText.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// =====================================================
// MODAL
// =====================================================

/**
 * Abre o modal
 */
function openModal() {
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Foca no input após a animação
    setTimeout(() => {
        nomeInput?.focus();
    }, 300);
}

/**
 * Fecha o modal
 */
function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
    
    // Reset do formulário após fechar
    setTimeout(() => {
        resetForm();
    }, 300);
}

/**
 * Reseta o formulário para o estado inicial
 */
function resetForm() {
    confirmForm.reset();
    confirmForm.style.display = 'flex';
    modalSuccess.style.display = 'none';
    submitText.style.display = 'inline';
    submitLoading.style.display = 'none';
    submitBtn.disabled = false;
}

// =====================================================
// ENVIO PARA GOOGLE APPS SCRIPT
// =====================================================

/**
 * Envia o nome para o Google Apps Script
 */
async function enviarNome(nomeUsuario) {
    const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Importante para evitar erros de CORS no Apps Script
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nomeUsuario })
    });
    
    // Como usamos no-cors, não temos acesso à resposta
    // Assumimos sucesso se não houve erro
    return true;
}

/**
 * Handler do submit do formulário
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    const nome = nomeInput.value.trim();
    
    if (!nome) {
        nomeInput.focus();
        return;
    }
    
    // Mostra loading
    submitText.style.display = 'none';
    submitLoading.style.display = 'flex';
    submitBtn.disabled = true;
    
    try {
        await enviarNome(nome);
        
        // Sucesso!
        vibrate();
        
        // Esconde form e mostra sucesso
        confirmForm.style.display = 'none';
        modalSuccess.style.display = 'block';
        
        // Mostra toast
        showToast('Presença confirmada! 💚');
        
        // Fecha modal automaticamente após alguns segundos
        setTimeout(() => {
            closeModal();
        }, 4000);
        
    } catch (error) {
        console.error('Erro ao enviar:', error);
        
        // Reset do botão
        submitText.style.display = 'inline';
        submitLoading.style.display = 'none';
        submitBtn.disabled = false;
        
        showToast('Erro ao enviar. Tente novamente.');
    }
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function init() {
    // Atualiza contador regressivo
    updateCountdown();
    
    // Botão de confirmar presença
    btnConfirmar?.addEventListener('click', openModal);
    
    // Fechar modal
    modalClose?.addEventListener('click', closeModal);
    
    // Fechar modal ao clicar fora
    modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Submit do formulário
    confirmForm?.addEventListener('submit', handleSubmit);
    
    // Previne zoom no double tap em iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
}

// Inicia quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

