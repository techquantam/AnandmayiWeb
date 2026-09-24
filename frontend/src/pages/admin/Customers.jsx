import { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import api from '../../services/api';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data } = await api.get('/api/auth/users');
                // Filter out admins if you only want to see customers, or show all. 
                // Let's show all but highlight role.
                setCustomers(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch customers");
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-charcoal">Customers</h2>
            
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
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                {customers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs">{customer._id.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 font-medium flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-saffron/10 text-saffron flex items-center justify-center font-bold">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            {customer.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Mail size={14} className="text-gray-400" />
                                                {customer.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Phone size={14} className="text-gray-400" />
                                                {customer.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {customer.role === 'admin' ? (
                                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">Admin</span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">Customer</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No customers found.
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
