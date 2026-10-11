import { useState, useEffect } from 'react';
import { Eye, Clock, CheckCircle, Trash2, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/api/orders');
                setOrders(data || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch orders", error);
                toast.error("Failed to fetch orders");
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
                toast.success(`Status updated to ${status}`);
            } catch (error) {
                console.error('Update status error:', error);
                const errorMsg = error.response?.data?.message || 'Failed to update order';
                toast.error(errorMsg);
            }
        }
    };

    const deleteOrderHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await api.delete(`/api/orders/${id}`);
                setOrders(orders.filter(o => o._id !== id));
                toast.success('Order deleted successfully');
            } catch (error) {
                console.error('Delete order error:', error);
                const errorMsg = error.response?.data?.message || 'Failed to delete order';
                toast.error(errorMsg);
            }
        }
    };

    const filteredOrders = orders.filter((order) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        const idMatch = order._id?.toLowerCase().includes(query);
        const userMatch = order.user?.name?.toLowerCase().includes(query);
        const emailMatch = order.user?.email?.toLowerCase().includes(query);
        const statusMatch = (order.orderStatus || (order.isDelivered ? 'Delivered' : 'Pending')).toLowerCase().includes(query);
        const amountMatch = String(order.totalPrice).includes(query);
        return idMatch || userMatch || emailMatch || statusMatch || amountMatch;
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {searchTerm ? `Found ${filteredOrders.length} of ${orders.length} orders` : `Total ${orders.length} orders`}
                    </p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search ID, customer, status..."
                        className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron shadow-sm"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                            title="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
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
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs">{order._id}</td>
                                        <td className="px-6 py-4 font-medium">{order.user?.name || 'Deleted User'}</td>
                                        <td className="px-6 py-4">{order.createdAt?.substring(0, 10)}</td>
                                        <td className="px-6 py-4 font-medium">₹{order.totalPrice}</td>
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
                                                order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                'bg-orange-50 text-orange-500'
                                            }`}>
                                                {order.orderStatus || (order.isDelivered ? 'Delivered' : 'Pending')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <select 
                                                    value={order.orderStatus || (order.isDelivered ? 'Delivered' : 'Pending')}
                                                    onChange={(e) => statusUpdateHandler(order._id, e.target.value)}
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-saffron"
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
                                                
                                                <Link to={`/order/${order._id}`} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded flex items-center gap-1 transition-colors" title="View Details">
                                                    <Eye size={18} />
                                                    <span className="text-sm font-medium">Details</span>
                                                </Link>

                                                <button 
                                                    onClick={() => deleteOrderHandler(order._id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                            {searchTerm ? (
                                                <div>
                                                    <p className="font-medium text-gray-700">No orders found</p>
                                                    <p className="text-xs text-gray-400 mt-1">No orders match "{searchTerm}"</p>
                                                </div>
                                            ) : (
                                                'No orders placed yet.'
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
