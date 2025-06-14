import pytest
import json
from app import app, products as app_products # Import the app instance and the products list

@pytest.fixture
def client():
    app.config['TESTING'] = True
    # Reset products list before each test to ensure test isolation
    app_products.clear()
    # Reset product_id_counter if it's accessible and needs resetting.
    # Assuming product_id_counter is a global in app.py, we might need to reset it.
    # For now, let's assume tests can manage or work with sequential IDs.
    # If your app.py has `product_id_counter = 1` at the global scope,
    # you might need to import and reset it here or in individual tests if strict ID checking is needed.
    # from app import product_id_counter as app_product_id_counter
    # global app_product_id_counter # Or find a way to reset it if it's not global
    # app_product_id_counter = 1
    # For simplicity, we'll rely on clearing app_products and sequential IDs.

    with app.test_client() as client:
        yield client

def test_add_product_success(client):
    """Test adding a product successfully."""
    payload = {
        'name': 'Test Product',
        'quantity': 10,
        'price': 19.99
    }
    response = client.post('/products', json=payload)
    data = response.get_json()

    assert response.status_code == 201
    assert 'message' in data
    assert data['message'] == 'Product added successfully'
    assert 'product' in data
    assert data['product']['name'] == payload['name']
    assert data['product']['quantity'] == payload['quantity']
    assert data['product']['price'] == payload['price']
    assert 'id' in data['product']

    # Assert that the product was actually added to the in-memory list
    assert len(app_products) == 1
    assert app_products[0]['name'] == payload['name']
    assert app_products[0]['id'] == data['product']['id']

def test_add_product_missing_fields(client):
    """Test adding a product with missing required fields."""
    payload = {
        'quantity': 10,
        'price': 19.99
    } # Missing 'name'
    response = client.post('/products', json=payload)
    data = response.get_json()

    assert response.status_code == 400
    assert 'error' in data
    assert data['error'] == 'Missing required fields'
    assert len(app_products) == 0 # Ensure product was not added

def test_add_product_invalid_data_types(client):
    """Test adding a product with invalid data types for fields."""
    payload_wrong_type = {
        'name': 'Test Product',
        'quantity': 'not-an-int', # Invalid type
        'price': 19.99
    }
    response = client.post('/products', json=payload_wrong_type)
    data = response.get_json()
    assert response.status_code == 400
    assert 'error' in data
    assert data['error'] == 'Invalid data types for fields'

    payload_wrong_price_type = {
        'name': 'Test Product',
        'quantity': 10,
        'price': 'not-a-float' # Invalid type
    }
    response = client.post('/products', json=payload_wrong_price_type)
    data = response.get_json()
    assert response.status_code == 400
    assert 'error' in data
    assert data['error'] == 'Invalid data types for fields'
    assert len(app_products) == 0 # Ensure product was not added


def test_get_products_empty(client):
    """Test getting products when none exist."""
    app_products.clear() # Ensure it's empty
    response = client.get('/products')
    data = response.get_json()

    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) == 0

def test_get_products_with_data(client):
    """Test getting products when some exist."""
    app_products.clear() # Start clean

    # Add some products directly to the list for testing GET
    # (or use POST endpoint, but direct manipulation is fine for setting up state for GET)
    product1 = {'id': 1, 'name': 'Product 1', 'quantity': 5, 'price': 10.0}
    product2 = {'id': 2, 'name': 'Product 2', 'quantity': 10, 'price': 20.0}
    app_products.append(product1)
    app_products.append(product2)

    # If your app uses a global counter that's not reset, the IDs from POST might differ.
    # For this test, we directly manipulate app_products, so IDs are what we set.

    response = client.get('/products')
    data = response.get_json()

    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) == 2

    # Check if the returned products match what we inserted
    # The order might not be guaranteed unless the backend sorts it.
    # We'll check if the names match as a simple verification.
    response_names = {p['name'] for p in data}
    expected_names = {product1['name'], product2['name']}
    assert response_names == expected_names

    # More thorough check if IDs are predictable
    assert any(p['id'] == 1 and p['name'] == 'Product 1' for p in data)
    assert any(p['id'] == 2 and p['name'] == 'Product 2' for p in data)

def test_add_product_with_extra_fields(client):
    """Test adding a product with extra fields not strictly defined in backend requirements."""
    payload = {
        'name': 'Extra Product',
        'quantity': 15,
        'price': 25.99,
        'assetId': 'SKU123', # Extra field
        'description': 'Test description', # Extra field
        'vat': 5.0, # Extra field
        'futurePrice': 30.0, # Extra field
        'futureVat': 7.5 # Extra field
    }
    response = client.post('/products', json=payload)
    data = response.get_json()

    assert response.status_code == 201
    assert 'product' in data
    assert data['product']['name'] == payload['name']
    assert data['product']['assetId'] == payload['assetId'] # Check if extra field is stored
    assert data['product']['description'] == payload['description']
    assert data['product']['vat'] == payload['vat']
    assert data['product']['futurePrice'] == payload['futurePrice']
    assert data['product']['futureVat'] == payload['futureVat']

    # Check in-memory list
    assert len(app_products) == 1
    assert app_products[0]['name'] == payload['name']
    assert app_products[0]['assetId'] == payload['assetId']
    assert app_products[0]['description'] == payload['description']
    assert app_products[0]['vat'] == payload['vat']
    assert app_products[0]['futurePrice'] == payload['futurePrice']
    assert app_products[0]['futureVat'] == payload['futureVat']

# To ensure product_id_counter reset works if it's a global that needs explicit reset
# you would do something like this:
# from app import product_id_counter
#
# @pytest.fixture(autouse=True)
# def reset_product_id_counter_fixture():
#     global product_id_counter
#     original_counter = product_id_counter
#     product_id_counter = 1
#     yield
#     product_id_counter = original_counter
#
# This depends on `product_id_counter` being accessible and modifiable from the test file.
# The current app.py has it as a local global, so it should be reset per app context implicitly with `app.test_client()`.
# The current implementation of app.py re-initializes product_id_counter = 1 at the module level.
# Test client reuses the same app instance, so product_id_counter will increment across tests within a session
# unless explicitly reset. The provided app.py code will have product_id_counter keep incrementing.
# For true isolation, the counter should be reset. Let's modify app.py to allow resetting or make counter part of app state.

# For now, the tests assume sequential IDs from 1 for each test run due to app_products.clear()
# and the fact that product_id_counter starts at 1 and increments. If a test run involves multiple POSTs,
# the IDs will be sequential (1, 2, 3...).
# The `test_get_products_with_data` directly manipulates app_products, so IDs are as set there.
# The `test_add_product_success` will get ID 1. If another test runs test_add_product_success it will get ID 2, etc.
# This is acceptable for now. A more robust solution would be to reset the counter in the fixture.
# Let's add a mechanism to reset the counter in app.py for tests.
# (This comment reflects thought process; actual change to app.py would be a separate step if needed)
# For the current structure, the `product_id_counter` in `app.py` is a global variable.
# It will persist across test client calls unless the app context is fully re-initialized or the counter is manually reset.
# The `client` fixture with `app.config['TESTING'] = True` creates a test context,
# but the global `product_id_counter` in `app.py` module scope will not be reset automatically by just clearing `app_products`.

# To make tests fully independent regarding IDs, the product_id_counter must be reset.
# One way: add a specific route or function in app.py for tests to reset state,
# or make product_id_counter part of the app's context (e.g., app.product_id_counter)
# and reset it in the fixture.

# Let's assume for now the sequential IDs are fine, as `app_products` is cleared.
# The first product added by any test_add_product will have ID 1, the next ID 2, IF product_id_counter was reset.
# Since it's NOT reset by default by just creating a test_client, the first product added by the first test running a POST
# will get ID 1. The first product added by the *next* test running a POST will get ID 2, and so on.
# This is because product_id_counter is a global in app.py and retains its value across client calls in a test session.

# The tests are written to generally expect *an* ID, not a specific ID, for POST responses,
# which makes them robust to this counter behavior.
# test_get_products_with_data uses specific IDs because it bypasses POST and sets data directly.
# This is fine.
# Added test_add_product_invalid_data_types and test_add_product_with_extra_fields.
# The `test_add_product_success` and `test_add_product_with_extra_fields` will have sequential IDs.
# For example, if test_add_product_success runs first, its product gets id 1.
# If test_add_product_with_extra_fields runs next, its product gets id 2.
# This is usually handled by pytest ordering or by making IDs fully independent.
# For now, this should be acceptable.
# The `app_products.clear()` in the fixture ensures the list is empty before each test.
# The `product_id_counter` in `app.py` is initialized to `1` when `app.py` is first imported.
# It will then increment. This means that if tests run in a certain order, the IDs will be sequential
# across all tests that use POST. This is generally okay.
# For example:
# 1. test_add_product_success runs -> adds product with ID 1. app_products is cleared after.
# 2. test_add_product_with_extra_fields runs -> adds product with ID 2. app_products is cleared after.
# This is because `product_id_counter` is global and not reset in the fixture.
# Let's try to reset it.
# Add a reset function to app.py and call it from the fixture.

# --- (Thinking about resetting product_id_counter) ---
# To properly reset, I'd modify app.py:
#
# def reset_product_id_counter_for_test():
#     global product_id_counter
#     product_id_counter = 1
#
# And in test_app.py fixture:
# from app import reset_product_id_counter_for_test
# ...
#     reset_product_id_counter_for_test() # Call this in client fixture
# ---
# For now, I will proceed without this modification to app.py, as it's a larger change.
# The tests should mostly pass; ID assertions are "is present" or match payload.
# The key is that `app_products` is cleared.
# `test_get_products_with_data` is fine because it creates its own data.
# `test_add_product_success` checks `len(app_products) == 1` and `app_products[0]['id'] == data['product']['id']`. This is robust.
# `test_add_product_with_extra_fields` does the same. This is also robust.
# The actual value of the ID (1, 2, 3...) is not hardcoded in these POST tests' assertions about the response.
# The only place a specific ID is used is in `test_get_products_with_data`, which is fine as it sets up its own data.

# Final check of tests:
# - test_add_product_success: OK
# - test_add_product_missing_fields: OK
# - test_add_product_invalid_data_types: OK (added this for completeness)
# - test_get_products_empty: OK
# - test_get_products_with_data: OK
# - test_add_product_with_extra_fields: OK (to test frontend scenario)

# The tests cover the main functionalities and edge cases as requested.
# The backend validation for POST /products checks for 'name', 'quantity', 'price'.
# It also checks their types. My tests cover these.
# Extra fields sent by the frontend (like assetId, description, vat, etc.) are also tested.
# The current backend app.py will store these extra fields because it does `product = { 'id': ..., **data }` essentially.
# My test_add_product_with_extra_fields verifies this behavior.
# The assertion `assert data['product']['assetId'] == payload['assetId']` confirms this.
# And `assert app_products[0]['assetId'] == payload['assetId']` confirms it in the list.
# Looks good.
