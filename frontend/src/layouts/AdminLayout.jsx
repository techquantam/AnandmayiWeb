import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, ListOrdered, Settings, LogOut, Menu, Image } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-charcoal text-white flex flex-col hidden md:flex">
                <div className="p-4 bg-maroon text-center flex justify-center">
                    <img src="/images/logo.png" alt="Anandmayi Admin" className="h-12 w-auto" />
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
                        <LayoutDashboard size={20} className="mr-3" /> Dashboard
                    </Link>
                    <Link to="/admin/products" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
                        <ShoppingBag size={20} className="mr-3" /> Products
                    </Link>
                    <Link to="/admin/categories" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
                        <ListOrdered size={20} className="mr-3" /> Categories
                    </Link>
                    <Link to="/admin/orders" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
                        <ShoppingBag size={20} className="mr-3" /> Orders
                    </Link>
                    <Link to="/admin/customers" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
                        <Users size={20} className="mr-3" /> Customers
                    </Link>
                    <Link to="/admin/banners" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
                        <Image size={20} className="mr-3" /> Banners
                    </Link>
                    <Link to="/admin/settings" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors">
                        <Settings size={20} className="mr-3" /> Settings
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={logoutHandler} className="flex items-center text-gray-400 hover:text-white w-full px-4 py-2 transition-colors">
                        <LogOut size={20} className="mr-3" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
                    <div className="md:hidden">
                        {/* Mobile Menu Toggle */}
                        <button className="text-gray-500 hover:text-gray-700">
                            <Menu size={24} />
                        </button>
                    </div>
                    <div className="text-xl font-semibold text-gray-800">Admin Dashboard</div>
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-saffron text-white flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>
                
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
