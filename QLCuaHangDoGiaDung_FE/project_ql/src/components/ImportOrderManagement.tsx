import { useState, useEffect } from 'react';
import { importOrdersAPI, importOrderDetailsAPI, productsAPI, suppliersAPI } from '../services/api';
import type { ImportOrder, ImportOrderDetail, Product, Supplier } from '../types';
import './Management.css';

type ImportOrderFormData = {
  maDonNhap: number;
  ngayNhap: string;
  maNhanVien: number;
  maNhaCungCap: number | null;
  tongTien: number;
};

type ImportOrderDetailFormData = {
  maSanPham: number;
  soLuong: number;
  giaNhap: number;
};

const initialOrderForm: ImportOrderFormData = {
  maDonNhap: 0,
  ngayNhap: new Date().toISOString().slice(0, 10),
  maNhanVien: 1,
  maNhaCungCap: null,
  tongTien: 0,
};

const initialDetailForm: ImportOrderDetailFormData = {
  maSanPham: 0,
  soLuong: 1,
  giaNhap: 0,
};

function ImportOrderManagement() {
  const [orders, setOrders] = useState<ImportOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedOrder, setSelectedOrder] = useState<ImportOrder | null>(null);
  const [orderForm, setOrderForm] = useState<ImportOrderFormData>(initialOrderForm);
  const [detailForm, setDetailForm] = useState<ImportOrderDetailFormData>(initialDetailForm);
  const [detailRows, setDetailRows] = useState<ImportOrderDetail[]>([]);
  const [selectedDetailIndex, setSelectedDetailIndex] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const normalizeOrder = (order: any): ImportOrder => ({
    maDonNhap: Number(order.maDonNhap ?? order.MaDonNhap ?? 0),
    ngayNhap: order.ngayNhap ?? order.NgayNhap ?? '',
    maNhanVien: Number(order.maNhanVien ?? order.MaNhanVien ?? 0),
    maNhaCungCap: order.maNhaCungCap ?? order.MaNhaCungCap ?? null,
    tongTien: Number(order.tongTien ?? order.TongTien ?? 0),
  });

  const normalizeDetail = (detail: any): ImportOrderDetail => ({
    maCTNhap: Number(detail.maCTNhap ?? detail.MaCTNhap ?? 0),
    maDonNhap: Number(detail.maDonNhap ?? detail.MaDonNhap ?? 0),
    maSanPham: Number(detail.maSanPham ?? detail.MaSanPham ?? 0),
    soLuong: Number(detail.soLuong ?? detail.SoLuong ?? 0),
    giaNhap: Number(detail.giaNhap ?? detail.GiaNhap ?? 0),
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, suppliersRes] = await Promise.all([
        importOrdersAPI.getAll(),
        productsAPI.getAll(),
        suppliersAPI.getAll(),
      ]);
      setOrders(ordersRes.data.map(normalizeOrder));
      setProducts(productsRes.data);
      setSuppliers(suppliersRes.data);
    } catch (error) {
      console.error('Error loading import orders:', error);
      alert('Không thể tải danh sách đơn nhập!');
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setOrderForm(initialOrderForm);
    setDetailForm(initialDetailForm);
    setDetailRows([]);
    setSelectedOrder(null);
    setSelectedDetailIndex(null);
    setFormErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    resetForms();
  };

  const getProductName = (id: number) => products.find((p) => p.maSanPham === id)?.tenSanPham || `SP${id}`;
  const getSupplierName = (id?: number | null) => suppliers.find((s) => s.maNhaCungCap === id)?.tenNhaCungCap || 'N/A';

  const openAddModal = () => {
    resetForms();
    setModalMode('add');
    setOrderForm(initialOrderForm);
    setShowModal(true);
  };

  const openViewModal = async (order: ImportOrder) => {
    try {
      setModalMode('view');
      setSelectedOrder(order);
      setOrderForm({
        maDonNhap: order.maDonNhap,
        ngayNhap: order.ngayNhap ? new Date(order.ngayNhap).toISOString().slice(0, 10) : '',
        maNhanVien: order.maNhanVien,
        maNhaCungCap: order.maNhaCungCap ?? null,
        tongTien: order.tongTien,
      });
      setShowModal(true);
      const detailRes = await importOrderDetailsAPI.getByOrderId(order.maDonNhap);
      setDetailRows(detailRes.data.map(normalizeDetail));
      setSelectedDetailIndex(null);
    } catch (error) {
      console.error('Error loading import order detail:', error);
      alert('Không thể tải chi tiết đơn nhập!');
      closeModal();
    }
  };

  const openEditModal = async (order: ImportOrder) => {
    try {
      setModalMode('edit');
      setSelectedOrder(order);
      setOrderForm({
        maDonNhap: order.maDonNhap,
        ngayNhap: order.ngayNhap ? new Date(order.ngayNhap).toISOString().slice(0, 10) : '',
        maNhanVien: order.maNhanVien,
        maNhaCungCap: order.maNhaCungCap ?? null,
        tongTien: order.tongTien,
      });
      const detailRes = await importOrderDetailsAPI.getByOrderId(order.maDonNhap);
      const normalizedDetails = detailRes.data.map(normalizeDetail);
      setDetailRows(normalizedDetails);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading order for edit:', error);
      alert('Không thể tải dữ liệu đơn nhập!');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!orderForm.ngayNhap) errors.ngayNhap = 'Vui lòng chọn ngày nhập.';
    if (orderForm.maNhanVien <= 0) errors.maNhanVien = 'Mã nhân viên không hợp lệ.';
    if (!detailRows.length) errors.details = 'Vui lòng thêm ít nhất một sản phẩm.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addDetailRow = () => {
    if (detailForm.maSanPham <= 0 || detailForm.soLuong <= 0 || detailForm.giaNhap <= 0) {
      setFormErrors((prev) => ({ ...prev, detailForm: 'Vui lòng nhập đủ thông tin chi tiết.' }));
      return;
    }

    setDetailRows((prev) => {
      if (selectedDetailIndex !== null) {
        const updated = [...prev];
        updated[selectedDetailIndex] = { maCTNhap: updated[selectedDetailIndex]?.maCTNhap ?? 0, maDonNhap: orderForm.maDonNhap, ...detailForm } as ImportOrderDetail;
        return updated;
      }
      return [...prev, { maCTNhap: 0, maDonNhap: orderForm.maDonNhap, ...detailForm } as ImportOrderDetail];
    });

    setDetailForm(initialDetailForm);
    setSelectedDetailIndex(null);
    setFormErrors((prev) => ({ ...prev, detailForm: '' }));
  };

  const editDetailRow = (index: number) => {
    const row = detailRows[index];
    setDetailForm({
      maSanPham: row.maSanPham,
      soLuong: row.soLuong,
      giaNhap: row.giaNhap,
    });
    setSelectedDetailIndex(index);
  };

  const removeDetailRow = (index: number) => {
    setDetailRows((prev) => prev.filter((_, i) => i !== index));
    if (selectedDetailIndex === index) {
      setSelectedDetailIndex(null);
      setDetailForm(initialDetailForm);
    }
  };

  const handleChangeOrder = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: name === 'maNhaCungCap' ? (value === '' ? null : Number(value)) : name === 'ngayNhap' ? value : Number(value),
    }));
  };

  const handleChangeDetail = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetailForm((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const filteredOrders = orders.filter((order) =>
    String(order.maDonNhap).includes(searchTerm.trim()) ||
    getSupplierName(order.maNhaCungCap).toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const handleDelete = async (order: ImportOrder) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đơn nhập #DN${order.maDonNhap}?`)) return;
    try {
      await importOrderDetailsAPI.deleteByOrderId(order.maDonNhap);
      await importOrdersAPI.delete(order.maDonNhap);
      alert('Xóa đơn nhập thành công!');
      await loadData();
    } catch (error) {
      console.error('Error deleting import order:', error);
      alert('Không thể xóa đơn nhập!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      const total = detailRows.reduce((sum, item) => sum + item.soLuong * item.giaNhap, 0);
      const orderPayload = {
        ...orderForm,
        tongTien: total,
      };

      if (modalMode === 'add') {
        const createRes = await importOrdersAPI.create(orderPayload);
        const createdId = createRes.data?.maDonNhap ?? createRes.data?.MaDonNhap ?? 0;
        const importOrderId = createdId || orderForm.maDonNhap;
        for (const item of detailRows) {
          await importOrderDetailsAPI.create({
            maDonNhap: importOrderId,
            maSanPham: item.maSanPham,
            soLuong: item.soLuong,
            giaNhap: item.giaNhap,
          });
        }
        alert('Thêm đơn nhập thành công!');
      } else if (modalMode === 'edit' && selectedOrder) {
        await importOrdersAPI.update(selectedOrder.maDonNhap, {
          ...orderPayload,
          maDonNhap: selectedOrder.maDonNhap,
        });

        await importOrderDetailsAPI.deleteByOrderId(selectedOrder.maDonNhap);
        for (const item of detailRows) {
          await importOrderDetailsAPI.create({
            maDonNhap: selectedOrder.maDonNhap,
            maSanPham: item.maSanPham,
            soLuong: item.soLuong,
            giaNhap: item.giaNhap,
          });
        }
        alert('Cập nhật đơn nhập thành công!');
      }

      closeModal();
      await loadData();
    } catch (error) {
      console.error('Error saving import order:', error);
      alert('Không thể lưu đơn nhập!');
    } finally {
      setSaving(false);
    }
  };

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
          <h2>Quản lý Đơn nhập</h2>
          <p className="helper-text">Tổng cộng: {orders.length} đơn nhập</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm theo mã đơn hoặc nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add" onClick={openAddModal}>
            <i className="fas fa-plus"></i>
            Thêm đơn nhập
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày nhập</th>
              <th>Nhà cung cấp</th>
              <th>Mã nhân viên</th>
              <th>Tổng tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.maDonNhap}>
                <td>#DN{order.maDonNhap}</td>
                <td>{new Date(order.ngayNhap).toLocaleDateString('vi-VN')}</td>
                <td>{getSupplierName(order.maNhaCungCap)}</td>
                <td>NV{order.maNhanVien}</td>
                <td>{formatCurrency(order.tongTien)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-action btn-view" onClick={() => openViewModal(order)} title="Xem chi tiết">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn-action btn-edit" onClick={() => openEditModal(order)} title="Sửa">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn-action btn-delete" onClick={() => handleDelete(order)} title="Xóa">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="no-data">
            <i className="fas fa-receipt"></i>
            <p>Không tìm thấy đơn nhập nào</p>
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalMode === 'add' && 'Thêm đơn nhập mới'}
                {modalMode === 'edit' && `Chỉnh sửa đơn nhập #DN${selectedOrder?.maDonNhap}`}
                {modalMode === 'view' && `Chi tiết đơn nhập #DN${selectedOrder?.maDonNhap}`}
              </h3>
              <button className="btn-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày nhập *</label>
                  <input type="date" name="ngayNhap" value={orderForm.ngayNhap} onChange={handleChangeOrder} disabled={modalMode === 'view' || saving} />
                  {formErrors.ngayNhap && <span className="error-message">{formErrors.ngayNhap}</span>}
                </div>
                <div className="form-group">
                  <label>Mã nhân viên *</label>
                  <input type="number" name="maNhanVien" value={orderForm.maNhanVien} onChange={handleChangeOrder} disabled={modalMode === 'view' || saving} min="1" />
                  {formErrors.maNhanVien && <span className="error-message">{formErrors.maNhanVien}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Nhà cung cấp</label>
                <select name="maNhaCungCap" value={orderForm.maNhaCungCap ?? ''} onChange={handleChangeOrder} disabled={modalMode === 'view' || saving}>
                  <option value="">-- Chọn nhà cung cấp --</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.maNhaCungCap} value={supplier.maNhaCungCap}>{supplier.tenNhaCungCap}</option>
                  ))}
                </select>
              </div>

              <div className="detail-title" style={{ marginTop: 16 }}>Chi tiết đơn nhập</div>
              {(modalMode !== 'view') && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Sản phẩm</label>
                    <select name="maSanPham" value={detailForm.maSanPham} onChange={handleChangeDetail}>
                      <option value={0}>-- Chọn sản phẩm --</option>
                      {products.map((product) => (
                        <option key={product.maSanPham} value={product.maSanPham}>{product.tenSanPham}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Số lượng</label>
                    <input type="number" name="soLuong" value={detailForm.soLuong} onChange={handleChangeDetail} min="1" />
                  </div>
                  <div className="form-group">
                    <label>Giá nhập</label>
                    <input type="number" name="giaNhap" value={detailForm.giaNhap} onChange={handleChangeDetail} min="1" />
                  </div>
                </div>
              )}

              {modalMode !== 'view' && (
                <div className="modal-footer" style={{ justifyContent: 'flex-start' }}>
                  <button type="button" className="btn-add" onClick={addDetailRow}>
                    {selectedDetailIndex !== null ? 'Cập nhật dòng' : 'Thêm dòng'}
                  </button>
                </div>
              )}

              <table className="data-table detail-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá nhập</th>
                    <th>Thành tiền</th>
                    {modalMode !== 'view' && <th>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {detailRows.map((row, index) => (
                    <tr key={`${row.maCTNhap}-${index}`}>
                      <td>{getProductName(row.maSanPham)}</td>
                      <td>{row.soLuong}</td>
                      <td>{formatCurrency(row.giaNhap)}</td>
                      <td>{formatCurrency(row.soLuong * row.giaNhap)}</td>
                      {modalMode !== 'view' && (
                        <td>
                          <div className="action-buttons">
                            <button type="button" className="btn-action btn-edit" onClick={() => editDetailRow(index)}><i className="fas fa-edit"></i></button>
                            <button type="button" className="btn-action btn-delete" onClick={() => removeDetailRow(index)}><i className="fas fa-trash"></i></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {formErrors.details && <div className="error-message" style={{ marginTop: 8 }}>{formErrors.details}</div>}
              {formErrors.detailForm && <div className="error-message" style={{ marginTop: 8 }}>{formErrors.detailForm}</div>}

              <div className="detail-grid" style={{ marginTop: 12 }}>
                <p><strong>Tổng tiền:</strong> {formatCurrency(detailRows.reduce((sum, item) => sum + item.soLuong * item.giaNhap, 0))}</p>
              </div>

              {modalMode !== 'view' && (
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={closeModal} disabled={saving}>Hủy</button>
                  <button type="submit" className="btn-save" disabled={saving}>
                    {saving ? 'Đang lưu...' : modalMode === 'add' ? 'Thêm' : 'Cập nhật'}
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

export default ImportOrderManagement;
