import { ShoppingCartIcon, TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const Cart = ({ items, onUpdateQuantity, onRemoveItem }) => {
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4" />
        <p>Koszyk jest pusty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.product.id} 
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <h3 className="font-medium">{item.product.name}</h3>
            <p className="text-sm text-gray-600">{item.product.price.toFixed(2)} zł</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-50"
              aria-label="Zmniejsz ilość"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            
            <span className="w-8 text-center">{item.quantity}</span>
            
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
              className="p-1 rounded-full hover:bg-gray-200"
              aria-label="Zwiększ ilość"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onRemoveItem(item.product.id)}
              className="p-1 rounded-full hover:bg-red-100 text-red-500"
              aria-label="Usuń z koszyka"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      
      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold">
          <span>Suma:</span>
          <span>{calculateTotal().toFixed(2)} zł</span>
        </div>
      </div>
    </div>
  );
};

export default Cart; 