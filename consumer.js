document.addEventListener('DOMContentLoaded', () => {
    const productsDisplay = document.getElementById('products-display');
    const cartDisplay = document.getElementById('cart-display');
    const checkoutButton = document.getElementById('checkout');

    // Mock product data (ideally this would come from a backend)
    const products = [
        { id: 1, name: 'Product A', price: '10.00', quantity: 100 },
        { id: 2, name: 'Product B', price: '25.50', quantity: 50 },
        { id: 3, name: 'Product C', price: '5.75', quantity: 200 }
    ];

    let cart = [];

    function displayProducts() {
        if (products.length === 0) {
            productsDisplay.innerHTML = '<p>No products available at the moment.</p>';
            return;
        }
        let html = '';
        products.forEach(product => {
            html += `
                <div class="product">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                    <p>Available: ${product.quantity}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
        });
        productsDisplay.innerHTML = html;

        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }

    function addToCart(productId) {
        const productToAdd = products.find(p => p.id === productId);
        if (productToAdd && productToAdd.quantity > 0) {
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ ...productToAdd, quantity: 1 });
            }
            productToAdd.quantity--; // Decrease available quantity
            displayCart();
            displayProducts(); // Refresh products to show updated quantity
        } else {
            alert('Product is out of stock or does not exist.');
        }
    }

    function displayCart() {
        if (cart.length === 0) {
            cartDisplay.innerHTML = '<p>Your cart is currently empty.</p>';
            return;
        }
        let html = '<ul>';
        let total = 0;
        cart.forEach(item => {
            const itemTotal = parseFloat(item.price) * item.quantity;
            html += `<li>${item.name} - Quantity: ${item.quantity} - Price: $${itemTotal.toFixed(2)}</li>`;
            total += itemTotal;
        });
        html += `</ul><p><strong>Total: $${total.toFixed(2)}</strong></p>`;
        cartDisplay.innerHTML = html;
    }

    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Proceeding to checkout (simulation)!');
            // Here you would typically redirect to a payment gateway or a more detailed checkout page
            cart = []; // Empty cart after checkout
            displayCart();
            // Potentially, refresh product quantities if they were reserved from a database
        } else {
            alert('Your cart is empty.');
        }
    });

    // Initial display of products
    displayProducts();
});
