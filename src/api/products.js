// Symulacja opóźnienia sieciowego
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Symulowana baza danych produktów
const PRODUCTS_DB = [
  { 
    id: 1, 
    name: 'Kawa', 
    price: 12.99, 
    category: 'Napoje',
    sku: 'NAP-001',
    stock: 50,
    vat: 23,
  },
  { 
    id: 2, 
    name: 'Herbata', 
    price: 8.99, 
    category: 'Napoje',
    sku: 'NAP-002',
    stock: 45,
    vat: 23,
  },
  { 
    id: 3, 
    name: 'Croissant', 
    price: 7.50, 
    category: 'Pieczywo',
    sku: 'PIE-001',
    stock: 15,
    vat: 5,
  },
  { 
    id: 4, 
    name: 'Kanapka', 
    price: 15.99, 
    category: 'Przekąski',
    sku: 'PRZ-001',
    stock: 8,
    vat: 5,
  },
  { 
    id: 5, 
    name: 'Sok pomarańczowy', 
    price: 9.99, 
    category: 'Napoje',
    sku: 'NAP-003',
    stock: 30,
    vat: 23,
  },
  { 
    id: 6, 
    name: 'Muffin', 
    price: 6.99, 
    category: 'Słodycze',
    sku: 'SLO-001',
    stock: 20,
    vat: 5,
  },
];

export const productsApi = {
  // Pobierz wszystkie produkty
  getProducts: async () => {
    await delay(800); // Symulacja opóźnienia sieciowego
    return PRODUCTS_DB;
  },

  // Pobierz produkty według kategorii
  getProductsByCategory: async (category) => {
    await delay(500);
    return PRODUCTS_DB.filter(product => product.category === category);
  },

  // Pobierz pojedynczy produkt
  getProduct: async (id) => {
    await delay(300);
    const product = PRODUCTS_DB.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  // Aktualizuj stan magazynowy
  updateStock: async (productId, quantity) => {
    await delay(300);
    const product = PRODUCTS_DB.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    product.stock -= quantity;
    return product;
  }
}; 