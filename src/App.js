import { useState } from 'react';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import PaymentPanel from './components/PaymentPanel';
import TransactionHistory from './components/TransactionHistory';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [transactions, setTransactions] = useState([]);

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

  const handlePayment = (paymentDetails) => {
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

    setTransactions(prev => [newTransaction, ...prev]);
    setCartItems([]);
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
            <TransactionHistory transactions={transactions} />
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
