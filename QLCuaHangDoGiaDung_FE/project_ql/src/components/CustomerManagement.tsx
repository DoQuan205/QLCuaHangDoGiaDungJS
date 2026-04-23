import { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';
import type { Customer } from '../types';
import './Management.css';

function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    tenKhachHang: '',
    soDienThoai: '',
    diaChi: '',
    email: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error loading customers:', error);
      alert('Không thể tải danh sách khách hàng!');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setModalMode('add');
    setFormData({
      tenKhachHang: '',
      soDienThoai: '',
      diaChi: '',
      email: ''
    });
    setShowModal(true);
  };

  const handleEdit = (customer: Customer) => {
    setModalMode('edit');
    setSelectedCustomer(customer);
    setFormData({
      tenKhachHang: customer.tenKhachHang,
      soDienThoai: customer.soDienThoai,
      diaChi: customer.diaChi,
      email: customer.email
    });
    setShowModal(true);
  };

  const handleView = (customer: Customer) => {
    setModalMode('view');
    setSelectedCustomer(customer);
    setFormData({
      tenKhachHang: customer.tenKhachHang,
      soDienThoai: customer.soDienThoai,
      diaChi: customer.diaChi,
      email: customer.email
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa khách hàng "${name}"?`)) {
      try {
        await customersAPI.delete(id);
        alert('Xóa khách hàng thành công!');
        loadCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Không thể xóa khách hàng!');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await customersAPI.create(formData);
        alert('Thêm khách hàng thành công!');
      } else if (modalMode === 'edit' && selectedCustomer) {
        await customersAPI.update(selectedCustomer.maKhachHang, formData);
        alert('Cập nhật khách hàng thành công!');
      }
      setShowModal(false);
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Không thể lưu khách hàng!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.tenKhachHang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.soDienThoai.includes(searchTerm)
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
        <h2>Quản lý Khách hàng</h2>
        <div className="header-actions">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add" onClick={handleAdd}>
            <i className="fas fa-plus"></i>
            Thêm khách hàng
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã KH</th>
              <th>Tên khách hàng</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.maKhachHang}>
                <td>#{customer.maKhachHang}</td>
                <td>{customer.tenKhachHang}</td>
                <td>{customer.soDienThoai}</td>
                <td>{customer.email}</td>
                <td>{customer.diaChi}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-action btn-view" 
                      onClick={() => handleView(customer)}
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="btn-action btn-edit" 
                      onClick={() => handleEdit(customer)}
                      title="Sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-action btn-delete" 
                      onClick={() => handleDelete(customer.maKhachHang, customer.tenKhachHang)}
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

        {filteredCustomers.length === 0 && (
          <div className="no-data">
            <i className="fas fa-users"></i>
            <p>Không tìm thấy khách hàng nào</p>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Thêm khách hàng mới'}
                {modalMode === 'edit' && 'Chỉnh sửa khách hàng'}
                {modalMode === 'view' && 'Thông tin khách hàng'}
              </h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên khách hàng *</label>
                <input
                  type="text"
                  name="tenKhachHang"
                  value={formData.tenKhachHang}
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

export default CustomerManagement;
