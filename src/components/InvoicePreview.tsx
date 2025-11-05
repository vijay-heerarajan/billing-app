import React, { useState, useEffect } from 'react';
import type { Invoice } from '../types/billing';
import type { User } from '../types/user';
import { useUser } from '../contexts/UserContext';
import { getUserProfile } from '../utils/auth';

interface InvoicePreviewProps {
  invoice: Invoice;
  onBack: () => void;
  onPrint: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onBack, onPrint }) => {
  const { user } = useUser();
  const [userProfile, setUserProfile] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      const profile = getUserProfile(user.id);
      setUserProfile(profile);
    }
  }, [user]);

  const getLogoPath = (logoPath: string | undefined) => {
    if (!logoPath) return '';
    
    // If path starts with 'public/', remove it and add leading slash
    if (logoPath.startsWith('public/')) {
      return '/' + logoPath.substring(7); // Remove 'public/' and add '/'
    }
    
    // If path doesn't start with '/', add it
    if (!logoPath.startsWith('/')) {
      return '/' + logoPath;
    }
    
    return logoPath;
  };

  if (!userProfile) {
    return <div className="loading">Loading invoice...</div>;
  }

  return (
    <div className="invoice-preview">
      <div className="invoice-actions">
        <button onClick={onBack}>Back to Form</button>
        <button onClick={onPrint}>Print Invoice</button>
      </div>

      <div className="invoice-document" id="invoice-document">
        <div className="invoice-header">
          <div className="header-top-row">
            <div className="gstin-info">
              {userProfile.gstNo ? `GSTIN No.: ${userProfile.gstNo}` : 'GSTIN No.: Not provided'}
            </div>
            <div className="tax-invoice-badge">Tax Invoice</div>
            <div className="mobile-info">
              {userProfile.phone ? `Mob.: ${userProfile.phone}` : 'Mob.: Not provided'}
            </div>
          </div>
          
          <div className="header-main-row">
            <div className="header-left">
              {userProfile.logo && (
                <div className="business-logo">
                  <img src={getLogoPath(userProfile.logo)} alt="Business Logo" className="logo-img" />
                </div>
              )}
              
              <div className="business-details">
                <h1>{userProfile.businessName}</h1>
                {/* <p className="proprietor">Pro. {userProfile.name}</p> */}
                <p>{userProfile.businessAddress}</p>
              </div>
            </div>
            
            <div className="invoice-info">
              <p><strong>Invoice No.</strong> {invoice.invoiceNo}</p>
              <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="customer-details">
          <p><strong>Name:</strong> {invoice.customerName}</p>
          <p><strong>Address:</strong> {invoice.customerAddress}</p>
        </div>

        <div className="invoice-content">
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
            {userProfile.bankDetails.bankName && (
              <p>Bank Name: {userProfile.bankDetails.bankName}</p>
            )}
            {userProfile.bankDetails.accountNo && userProfile.bankDetails.ifsc && (
              <p>A/c No: {userProfile.bankDetails.accountNo}, IFS Code: {userProfile.bankDetails.ifsc}</p>
            )}
            <p>Name: {userProfile.businessName.toUpperCase()}</p>
          </div>
          
          <div className="amount-words">
            <p><strong>Rupees In Words:</strong> {invoice.amountInWords}</p>
          </div>
          
          <div className="signature">
            <p>For <strong>{userProfile.businessName.toUpperCase()}</strong></p>
            <br/>
            <p>Prop./Auth. Signatory</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;