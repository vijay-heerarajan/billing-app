import React from 'react';
import type { Invoice } from '../types/billing';

interface InvoicePreviewProps {
  invoice: Invoice;
  onBack: () => void;
  onPrint: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onBack, onPrint }) => {
  return (
    <div className="invoice-preview">
      <div className="invoice-actions">
        <button onClick={onBack}>Back to Form</button>
        <button onClick={onPrint}>Print Invoice</button>
      </div>

      <div className="invoice-document" id="invoice-document">
        <div className="invoice-header">
          <div className="business-details">
            <h1>RAMDHANI TEA SHOP</h1>
            <p>Pro. Sudarshan Prasad</p>
            <p>Shop No. 1, I.I.T. (I.S.M.) Dhanbad - 826 004</p>
          </div>
          <div className="invoice-info">
            <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
            <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        <div className="customer-details">
          <p><strong>Name:</strong> {invoice.customerName}</p>
          <p><strong>Address:</strong> {invoice.customerAddress}</p>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name of Product</th>
              <th>HSN</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Taxable Value</th>
              <th>CGST<br/>% | Amount</th>
              <th>SGST<br/>% | Amount</th>
              <th>Net Amount<br/>Rs.</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.hsn}</td>
                <td>{item.qty}</td>
                <td>₹{item.rate.toFixed(2)}</td>
                <td>₹{item.taxableValue.toFixed(2)}</td>
                <td>
                  {item.cgstRate}% | ₹{item.cgstAmount.toFixed(2)}
                </td>
                <td>
                  {item.sgstRate}% | ₹{item.sgstAmount.toFixed(2)}
                </td>
                <td>₹{item.netAmount.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan={5}><strong>Total Amount</strong></td>
              <td><strong>₹{invoice.items.reduce((sum, item) => sum + item.taxableValue, 0).toFixed(2)}</strong></td>
              <td><strong>₹{invoice.totalCgst.toFixed(2)}</strong></td>
              <td><strong>₹{invoice.totalSgst.toFixed(2)}</strong></td>
              <td><strong>₹{invoice.totalAmount.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div className="invoice-footer">
          <div className="bank-details">
            <p><strong>Bank Details:</strong></p>
            <p>Bank Name: HDFC, Police Line, Hirapur, Dhanbad</p>
            <p>A/c No: 50200101861624, IFS Code: HDFC0004721</p>
            <p>Name: RAMDHANI TEA SHOP</p>
          </div>
          
          <div className="amount-words">
            <p><strong>Rupees In Words:</strong> {invoice.amountInWords}</p>
          </div>
          
          <div className="signature">
            <p>For <strong>RAMDHANI TEA SHOP</strong></p>
            <br/>
            <p>Prop./Auth. Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;