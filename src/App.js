import { useState, useEffect } from 'react';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import PaymentPanel from './components/PaymentPanel';
import TransactionHistory from './components/TransactionHistory';
import { dbService } from './services/db';
import { syncService } from './services/syncService';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Funkcja do ładowania transakcji
    const loadTransactions = async () => {
      try {
        setLoading(true);
        // Pobierz transakcje z IndexedDB
        const savedTransactions = await dbService.getTransactions();
        console.log('Załadowano transakcje z IndexedDB:', savedTransactions.length);
        // Sortuj transakcje od najnowszej
        const sortedTransactions = savedTransactions.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setTransactions(sortedTransactions);
      } catch (error) {
        console.error('Błąd podczas ładowania transakcji:', error);
      } finally {
        setLoading(false);
      }
    };

    // Sprawdź stan bazy danych i załaduj transakcje
    dbService.checkDatabase().then(dbInfo => {
      console.log('Stan bazy danych:', dbInfo);
      loadTransactions();
    });

    // Nasłuchiwanie zmian stanu połączenia
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleOnline = () => {
    syncService.syncWithServer();
  };

  const handleOffline = () => {
    // Możemy pokazać użytkownikowi informację o trybie offline
  };

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.product.id !== productId)
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const downloadTransactionJson = (transaction) => {
    const data = JSON.stringify(transaction, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date(transaction.timestamp).toISOString().split('.')[0].replace(/[:-]/g, '');
    
    a.href = url;
    a.download = `transaction_${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handlePayment = async (paymentDetails) => {
    const newTransaction = {
      id: Date.now(),
      timestamp: new Date(),
      items: [...cartItems],
      total: paymentDetails.total,
      method: paymentDetails.method,
      cashReceived: paymentDetails.cashReceived,
      change: paymentDetails.change,
      documentType: paymentDetails.documentType,
      customer: paymentDetails.customer
    };

    try {
      // Zapisz lokalnie
      await dbService.saveTransaction(newTransaction);
      setTransactions(prev => [newTransaction, ...prev]);
      setCartItems([]);

      // Jeśli jest offline, pobierz plik JSON
      if (!navigator.onLine) {
        downloadTransactionJson(newTransaction);
      }

      // Jeśli jest połączenie, zarejestruj synchronizację
      if (navigator.onLine) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('sync-transactions');
        });
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania transakcji:', error);
      // W przypadku błędu, również pobierz plik JSON jako kopię zapasową
      downloadTransactionJson(newTransaction);
    }
  };

  const calculateDailyTotal = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return transactions
      .filter(t => new Date(t.timestamp).setHours(0, 0, 0, 0) === today)
      .reduce((sum, t) => sum + t.total, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">System POS</h1>
              <p className="text-gray-600">
                {new Date().toLocaleDateString('pl-PL')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Dziś sprzedaż</p>
              <p className="text-2xl font-bold text-green-600">
                {calculateDailyTotal().toFixed(2)} zł
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 flex gap-4">
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Produkty</h2>
            <ProductGrid onAddToCart={handleAddToCart} />
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Historia transakcji</h2>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <TransactionHistory transactions={transactions} />
            )}
          </div>
        </div>

        <div className="w-96 space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Koszyk</h2>
            <Cart 
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Płatność</h2>
            <PaymentPanel
              total={calculateTotal()}
              onPayment={handlePayment}
              disabled={cartItems.length === 0}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
