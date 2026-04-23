import { useState, useEffect } from 'react';
import { ordersAPI, orderDetailsAPI, productsAPI } from '../services/api';
import type { Order, OrderDetail, Product } from '../types';
import './Management.css';

function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const getStatusClass = (trangThai: Order['trangThai']) => {
    return trangThai === 'Đã giao' ? 'badge badge-success' : 'badge badge-warning';
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      alert('Không thể tải danh sách đơn hàng!');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleView = async (order: Order) => {
    try {
      setDetailsLoading(true);
      setSelectedOrder(order);
      setShowModal(true);
      const response = await orderDetailsAPI.getByOrderId(order.maDonXuat);
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error loading order details:', error);
      alert('Không thể tải chi tiết đơn hàng!');
      setShowModal(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getProductName = (productId: number) => {
    return products.find(product => product.maSanPham === productId)?.tenSanPham || `SP${productId}`;
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(`Bạn có chắc muốn xóa đơn hàng #${id}?`)) {
      try {
        await orderDetailsAPI.deleteByOrderId(id);
        await ordersAPI.delete(id);
        alert('Xóa đơn hàng thành công!');
        loadOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Không thể xóa đơn hàng!');
      }
    }
  };

  const handleConfirmDelivery = async (order: Order) => {
    if (order.trangThai === 'Đã giao') {
      return;
    }

    try {
      setUpdatingStatusId(order.maDonXuat);
      await ordersAPI.updateStatus(order.maDonXuat, 'Đã giao');
      setOrders((prevOrders) =>
        prevOrders.map((item) =>
          item.maDonXuat === order.maDonXuat ? { ...item, trangThai: 'Đã giao' } : item
        )
      );
      setSelectedOrder((current) =>
        current && current.maDonXuat === order.maDonXuat ? { ...current, trangThai: 'Đã giao' } : current
      );
      alert(`Đơn hàng #DX${order.maDonXuat} đã được xác nhận giao.`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Không thể cập nhật trạng thái đơn hàng!');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const filteredOrders = orders.filter(order =>
    order.maDonXuat.toString().includes(searchTerm)
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
        <h2>Quản lý Đơn hàng</h2>
        <div className="header-actions">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày xuất</th>
              <th>Nhân viên</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.maDonXuat}>
                <td>#DX{order.maDonXuat}</td>
                <td>{formatDate(order.ngayXuat)}</td>
                <td>NV{order.maNhanVien}</td>
                <td>KH{order.maKhachHang || 'N/A'}</td>
                <td>{formatCurrency(order.tongTien)}</td>
                <td>
                  <span className={getStatusClass(order.trangThai)}>{order.trangThai}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-action btn-view" 
                      onClick={() => handleView(order)}
                      title="Xem chi tiết"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleConfirmDelivery(order)}
                      title={order.trangThai === 'Đã giao' ? 'Đơn hàng đã giao' : 'Xác nhận giao hàng'}
                      disabled={order.trangThai === 'Đã giao' || updatingStatusId === order.maDonXuat}
                    >
                      <i className="fas fa-check"></i>
                    </button>
                    <button 
                      className="btn-action btn-delete" 
                      onClick={() => handleDelete(order.maDonXuat)}
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

        {filteredOrders.length === 0 && (
          <div className="no-data">
            <i className="fas fa-shopping-cart"></i>
            <p>Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>

      {showModal && selectedOrder && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>Chi tiết đơn hàng #DX{selectedOrder.maDonXuat}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <p><strong>Ngày xuất:</strong> {formatDate(selectedOrder.ngayXuat)}</p>
                <p><strong>Nhân viên:</strong> NV{selectedOrder.maNhanVien}</p>
                <p><strong>Khách hàng:</strong> KH{selectedOrder.maKhachHang || 'N/A'}</p>
                <p><strong>Tổng tiền:</strong> {formatCurrency(selectedOrder.tongTien)}</p>
                <p><strong>Trạng thái:</strong> <span className={getStatusClass(selectedOrder.trangThai)}>{selectedOrder.trangThai}</span></p>
              </div>

              <h4 className="detail-title">Sản phẩm trong đơn</h4>

              {detailsLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Đang tải chi tiết đơn hàng...</p>
                </div>
              ) : orderDetails.length > 0 ? (
                <table className="data-table detail-table">
                  <thead>
                    <tr>
                      <th>Mã SP</th>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá bán</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((detail) => (
                      <tr key={detail.maCTXuat}>
                        <td>#{detail.maSanPham}</td>
                        <td>{getProductName(detail.maSanPham)}</td>
                        <td>{detail.soLuong}</td>
                        <td>{formatCurrency(detail.giaBan)}</td>
                        <td>{formatCurrency(detail.soLuong * detail.giaBan)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">
                  <i className="fas fa-receipt"></i>
                  <p>Đơn hàng chưa có chi tiết</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OrderManagement;
