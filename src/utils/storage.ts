import type { Invoice } from '../types/billing';
import { getCurrentUser } from './auth';

const getStorageKey = (userId: string): string => `billing_app_invoices_${userId}`;

export const saveInvoice = (invoice: Invoice): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No user logged in');
  
  const invoices = getInvoices();
  invoices.push(invoice);
  localStorage.setItem(getStorageKey(currentUser.id), JSON.stringify(invoices));
};

export const getInvoices = (): Invoice[] => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  const stored = localStorage.getItem(getStorageKey(currentUser.id));
  return stored ? JSON.parse(stored) : [];
};

export const getInvoiceById = (id: string): Invoice | null => {
  const invoices = getInvoices();
  return invoices.find(invoice => invoice.id === id) || null;
};

export const deleteInvoice = (id: string): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const invoices = getInvoices();
  const filtered = invoices.filter(invoice => invoice.id !== id);
  localStorage.setItem(getStorageKey(currentUser.id), JSON.stringify(filtered));
};

export const generateInvoiceNumber = (): string => {
  const invoices = getInvoices();
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Extract numeric part from existing invoice numbers for this year/month
  const yearMonthPrefix = `INV${currentYear}${currentMonth}`;
  const existingNumbers = invoices
    .map(inv => inv.invoiceNo)
    .filter(invNo => invNo.startsWith(yearMonthPrefix))
    .map(invNo => parseInt(invNo.slice(yearMonthPrefix.length)) || 0);
  
  const lastNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const nextNumber = String(lastNumber + 1).padStart(4, '0');
  
  return `${yearMonthPrefix}${nextNumber}`;
};