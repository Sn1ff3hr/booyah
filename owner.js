document.addEventListener('DOMContentLoaded', () => {
    const viewInventoryButton = document.getElementById('view-inventory');
    const inventoryDisplay = document.getElementById('inventory-display');
    const addProductForm = document.getElementById('add-product-form');

    // Mock inventory data
    let inventory = [
        { name: 'Product A', quantity: 100, price: '10.00' },
        { name: 'Product B', quantity: 50, price: '25.50' }
    ];

    viewInventoryButton.addEventListener('click', () => {
        displayInventory();
    });

    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = document.getElementById('product-name').value;
        const productQuantity = parseInt(document.getElementById('product-quantity').value);
        const productPrice = document.getElementById('product-price').value;

        if (productName && !isNaN(productQuantity) && productPrice) {
            inventory.push({ name: productName, quantity: productQuantity, price: productPrice });
            displayInventory(); // Refresh inventory display
            addProductForm.reset(); // Clear the form
            alert('Product added successfully!');
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    function displayInventory() {
        if (inventory.length === 0) {
            inventoryDisplay.innerHTML = '<p>No products in inventory.</p>';
            return;
        }

        let html = '<ul>';
        inventory.forEach(product => {
            html += `<li>${product.name} - Quantity: ${product.quantity} - Price: $${product.price}</li>`;
        });
        html += '</ul>';
        inventoryDisplay.innerHTML = html;
    }

    // Initial display (optional)
    // displayInventory();
});
