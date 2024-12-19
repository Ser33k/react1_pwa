import { PrinterIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const ReceiptGenerator = ({ transaction, type }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${type === 'invoice' ? 'Faktura' : 'Paragon'} #${transaction.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .seller { margin-bottom: 20px; }
            .buyer { margin-bottom: 20px; }
            .items { margin: 20px 0; border-collapse: collapse; width: 100%; }
            .items th, .items td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { margin-top: 20px; text-align: right; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; }
            .payment-info { margin-top: 20px; }
            .document-number { margin-bottom: 20px; }
            .flex-container { display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${type === 'invoice' ? 'Faktura VAT' : 'Paragon Fiskalny'}</h2>
            <div class="document-number">
              <p>Nr dokumentu: ${transaction.id}</p>
              <p>Data wystawienia: ${new Date(transaction.timestamp).toLocaleDateString('pl-PL')}</p>
            </div>
          </div>
          
          ${type === 'invoice' && transaction.customer ? `
            <div class="flex-container">
              <div class="seller">
                <h3>Sprzedawca:</h3>
                <p>Nazwa Firmy Sp. z o.o.</p>
                <p>ul. Przykładowa 1</p>
                <p>00-000 Miasto</p>
                <p>NIP: 000-000-00-00</p>
              </div>
              
              <div class="buyer">
                <h3>Nabywca:</h3>
                <p>${transaction.customer.name}</p>
                <p>${transaction.customer.address}</p>
                <p>${transaction.customer.postalCode} ${transaction.customer.city}</p>
                <p>NIP: ${transaction.customer.nip}</p>
                <p>Email: ${transaction.customer.email}</p>
              </div>
            </div>
          ` : `
            <div class="seller">
              <p>Nazwa Firmy Sp. z o.o.</p>
              <p>ul. Przykładowa 1</p>
              <p>00-000 Miasto</p>
              <p>NIP: 000-000-00-00</p>
            </div>
          `}
          
          <table class="items">
            <thead>
              <tr>
                <th>Lp.</th>
                <th>Nazwa</th>
                <th>Ilość</th>
                <th>Cena jedn.</th>
                <th>Wartość</th>
                ${type === 'invoice' ? '<th>VAT</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${transaction.items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.product.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.product.price.toFixed(2)} zł</td>
                  <td>${(item.product.price * item.quantity).toFixed(2)} zł</td>
                  ${type === 'invoice' ? '<td>23%</td>' : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total">
            ${type === 'invoice' ? `
              <p>Wartość netto: ${(transaction.total / 1.23).toFixed(2)} zł</p>
              <p>VAT (23%): ${(transaction.total - transaction.total / 1.23).toFixed(2)} zł</p>
            ` : ''}
            <p>Suma brutto: ${transaction.total.toFixed(2)} zł</p>
            ${transaction.method === 'cash' ? `
              <div class="payment-info">
                <p>Zapłacono gotówką: ${transaction.cashReceived.toFixed(2)} zł</p>
                <p>Wydano reszty: ${transaction.change.toFixed(2)} zł</p>
              </div>
            ` : `
              <div class="payment-info">
                <p>Zapłacono kartą</p>
              </div>
            `}
          </div>
          
          <div class="footer">
            <p>Dziękujemy za zakupy!</p>
            ${type === 'invoice' ? `
              <p>Dokument wygenerowany elektronicznie</p>
              <div style="margin-top: 60px; display: flex; justify-content: space-between;">
                <div style="text-align: center;">
                  <div style="border-top: 1px solid #000; padding-top: 8px; width: 200px;">
                    Osoba upoważniona do wystawienia
                  </div>
                </div>
                <div style="text-align: center;">
                  <div style="border-top: 1px solid #000; padding-top: 8px; width: 200px;">
                    Osoba upoważniona do odbioru
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100"
      aria-label={`Drukuj ${type === 'invoice' ? 'fakturę' : 'paragon'}`}
    >
      {type === 'invoice' ? <DocumentTextIcon className="h-4 w-4" /> : <PrinterIcon className="h-4 w-4" />}
      <span>{type === 'invoice' ? 'Drukuj fakturę' : 'Drukuj paragon'}</span>
    </button>
  );
};

export default ReceiptGenerator; 