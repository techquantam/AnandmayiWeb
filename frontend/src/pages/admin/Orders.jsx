import { useState, useEffect } from 'react';
import { Eye, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/api/orders');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch orders");
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const statusUpdateHandler = async (id, status) => {
        if (window.confirm(`Update order status to ${status}?`)) {
            try {
                await api.put(`/api/orders/${id}/status`, { status });
                setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: status, isDelivered: status === 'Delivered' } : o));
            } catch (error) {
                alert('Failed to update order');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading orders...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm">
                                    <th className="px-6 py-3 font-medium">Order ID</th>
                                    <th className="px-6 py-3 font-medium">User</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Total</th>
                                    <th className="px-6 py-3 font-medium">Paid</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                                        <td className="px-6 py-4 font-medium">{order.user?.name || 'Deleted User'}</td>
                                        <td className="px-6 py-4">{order.createdAt?.substring(0, 10)}</td>
                                        <td className="px-6 py-4">₹{order.totalPrice}</td>
                                        <td className="px-6 py-4">
                                            {order.isPaid ? (
                                                <span className="flex items-center text-green-600"><CheckCircle size={16} className="mr-1" /> Yes</span>
                                            ) : (
                                                <span className="flex items-center text-red-500"><Clock size={16} className="mr-1" /> No</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' :
                                                order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                                'bg-orange-50 text-orange-500'
                                            }`}>
                                                {order.orderStatus || (order.isDelivered ? 'Delivered' : 'Pending')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-3">
                                                <select 
                                                    value={order.orderStatus || (order.isDelivered ? 'Delivered' : 'Pending')}
                                                    onChange={(e) => statusUpdateHandler(order._id, e.target.value)}
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Packed">Packed</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                
                                                <Link to={`/order/${order._id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 p-1" title="View Details">
                                                    <Eye size={18} />
                                                    <span className="text-sm font-medium">Details</span>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
