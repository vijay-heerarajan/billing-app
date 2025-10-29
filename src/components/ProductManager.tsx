import React, { useState, useEffect } from 'react';
import type { Product } from '../types/billing';
import { saveProduct, getProducts, deleteProduct, generateProductId } from '../utils/products';

interface ProductManagerProps {
  onClose: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    hsn: '',
    rate: 0,
    cgstRate: 0,
    sgstRate: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.rate) return;

    const product: Product = {
      id: generateProductId(),
      name: newProduct.name,
      hsn: newProduct.hsn || '',
      rate: newProduct.rate,
      taxableValue: 0,
      cgstRate: newProduct.cgstRate || 0,
      sgstRate: newProduct.sgstRate || 0
    };

    saveProduct(product);
    loadProducts();
    setNewProduct({
      name: '',
      hsn: '',
      rate: 0,
      cgstRate: 0,
      sgstRate: 0
    });
    setShowAddForm(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="product-manager">
      <div className="manager-header">
        <h2>Product Management</h2>
        <div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="add-product-btn">
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>

      {showAddForm && (
        <div className="add-product-form">
          <h3>Add New Product</h3>
          <div className="product-form-grid">
            <div className="product-form-row">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="text"
                placeholder="HSN Code"
                value={newProduct.hsn || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, hsn: e.target.value }))}
              />
            </div>
            <div className="product-form-row">
              <input
                type="number"
                placeholder="Rate (₹)"
                step="0.01"
                value={newProduct.rate || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, rate: Number(e.target.value) }))}
              />
              <input
                type="number"
                placeholder="CGST %"
                step="0.1"
                value={newProduct.cgstRate || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, cgstRate: Number(e.target.value) }))}
              />
              <input
                type="number"
                placeholder="SGST %"
                step="0.1"
                value={newProduct.sgstRate || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, sgstRate: Number(e.target.value) }))}
              />
            </div>
            <div className="product-form-row">
              <button onClick={handleAddProduct} className="save-product-btn">Save Product</button>
            </div>
          </div>
        </div>
      )}

      <div className="products-list">
        <h3>Existing Products</h3>
        {products.length === 0 ? (
          <p>No products found. Add some products to get started.</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>HSN Code</th>
                <th>Rate (₹)</th>
                <th>CGST %</th>
                <th>SGST %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.hsn}</td>
                  <td>₹{product.rate.toFixed(2)}</td>
                  <td>{product.cgstRate}%</td>
                  <td>{product.sgstRate}%</td>
                  <td>
                    <button onClick={() => handleDeleteProduct(product.id)} className="delete-btn">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductManager;