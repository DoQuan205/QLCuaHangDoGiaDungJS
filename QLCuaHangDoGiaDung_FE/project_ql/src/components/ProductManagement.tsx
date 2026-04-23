import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';
import type { Product, Category } from '../types';
import './Management.css';

function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    maSanPham: 0,
    tenSanPham: '',
    maLoai: 1,
    giaBan: 0,
    soLuong: 0,
    hinhAnh: '',
    moTa: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Không thể tải danh sách sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(category => category.maLoai === categoryId)?.tenLoai || `Loại ${categoryId}`;
  };

  const handleAdd = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setFormData({
      maSanPham: 0,
      tenSanPham: '',
      maLoai: categories.length > 0 ? categories[0].maLoai : 1,
      giaBan: 0,
      soLuong: 0,
      hinhAnh: '',
      moTa: ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleEdit = (product: Product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      maSanPham: product.maSanPham,
      tenSanPham: product.tenSanPham,
      maLoai: product.maLoai,
      giaBan: product.giaBan,
      soLuong: product.soLuong,
      hinhAnh: product.hinhAnh || '',
      moTa: product.moTa || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleView = (product: Product) => {
    setModalMode('view');
    setSelectedProduct(product);
    setFormData({
      maSanPham: product.maSanPham,
      tenSanPham: product.tenSanPham,
      maLoai: product.maLoai,
      giaBan: product.giaBan,
      soLuong: product.soLuong,
      hinhAnh: product.hinhAnh || '',
      moTa: product.moTa || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`⚠️ Bạn có chắc muốn xóa sản phẩm "${name}"?\n\nHành động này không thể hoàn tác!`)) {
      try {
        await productsAPI.delete(id);
        showNotification('Xóa sản phẩm thành công!', 'success');
        loadProducts();
      } catch (error: any) {
        console.error('Error deleting product:', error);
        const errorMessage = error.response?.data?.message || 'Không thể xóa sản phẩm!';
        showNotification(errorMessage, 'error');
      }
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.tenSanPham.trim()) {
      errors.tenSanPham = 'Tên sản phẩm không được để trống';
    } else if (formData.tenSanPham.length < 3) {
      errors.tenSanPham = 'Tên sản phẩm phải có ít nhất 3 ký tự';
    }

    if (formData.giaBan <= 0) {
      errors.giaBan = 'Giá bán phải lớn hơn 0';
    }

    if (formData.soLuong < 0) {
      errors.soLuong = 'Số lượng không được âm';
    }

    if (formData.hinhAnh && !isValidUrl(formData.hinhAnh)) {
      errors.hinhAnh = 'URL hình ảnh không hợp lệ';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data before validation:', formData);
    
    if (!validateForm()) {
      console.log('Validation failed:', formErrors);
      return;
    }

    try {
      setSubmitting(true);
      console.log('Submitting data:', formData);
      
      if (modalMode === 'add') {
        const { maSanPham, ...createPayload } = formData;
        const response = await productsAPI.create(createPayload);
        console.log('Create response:', response);
        showNotification('Thêm sản phẩm thành công!', 'success');
      } else if (modalMode === 'edit' && selectedProduct) {
        const response = await productsAPI.update(selectedProduct.maSanPham, {
          ...formData,
          maSanPham: selectedProduct.maSanPham
        });
        console.log('Update response:', response);
        showNotification('Cập nhật sản phẩm thành công!', 'success');
      }
      setShowModal(false);
      loadProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu sản phẩm!';
      showNotification(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Simple notification using alert for now
    // You can replace this with a toast library like react-toastify
    if (type === 'success') {
      alert('✅ ' + message);
    } else {
      alert('❌ ' + message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue: string | number = value;
    
    // Convert to number for numeric fields
    if (name === 'giaBan' || name === 'soLuong' || name === 'maLoai') {
      processedValue = value === '' ? 0 : Number(value);
      
      // Validate number
      if (isNaN(processedValue)) {
        processedValue = 0;
      }
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const filteredProducts = products.filter(product =>
    product.tenSanPham.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Quản lý Sản phẩm</h2>
        <div className="header-actions">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add" onClick={handleAdd}>
            <i className="fas fa-plus"></i>
            Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Loại</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.maSanPham}>
                <td>#{product.maSanPham}</td>
                <td>{product.tenSanPham}</td>
                <td>{getCategoryName(product.maLoai)}</td>
                <td>{formatCurrency(product.giaBan)}</td>
                <td>
                  <span className={product.soLuong < 10 ? 'stock-low' : 'stock-ok'}>
                    {product.soLuong}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-action btn-view" 
                      onClick={() => handleView(product)}
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="btn-action btn-edit" 
                      onClick={() => handleEdit(product)}
                      title="Sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-action btn-delete" 
                      onClick={() => handleDelete(product.maSanPham, product.tenSanPham)}
                      title="Xóa"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="no-data">
            <i className="fas fa-box-open"></i>
            <p>Không tìm thấy sản phẩm nào</p>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Thêm sản phẩm mới'}
                {modalMode === 'edit' && 'Chỉnh sửa sản phẩm'}
                {modalMode === 'view' && 'Thông tin sản phẩm'}
              </h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tên sản phẩm *</label>
                  <input
                    type="text"
                    name="tenSanPham"
                    value={formData.tenSanPham}
                    onChange={handleChange}
                    disabled={modalMode === 'view'}
                    required
                    className={formErrors.tenSanPham ? 'error' : ''}
                  />
                  {formErrors.tenSanPham && (
                    <span className="error-message">{formErrors.tenSanPham}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Loại sản phẩm *</label>
                  <select
                    name="maLoai"
                    value={formData.maLoai}
                    onChange={handleChange}
                    disabled={modalMode === 'view'}
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.maLoai} value={category.maLoai}>
                        {category.tenLoai}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    name="giaBan"
                    value={formData.giaBan}
                    onChange={handleChange}
                    disabled={modalMode === 'view'}
                    min="0"
                    step="1000"
                    required
                    className={formErrors.giaBan ? 'error' : ''}
                  />
                  {formErrors.giaBan && (
                    <span className="error-message">{formErrors.giaBan}</span>
                  )}
                  {modalMode !== 'view' && formData.giaBan > 0 && (
                    <span className="helper-text">
                      {formatCurrency(formData.giaBan)}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Số lượng *</label>
                  <input
                    type="number"
                    name="soLuong"
                    value={formData.soLuong}
                    onChange={handleChange}
                    disabled={modalMode === 'view'}
                    min="0"
                    required
                    className={formErrors.soLuong ? 'error' : ''}
                  />
                  {formErrors.soLuong && (
                    <span className="error-message">{formErrors.soLuong}</span>
                  )}
                  {modalMode !== 'view' && formData.soLuong < 10 && formData.soLuong >= 0 && (
                    <span className="warning-text">
                      ⚠️ Số lượng thấp
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Hình ảnh (URL)</label>
                <input
                  type="text"
                  name="hinhAnh"
                  value={formData.hinhAnh}
                  onChange={handleChange}
                  disabled={modalMode === 'view'}
                  placeholder="https://example.com/image.jpg"
                  className={formErrors.hinhAnh ? 'error' : ''}
                />
                {formErrors.hinhAnh && (
                  <span className="error-message">{formErrors.hinhAnh}</span>
                )}
                {formData.hinhAnh && isValidUrl(formData.hinhAnh) && (
                  <div className="image-preview">
                    <img src={formData.hinhAnh} alt="Preview" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  name="moTa"
                  value={formData.moTa}
                  onChange={handleChange}
                  disabled={modalMode === 'view'}
                  rows={3}
                  placeholder="Nhập mô tả sản phẩm..."
                />
              </div>

              {modalMode !== 'view' && (
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn-cancel" 
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn-save"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        {modalMode === 'add' ? 'Đang thêm...' : 'Đang cập nhật...'}
                      </>
                    ) : (
                      <>
                        <i className={modalMode === 'add' ? 'fas fa-plus' : 'fas fa-save'}></i>
                        {modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductManagement;
