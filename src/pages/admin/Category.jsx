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
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      console.log('Delete category:', categoryId);
      try {
        await axios.delete(getApiUrl(`/categories/${categoryId}`));
        setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Xóa danh mục thất bại');
      }
      fetchCategories();
    }
  };

  return (
    <div className="category-container">
      <div className="category-header">
        <h1>Quản lý Danh Mục</h1>
        <button className="btn-add-category" onClick={handleAddCategory}>
          + Thêm Danh Mục
        </button>
      </div>

      {loading ? (
        <div className="category-loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="category-table-wrapper">
          <table className="category-table">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>ID</th>
                <th style={{ width: '20%' }}>Tên Danh Mục</th>
                <th style={{ width: '50%' }}>Mô Tả</th>
                <th style={{ width: '20%' }}>Hành Động</th>
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
                      Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-categories">
          <p>Chưa có danh mục nào. Hãy thêm danh mục mới.</p>
          <button className="btn-add-category" onClick={handleAddCategory}>
            + Thêm Danh Mục Ngay
          </button>
        </div>
      )}
    </div>
  );
}

export default Category;
        