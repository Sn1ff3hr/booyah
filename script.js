'use strict';
// Simple i18n dictionary
const translations = {
    en: {
        title: 'Product Entry',
        assetId: 'Asset ID',
        productName: 'Product Name',
        tax: 'Tax/VAT',
        quantity: 'Quantity',
        description: 'Description',
        purchaseAmount: 'Total Paid',
        salePrice: 'Future Sale Price',
        updateInventory: 'Update Inventory',
        done: 'Done',
        inventoryList: 'Inventory List',
        taxExpected: 'Tax Expected',
        amountEarned: 'Amount to Earn',
        percentEarnings: '% Earnings',
        printQrMsg: 'To print a QR code complete the form'
    },
    es: {
        title: 'Ingreso de Producto',
        assetId: 'ID de Activo',
        productName: 'Nombre del Producto',
        tax: 'Impuesto/IVA',
        quantity: 'Cantidad',
        description: 'Descripción',
        purchaseAmount: 'Total Pagado',
        salePrice: 'Precio de Venta',
        updateInventory: 'Actualizar Inventario',
        done: 'Hecho',
        inventoryList: 'Lista de Inventario',
        taxExpected: 'Impuesto Esperado',
        amountEarned: 'Monto a Ganar',
        percentEarnings: '% Ganancias',
        printQrMsg: 'Para imprimir el c\u00f3digo QR complete el formulario'
    }
};

let currentLang = navigator.language.startsWith('es') ? 'es' : 'en';

function translatePage(lang) {
    currentLang = translations[lang] ? lang : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    updateLangButton();
}

function updateLangButton() {
    const btn = document.getElementById('lang-toggle');
    if (btn) {
        btn.textContent = currentLang.toUpperCase();
    }
}

function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'es' : 'en';
    translatePage(newLang);
}

function addTaxField() {
    const container = document.getElementById('tax-container');
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'tax-input';
    input.min = '0';
    input.step = '0.01';
    container.appendChild(input);
}

function removeTaxField() {
    const container = document.getElementById('tax-container');
    if (container.children.length > 2) {
        container.removeChild(container.lastElementChild);
    }
}

function updateInventory() {
    const name = document.getElementById('product-name').value;
    const assetId = document.getElementById('asset-id').value;
    const paid = parseFloat(document.getElementById('total-paid').value) || 0;
    const taxes = Array.from(document.querySelectorAll('.tax-input'))
        .map(i => parseFloat(i.value) || 0)
        .reduce((a, b) => a + b, 0);
    const sale = parseFloat(document.getElementById('future-sale').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value, 10) || 0;

    const taxExpected = sale * 0.15; // placeholder
    const amountEarned = (sale - paid) * quantity;
    const percentEarnings = sale ? ((sale - paid) / sale) * 100 : 0;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td>${assetId}</td>
        <td>${paid.toFixed(2)}</td>
        <td>${taxes.toFixed(2)}</td>
        <td>${sale.toFixed(2)}</td>
        <td>${taxExpected.toFixed(2)}</td>
        <td>${amountEarned.toFixed(2)}</td>
        <td>${percentEarnings.toFixed(2)}%</td>
    `;
    document.getElementById('inventory-body').appendChild(row);

    updateTotals();
}

function updateTotals() {
    const rows = document.querySelectorAll('#inventory-body tr');
    let totals = Array(6).fill(0); // paid, tax, sale, taxExpected, amountEarned, percentEarnings (ignored)
    rows.forEach(row => {
        totals[0] += parseFloat(row.children[2].textContent);
        totals[1] += parseFloat(row.children[3].textContent);
        totals[2] += parseFloat(row.children[4].textContent);
        totals[3] += parseFloat(row.children[5].textContent);
        totals[4] += parseFloat(row.children[6].textContent);
    });
    const totalsRow = document.getElementById('inventory-totals');
    totalsRow.innerHTML = `
        <td></td>
        <td>Total</td>
        <td>${totals[0].toFixed(2)}</td>
        <td>${totals[1].toFixed(2)}</td>
        <td>${totals[2].toFixed(2)}</td>
        <td>${totals[3].toFixed(2)}</td>
        <td>${totals[4].toFixed(2)}</td>
        <td></td>
    `;
}

async function openCamera() {
    const input = document.getElementById('camera-input');
    if (input) {
        input.click();
    }
}

function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('product-image').src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function scanQRCode() {
    alert('QR scanning not implemented');
}

function printQRCode() {
    const msg = document.getElementById('print-qr-msg');
    if (msg) msg.textContent = translations[currentLang].printQrMsg;
    window.print();
}

function init() {
    translatePage(currentLang);
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
    document.getElementById('add-tax').addEventListener('click', addTaxField);
    document.getElementById('remove-tax').addEventListener('click', removeTaxField);
    document.getElementById('update-inventory').addEventListener('click', updateInventory);
    document.getElementById('camera-btn').addEventListener('click', openCamera);
    document.getElementById('camera-input').addEventListener('change', handleImageSelect);
    document.getElementById('qr-scan-btn').addEventListener('click', scanQRCode);
    document.getElementById('print-qr-btn').addEventListener('click', printQRCode);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
    }
}

document.addEventListener('DOMContentLoaded', init);
