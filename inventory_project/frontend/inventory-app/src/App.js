import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is imported
import './App.css';

const API_URL = 'http://localhost:5000'; // Backend API URL

function App() {
    const [products, setProducts] = useState([]);
    const [assetId, setAssetId] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [subtotal, setSubtotal] = useState('');
    const [vat, setVat] = useState('');
    const [futurePrice, setFuturePrice] = useState('');
    const [futureVat, setFutureVat] = useState('');

    // Fetch products from backend
    const fetchProducts = async () => {
        try {
            // The backend returns a list of products directly, not nested under a 'products' key.
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data || []); // Ensure products is an array
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]); // Set to empty array on error
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newProduct = {
            // Ensure your backend expects these exact field names
            // assetId is part of the frontend state but not explicitly sent to the backend
            // as the backend's /products POST endpoint doesn't list it as a required or expected field.
            // The backend 'id' is auto-generated.
            // We will include assetId in the payload for now, and adjust if the backend cannot handle it.
            assetId: assetId,
            name: productName, // Backend expects 'name'
            description: description, // Not in backend's required fields, but good to send if available
            quantity: parseInt(quantity),
            price: parseFloat(subtotal), // Backend expects 'price' which is used as subtotal here
            vat: parseFloat(vat), // Not in backend's required fields, but good to send
            futurePrice: parseFloat(futurePrice), // Not in backend's required fields
            futureVat: parseFloat(futureVat), // Not in backend's required fields
        };

        try {
            const response = await axios.post(
                `${API_URL}/products`,
                newProduct
            );
            console.log('Product added:', response.data);
            fetchProducts(); // Refresh the products list
            // Reset form fields
            setAssetId('');
            setProductName('');
            setDescription('');
            setQuantity('');
            setSubtotal('');
            setVat('');
            setFuturePrice('');
            setFutureVat('');
        } catch (error) {
            console.error(
                'Error adding product:',
                error.response ? error.response.data : error.message
            );
            // You might want to display an error message to the user here
        }
    };

    return (
        <div className="App">
            <h1>🧾 Product Entry</h1>
            <form id="productForm" onSubmit={handleSubmit}>
                <div className="form-fields">
                    <label>
                        <span className="label-header">
                            Asset ID{' '}
                            <span className="tooltip">
                                <span className="tooltip-icon">?</span>
                                <span className="tooltip-text">
                                    Unique identifier for tracking products.
                                    (Not sent to backend ID)
                                </span>
                            </span>
                        </span>
                        <input
                            type="text"
                            value={assetId}
                            onChange={(e) => setAssetId(e.target.value)}
                            placeholder="e.g., SKU-12345"
                        />
                    </label>
                    <label>
                        <span className="label-header">
                            Product Name{' '}
                            <span className="tooltip">
                                <span className="tooltip-icon">?</span>
                                <span className="tooltip-text">
                                    What is the name of the product?
                                </span>
                            </span>
                        </span>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g., Organic Apples"
                            required
                        />
                    </label>
                    <label>
                        <span className="label-header">
                            Description{' '}
                            <span className="tooltip">
                                <span className="tooltip-icon">?</span>
                                <span className="tooltip-text">
                                    Describe the product briefly.
                                </span>
                            </span>
                        </span>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Color, size, etc."
                        />
                    </label>
                    <label>
                        <span className="label-header">
                            Quantity{' '}
                            <span className="tooltip">
                                <span className="tooltip-icon">?</span>
                                <span className="tooltip-text">
                                    Total number of units purchased.
                                </span>
                            </span>
                        </span>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="e.g., 100"
                            required
                        />
                    </label>
                    <label>
                        <span className="label-header">
                            Subtotal Paid{' '}
                            <span className="tooltip">
                                <span className="tooltip-icon">?</span>
                                <span className="tooltip-text">
                                    Amount paid before tax. (This will be
                                    'price' in backend)
                                </span>
                            </span>
                        </span>
                        <input
                            type="number"
                            value={subtotal}
                            onChange={(e) => setSubtotal(e.target.value)}
                            placeholder="$0.00"
                            step="0.01"
                            required
                        />
                    </label>
                    <label>
                        <span className="label-header">
                            VAT %{' '}
                            <span className="tooltip">
                                <span className="tooltip-icon">?</span>
                                <span className="tooltip-text">
                                    Tax rate for purchase.
                                </span>
                            </span>
                        </span>
                        <input
                            type="number"
                            value={vat}
                            onChange={(e) => setVat(e.target.value)}
                            placeholder="e.g., 12"
                            step="0.01"
                        />
                    </label>
                    <label>
                        <span className="label-header">
                            Future Price/Unit{' '}
                            <span className="tooltip">
                                <span className="tooltip-icon">?</span>
                                <span className="tooltip-text">
                                    Selling price per unit.
                                </span>
                            </span>
                        </span>
                        <input
                            type="number"
                            value={futurePrice}
                            onChange={(e) => setFuturePrice(e.target.value)}
                            placeholder="$ per unit"
                            step="0.01"
                        />
                    </label>
                    <label>
                        <span className="label-header">
                            Future VAT %{' '}
                            <span className="tooltip">
                                <span className="tooltip-icon">?</span>
                                <span className="tooltip-text">
                                    Expected tax at sale.
                                </span>
                            </span>
                        </span>
                        <input
                            type="number"
                            value={futureVat}
                            onChange={(e) => setFutureVat(e.target.value)}
                            placeholder="e.g., 12"
                            step="0.01"
                        />
                    </label>
                </div>
                <div className="media-box">
                    <div className="media-preview">📷 Image</div>
                    <div className="media-btns">
                        <button
                            type="button"
                            className="media-btn"
                            title="Camera"
                        >
                            📸
                        </button>
                        <button
                            type="button"
                            className="media-btn"
                            title="Scanner"
                        >
                            ➖
                        </button>
                        <button
                            type="button"
                            className="media-btn"
                            title="Print"
                        >
                            🖨️
                        </button>
                    </div>
                </div>
            </form>
            <button type="submit" form="productForm">
                Add to Inventory
            </button>
            <button className="green-update-btn">
                Update General Ledger / Inventory
            </button>

            <div id="productTableContainer">
                <h2>Inventory List</h2>
                <table id="productTable">
                    <thead>
                        <tr>
                            <th>ID (BE)</th>
                            <th>Asset ID (FE)</th>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price (Subtotal)</th>
                            <th>VAT %</th>
                            <th>Future Price/Unit</th>
                            <th>Future VAT %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product, index) => (
                                <tr key={product.id || index}>
                                    {' '}
                                    {/* Use backend product.id */}
                                    <td>{product.id}</td>
                                    <td>{product.assetId}</td>{' '}
                                    {/* Display assetId from product data if available */}
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        {product.price
                                            ? product.price.toFixed(2)
                                            : 'N/A'}
                                    </td>{' '}
                                    {/* Display price */}
                                    <td>{product.vat}</td>
                                    <td>
                                        {product.futurePrice
                                            ? product.futurePrice.toFixed(2)
                                            : 'N/A'}
                                    </td>
                                    <td>{product.futureVat}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">
                                    No products yet. Add some using the form
                                    above.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default App;
