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

      const response = await axios.put(getApiUrl(`/categories/${category.id}`), {
        category_name: formData.category_name.trim(),
        description: formData.description.trim() || null
      });

      if (response.data.status === 'success') {
        setSuccessMessage('Danh mục đã được cập nhật thành công!');
        setTimeout(() => {
          navigate('/admin/categories');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setErrors({
        submit: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật danh mục'
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
          <p>Không tìm thấy danh mục. Vui lòng quay lại danh sách.</p>
          <button className="btn-add-category" onClick={() => navigate('/admin/categories')}>
            ← Quay Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-category-container">
      <div className="form-header">
        <h1>Chỉnh Sửa Danh Mục</h1>
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
              placeholder="Nhập tên danh mục"
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
              {loading ? 'Đang cập nhật...' : ' Lưu Thay Đổi'}
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

export default EditCategory;
