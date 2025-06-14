import { render, screen, waitFor, within } from '@testing-library/react'; // Added within
import App from './App';
import axios from 'axios';

// Mock axios for all tests in this file
jest.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    // Reset any previous mock implementation details before each test
    axios.get.mockReset();
    axios.post.mockReset();
  });

  test('renders main heading "Product Entry"', async () => {
    axios.get.mockResolvedValue({ data: [] }); // Mock for initial fetch
    render(<App />);
    // Ensure useEffect completes
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const headingElement = screen.getByText(/🧾 Product Entry/i);
    expect(headingElement).toBeInTheDocument();
  });

  test('renders "Add to Inventory" button', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const addButton = screen.getByRole('button', { name: /Add to Inventory/i });
    expect(addButton).toBeInTheDocument();
  });

  test('renders "Update General Ledger / Inventory" button', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const updateButton = screen.getByRole('button', { name: /Update General Ledger \/ Inventory/i });
    expect(updateButton).toBeInTheDocument();
  });

  test('renders Asset ID input field', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const assetIdInput = screen.getByPlaceholderText(/e.g., SKU-12345/i);
    expect(assetIdInput).toBeInTheDocument();
  });

  test('renders Product Name input field', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const productNameInput = screen.getByPlaceholderText(/e.g., Organic Apples/i);
    expect(productNameInput).toBeInTheDocument();
  });

  test('renders Quantity input field', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const quantityInput = screen.getByPlaceholderText(/e.g., 100/i);
    expect(quantityInput).toBeInTheDocument();
  });

  test('renders Subtotal Paid input field', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const subtotalInput = screen.getByPlaceholderText(/\$0.00/i);
    expect(subtotalInput).toBeInTheDocument();
  });

  test('renders Inventory List heading', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const inventoryListHeading = screen.getByRole('heading', { name: /Inventory List/i });
    expect(inventoryListHeading).toBeInTheDocument();
  });

  test('renders table for products', async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const productTable = screen.getByRole('table');
    expect(productTable).toBeInTheDocument();
  });

  test('initially shows "No products yet" message when fetch returns empty array', async () => {
    axios.get.mockResolvedValue({ data: [] }); // Mock GET to return empty array
    render(<App />);

    const noProductsMessage = await screen.findByText(/No products yet. Add some using the form above./i);
    expect(noProductsMessage).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/products');
  });

  test('displays products when fetch returns data', async () => {
    const mockProducts = [
      { id: 1, assetId: 'A001', name: 'Test Product 1', description: 'Desc 1', quantity: 10, price: 100, vat: 11, futurePrice: 120, futureVat: 12 },
      { id: 2, assetId: 'A002', name: 'Test Product 2', description: 'Desc 2', quantity: 20, price: 200, vat: 21, futurePrice: 240, futureVat: 22 },
    ];
    axios.get.mockResolvedValue({ data: mockProducts });
    render(<App />);

    expect(await screen.findByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();

    expect(screen.getByText('A001')).toBeInTheDocument();
    expect(screen.getByText('Desc 2')).toBeInTheDocument();

    // Check for unique values from Product 2
    const product2Row = screen.getByText('Test Product 2').closest('tr');
    expect(within(product2Row).getByText('20')).toBeInTheDocument(); // Quantity
    expect(within(product2Row).getByText('200.00')).toBeInTheDocument(); // Price
    expect(within(product2Row).getByText('21')).toBeInTheDocument(); // VAT
    expect(within(product2Row).getByText('240.00')).toBeInTheDocument(); // Future Price
    expect(within(product2Row).getByText('22')).toBeInTheDocument(); // Future VAT
  });
});
