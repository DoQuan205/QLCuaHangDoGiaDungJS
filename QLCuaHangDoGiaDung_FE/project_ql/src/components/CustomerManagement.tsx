import { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';
import type { Customer } from '../types';
import './Management.css';

type CustomerFormData = Omit<Customer, 'maKhachHang'>;
type CustomerFormErrors = Partial<Record<keyof CustomerFormData, string>>;

const initialFormData: CustomerFormData = {
  tenKhachHang: '',
  soDienThoai: '',
  diaChi: '',
  email: ''
};

function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<CustomerFormErrors>({});

  useEffect(() => {
    loadCustomers();
  }, []);

  const normalizeText = (value: string) => value.trim().replace(/\s+/g, ' ');

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

  const resetForm = () => {
    setSelectedCustomer(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const getCustomerPayload = () => ({
    tenKhachHang: normalizeText(formData.tenKhachHang),
    soDienThoai: formData.soDienThoai.trim(),
    diaChi: normalizeText(formData.diaChi),
    email: formData.email.trim().toLowerCase()
  });

  const validateForm = () => {
    const payload = getCustomerPayload();
    const errors: CustomerFormErrors = {};
    const phoneRegex = /^(0|\+84)(\d{9,10})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!payload.tenKhachHang) {
      errors.tenKhachHang = 'Vui lòng nhập tên khách hàng.';
    } else if (payload.tenKhachHang.length < 2) {
      errors.tenKhachHang = 'Tên khách hàng phải có ít nhất 2 ký tự.';
    }

    if (!payload.soDienThoai) {
      errors.soDienThoai = 'Vui lòng nhập số điện thoại.';
    } else if (!phoneRegex.test(payload.soDienThoai)) {
      errors.soDienThoai = 'Số điện thoại không hợp lệ. Ví dụ: 0987654321.';
    }

    if (!payload.email) {
      errors.email = 'Vui lòng nhập email.';
    } else if (!emailRegex.test(payload.email)) {
      errors.email = 'Email không hợp lệ.';
    }

    if (!payload.diaChi) {
      errors.diaChi = 'Vui lòng nhập địa chỉ.';
    } else if (payload.diaChi.length < 5) {
      errors.diaChi = 'Địa chỉ phải có ít nhất 5 ký tự.';
    }

    const duplicatedPhone = customers.some((customer) =>
      customer.soDienThoai.trim() === payload.soDienThoai &&
      customer.maKhachHang !== selectedCustomer?.maKhachHang
    );

    if (duplicatedPhone) {
      errors.soDienThoai = 'Số điện thoại này đã tồn tại.';
    }

    const duplicatedEmail = customers.some((customer) =>
      customer.email.trim().toLowerCase() === payload.email &&
      customer.maKhachHang !== selectedCustomer?.maKhachHang
    );

    if (duplicatedEmail) {
      errors.email = 'Email này đã tồn tại.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = () => {
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  const fillForm = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      tenKhachHang: customer.tenKhachHang,
      soDienThoai: customer.soDienThoai,
      diaChi: customer.diaChi,
      email: customer.email
    });
    setFormErrors({});
  };

  const handleEdit = (customer: Customer) => {
    setModalMode('edit');
    fillForm(customer);
    setShowModal(true);
  };

  const handleView = async (customer: Customer) => {
    try {
      setModalMode('view');
      const response = await customersAPI.getById(customer.maKhachHang);
      fillForm(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading customer detail:', error);
      fillForm(customer);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa khách hàng "${name}"?`)) return;

    try {
      await customersAPI.delete(id);
      alert('Xóa khách hàng thành công!');
      await loadCustomers();
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      alert(error.response?.data || 'Không thể xóa khách hàng! Khách hàng có thể đang phát sinh đơn hàng.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'view') return;
    if (!validateForm()) return;

    const payload = getCustomerPayload();

    try {
      setSaving(true);
      if (modalMode === 'add') {
        await customersAPI.create(payload);
        alert('Thêm khách hàng thành công!');
      } else if (modalMode === 'edit' && selectedCustomer) {
        await customersAPI.update(selectedCustomer.maKhachHang, {
          maKhachHang: selectedCustomer.maKhachHang,
          ...payload
        });
        alert('Cập nhật khách hàng thành công!');
      }

      closeModal();
      await loadCustomers();
    } catch (error: any) {
      console.error('Error saving customer:', error);
      alert(error.response?.data || 'Không thể lưu khách hàng!');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (formErrors[name as keyof CustomerFormData]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return true;

    return (
      customer.tenKhachHang.toLowerCase().includes(keyword) ||
      customer.soDienThoai.includes(keyword) ||
      customer.email.toLowerCase().includes(keyword) ||
      customer.diaChi.toLowerCase().includes(keyword) ||
      String(customer.maKhachHang).includes(keyword)
    );
  });

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
        <div>
          <h2>Quản lý Khách hàng</h2>
          <p className="helper-text">Tổng cộng: {customers.length} khách hàng</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm theo tên, SĐT, email, địa chỉ..."
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
            <p>{searchTerm ? 'Không tìm thấy khách hàng phù hợp' : 'Chưa có khách hàng nào'}</p>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Thêm khách hàng mới'}
                {modalMode === 'edit' && 'Chỉnh sửa khách hàng'}
                {modalMode === 'view' && 'Thông tin khách hàng'}
              </h3>
              <button className="btn-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="modal-body" onSubmit={handleSubmit}>
              {modalMode === 'view' && selectedCustomer && (
                <div className="detail-grid">
                  <div><strong>Mã khách hàng:</strong> #{selectedCustomer.maKhachHang}</div>
                  <div><strong>Email:</strong> {selectedCustomer.email}</div>
                </div>
              )}

              <div className="form-group">
                <label>Tên khách hàng *</label>
                <input
                  className={formErrors.tenKhachHang ? 'error' : ''}
                  type="text"
                  name="tenKhachHang"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.tenKhachHang}
                  onChange={handleChange}
                  disabled={modalMode === 'view' || saving}
                />
                {formErrors.tenKhachHang && <span className="error-message">{formErrors.tenKhachHang}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    className={formErrors.soDienThoai ? 'error' : ''}
                    type="tel"
                    name="soDienThoai"
                    placeholder="Ví dụ: 0987654321"
                    value={formData.soDienThoai}
                    onChange={handleChange}
                    disabled={modalMode === 'view' || saving}
                  />
                  {formErrors.soDienThoai && <span className="error-message">{formErrors.soDienThoai}</span>}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    className={formErrors.email ? 'error' : ''}
                    type="email"
                    name="email"
                    placeholder="Ví dụ: khachhang@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={modalMode === 'view' || saving}
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ *</label>
                <textarea
                  className={formErrors.diaChi ? 'error' : ''}
                  name="diaChi"
                  placeholder="Nhập địa chỉ giao hàng/địa chỉ liên hệ"
                  value={formData.diaChi}
                  onChange={handleChange}
                  disabled={modalMode === 'view' || saving}
                  rows={3}
                />
                {formErrors.diaChi && <span className="error-message">{formErrors.diaChi}</span>}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal} disabled={saving}>
                  {modalMode === 'view' ? 'Đóng' : 'Hủy'}
                </button>
                {modalMode !== 'view' && (
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving && <i className="fas fa-spinner fa-spin"></i>}
                    {!saving && <i className="fas fa-save"></i>}
                    {saving ? 'Đang lưu...' : modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerManagement;
