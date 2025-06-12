// js/ui.js
'use strict';

// Note: The QRCode library is now expected to be globally available via a script tag.

import { getElement, getValue, setText, getElements } from './domUtils.js';
// import { getCurrentLang } from './i18n.js'; // Not currently used in this file directly

let currentImageFile = null; // Variable to store the current image File object

export function getCurrentProductImageFile() {
    return currentImageFile;
}

export function resetCurrentImageFile() {
    currentImageFile = null;
    const productImage = getElement('#product-image');
    if (productImage) {
        productImage.src = ''; // Clear the preview
    }
    // Also reset the file input element itself, so the same file can be re-selected if needed
    const cameraInput = getElement('#camera-input');
    if (cameraInput) {
        cameraInput.value = null;
    }
}

export function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) {
        resetCurrentImageFile(); // Clear if no file is selected or selection is cancelled
        return;
    }
    currentImageFile = file; // Store the File object

    const reader = new FileReader();
    reader.onload = function(e) {
        const productImage = getElement('#product-image');
        if (productImage) {
            productImage.src = e.target.result; // Set preview
            showStatusMessage('Image preview updated.', 'success', 2000);
        }
    };
    reader.readAsDataURL(file); // Read for preview purposes
}


export function addTaxField() {
    const container = getElement('#tax-container');
    if (!container) return;
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'tax-input';
    input.min = '0';
    input.step = '0.01';
    container.appendChild(input);
}

export function removeTaxField() {
    const container = getElement('#tax-container');
    if (!container) return;
    const taxInputs = container.querySelectorAll('.tax-input');
    if (taxInputs.length > 1) {
        container.removeChild(taxInputs[taxInputs.length - 1]);
    }
}

export async function openCamera() {
    const input = getElement('#camera-input');
    if (input) {
        input.click(); // Triggers the file input
    }
}

export function showStatusMessage(message, type = 'success', duration = 3000) {
    const container = getElement('#status-message-container');
    if (!container) return;

    container.className = 'status-message-container';
    void container.offsetWidth;

    container.textContent = message;
    if (type === 'success') {
        container.classList.add('success');
    } else if (type === 'error') {
        container.classList.add('error');
    }

    container.style.display = 'block';

    setTimeout(() => {
        container.style.display = 'none';
        container.textContent = '';
        container.className = 'status-message-container';
    }, duration);
}


export function scanQRCode() {
    console.warn('QR scanning feature placeholder from ui.js.');
    showStatusMessage('QR code scanning feature is not yet implemented.', 'error', 3000);
}

export function displayProductQRCode() {
    const assetId = getValue('#asset-id');
    const productName = getValue('#product-name');

    if (!assetId && !productName) {
        showStatusMessage('Please enter at least an Asset ID or Product Name to generate a QR code.', 'error');
        return;
    }

    const qrData = JSON.stringify({
        assetId: assetId || '',
        productName: productName || '',
    });

    const qrDisplay = getElement('#qr-code-display');
    const modal = getElement('#qr-modal');
    const qrInfoText = getElement('#qr-info-text');

    if (!qrDisplay || !modal || !qrInfoText) {
        console.error('QR code modal elements not found.');
        showStatusMessage('Could not display QR code modal. Elements missing.', 'error');
        return;
    }

    if (typeof QRCode === 'undefined') {
        showStatusMessage('QR Code library is not loaded.', 'error');
        console.error('QRCode library is not loaded.');
        return;
    }

    qrDisplay.innerHTML = '';

    new QRCode(qrDisplay, {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    qrInfoText.textContent = `Asset ID: ${assetId || 'N/A'}, Name: ${productName || 'N/A'}`;
    modal.style.display = 'flex';

    const printQrMsgEl = getElement('#print-qr-msg');
    if (printQrMsgEl) printQrMsgEl.textContent = '';
}

function closeQrModal() {
    const modal = getElement('#qr-modal');
    if (modal) {
        modal.style.display = 'none';
        const qrDisplay = getElement('#qr-code-display');
        if (qrDisplay) qrDisplay.innerHTML = '';
    }
}

function printDisplayedQRCode() {
    const qrCodeImage = getElement('#qr-code-display img');
    if (qrCodeImage && qrCodeImage.src) {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print QR Code</title><style>body { text-align: center; margin-top: 50px; } img { width: 300px; height: 300px; }</style></head><body>');
        printWindow.document.write('<img src="' + qrCodeImage.src + '">');
        printWindow.document.write('<script>window.onload = function() { window.print(); window.close(); };</script>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
    } else {
        showStatusMessage('Could not find QR code image to print.', 'error');
    }
}

export function initUiEventListeners() {
    const addTaxBtn = getElement('#add-tax');
    if (addTaxBtn) addTaxBtn.addEventListener('click', addTaxField);

    const removeTaxBtn = getElement('#remove-tax');
    if (removeTaxBtn) removeTaxBtn.addEventListener('click', removeTaxField);

    const cameraBtn = getElement('#camera-btn');
    if (cameraBtn) cameraBtn.addEventListener('click', openCamera);

    const cameraInput = getElement('#camera-input');
    if (cameraInput) cameraInput.addEventListener('change', handleImageSelect);

    const qrScanBtn = getElement('#qr-scan-btn');
    if (qrScanBtn) qrScanBtn.addEventListener('click', scanQRCode);

    const displayQrBtn = getElement('#print-qr-btn');
    if (displayQrBtn) displayQrBtn.addEventListener('click', displayProductQRCode);

    const closeQrModalBtn = getElement('#close-qr-modal');
    if (closeQrModalBtn) closeQrModalBtn.addEventListener('click', closeQrModal);

    const printActualQrBtn = getElement('#print-actual-qr-btn');
    if(printActualQrBtn) printActualQrBtn.addEventListener('click', printDisplayedQRCode);

    const modal = getElement('#qr-modal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeQrModal();
            }
        });
    }
}
