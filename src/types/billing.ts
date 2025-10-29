export interface Product {
  id: string;
  name: string;
  hsn: string;
  rate: number;
  taxableValue: number;
  cgstRate: number;
  sgstRate: number;
}

export interface InvoiceItem {
  id: string;
  productName: string;
  hsn: string;
  qty: number;
  rate: number;
  taxableValue: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  netAmount: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
  totalAmount: number;
  totalCgst: number;
  totalSgst: number;
  amountInWords: string;
}

export interface BusinessDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstNo: string;
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifsc: string;
  };
}