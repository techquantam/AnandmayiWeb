import { useState, useEffect } from 'react';
import { IndianRupee, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    // Placeholder data for now
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        activeProducts: 0
    });
    const [loading, setLoading] = useState(true);

    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const { data } = await api.get('/api/orders/stats');
                setStats({
                    totalRevenue: data.totalRevenue,
                    totalOrders: data.totalOrders,
                    totalCustomers: data.totalCustomers,
                    activeProducts: data.activeProducts
                });
                setRecentOrders(data.recentOrders);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
                setLoading(false);
            }
        };

        fetchRecentOrders();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                        <IndianRupee size={24} />
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <ShoppingBag size={24} />
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Customers</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                        <Users size={24} />
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.activeProducts}</h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 text-saffron rounded-full flex items-center justify-center">
                        <TrendingUp size={24} />
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
                    <button className="text-saffron hover:text-orange-600 text-sm font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm">
                                <th className="px-6 py-3 font-medium">Order ID</th>
                                <th className="px-6 py-3 font-medium">Customer</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Total</th>
                                <th className="px-6 py-3 font-medium">Payment Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">#{order._id}</td>
                                    <td className="px-6 py-4">{order.user ? order.user.name : 'Unknown User'}</td>
                                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">₹{order.totalPrice}</td>
                                    <td className="px-6 py-4">
                                        {order.isPaid ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Paid</span>
                                        ) : (
                                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">Pending</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
