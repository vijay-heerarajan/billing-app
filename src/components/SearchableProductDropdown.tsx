import React, { useState, useEffect, useRef } from 'react';
import type { Product } from '../types/billing';

interface SearchableProductDropdownProps {
  products: Product[];
  selectedProduct: string;
  onProductSelect: (productName: string) => void;
  placeholder?: string;
}

const SearchableProductDropdown: React.FC<SearchableProductDropdownProps> = ({
  products,
  selectedProduct,
  onProductSelect,
  placeholder = "Search and select product..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [displayValue, setDisplayValue] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.hsn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update display value when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      const product = products.find(p => p.name === selectedProduct);
      setDisplayValue(product ? `${product.name} - ₹${product.rate}` : selectedProduct);
    } else {
      setDisplayValue('');
    }
  }, [selectedProduct, products]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setDisplayValue(value);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(displayValue.split(' - ₹')[0] || ''); // Extract product name for search
  };

  const handleProductSelect = (product: Product) => {
    onProductSelect(product.name);
    setDisplayValue(`${product.name} - ₹${product.rate}`);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredProducts.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredProducts.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredProducts[highlightedIndex]) {
          handleProductSelect(filteredProducts[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClearSelection = () => {
    onProductSelect('');
    setDisplayValue('');
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="searchable-dropdown" ref={dropdownRef}>
      <div className="dropdown-input-container">
        <input
          ref={inputRef}
          type="text"
          className="dropdown-input"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
        />
        {selectedProduct && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClearSelection}
            title="Clear selection"
          >
            ×
          </button>
        )}
        <button
          type="button"
          className="dropdown-arrow"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {isOpen && (
        <div className="dropdown-list">
          {filteredProducts.length === 0 ? (
            <div className="dropdown-item no-results">
              {searchTerm ? `No products found for "${searchTerm}"` : 'No products available'}
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`dropdown-item ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleProductSelect(product)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="product-name">{product.name}</div>
                <div className="product-details">
                  HSN: {product.hsn} | ₹{product.rate.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableProductDropdown;