import React, { useState, useEffect } from 'react';
import type { Invoice } from '../types/billing';
import { getInvoices, deleteInvoice } from '../utils/storage';

interface InvoiceHistoryProps {
  onViewInvoice: (invoice: Invoice) => void;
  onClose: () => void;
}

const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ onViewInvoice, onClose }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
      setInvoices(getInvoices());
    }
  };

  return (
    <div className="invoice-history">
      <div className="history-header">
        <h2>Invoice History</h2>
        <button onClick={onClose}>Close</button>
      </div>
      
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Invoice No.</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.invoiceNo}</td>
                <td>{new Date(invoice.date).toLocaleDateString('en-IN')}</td>
                <td>{invoice.customerName}</td>
                <td>₹{invoice.totalAmount.toFixed(2)}</td>
                <td>
                  <button onClick={() => onViewInvoice(invoice)}>View</button>
                  <button onClick={() => handleDelete(invoice.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InvoiceHistory;