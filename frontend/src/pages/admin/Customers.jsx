import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Search, X, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data } = await api.get('/api/auth/users');
                setCustomers(data || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch customers", error);
                toast.error("Failed to fetch customers");
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const deleteHandler = async (id, customerName) => {
        if (window.confirm(`Are you sure you want to delete customer "${customerName || 'this user'}"? This action cannot be undone.`)) {
            try {
                await api.delete(`/api/auth/users/${id}`);
                setCustomers(customers.filter(c => c._id !== id));
                toast.success('Customer deleted successfully');
            } catch (error) {
                console.error('Delete customer error:', error);
                const errorMsg = error.response?.data?.message || 'Failed to delete customer';
                toast.error(errorMsg);
            }
        }
    };

    const filteredCustomers = customers.filter((customer) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        const nameMatch = customer.name?.toLowerCase().includes(query);
        const emailMatch = customer.email?.toLowerCase().includes(query);
        const phoneMatch = customer.phone?.toLowerCase().includes(query);
        const idMatch = customer._id?.toLowerCase().includes(query);
        const roleMatch = customer.role?.toLowerCase().includes(query);
        return nameMatch || emailMatch || phoneMatch || idMatch || roleMatch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {searchTerm ? `Found ${filteredCustomers.length} of ${customers.length} users` : `Total ${customers.length} registered users`}
                    </p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search name, email, phone..."
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
                    <div className="p-6 text-center text-gray-500">Loading customers...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm">
                                    <th className="px-6 py-3 font-medium">ID</th>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Email</th>
                                    <th className="px-6 py-3 font-medium">Phone</th>
                                    <th className="px-6 py-3 font-medium">Role</th>
                                    <th className="px-6 py-3 font-medium">Registered</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs">{customer._id.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-bold">
                                                {customer.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            {customer.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Mail size={14} className="text-gray-400" />
                                                <a href={`mailto:${customer.email}`} className="hover:text-saffron transition-colors">
                                                    {customer.email}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Phone size={14} className="text-gray-400" />
                                                {customer.phone ? (
                                                    <a href={`tel:${customer.phone}`} className="hover:text-saffron transition-colors">
                                                        {customer.phone}
                                                    </a>
                                                ) : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.role === 'admin' ? (
                                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">Admin</span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">Customer</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => deleteHandler(customer._id, customer.name)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete Customer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                            {searchTerm ? (
                                                <div>
                                                    <p className="font-medium text-gray-700">No customers found</p>
                                                    <p className="text-xs text-gray-400 mt-1">No customers match "{searchTerm}"</p>
                                                </div>
                                            ) : (
                                                'No customers registered yet.'
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

export default AdminCustomers;
