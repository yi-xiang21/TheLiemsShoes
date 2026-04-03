import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../../config/config.js';
import '../../assets/css/category.css';

function Category() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl('/categories'));
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    navigate('/admin/CreateCategory');
  };

  const handleEditCategory = (category) => {
    navigate('/admin/EditCategory', { state: { category } });
  };

  const handleDeleteCategory = async (categoryId) => {
    // TODO: Delete category with confirmation
    if (window.confirm('Are you sure you want to delete this category?')) {
      console.log('Delete category:', categoryId);
      try {
        await axios.delete(getApiUrl(`/categories/${categoryId}`));
        setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
      fetchCategories();
    }
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <h1>Category Management</h1>
        <button className="btn-add-category" onClick={handleAddCategory}>
          + Add Category
        </button>
      </div>

      {loading ? (
        <div className="category-loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="category-table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>ID</th>
                <th style={{ width: '20%' }}>Category Name</th>
                <th style={{ width: '50%' }}>Description</th>
                <th style={{ width: '20%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="category-id">{category.id}</td>
                  <td className="category-name">{category.category_name}</td>
                  <td className="category-description">{category.description}</td>
                  <td className="category-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-categories">
          <p>No categories found. Add a new category to get started.</p>
          <button className="btn-add-category" onClick={handleAddCategory}>
            + Add Category Now
          </button>
        </div>
      )}
    </div>
  );
}

export default Category;
        