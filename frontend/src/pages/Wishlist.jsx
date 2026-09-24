import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    return (
        <div className="bg-gray-50 min-h-[70vh] py-16 flex items-center justify-center">
            <div className="text-center px-4 max-w-md">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-400">
                    <Heart size={48} className="fill-current" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Wishlist</h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Save items you love in your wishlist. Review them anytime and easily move them to your cart when you're ready to buy.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                    <p className="text-sm text-gray-500 mb-4">This feature is coming soon in the next update!</p>
                </div>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-saffron text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-orange-600 transition-colors">
                    <Search size={20} />
                    Explore Products
                </Link>
            </div>
        </div>
    );
};

export default Wishlist;
