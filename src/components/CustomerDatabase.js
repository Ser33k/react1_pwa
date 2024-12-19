import { useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const SAMPLE_CUSTOMERS = [
  {
    id: 1,
    name: 'Firma ABC Sp. z o.o.',
    nip: '1234567890',
    address: 'ul. Przykładowa 1',
    postalCode: '00-001',
    city: 'Warszawa',
    email: 'kontakt@firmaabc.pl',
  },
  // Więcej przykładowych klientów...
];

const CustomerDatabase = ({ onSelectCustomer, onClose }) => {
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    nip: '',
    address: '',
    postalCode: '',
    city: '',
    email: '',
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.nip.includes(searchQuery)
  );

  const handleAddCustomer = (e) => {
    e.preventDefault();
    const customer = {
      id: Date.now(),
      ...newCustomer
    };
    setCustomers(prev => [...prev, customer]);
    setNewCustomer({
      name: '',
      nip: '',
      address: '',
      postalCode: '',
      city: '',
      email: '',
    });
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Baza klientów</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Szukaj po nazwie lub NIP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <PlusIcon className="h-5 w-5" />
              Dodaj
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {showAddForm ? (
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <input
                type="text"
                placeholder="Nazwa firmy"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="NIP"
                value={newCustomer.nip}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, nip: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Adres"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kod pocztowy"
                  value={newCustomer.postalCode}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, postalCode: e.target.value }))}
                  className="w-1/3 p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Miasto"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, city: e.target.value }))}
                  className="flex-1 p-2 border rounded-lg"
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Zapisz
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {filteredCustomers.map(customer => (
                <button
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer)}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-600">NIP: {customer.nip}</div>
                  <div className="text-sm text-gray-600">{customer.address}, {customer.postalCode} {customer.city}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDatabase; 