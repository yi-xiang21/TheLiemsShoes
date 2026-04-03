import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../../config/config.js';
import '../../assets/css/category.css';

function EditCategory() {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;
  const [formData, setFormData] = useState({
    category_name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load category data from state
  useEffect(() => {
    if (category) {
      setFormData({
        category_name: category.category_name,
        description: category.description || ''
      });
    }
  }, [category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category_name.trim()) {
      newErrors.category_name = 'Category name is required';
    }

    if (formData.category_name.trim().length < 2) {
      newErrors.category_name = 'Category name must have at least 2 characters';
    }

    if (formData.category_name.trim().length > 100) {
      newErrors.category_name = 'Category name must not exceed 100 characters';
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage('');

      const response = await axios.put(getApiUrl(`/categories/${category.id}`), {
        category_name: formData.category_name.trim(),
        description: formData.description.trim() || null
      });

      if (response.data.status === 'success') {
        setSuccessMessage('Category updated successfully!');
        setTimeout(() => {
          navigate('/admin/categories');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setErrors({
        submit: error.response?.data?.message || 'An error occurred while updating category'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/categories');
  };

  if (!category) {
    return (
      <div className="create-category-container">
        <div className="no-categories" style={{ marginTop: '100px' }}>
          <p>Category not found. Please return to the category list.</p>
          <button className="btn-add-category" onClick={() => navigate('/admin/categories')}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-category-container">
      <div className="form-header">
        <h1>Edit Category</h1>
        <button className="btn-back" onClick={handleCancel}>
          ← Back
        </button>
      </div>

      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="error-message" style={{ marginBottom: '20px' }}>
              {errors.submit}
            </div>
          )}

          {successMessage && (
            <div className="success-message" style={{ marginBottom: '20px' }}>
              ✓ {successMessage}
            </div>
          )}

          <div className="form-group required">
            <label htmlFor="category_name">Category Name</label>
            <input
              type="text"
              id="category_name"
              name="category_name"
              value={formData.category_name}
              onChange={handleInputChange}
              placeholder="Enter category name"
              disabled={loading}
              maxLength="100"
            />
            {errors.category_name && (
              <div className="error-message">{errors.category_name}</div>
            )}
            <small style={{ color: '#999', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              {formData.category_name.length}/100 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter category description (optional)"
              disabled={loading}
              maxLength="500"
            />
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
            <small style={{ color: '#999', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              {formData.description.length}/500 characters
            </small>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCategory;
