import { useState, useEffect } from 'react';
import { suppliersAPI } from '../services/api';
import type { Supplier } from '../types';
import './Management.css';

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    tenNhaCungCap: '',
    soDienThoai: '',
    diaChi: '',
    email: ''
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
      alert('Không thể tải danh sách nhà cung cấp!');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      tenNhaCungCap: '',
      soDienThoai: '',
      diaChi: '',
      email: ''
    });
    setShowModal(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setModalMode('edit');
    setSelectedSupplier(supplier);
    setFormData({
      tenNhaCungCap: supplier.tenNhaCungCap,
      soDienThoai: supplier.soDienThoai,
      diaChi: supplier.diaChi,
      email: supplier.email
    });
    setShowModal(true);
  };

  const handleView = (supplier: Supplier) => {
    setModalMode('view');
    setSelectedSupplier(supplier);
    setFormData({
      tenNhaCungCap: supplier.tenNhaCungCap,
      soDienThoai: supplier.soDienThoai,
      diaChi: supplier.diaChi,
      email: supplier.email
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa nhà cung cấp "${name}"?`)) {
      try {
        await suppliersAPI.delete(id);
        alert('Xóa nhà cung cấp thành công!');
        loadSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Không thể xóa nhà cung cấp!');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await suppliersAPI.create(formData);
        alert('Thêm nhà cung cấp thành công!');
      } else if (modalMode === 'edit' && selectedSupplier) {
        await suppliersAPI.update(selectedSupplier.maNhaCungCap, formData);
        alert('Cập nhật nhà cung cấp thành công!');
      }
      setShowModal(false);
      loadSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Không thể lưu nhà cung cấp!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.tenNhaCungCap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.soDienThoai.includes(searchTerm)
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
        <h2>Quản lý Nhà cung cấp</h2>
        <div className="header-actions">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add" onClick={handleAdd}>
            <i className="fas fa-plus"></i>
            Thêm nhà cung cấp
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã NCC</th>
              <th>Tên nhà cung cấp</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.maNhaCungCap}>
                <td>#{supplier.maNhaCungCap}</td>
                <td>{supplier.tenNhaCungCap}</td>
                <td>{supplier.soDienThoai}</td>
                <td>{supplier.email}</td>
                <td>{supplier.diaChi}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-action btn-view" 
                      onClick={() => handleView(supplier)}
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="btn-action btn-edit" 
                      onClick={() => handleEdit(supplier)}
                      title="Sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-action btn-delete" 
                      onClick={() => handleDelete(supplier.maNhaCungCap, supplier.tenNhaCungCap)}
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

        {filteredSuppliers.length === 0 && (
          <div className="no-data">
            <i className="fas fa-truck"></i>
            <p>Không tìm thấy nhà cung cấp nào</p>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Thêm nhà cung cấp mới'}
                {modalMode === 'edit' && 'Chỉnh sửa nhà cung cấp'}
                {modalMode === 'view' && 'Thông tin nhà cung cấp'}
              </h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên nhà cung cấp *</label>
                <input
                  type="text"
                  name="tenNhaCungCap"
                  value={formData.tenNhaCungCap}
                  onChange={handleChange}
                  disabled={modalMode === 'view'}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="soDienThoai"
                    value={formData.soDienThoai}
                    onChange={handleChange}
                    disabled={modalMode === 'view'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={modalMode === 'view'}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ *</label>
                <textarea
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleChange}
                  disabled={modalMode === 'view'}
                  rows={3}
                  required
                />
              </div>

              {modalMode !== 'view' && (
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn-save">
                    {modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
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

export default SupplierManagement;
