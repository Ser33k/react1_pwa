import { ClockIcon } from '@heroicons/react/24/outline';
import ReceiptGenerator from './ReceiptGenerator';

const TransactionHistory = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ClockIcon className="h-12 w-12 mx-auto mb-4" />
        <p>Brak transakcji</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {transactions.map((transaction, index) => (
        <div
          key={transaction.id}
          className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                Transakcja #{transactions.length - index}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(transaction.timestamp).toLocaleString('pl-PL')}
              </p>
              <p className="text-sm text-gray-600">
                Metoda: {transaction.method === 'cash' ? 'Gotówka' : 'Karta'}
              </p>
              <p className="text-sm text-gray-600">
                Dokument: {transaction.documentType === 'invoice' ? 'Faktura' : 'Paragon'}
              </p>
            </div>
            <span className="font-bold text-lg">
              {transaction.total.toFixed(2)} zł
            </span>
          </div>
          <div className="mt-2 text-sm">
            {transaction.items.map(item => (
              <div key={item.product.id} className="flex justify-between">
                <span>{item.product.name} x{item.quantity}</span>
                <span>{(item.product.price * item.quantity).toFixed(2)} zł</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2 border-t pt-2">
            <ReceiptGenerator 
              transaction={transaction} 
              type={transaction.documentType} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory; 