import { useState } from 'react';
import { CreditCardIcon, BanknotesIcon, ReceiptIcon, UserIcon } from '@heroicons/react/24/outline';
import CustomerDatabase from './CustomerDatabase';

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Gotówka', icon: BanknotesIcon },
  { id: 'card', name: 'Karta', icon: CreditCardIcon },
];

const DOCUMENT_TYPES = [
  { id: 'receipt', name: 'Paragon' },
  { id: 'invoice', name: 'Faktura' },
];

const PaymentPanel = ({ total, onPayment, disabled }) => {
  const [selectedMethod, setSelectedMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [documentType, setDocumentType] = useState('receipt');
  const [showCustomerDatabase, setShowCustomerDatabase] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handlePayment = () => {
    if (selectedMethod === 'cash' && parseFloat(cashReceived) < total) {
      alert('Otrzymana kwota jest za mała!');
      return;
    }

    if (documentType === 'invoice' && !selectedCustomer) {
      alert('Wybierz klienta dla faktury!');
      return;
    }

    onPayment({
      method: selectedMethod,
      total,
      cashReceived: selectedMethod === 'cash' ? parseFloat(cashReceived) : null,
      change: selectedMethod === 'cash' ? parseFloat(cashReceived) - total : 0,
      documentType,
      customer: selectedCustomer
    });

    setCashReceived('');
    setSelectedCustomer(null);
    setDocumentType('receipt');
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDatabase(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {PAYMENT_METHODS.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedMethod(id)}
            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 ${
              selectedMethod === id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            disabled={disabled}
          >
            <Icon className="h-6 w-6" />
            <span>{name}</span>
          </button>
        ))}
      </div>

      {selectedMethod === 'cash' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Otrzymano gotówki:
          </label>
          <input
            type="number"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            className="w-full p-2 border rounded-lg"
            placeholder="0.00"
            min={total}
            step="0.01"
          />
          {cashReceived && parseFloat(cashReceived) >= total && (
            <div className="text-sm text-gray-600">
              Reszta: {(parseFloat(cashReceived) - total).toFixed(2)} zł
            </div>
          )}
        </div>
      )}

      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Wybierz dokument:</p>
        <div className="flex gap-2">
          {DOCUMENT_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => {
                setDocumentType(type.id);
                if (type.id === 'invoice' && !selectedCustomer) {
                  setShowCustomerDatabase(true);
                }
              }}
              className={`flex-1 p-2 rounded-lg border-2 ${
                documentType === type.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {documentType === 'invoice' && (
        <div className="border p-3 rounded-lg">
          {selectedCustomer ? (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-gray-600">NIP: {selectedCustomer.nip}</p>
                  <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
                  <p className="text-sm text-gray-600">{selectedCustomer.postalCode} {selectedCustomer.city}</p>
                </div>
                <button
                  onClick={() => setShowCustomerDatabase(true)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Zmień
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomerDatabase(true)}
              className="w-full p-2 border-2 border-dashed rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400"
            >
              <UserIcon className="h-5 w-5 mx-auto mb-1" />
              Wybierz klienta
            </button>
          )}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={disabled || (selectedMethod === 'cash' && (!cashReceived || parseFloat(cashReceived) < total)) || (documentType === 'invoice' && !selectedCustomer)}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Zatwierdź płatność
      </button>

      {showCustomerDatabase && (
        <CustomerDatabase
          onSelectCustomer={handleSelectCustomer}
          onClose={() => setShowCustomerDatabase(false)}
        />
      )}
    </div>
  );
};

export default PaymentPanel; 