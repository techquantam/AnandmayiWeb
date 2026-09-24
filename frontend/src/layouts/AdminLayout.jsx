import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, ListOrdered, Settings, LogOut, Menu, Image, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden relative">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-charcoal text-white flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 bg-maroon text-center flex justify-between items-center md:justify-center">
                    <img src="/images/logo.webp" alt="Anandmayi Admin" className="h-12 w-auto" />
                    <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
                    <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-4 py-3 rounded transition-colors ${location.pathname === '/admin/dashboard' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                        <LayoutDashboard size={20} className="mr-3" /> Dashboard
                    </Link>
                    <Link to="/admin/products" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-4 py-3 rounded transition-colors ${location.pathname.includes('/admin/product') ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                        <ShoppingBag size={20} className="mr-3" /> Products
                    </Link>
                    <Link to="/admin/categories" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-4 py-3 rounded transition-colors ${location.pathname === '/admin/categories' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                        <ListOrdered size={20} className="mr-3" /> Categories
                    </Link>
                    <Link to="/admin/orders" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-4 py-3 rounded transition-colors ${location.pathname === '/admin/orders' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                        <ShoppingBag size={20} className="mr-3" /> Orders
                    </Link>
                    <Link to="/admin/customers" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-4 py-3 rounded transition-colors ${location.pathname === '/admin/customers' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                        <Users size={20} className="mr-3" /> Customers
                    </Link>
                    <Link to="/admin/banners" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-4 py-3 rounded transition-colors ${location.pathname === '/admin/banners' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                        <Image size={20} className="mr-3" /> Banners
                    </Link>
                    <Link to="/admin/settings" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center px-4 py-3 rounded transition-colors ${location.pathname === '/admin/settings' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
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
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="md:hidden">
                        {/* Mobile Menu Toggle */}
                        <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsMobileMenuOpen(true)}>
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
