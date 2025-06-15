'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const paymentModal = document.getElementById('paymentModal');
    if (!paymentModal) return;

    const openBtn = document.getElementById('proceed-to-pay');
    const closeBtn = paymentModal.querySelector('.close');
    const cancelBtn = paymentModal.querySelector('.cancel-btn');
    const modalContent = paymentModal.querySelector('.modal-content');

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            paymentModal.style.display = 'flex';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            paymentModal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            paymentModal.style.display = 'none';
        });
    }

    if (modalContent) {
        modalContent.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    paymentModal.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });
});
