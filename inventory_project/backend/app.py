from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory product storage (replace with database in a real application)
products = []
# Counter for generating simple IDs
product_id_counter = 1

@app.route('/products', methods=['POST'])
def add_product():
    global product_id_counter
    data = request.get_json()

    # Basic validation
    required_fields = ['name', 'quantity', 'price']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    if not isinstance(data['name'], str) or \
       not isinstance(data['quantity'], int) or \
       not (isinstance(data['price'], float) or isinstance(data['price'], int)):
        return jsonify({'error': 'Invalid data types for fields'}), 400

    # Create the product dictionary, starting with a copy of the input data
    # to include any extra fields sent by the client.
    product = data.copy()

    # Set/override the mandatory fields and ensure correct types
    product['id'] = product_id_counter
    product['name'] = str(data['name']) # Already validated as str
    product['quantity'] = int(data['quantity']) # Already validated as int
    product['price'] = float(data['price']) # Already validated as float/int

    products.append(product)
    product_id_counter += 1
    return jsonify({'message': 'Product added successfully', 'product': product}), 201

@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
