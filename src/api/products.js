import { openDB } from 'idb';
import { DB_CONFIG } from '../config/database';

// Inicjalizacja bazy danych
async function initDB() {
  return openDB(DB_CONFIG.name, DB_CONFIG.version, {
    upgrade(db, oldVersion, newVersion) {
      // Konfiguracja jest już obsłużona w głównym pliku db.js
      console.log(`Aktualizacja bazy danych w products.js z wersji ${oldVersion} do ${newVersion}`);
    }
  });
}

// Symulacja API zewnętrznego systemu
const EXTERNAL_PRODUCTS = [
  { 
    id: 1, 
    name: 'Kawa', 
    price: 12.99, 
    category: 'Napoje',
    sku: 'NAP-001',
    stock: 50,
    vat: 23,
    lastUpdate: new Date().toISOString()
  },
  { 
    id: 2, 
    name: 'Herbata', 
    price: 8.99, 
    category: 'Napoje',
    sku: 'NAP-002',
    stock: 45,
    vat: 23,
    lastUpdate: new Date().toISOString()
  },
  { 
    id: 3, 
    name: 'Croissant', 
    price: 7.50, 
    category: 'Pieczywo',
    sku: 'PIE-001',
    stock: 15,
    vat: 5,
    lastUpdate: new Date().toISOString()
  },
  { 
    id: 4, 
    name: 'Kanapka', 
    price: 15.99, 
    category: 'Przekąski',
    sku: 'PRZ-001',
    stock: 8,
    vat: 5,
    lastUpdate: new Date().toISOString()
  },
  { 
    id: 5, 
    name: 'Sok pomarańczowy', 
    price: 9.99, 
    category: 'Napoje',
    sku: 'NAP-003',
    stock: 30,
    vat: 23,
    lastUpdate: new Date().toISOString()
  },
  { 
    id: 6, 
    name: 'Muffin', 
    price: 6.99, 
    category: 'Słodycze',
    sku: 'SLO-001',
    stock: 20,
    vat: 5,
    lastUpdate: new Date().toISOString()
  }
];

// Symulacja opóźnienia sieciowego
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const externalApi = {
  // Symulacja pobierania z zewnętrznego systemu
  async fetchProducts() {
    await delay(800);
    console.log('Pobieranie produktów z zewnętrznego systemu...');
    return EXTERNAL_PRODUCTS;
  }
};

export const productsApi = {
  async getProducts() {
    try {
      // Inicjalizuj bazę danych
      const db = await initDB();

      if (navigator.onLine) {
        console.log('Tryb online: Pobieranie produktów z zewnętrznego systemu...');
        const products = await externalApi.fetchProducts();
        
        try {
          // Zapisz do IndexedDB
          console.log('Rozpoczęcie zapisywania produktów do IndexedDB...');
          const tx = db.transaction('products', 'readwrite');
          
          // Wyczyść istniejące produkty
          await tx.store.clear();
          
          // Zapisz nowe produkty
          for (const product of products) {
            await tx.store.add(product);
          }
          
          await tx.done;
          console.log('Produkty zostały pomyślnie zapisane w IndexedDB');
        } catch (error) {
          console.error('Błąd podczas zapisywania do IndexedDB:', error);
        }
        
        return { products, source: 'online' };
      } else {
        console.log('Tryb offline: Pobieranie produktów z IndexedDB...');
        const products = await db.getAll('products');
        console.log('Pobrano produktów z IndexedDB:', products.length);
        return { products, source: 'offline' };
      }
    } catch (error) {
      console.error('Błąd podczas operacji na produktach:', error);
      try {
        const db = await initDB();
        const products = await db.getAll('products');
        console.log('Pobrano produkty z lokalnej bazy po błędzie:', products.length);
        return { products, source: 'offline' };
      } catch (fallbackError) {
        console.error('Błąd podczas próby pobrania z lokalnej bazy:', fallbackError);
        return { products: [], source: 'offline' };
      }
    }
  },

  async getProductsByCategory(category) {
    const db = await initDB();
    const products = await db.getAll('products');
    return products.filter(product => product.category === category);
  },

  async getProduct(id) {
    const db = await initDB();
    const product = await db.get('products', id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async updateStock(productId, quantity) {
    const db = await initDB();
    const tx = db.transaction('products', 'readwrite');
    const product = await tx.store.get(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    product.stock -= quantity;
    await tx.store.put(product);
    await tx.done;

    return product;
  }
}; 