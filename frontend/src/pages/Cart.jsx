import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag } from 'lucide-react';
import { addToCart, removeFromCart } from '../features/cartSlice';
import PriceDetails from '../components/PriceDetails';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const { 
        cartItems, 
        itemsPrice, 
        mrpPrice, 
        discountPrice, 
        shippingPrice, 
        taxPrice, 
        totalPrice, 
        totalSavings 
    } = cart;

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        if (userInfo) {
            navigate('/shipping');
        } else {
            navigate('/login?redirect=/shipping');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-hindi text-charcoal font-bold mb-8">Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Looks like you haven't added any puja samagri yet.</p>
                    <Link to="/shop" className="bg-saffron text-white px-6 py-2 rounded font-medium hover:bg-orange-600 transition-colors">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row items-center p-4 sm:p-6 border-b border-gray-100 last:border-b-0 gap-4 sm:gap-6">
                                    <img 
                                        src={item.images[0]?.url ? (item.images[0].url.startsWith('/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.images[0].url}` : item.images[0].url) : 'https://via.placeholder.com/150?text=No+Image'} 
                                        alt={item.name} 
                                        className="w-24 h-24 object-cover rounded bg-gray-50"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                    />
                                    <div className="flex-1 text-center sm:text-left">
                                        <Link to={`/product/${item.slug}`} className="font-medium text-charcoal hover:text-saffron text-lg">
                                            {item.name}
                                        </Link>
                                        <div className="text-maroon font-bold mt-1 flex items-center gap-2 flex-wrap">
                                            <span>₹{item.price}</span>
                                            {item.gstPercent !== undefined && (
                                                <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-normal">
                                                    GST: {item.gstPercent}%
                                                </span>
                                            )}
                                            {Number(item.shippingCharge) > 0 ? (
                                                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-normal">
                                                    Shipping: ₹{item.shippingCharge}
                                                </span>
                                            ) : (
                                                <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-normal">
                                                    Free Shipping
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <select 
                                            value={item.qty}
                                            onChange={(e) => dispatch(addToCart({ ...item, qty: Number(e.target.value) }))}
                                            className="border border-gray-300 rounded p-1 focus:outline-none"
                                        >
                                            {[...Array(item.stock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => removeFromCartHandler(item._id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Details */}
                    <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                        <div className="sticky top-24">
                            <PriceDetails
                                itemsPrice={itemsPrice}
                                mrpPrice={mrpPrice}
                                discountPrice={discountPrice}
                                shippingPrice={shippingPrice}
                                taxPrice={taxPrice}
                                totalPrice={totalPrice}
                                totalSavings={totalSavings}
                                buttonText="Proceed to Checkout"
                                onButtonClick={checkoutHandler}
                                buttonDisabled={cartItems.length === 0}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
