import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Header = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');
    const [categories, setCategories] = useState([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const userInfo = useSelector((state) => state.auth.userInfo);
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/api/categories');
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        if (keyword.trim()) {
            navigate(`/shop?keyword=${keyword}`);
        } else {
            navigate('/shop');
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Top Announcement Bar */}
            <div className="bg-saffron text-white text-sm text-center py-2 font-medium">
                पूजा सामग्री अब आपके घर तक 🚚
            </div>
            
            {/* Main Header */}
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Mobile Menu Icon */}
                <div className="md:hidden flex items-center">
                    <button className="text-maroon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <Menu size={24} />
                    </button>
                </div>

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img src="/images/logo.png" alt="Anandmayi Bhakti Logo" className="h-20 w-auto" />
                    <span className="text-3xl font-bold text-maroon font-serif tracking-wide hidden sm:block">Anandmayi</span>
                </Link>

                {/* Desktop Search Bar */}
                <form onSubmit={searchSubmitHandler} className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                    <input 
                        type="text" 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search for puja samagri, kits, incense..." 
                        className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron"
                    />
                    <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-saffron">
                        <Search size={20} />
                    </button>
                </form>

                {/* Icons */}
                <div className="flex items-center gap-4 sm:gap-6 md:pr-10">
                    {userInfo ? (
                        <button onClick={logoutHandler} className="hidden sm:block bg-red-100 text-red-600 px-5 py-2 rounded font-bold hover:bg-red-200 transition-colors text-[13px]">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="hidden sm:block bg-maroon text-white px-5 py-2 rounded font-bold hover:bg-saffron transition-colors text-[13px]">
                            Login
                        </Link>
                    )}
                    <Link to={userInfo ? (userInfo.role === 'admin' ? '/admin/dashboard' : '/profile') : '/login'} className="text-charcoal hover:text-saffron flex flex-col items-center">
                        <User size={22} strokeWidth={2.5} />
                        <span className="text-[13px] mt-1 font-bold hidden sm:block">{userInfo ? 'Profile' : 'Guest'}</span>
                    </Link>
                    <Link to="/wishlist" className="text-charcoal hover:text-saffron flex flex-col items-center">
                        <Heart size={22} strokeWidth={2.5} />
                        <span className="text-[13px] mt-1 font-bold hidden sm:block">Wishlist</span>
                    </Link>
                    <Link to="/cart" className="text-charcoal hover:text-saffron flex flex-col items-center relative">
                        <div className="relative">
                            <ShoppingCart size={22} strokeWidth={2.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-saffron text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[13px] mt-1 font-bold hidden sm:block">Cart</span>
                    </Link>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center justify-center gap-8 py-3 text-sm font-bold text-maroon">
                        <li><Link to="/" className="hover:text-saffron">Home</Link></li>
                        <li><Link to="/shop" className="hover:text-saffron">Shop All</Link></li>
                        {categories.slice(0, 4).map(category => (
                            <li key={category._id}>
                                <Link to={`/shop?category=${category._id}`} className="hover:text-saffron">
                                    {category.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-4 space-y-4">
                        <form onSubmit={searchSubmitHandler} className="flex relative">
                            <input 
                                type="text" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Search products..." 
                                className="w-full border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron text-sm"
                            />
                            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-saffron">
                                <Search size={18} />
                            </button>
                        </form>
                        <ul className="flex flex-col gap-3 font-bold text-maroon">
                            <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-saffron">Home</Link></li>
                            <li><Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-saffron">Shop All</Link></li>
                            {categories.slice(0, 4).map(category => (
                                <li key={category._id}>
                                    <Link to={`/shop?category=${category._id}`} onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-saffron">
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-3">
                                {userInfo ? (
                                    <>
                                        <Link to={userInfo.role === 'admin' ? '/admin/dashboard' : '/profile'} onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-saffron">My Profile</Link>
                                        <button onClick={() => { logoutHandler(); setIsMobileMenuOpen(false); }} className="block w-full text-left text-red-600 hover:text-red-700">Logout</button>
                                    </>
                                ) : (
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-saffron">Login / Register</Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
