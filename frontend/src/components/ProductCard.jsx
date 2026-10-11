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
                {product.mrp > product.price && (
                    <span className="absolute top-2 left-2 bg-[#CC0C39] text-white text-[11px] font-semibold px-1.5 py-0.5 rounded shadow-sm">
                        -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                    </span>
                )}
            </Link>
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/product/${product.slug}`} className="flex-grow">
                    <h3 className="font-medium text-charcoal hover:text-saffron transition-colors line-clamp-2 text-sm md:text-base">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-auto pt-3 flex items-end justify-between gap-2">
                    <div className="flex flex-col">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            {product.mrp > product.price && (
                                <span className="text-base font-light text-[#CC0C39] tracking-tight">
                                    -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                                </span>
                            )}
                            <div className="flex items-start text-gray-900">
                                <span className="text-[11px] font-normal mt-0.5 mr-0.5">₹</span>
                                <span className="font-semibold text-base md:text-lg tracking-tight">
                                    {Number(product.price).toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>

                        {product.mrp > product.price && (
                            <div className="text-[11px] text-[#565959] flex items-center gap-1 font-normal">
                                <span>M.R.P.:</span>
                                <span className="line-through">₹{Number(product.mrp).toLocaleString('en-IN')}</span>
                            </div>
                        )}

                        <span className={`text-[10px] mt-0.5 ${Number(product.shippingCharge) > 0 ? 'text-gray-500' : 'text-emerald-700 font-medium'}`}>
                            {Number(product.shippingCharge) > 0 ? `+₹${product.shippingCharge} delivery` : 'Free delivery'}
                        </span>
                    </div>
                    <button 
                        onClick={addToCartHandler}
                        className="bg-white border border-saffron text-saffron hover:bg-saffron hover:text-white px-3 py-1 md:px-4 md:py-1.5 rounded font-medium text-xs md:text-sm transition-colors whitespace-nowrap self-end"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
