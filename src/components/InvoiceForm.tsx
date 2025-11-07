import React, { useState, useEffect } from 'react';
import type { Invoice, InvoiceItem } from '../types/billing';
import { calculateItemAmount, calculateGstAmount, calculateNetAmount, calculateInvoiceTotals, numberToWords } from '../utils/calculations';
import { saveInvoice, generateInvoiceNumber } from '../utils/storage';
import { getProducts, getProductByName } from '../utils/products';
import SearchableProductDropdown from './SearchableProductDropdown';

interface InvoiceFormProps {
  onInvoiceCreate: (invoice: Invoice) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onInvoiceCreate }) => {
  const [invoice, setInvoice] = useState<Partial<Invoice>>({
    invoiceNo: '',
    date: new Date().toLocaleDateString('en-IN'),
    deliveryDate: '',
    customerName: '',
    customerAddress: '',
    items: [],
  });

  useEffect(() => {
    setInvoice(prev => ({
      ...prev,
      invoiceNo: generateInvoiceNumber()
    }));
  }, []);

  useEffect(() => {
    // Refresh products when component mounts or when coming back from product management
    setAvailableProducts(getProducts());
  }, []);

  const [currentItem, setCurrentItem] = useState({
    productName: '',
    qty: 0,
  });

  const [availableProducts, setAvailableProducts] = useState(getProducts());


  const addItem = () => {
    if (!currentItem.productName || !currentItem.qty) return;

    const product = getProductByName(currentItem.productName);
    if (!product) {
      alert('Product not found! Please add the product first.');
      return;
    }

    const taxableValue = calculateItemAmount(currentItem.qty, product.rate);
    const cgstAmount = calculateGstAmount(taxableValue, product.cgstRate);
    const sgstAmount = calculateGstAmount(taxableValue, product.sgstRate);
    
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      productName: product.name,
      hsn: product.hsn,
      qty: currentItem.qty,
      rate: product.rate,
      taxableValue,
      cgstRate: product.cgstRate,
      cgstAmount,
      sgstRate: product.sgstRate,
      sgstAmount,
      netAmount: calculateNetAmount({ taxableValue, cgstAmount, sgstAmount })
    };

    setInvoice(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));

    setCurrentItem({
      productName: '',
      qty: 0,
    });
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== id) || []
    }));
  };

  const generateInvoice = () => {
    if (!invoice.invoiceNo || !invoice.customerName || !invoice.items?.length) return;

    const totals = calculateInvoiceTotals(invoice.items);
    
    const finalInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNo: invoice.invoiceNo,
      date: invoice.date!,
      deliveryDate: invoice.deliveryDate,
      customerName: invoice.customerName,
      customerAddress: invoice.customerAddress || '',
      items: invoice.items,
      totalAmount: totals.totalAmount,
      totalCgst: totals.totalCgst,
      totalSgst: totals.totalSgst,
      amountInWords: numberToWords(Math.round(totals.totalAmount))
    };

    saveInvoice(finalInvoice);
    onInvoiceCreate(finalInvoice);
  };

  return (
    <div className="invoice-form">
      <h2>Create Invoice</h2>
      
      <div className="form-section">
        <h3>Invoice Details</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Invoice No."
            value={invoice.invoiceNo || ''}
            onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNo: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Invoice Date (DD/MM/YYYY)"
            value={invoice.date || ''}
            onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Delivery Date (e.g., 01/12/2025 or 01/12/2025 - 20/12/2025)"
            value={invoice.deliveryDate || ''}
            onChange={(e) => setInvoice(prev => ({ ...prev, deliveryDate: e.target.value }))}
          />
        </div>
        <div className="form-help">
          <small>Enter single date (DD/MM/YYYY) or date range (DD/MM/YYYY - DD/MM/YYYY)</small>
        </div>
      </div>

      <div className="form-section">
        <h3>Customer Details</h3>
        <input
          type="text"
          placeholder="Customer Name"
          value={invoice.customerName || ''}
          onChange={(e) => setInvoice(prev => ({ ...prev, customerName: e.target.value }))}
        />
        <textarea
          placeholder="Customer Address"
          value={invoice.customerAddress || ''}
          onChange={(e) => setInvoice(prev => ({ ...prev, customerAddress: e.target.value }))}
        />
      </div>

      <div className="form-section">
        <h3>Add Items</h3>
        <div className="item-form-simple">
          <SearchableProductDropdown
            products={availableProducts}
            selectedProduct={currentItem.productName}
            onProductSelect={(productName) => setCurrentItem(prev => ({ ...prev, productName }))}
            placeholder="Search products by name or HSN..."
          />
          <input
            type="number"
            placeholder="Quantity"
            value={currentItem.qty || ''}
            onChange={(e) => setCurrentItem(prev => ({ ...prev, qty: Number(e.target.value) }))}
          />
          <button onClick={addItem}>Add Item</button>
        </div>
        
        {availableProducts.length === 0 && (
          <p style={{ color: '#666', fontStyle: 'italic', marginTop: '10px' }}>
            No products available. Please add products first using the "Manage Products" button.
          </p>
        )}
      </div>

      {invoice.items && invoice.items.length > 0 && (
        <div className="items-list">
          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Taxable Value</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Net Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.hsn}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.rate.toFixed(2)}</td>
                  <td>₹{item.taxableValue.toFixed(2)}</td>
                  <td>₹{item.cgstAmount.toFixed(2)}</td>
                  <td>₹{item.sgstAmount.toFixed(2)}</td>
                  <td>₹{item.netAmount.toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button 
        className="generate-btn"
        onClick={generateInvoice}
        disabled={!invoice.invoiceNo || !invoice.customerName || !invoice.items?.length}
      >
        Generate Invoice
      </button>
    </div>
  );
};

export default InvoiceForm;