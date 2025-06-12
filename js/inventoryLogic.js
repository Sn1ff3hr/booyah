// js/inventoryLogic.js
'use strict';

import { getValue, setValue, getElement, getElements, setText as setElementText } from './domUtils.js';
import { showStatusMessage } from './ui.js';
import { getCurrentProductImageFile, resetCurrentImageFile as resetUiImageState } from './ui.js'; // Import image functions
import { translatePage } from './i18n.js'; // For translating 'Total' in totals row - already present

const DEFAULT_TAX_RATE = 0.10;
let inventoryItems = [];
let nextItemId = 1;

function renderInventoryTable() {
    const inventoryBody = getElement('#inventory-body');
    if (!inventoryBody) return;
    inventoryBody.innerHTML = '';
    inventoryItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.assetId}</td>
            <td>${item.paid.toFixed(2)}</td>
            <td>${item.taxes.toFixed(2)}</td>
            <td>${item.sale.toFixed(2)}</td>
            <td>${item.taxExpected.toFixed(2)}</td>
            <td>${item.amountEarned.toFixed(2)}</td>
            <td>${item.percentEarnings.toFixed(2)}%</td>
        `;
        // Future: Add image indicator like: <td>${item.imageFileName ? '📷' : ''}</td>
        inventoryBody.appendChild(row);
    });
    updateTotals();
}

function clearErrorMessages() {
    setElementText('#asset-id-error', '');
    setElementText('#product-name-error', '');
    setElementText('#total-paid-error', '');
}

function validateProductForm() {
    clearErrorMessages();
    let isValid = true;
    const assetId = getValue('#asset-id');
    const productName = getValue('#product-name');
    const totalPaidStr = getValue('#total-paid');
    const totalPaid = parseFloat(totalPaidStr);
    const quantityStr = getValue('#quantity');
    const quantity = parseInt(quantityStr, 10);
    const futureSaleStr = getValue('#future-sale');
    const futureSale = parseFloat(futureSaleStr);

    if (!assetId) {
        setElementText('#asset-id-error', 'Asset ID is required.');
        isValid = false;
    }
    if (!productName) {
        setElementText('#product-name-error', 'Product Name is required.');
        isValid = false;
    }
    if (!totalPaidStr) {
        setElementText('#total-paid-error', 'Total Paid is required.');
        isValid = false;
    } else if (isNaN(totalPaid) || totalPaid < 0) {
        setElementText('#total-paid-error', 'Total Paid must be a non-negative number.');
        isValid = false;
    }
    if (isNaN(quantity) || quantity <= 0) {
        showStatusMessage('Quantity must be a positive number.', 'error');
        isValid = false;
    }
    if (futureSaleStr && (isNaN(futureSale) || futureSale < 0)) {
        showStatusMessage('Future Sale Price, if entered, must be a non-negative number.', 'error');
        isValid = false;
    }
    const taxInputs = getElements('.tax-input');
    for (const input of taxInputs) {
        if (input.value && (isNaN(parseFloat(input.value)) || parseFloat(input.value) < 0)) {
            showStatusMessage('All Tax/VAT fields, if entered, must be non-negative numbers.', 'error');
            isValid = false;
            break;
        }
    }
    return isValid;
}

export function updateInventory() {
    if (!validateProductForm()) {
        return;
    }

    const name = getValue('#product-name');
    const assetId = getValue('#asset-id');
    const paid = parseFloat(getValue('#total-paid')) || 0;
    const taxInputs = getElements('.tax-input');
    const taxes = Array.from(taxInputs)
        .map(i => parseFloat(i.value) || 0)
        .reduce((a, b) => a + b, 0);
    const sale = parseFloat(getValue('#future-sale')) || 0;
    const quantityVal = parseInt(getValue('#quantity'), 10) || 1;

    const imageFile = getCurrentProductImageFile(); // Get the image File object

    const perUnitPaid = quantityVal > 0 ? paid / quantityVal : paid;
    const percentEarnings = perUnitPaid > 0 ? ((sale - perUnitPaid) / perUnitPaid) * 100 : 0;
    const taxExpected = sale * DEFAULT_TAX_RATE;

    const newItem = {
        id: nextItemId++,
        name,
        assetId,
        paid: perUnitPaid * quantityVal,
        taxes,
        sale,
        quantity: quantityVal,
        taxExpected: taxExpected * quantityVal,
        amountEarned: (sale - perUnitPaid) * quantityVal,
        percentEarnings,
        imageFile: imageFile, // Store the File object (or null)
        imageFileName: imageFile ? imageFile.name : null // Store name for reference
    };

    inventoryItems.push(newItem);
    console.log('Item added with image file:', imageFile ? imageFile.name : 'No image', '; All items:', inventoryItems); // For debugging
    renderInventoryTable();
    clearFormInputs();
    showStatusMessage(`Product "${name}" added to inventory.`, 'success');
}

function updateTotals() {
    const totalsRow = getElement('#inventory-totals');
    if (!totalsRow) return;
    let totalPaid = 0, totalTaxPaid = 0, totalTaxExpected = 0, totalAmountEarned = 0;
    inventoryItems.forEach(item => {
        totalPaid += item.paid;
        totalTaxPaid += item.taxes;
        totalTaxExpected += item.taxExpected;
        totalAmountEarned += item.amountEarned;
    });
    totalsRow.innerHTML = `
        <td></td>
        <td data-i18n="totalLabel">Total</td>
        <td>${totalPaid.toFixed(2)}</td>
        <td>${totalTaxPaid.toFixed(2)}</td>
        <td></td>
        <td>${totalTaxExpected.toFixed(2)}</td>
        <td>${totalAmountEarned.toFixed(2)}</td>
        <td></td>
    `;
}

function clearFormInputs() {
    setValue('#product-name', '');
    setValue('#asset-id', '');
    setValue('#total-paid', '');
    setValue('#future-sale', '');
    setValue('#quantity', '1');
    setValue('#description', '');

    resetUiImageState(); // Clears currentImageFile in ui.js and the <img> preview

    const taxInputs = getElements('.tax-input');
    taxInputs.forEach((input) => {
        input.value = '';
    });
    const taxContainer = getElement('#tax-container');
    if (taxContainer) { // Ensure taxContainer exists
        const allTaxInputsInContainer = taxContainer.querySelectorAll('.tax-input');
        while (allTaxInputsInContainer.length > 1 && taxContainer.lastElementChild && taxContainer.lastElementChild.classList.contains('tax-input')) {
             taxContainer.removeChild(taxContainer.lastElementChild);
        }
    }
    clearErrorMessages();
}

function handleDone() {
    clearFormInputs();
    showStatusMessage('Form cleared.', 'success', 2000);
}

export function initInventoryEventListeners() {
    const updateBtn = getElement('#update-inventory');
    if (updateBtn) updateBtn.addEventListener('click', updateInventory);
    const doneBtn = getElement('#done');
    if (doneBtn) doneBtn.addEventListener('click', handleDone);
    renderInventoryTable();
}
