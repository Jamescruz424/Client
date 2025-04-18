import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getInventory, deleteInventory } from '../services/api';
import ProductDetails from './ProductDetails';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getInventory();
        if (response.data.success) {
          setInventory(response.data.items);
          setFilteredInventory(response.data.items);
        } else {
          setError(response.data.message || 'Failed to load inventory');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      setError('');
      try {
        const response = await deleteInventory(itemId);
        if (response.data.success) {
          const updatedInventory = inventory.filter((item) => item.id !== itemId);
          setInventory(updatedInventory);
          setFilteredInventory(updatedInventory);
          alert('Item deleted successfully!');
        } else {
          setError(response.data.message || 'Failed to delete item');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Error deleting item');
      } finally {
        setLoading(false);
      }
    }
  };

   const handleEdit = (itemId) => {
    navigate(`/admin-dashboard/edit-inventory/${itemId}`);
  };

 const handleViewDetails = (item) => {
    setSelectedProduct(item);
  };
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterInventory(term, selectedCategory);
  };

  const handleCategoryFilter = () => {
    const newCategory = selectedCategory === 'Electronics' ? '' : 'Electronics';
    setSelectedCategory(newCategory);
    filterInventory(searchTerm, newCategory);
  };
  const filterInventory = (term, category) => {
    let filtered = [...inventory];
    if (term) {
      filtered = filtered.filter((item) => item.name.toLowerCase().includes(term));
    }
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }
    setFilteredInventory(filtered);
  };
  if (loading) return <div className="p-4 sm:p-8">Loading inventory...</div>;
  if (error && !inventory.length) return <div className="p-4 sm:p-8 text-red-600">{error}</div>;

  if (loading) return <div className="p-4 sm:p-8">Loading inventory...</div>;
  if (error && !inventory.length) return <div className="p-4 sm:p-8 text-red-600">{error}</div>;

  return (
    <main className="p-4 sm:p-8">
      {/* Header */}
      {/* Mobile View */}
      {/* Desktop View */}
      {/* Pagination */}
      {selectedProduct && <ProductDetails product={selectedProduct} onClose={handleCloseModal} />}
    </main>
  );
};

export default InventoryList;
