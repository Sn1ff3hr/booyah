'use strict';
// Language Switcher
let currentLang = 'en';
const langToggle = document.getElementById('langToggle');
function switchLang() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  langToggle.textContent = currentLang === 'en' ? 'ES' : 'EN';
  document.getElementById('mainNavTitle').textContent = document.getElementById('mainNavTitle').getAttribute(`data-${currentLang}`);
  document.getElementById('mainTitle').textContent = currentLang === 'en'
    ? '🧾 Product Entry | Product Entry'
    : '🧾 Entrada de Producto | Entrada de Producto';
  document.querySelectorAll('[data-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
  document.querySelectorAll('[data-en][placeholder]').forEach(el => {
    el.placeholder = el.getAttribute(`data-${currentLang}`);
  });
  document.querySelectorAll('.tooltip-text').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
  document.querySelectorAll('.help').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
  const imgHelp = document.getElementById('imgHelp');
  if (imgHelp) {
    imgHelp.textContent = imgHelp.getAttribute(`data-${currentLang}`);
  }
  document.querySelectorAll('th[data-en]').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
  const addBtn = document.getElementById('addBtn');
  if (addBtn) addBtn.textContent = addBtn.getAttribute(`data-${currentLang}`);
  const ledgerBtn = document.getElementById('ledgerBtn');
  if (ledgerBtn) ledgerBtn.textContent = ledgerBtn.getAttribute(`data-${currentLang}`);
}
if (langToggle) langToggle.addEventListener('click', switchLang);

// Camera
const cameraBtn = document.getElementById('cameraBtn');
const uploadImg = document.getElementById('uploadImg');
const imgPreview = document.getElementById('imgPreview');
if (cameraBtn) cameraBtn.onclick = () => uploadImg.click();
if (uploadImg) {
  uploadImg.onchange = function () {
    if (this.files && this.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        imgPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%;height:auto;border-radius:1em;">`;
      };
      reader.readAsDataURL(this.files[0]);
    }
  };
}

// Scan
const scanBtn = document.getElementById('scanBtn');
if (scanBtn) {
  scanBtn.onclick = () => {
    alert(currentLang === 'en'
      ? 'QR/Barcode scanner feature coming soon!\nThis can connect to a library or mobile scanner.'
      : '¡Función de escáner QR/Código de barras próximamente!\nEsto puede conectarse a una biblioteca o escáner móvil.');
  };
}
// Print
const printBtn = document.getElementById('printBtn');
if (printBtn) {
  printBtn.onclick = () => {
    const fields = [
      { label: currentLang === 'en' ? 'Asset ID' : 'ID del Producto', value: document.getElementById('assetId').value },
      { label: currentLang === 'en' ? 'Product Name' : 'Nombre del Producto', value: document.getElementById('productName').value },
      { label: currentLang === 'en' ? 'Description' : 'Descripción', value: document.getElementById('description').value },
      { label: currentLang === 'en' ? 'Quantity' : 'Cantidad', value: document.getElementById('quantity').value },
      { label: currentLang === 'en' ? 'Subtotal Paid' : 'Subtotal Pagado', value: document.getElementById('subtotal').value },
      { label: currentLang === 'en' ? 'VAT %' : 'IVA %', value: document.getElementById('vat').value },
      { label: currentLang === 'en' ? 'Total Amount Paid' : 'Precio de Venta', value: document.getElementById('totalPaid').value },
      { label: currentLang === 'en' ? 'Unit Price' : 'Precio por Unidad', value: document.getElementById('unitPrice').value },
      { label: currentLang === 'en' ? 'Future Selling' : 'Venta Futura', value: document.getElementById('futureSelling').value },
      { label: currentLang === 'en' ? 'Future VAT %' : 'IVA Futuro %', value: document.getElementById('futureVat').value },
      { label: currentLang === 'en' ? 'Future Earnings' : 'Monto Futuro a Ganar', value: document.getElementById('futureEarnings').value },
      { label: currentLang === 'en' ? '% Earnings' : '% de Ganancias', value: document.getElementById('grossMargin').value }
    ];
    let printContent = `<h2>${currentLang === 'en' ? 'Product Entry' : 'Entrada de Producto'}</h2><ul style="font-size:1.1em;">`;
    for (const f of fields) {
      printContent += `<li><strong>${f.label}:</strong> ${f.value ? f.value : '-'}</li>`;
    }
    printContent += '</ul>';
    const win = window.open('', '_blank', 'width=600,height=600');
    win.document.write(`<html><head><title>Print Product</title></head><body>${printContent}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };
}

function toFloat(v) { return parseFloat(v.replace(',', '.')) || 0; }
function updateCalculatedFields() {
  const subtotal = toFloat(document.getElementById('subtotal').value);
  const vat = toFloat(document.getElementById('vat').value);
  const qty = toFloat(document.getElementById('quantity').value);
  const futureSelling = toFloat(document.getElementById('futureSelling').value);
  const vatDecimal = vat / 100;
  const totalPaid = subtotal * (1 + vatDecimal);
  document.getElementById('totalPaid').value = totalPaid ? totalPaid.toFixed(2) : '';
  const unitPrice = qty ? subtotal / qty : 0;
  document.getElementById('unitPrice').value = unitPrice ? unitPrice.toFixed(2) : '';
  const futureEarnings = futureSelling && qty ? futureSelling * qty : 0;
  document.getElementById('futureEarnings').value = futureEarnings ? futureEarnings.toFixed(2) : '';
  const grossMargin = unitPrice && futureSelling ? ((futureSelling - unitPrice) / unitPrice) * 100 : 0;
  document.getElementById('grossMargin').value = grossMargin ? grossMargin.toFixed(2) : '';
}
['subtotal', 'vat', 'quantity', 'futureSelling'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', updateCalculatedFields);
});

document.getElementById('productForm').onsubmit = function (e) {
  e.preventDefault();
  updateCalculatedFields();
  const row = document.createElement('tr');
  row.innerHTML = [
    'assetId','productName','quantity','subtotal','vat','totalPaid','unitPrice','futureSelling','futureVat','futureEarnings','grossMargin'
  ].map(id => `<td>${document.getElementById(id).value || '-'}</td>`).join('');
  document.querySelector('#inventoryTable tbody').appendChild(row);
  this.reset();
  updateCalculatedFields();
  imgPreview.innerHTML = '📷';
};
