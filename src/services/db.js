import { openDB } from 'idb';
import { DB_CONFIG } from '../config/database';
import { externalApi } from '../api/products';

export const initDB = async () => {
  return openDB(DB_CONFIG.name, DB_CONFIG.version, {
    upgrade(db, oldVersion, newVersion) {
      console.log(`Aktualizacja bazy danych z wersji ${oldVersion} do ${newVersion}`);

      // Tworzenie stores na podstawie konfiguracji
      Object.entries(DB_CONFIG.stores).forEach(([storeName, storeConfig]) => {
        if (!db.objectStoreNames.contains(storeName)) {
          console.log(`Tworzenie store ${storeName}...`);
          const store = db.createObjectStore(storeName, {
            keyPath: storeConfig.keyPath,
            autoIncrement: storeConfig.autoIncrement
          });

          // Tworzenie indeksów
          if (storeConfig.indexes) {
            storeConfig.indexes.forEach(index => {
              store.createIndex(index.name, index.keyPath, index.options);
            });
          }
        }
      });
    },
    blocked(currentVersion, blockedVersion, event) {
      console.log('Baza danych jest zablokowana:', { currentVersion, blockedVersion, event });
    },
    blocking(currentVersion, blockedVersion, event) {
      console.log('Ta instancja blokuje aktualizację:', { currentVersion, blockedVersion, event });
    },
    terminated() {
      console.log('Połączenie z bazą danych zostało przerwane');
    }
  });
};

export const dbService = {
  async getProducts() {
    const db = await initDB();
    const tx = db.transaction('products', 'readonly');
    const store = tx.objectStore('products');
    return store.getAll();
  },

  async saveProduct(product) {
    const db = await initDB();
    const tx = db.transaction('products', 'readwrite');
    const store = tx.objectStore('products');
    await store.put(product);
    await tx.done;
  },

  async saveTransaction(transaction) {
    const db = await initDB();
    
    // Rozpocznij transakcję dla 'transactions'
    const txTransactions = db.transaction('transactions', 'readwrite');
    const transactionStore = txTransactions.objectStore('transactions');
    
    // Ustaw flagę synced
    transaction.synced = false;
    
    // Zapisz transakcję
    await transactionStore.put(transaction);
    await txTransactions.done;

    // Rozpocznij osobną transakcję dla 'sync_queue'
    const txQueue = db.transaction('sync_queue', 'readwrite');
    const queueStore = txQueue.objectStore('sync_queue');
    
    // Dodaj do kolejki synchronizacji
    await queueStore.add({
      type: 'transaction',
      data: transaction,
      timestamp: new Date()
    });
    
    await txQueue.done;
  },

  async getTransactions() {
    const db = await initDB();
    const tx = db.transaction('transactions', 'readonly');
    const store = tx.objectStore('transactions');
    return store.getAll();
  },

  async addToSyncQueue(item) {
    const db = await initDB();
    const tx = db.transaction('sync_queue', 'readwrite');
    const store = tx.objectStore('sync_queue');
    await store.add(item);
    await tx.done;
  },

  async getSyncQueue() {
    const db = await initDB();
    const tx = db.transaction('sync_queue', 'readonly');
    const store = tx.objectStore('sync_queue');
    return store.getAll();
  },

  async removeSyncQueueItem(id) {
    const db = await initDB();
    const tx = db.transaction('sync_queue', 'readwrite');
    const store = tx.objectStore('sync_queue');
    await store.delete(id);
    await tx.done;
  },

  async checkDatabase() {
    const db = await initDB();
    console.log('Aktualna wersja bazy:', db.version);
    console.log('Dostępne stores:', Array.from(db.objectStoreNames));

    try {
      // Sprawdź czy są produkty w bazie
      const tx = db.transaction('products', 'readonly');
      const store = tx.objectStore('products');
      const count = await store.count();
      await tx.done; // Poczekaj na zakończenie transakcji

      if (count === 0 && navigator.onLine) {
        console.log('Brak produktów w bazie, pobieram z zewnętrznego API...');
        try {
          // Pobierz produkty z zewnętrznego API
          const products = await externalApi.fetchProducts();
          
          // Nowa transakcja do zapisu produktów
          const writeTx = db.transaction('products', 'readwrite');
          await Promise.all(
            products.map(product => writeTx.store.add(product))
          );
          await writeTx.done;
          console.log('Zapisano produkty do bazy danych');

          // Nowa transakcja do pobrania aktualnej liczby produktów
          const finalTx = db.transaction('products', 'readonly');
          const finalCount = await finalTx.objectStore('products').count();
          await finalTx.done;

          return {
            version: db.version,
            stores: Array.from(db.objectStoreNames),
            productsCount: finalCount
          };
        } catch (error) {
          console.error('Błąd podczas inicjalizacji produktów:', error);
          throw error;
        }
      }

      return {
        version: db.version,
        stores: Array.from(db.objectStoreNames),
        productsCount: count
      };
    } catch (error) {
      console.error('Błąd podczas sprawdzania bazy danych:', error);
      return {
        version: db.version,
        stores: Array.from(db.objectStoreNames),
        productsCount: 0,
        error: error.message
      };
    }
  }
}; 