import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logout } from '../features/authSlice';
import { User, Package, Settings, LogOut, MapPin, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const Profile = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [addresses, setAddresses] = useState([]);
    
    // New Address form state
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
    });
    
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses', or 'settings'

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
            setPhone(userInfo.phone || '');
            setAddresses(userInfo.addresses || []);
        }

        const fetchMyOrders = async () => {
            try {
                const { data } = await api.get('/api/orders/myorders');
                setOrders(data);
                setLoadingOrders(false);
            } catch (error) {
                console.error('Failed to fetch orders');
                setLoadingOrders(false);
            }
        };

        fetchMyOrders();
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setUpdatingProfile(true);
        try {
            const { data } = await api.put('/api/auth/profile', {
                name, email, phone, password, addresses
            });
            dispatch(setCredentials(data));
            toast.success('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
            setUpdatingProfile(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
            setUpdatingProfile(false);
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        const updatedAddresses = [...addresses, newAddress];
        
        setUpdatingProfile(true);
        try {
            const { data } = await api.put('/api/auth/profile', {
                addresses: updatedAddresses
            });
            dispatch(setCredentials(data));
            setAddresses(data.addresses);
            toast.success('Address added successfully');
            setShowAddressForm(false);
            setNewAddress({
                fullName: '', phone: '', address: '', apartment: '',
                city: '', state: '', pincode: '', landmark: ''
            });
            setUpdatingProfile(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add address');
            setUpdatingProfile(false);
        }
    };

    const handleDeleteAddress = async (index) => {
        if(window.confirm('Are you sure you want to delete this address?')) {
            const updatedAddresses = [...addresses];
            updatedAddresses.splice(index, 1);
            
            try {
                const { data } = await api.put('/api/auth/profile', {
                    addresses: updatedAddresses
                });
                dispatch(setCredentials(data));
                setAddresses(data.addresses);
                toast.success('Address removed');
            } catch (error) {
                toast.error('Failed to remove address');
            }
        }
    };

    const logoutHandler = () => {
        try {
            dispatch(logout());
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 text-center border-b border-gray-50">
                                <div className="w-20 h-20 bg-saffron/10 rounded-full flex items-center justify-center mx-auto mb-4 text-saffron">
                                    <User size={36} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">{userInfo?.name}</h2>
                                <p className="text-sm text-gray-500">{userInfo?.email}</p>
                            </div>
                            <nav className="p-2 space-y-1">
                                <button 
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'orders' ? 'bg-saffron/10 text-saffron font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Package size={18} />
                                    My Orders
                                </button>
                                <button 
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'addresses' ? 'bg-saffron/10 text-saffron font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <MapPin size={18} />
                                    My Addresses
                                </button>
                                <button 
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded text-left transition-colors ${activeTab === 'settings' ? 'bg-saffron/10 text-saffron font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <Settings size={18} />
                                    Account Settings
                                </button>
                                {userInfo?.role === 'admin' && (
                                    <Link 
                                        to="/admin/dashboard"
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded text-left text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <User size={18} />
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button 
                                    onClick={logoutHandler}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded text-left text-red-600 hover:bg-red-50 transition-colors mt-4 border-t border-gray-50"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <h2 className="text-2xl font-bold text-charcoal mb-6">My Orders</h2>
                                {loadingOrders ? (
                                    <p className="text-gray-500">Loading your orders...</p>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                                        <Link to="/shop" className="text-saffron font-medium hover:underline">Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 text-sm">
                                                    <th className="px-4 py-3 font-medium">Order ID</th>
                                                    <th className="px-4 py-3 font-medium">Date</th>
                                                    <th className="px-4 py-3 font-medium">Total</th>
                                                    <th className="px-4 py-3 font-medium">Paid</th>
                                                    <th className="px-4 py-3 font-medium">Status</th>
                                                    <th className="px-4 py-3 font-medium text-right">Details</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {orders.map(order => (
                                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 font-mono text-xs">{order._id.substring(0, 8)}...</td>
                                                        <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                        <td className="px-4 py-3 text-sm font-medium">₹{order.totalPrice}</td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {order.isPaid ? (
                                                                <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium">Yes</span>
                                                            ) : (
                                                                <span className="text-red-500 bg-red-50 px-2 py-1 rounded text-xs font-medium">No</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-600' :
                                                                order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                                                'bg-orange-50 text-orange-500'
                                                            }`}>
                                                                {order.orderStatus || (order.isDelivered ? 'Delivered' : 'Pending')}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <Link to={`/order/${order._id}`} className="text-blue-600 hover:underline text-sm font-medium">View</Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-charcoal">My Addresses</h2>
                                    {!showAddressForm && (
                                        <button 
                                            onClick={() => setShowAddressForm(true)}
                                            className="bg-saffron text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-orange-600"
                                        >
                                            <Plus size={16} /> Add Address
                                        </button>
                                    )}
                                </div>
                                
                                {showAddressForm ? (
                                    <form onSubmit={handleSaveAddress} className="border border-gray-200 rounded p-6 bg-gray-50 mb-6">
                                        <h3 className="font-bold text-lg mb-4">Add New Address</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                                                <input type="text" required value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} className="w-full border rounded px-3 py-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                                                <input type="text" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full border rounded px-3 py-2" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm text-gray-600 mb-1">Street Address</label>
                                                <input type="text" required value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} className="w-full border rounded px-3 py-2" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm text-gray-600 mb-1">Apartment, suite, etc. (optional)</label>
                                                <input type="text" value={newAddress.apartment} onChange={e => setNewAddress({...newAddress, apartment: e.target.value})} className="w-full border rounded px-3 py-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">City</label>
                                                <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full border rounded px-3 py-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">State</label>
                                                <input type="text" required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full border rounded px-3 py-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">PIN Code</label>
                                                <input type="text" required value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} className="w-full border rounded px-3 py-2" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-600 mb-1">Landmark (optional)</label>
                                                <input type="text" value={newAddress.landmark} onChange={e => setNewAddress({...newAddress, landmark: e.target.value})} className="w-full border rounded px-3 py-2" />
                                            </div>
                                        </div>
                                        <div className="mt-6 flex gap-3">
                                            <button type="submit" disabled={updatingProfile} className="bg-saffron text-white px-6 py-2 rounded">Save Address</button>
                                            <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 py-2 rounded text-gray-600 border border-gray-300">Cancel</button>
                                        </div>
                                    </form>
                                ) : addresses.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        <MapPin size={40} className="mx-auto mb-3 text-gray-300" />
                                        <p>You haven't saved any addresses yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((addr, idx) => (
                                            <div key={idx} className="border border-gray-200 rounded p-4 relative">
                                                <button 
                                                    onClick={() => handleDeleteAddress(idx)}
                                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                                    title="Delete Address"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <h4 className="font-bold text-gray-800">{addr.fullName}</h4>
                                                <p className="text-gray-600 text-sm mt-1">{addr.phone}</p>
                                                <p className="text-gray-600 text-sm mt-2">
                                                    {addr.address}<br />
                                                    {addr.apartment && <>{addr.apartment}<br /></>}
                                                    {addr.city}, {addr.state} {addr.pincode}<br />
                                                    {addr.landmark && <span className="text-gray-400">Landmark: {addr.landmark}</span>}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <h2 className="text-2xl font-bold text-charcoal mb-6">Account Settings</h2>
                                <form onSubmit={submitHandler} className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 mt-4">
                                        <h3 className="font-medium text-gray-800 mb-3">Change Password (Optional)</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button 
                                            type="submit" 
                                            disabled={updatingProfile}
                                            className="bg-saffron text-white px-6 py-2 rounded font-medium shadow hover:bg-orange-600 transition-colors disabled:opacity-70"
                                        >
                                            {updatingProfile ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
