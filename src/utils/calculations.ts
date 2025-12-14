import type { InvoiceItem } from '../types/billing';

export const calculateItemAmount = (qty: number, rate: number): number => {
  return qty * rate;
};

export const calculateGstAmount = (taxableValue: number, gstRate: number): number => {
  return (taxableValue * gstRate) / 100;
};

export const calculateNetAmount = (item: Partial<InvoiceItem>): number => {
  const { taxableValue = 0, cgstAmount = 0, sgstAmount = 0 } = item;
  return taxableValue + cgstAmount + sgstAmount;
};

export const calculateInvoiceTotals = (items: InvoiceItem[]) => {
  const totalAmount = items.reduce((sum, item) => sum + item.netAmount, 0);
  const totalCgst = items.reduce((sum, item) => sum + item.cgstAmount, 0);
  const totalSgst = items.reduce((sum, item) => sum + item.sgstAmount, 0);
  
  return {
    totalAmount,
    totalCgst,
    totalSgst
  };
};

export const calculateRoundOff = (amount: number): { roundedAmount: number; roundOffValue: number } => {
  const roundedAmount = Math.round(amount);
  const roundOffValue = roundedAmount - amount;
  
  return {
    roundedAmount,
    roundOffValue
  };
};

export const numberToWords = (num: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const thousands = ['', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero';

  const convertHundreds = (n: number): string => {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
      return result;
    }
    if (n > 0) {
      result += ones[n] + ' ';
    }
    return result;
  };

  let result = '';
  let thousandIndex = 0;
  
  while (num > 0) {
    if (num % 1000 !== 0) {
      result = convertHundreds(num % 1000) + thousands[thousandIndex] + ' ' + result;
    }
    num = Math.floor(num / 1000);
    thousandIndex++;
  }

  return result.trim() + ' Only';
};