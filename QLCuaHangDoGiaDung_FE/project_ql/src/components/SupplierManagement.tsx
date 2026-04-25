import { useState, useEffect } from 'react';
import { suppliersAPI } from '../services/api';
import type { Supplier } from '../types';
import './Management.css';

type SupplierFormData = Omit<Supplier, 'maNhaCungCap'>;
type SupplierFormErrors = Partial<Record<keyof SupplierFormData, string>>;

const initialFormData: SupplierFormData = {
  tenNhaCungCap: '',
  soDienThoai: '',
  diaChi: '',
  email: ''
};

function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<SupplierFormErrors>({});

  useEffect(() => {
    loadSuppliers();
  }, []);

  const normalizeText = (value: string) => value.trim().replace(/\s+/g, ' ');

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

  const resetForm = () => {
    setSelectedSupplier(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const getSupplierPayload = () => ({
    tenNhaCungCap: normalizeText(formData.tenNhaCungCap),
    soDienThoai: formData.soDienThoai.trim(),
    diaChi: normalizeText(formData.diaChi),
    email: formData.email.trim().toLowerCase()
  });

  const validateForm = () => {
    const payload = getSupplierPayload();
    const errors: SupplierFormErrors = {};
    const phoneRegex = /^(0|\+84)(\d{9,10})$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!payload.tenNhaCungCap) {
      errors.tenNhaCungCap = 'Vui lòng nhập tên nhà cung cấp.';
    } else if (payload.tenNhaCungCap.length < 2) {
      errors.tenNhaCungCap = 'Tên nhà cung cấp phải có ít nhất 2 ký tự.';
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

    const duplicatedPhone = suppliers.some((supplier) =>
      supplier.soDienThoai.trim() === payload.soDienThoai &&
      supplier.maNhaCungCap !== selectedSupplier?.maNhaCungCap
    );

    if (duplicatedPhone) {
      errors.soDienThoai = 'Số điện thoại này đã tồn tại.';
    }

    const duplicatedEmail = suppliers.some((supplier) =>
      supplier.email.trim().toLowerCase() === payload.email &&
      supplier.maNhaCungCap !== selectedSupplier?.maNhaCungCap
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

  const fillForm = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      tenNhaCungCap: supplier.tenNhaCungCap,
      soDienThoai: supplier.soDienThoai,
      diaChi: supplier.diaChi,
      email: supplier.email
    });
    setFormErrors({});
  };

  const handleEdit = (supplier: Supplier) => {
    setModalMode('edit');
    fillForm(supplier);
    setShowModal(true);
  };

  const handleView = async (supplier: Supplier) => {
    try {
      setModalMode('view');
      const response = await suppliersAPI.getById(supplier.maNhaCungCap);
      fillForm(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading supplier detail:', error);
      fillForm(supplier);
      setShowModal(true);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhà cung cấp "${name}"?`)) return;

    try {
      await suppliersAPI.delete(id);
      alert('Xóa nhà cung cấp thành công!');
      await loadSuppliers();
    } catch (error: any) {
      console.error('Error deleting supplier:', error);
      alert(error.response?.data || 'Không thể xóa nhà cung cấp! Nhà cung cấp có thể đang liên kết với phiếu nhập/sản phẩm.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'view') return;
    if (!validateForm()) return;

    const payload = getSupplierPayload();

    try {
      setSaving(true);
      if (modalMode === 'add') {
        await suppliersAPI.create(payload);
        alert('Thêm nhà cung cấp thành công!');
      } else if (modalMode === 'edit' && selectedSupplier) {
        await suppliersAPI.update(selectedSupplier.maNhaCungCap, {
          maNhaCungCap: selectedSupplier.maNhaCungCap,
          ...payload
        });
        alert('Cập nhật nhà cung cấp thành công!');
      }

      closeModal();
      await loadSuppliers();
    } catch (error: any) {
      console.error('Error saving supplier:', error);
      alert(error.response?.data || 'Không thể lưu nhà cung cấp!');
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

    if (formErrors[name as keyof SupplierFormData]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined
      });
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return true;

    return (
      supplier.tenNhaCungCap.toLowerCase().includes(keyword) ||
      supplier.soDienThoai.includes(keyword) ||
      supplier.email.toLowerCase().includes(keyword) ||
      supplier.diaChi.toLowerCase().includes(keyword) ||
      String(supplier.maNhaCungCap).includes(keyword)
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
          <h2>Quản lý Nhà cung cấp</h2>
          <p className="helper-text">Tổng cộng: {suppliers.length} nhà cung cấp</p>
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
            <p>{searchTerm ? 'Không tìm thấy nhà cung cấp phù hợp' : 'Chưa có nhà cung cấp nào'}</p>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Thêm nhà cung cấp mới'}
                {modalMode === 'edit' && 'Chỉnh sửa nhà cung cấp'}
                {modalMode === 'view' && 'Thông tin nhà cung cấp'}
              </h3>
              <button className="btn-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="modal-body" onSubmit={handleSubmit}>
              {modalMode === 'view' && selectedSupplier && (
                <div className="detail-grid">
                  <div><strong>Mã nhà cung cấp:</strong> #{selectedSupplier.maNhaCungCap}</div>
                  <div><strong>Email:</strong> {selectedSupplier.email}</div>
                </div>
              )}

              <div className="form-group">
                <label>Tên nhà cung cấp *</label>
                <input
                  className={formErrors.tenNhaCungCap ? 'error' : ''}
                  type="text"
                  name="tenNhaCungCap"
                  placeholder="Ví dụ: Công ty TNHH Gia Dụng Việt"
                  value={formData.tenNhaCungCap}
                  onChange={handleChange}
                  disabled={modalMode === 'view' || saving}
                />
                {formErrors.tenNhaCungCap && <span className="error-message">{formErrors.tenNhaCungCap}</span>}
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
                    placeholder="Ví dụ: ncc@email.com"
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
                  placeholder="Nhập địa chỉ nhà cung cấp"
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

export default SupplierManagement;
