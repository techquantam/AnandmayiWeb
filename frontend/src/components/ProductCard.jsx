import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cartSlice';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);

    const addToCartHandler = (e) => {
        e.preventDefault(); // Prevent Link click if it's inside a Link or bubbling
        const existItem = cartItems.find((x) => x._id === product._id);
        const qty = existItem ? existItem.qty + 1 : 1;
        dispatch(addToCart({ ...product, qty }));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow group h-full flex flex-col">
            <Link to={`/product/${product.slug}`} className="block relative overflow-hidden aspect-square bg-gray-50">
                <img 
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/400?text=Product'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-saffron text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discount}% OFF
                    </span>
                )}
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product.slug}`} className="flex-grow">
                    <h3 className="font-medium text-charcoal hover:text-saffron transition-colors line-clamp-2 text-sm md:text-base">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-maroon font-bold md:text-lg">₹{product.price}</span>
                        {product.mrp > product.price && (
                            <span className="text-gray-400 text-xs line-through">₹{product.mrp}</span>
                        )}
                    </div>
                    <button 
                        onClick={addToCartHandler}
                        className="bg-white border border-saffron text-saffron hover:bg-saffron hover:text-white px-3 py-1 md:px-4 md:py-1.5 rounded font-medium text-xs md:text-sm transition-colors whitespace-nowrap"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
