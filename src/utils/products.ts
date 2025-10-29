import type { Product } from '../types/billing';
import { getCurrentUser } from './auth';

const getStorageKey = (userId: string): string => `billing_app_products_${userId}`;

export const saveProduct = (product: Product): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('No user logged in');
  
  const products = getProducts();
  const existingIndex = products.findIndex(p => p.id === product.id);
  
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  
  localStorage.setItem(getStorageKey(currentUser.id), JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const currentUser = getCurrentUser();
  if (!currentUser) return [];
  
  const stored = localStorage.getItem(getStorageKey(currentUser.id));
  return stored ? JSON.parse(stored) : [];
};

export const getProductById = (id: string): Product | null => {
  const products = getProducts();
  return products.find(product => product.id === id) || null;
};

export const getProductByName = (name: string): Product | null => {
  const products = getProducts();
  return products.find(product => product.name === name) || null;
};

export const deleteProduct = (id: string): void => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const products = getProducts();
  const filtered = products.filter(product => product.id !== id);
  localStorage.setItem(getStorageKey(currentUser.id), JSON.stringify(filtered));
};

export const generateProductId = (): string => {
  return Date.now().toString();
};