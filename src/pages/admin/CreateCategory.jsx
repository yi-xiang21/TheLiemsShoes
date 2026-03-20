import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../../config/config.js';
import '../../assets/css/category.css';

function CreateCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category_name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
      newErrors.category_name = 'Tên danh mục là bắt buộc';
    }

    if (formData.category_name.trim().length < 2) {
      newErrors.category_name = 'Tên danh mục phải có ít nhất 2 ký tự';
    }

    if (formData.category_name.trim().length > 100) {
      newErrors.category_name = 'Tên danh mục không được vượt quá 100 ký tự';
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = 'Mô tả không được vượt quá 500 ký tự';
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

      const response = await axios.post(getApiUrl('/categories'), {
        category_name: formData.category_name.trim(),
        description: formData.description.trim() || null
      });

      if (response.data.status === 'success') {
        setSuccessMessage('Danh mục đã được tạo thành công!');
        setTimeout(() => {
          navigate('/admin/categories');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setErrors({
        submit: error.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/categories');
  };

  return (
    <div className="create-category-container">
      <div className="form-header">
        <h1>Thêm Danh Mục Mới</h1>
        <button className="btn-back" onClick={handleCancel}>
          ← Quay Lại
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
            <label htmlFor="category_name">Tên Danh Mục</label>
            <input
              type="text"
              id="category_name"
              name="category_name"
              value={formData.category_name}
              onChange={handleInputChange}
              placeholder="Nhập tên danh mục (vd: Giày Nam, Giày Nữ)"
              disabled={loading}
              maxLength="100"
            />
            {errors.category_name && (
              <div className="error-message">{errors.category_name}</div>
            )}
            <small style={{ color: '#999', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              {formData.category_name.length}/100 ký tự
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô Tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả về danh mục (tùy chọn)"
              disabled={loading}
              maxLength="500"
            />
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
            <small style={{ color: '#999', fontSize: '12px', marginTop: '5px', display: 'block' }}>
              {formData.description.length}/500 ký tự
            </small>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Đang tạo...' : 'Tạo Danh Mục'}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCategory;
