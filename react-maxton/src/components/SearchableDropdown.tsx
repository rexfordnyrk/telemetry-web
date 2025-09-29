import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Dropdown, Spinner } from 'react-bootstrap';

/**
 * Props interface for the SearchableDropdown component
 */
interface SearchableDropdownProps {
  items: Array<{
    id: string;
    name: string;
    subtitle?: string;
    [key: string]: any;
  }>;
  selectedItem: any | null;
  onSelect: (item: any) => void;
  placeholder: string;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;
  displayKey?: string;
  subtitleKey?: string;
  className?: string;
}

/**
 * SearchableDropdown Component
 * 
 * A reusable searchable dropdown component that allows users to search through
 * a list of items and select one. It provides real-time search functionality
 * with loading states and error handling.
 * 
 * Features:
 * - Real-time search filtering
 * - Loading state indicator
 * - Error handling
 * - Customizable display format
 * - Keyboard navigation support
 * - Click outside to close
 * - Responsive design
 */
const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  items,
  selectedItem,
  onSelect,
  placeholder,
  loading = false,
  error,
  disabled = false,
  searchPlaceholder = "Search...",
  noResultsText = "No results found",
  displayKey = "name",
  subtitleKey = "subtitle",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item => {
        const name = item[displayKey]?.toLowerCase() || '';
        const subtitle = item[subtitleKey]?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || subtitle.includes(search);
      });
      setFilteredItems(filtered);
    }
  }, [searchTerm, items, displayKey, subtitleKey]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleItemSelect = (item: any) => {
    onSelect(item);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const getDisplayText = (item: any) => {
    const name = item[displayKey] || '';
    const subtitle = item[subtitleKey] || '';
    return subtitle ? `${name} (${subtitle})` : name;
  };

  return (
    <div ref={dropdownRef} className={`searchable-dropdown ${className}`}>
      <Dropdown show={isOpen} onToggle={handleToggle}>
        <Dropdown.Toggle
          as={Form.Control}
          variant="outline-secondary"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          disabled={disabled}
          readOnly
          value={selectedItem ? getDisplayText(selectedItem) : ''}
          placeholder={placeholder}
        />
        
        <Dropdown.Menu className="w-100" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <div className="p-2 border-bottom">
            <InputGroup size="sm">
              <InputGroup.Text>
                <i className="material-icons-outlined" style={{ fontSize: '16px' }}>search</i>
              </InputGroup.Text>
              <Form.Control
                ref={inputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-0"
              />
            </InputGroup>
          </div>
          
          {loading ? (
            <div className="text-center p-3">
              <Spinner animation="border" size="sm" />
              <span className="ms-2">Loading...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center p-3 text-muted">
              {noResultsText}
            </div>
          ) : (
            filteredItems.map((item) => (
              <Dropdown.Item
                key={item.id}
                onClick={() => handleItemSelect(item)}
                className="d-flex flex-column"
                style={{ whiteSpace: 'normal' }}
              >
                <div className="fw-medium">{item[displayKey]}</div>
                {item[subtitleKey] && (
                  <div className="text-muted small">{item[subtitleKey]}</div>
                )}
              </Dropdown.Item>
            ))
          )}
        </Dropdown.Menu>
      </Dropdown>
      
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;


