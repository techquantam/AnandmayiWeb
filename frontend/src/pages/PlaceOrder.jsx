import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartItems } from '../features/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import api from '../services/api';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        }
    }, [cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            const orderItemsFormatted = cart.cartItems.map((item) => ({
                name: item.name,
                qty: item.qty,
                image: item.images && item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/50',
                price: item.price,
                product: item._id || item.product,
            }));

            const { data } = await api.post('/api/orders', {
                orderItems: orderItemsFormatted,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            });

            dispatch(clearCartItems());

            if (cart.paymentMethod === 'Razorpay') {
                navigate(`/order/${data._id}`);
            } else {
                // Handle COD
                navigate(`/order/${data._id}`);
            }
        } catch (error) {
            console.error('Order creation failed:', error);
            alert('Failed to place order.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <CheckoutSteps step1 step2 />
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Details */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-charcoal mb-4 pb-2 border-b">Shipping</h2>
                        <p className="text-gray-700">
                            <strong>Name: </strong> {cart.shippingAddress.fullName}
                        </p>
                        <p className="text-gray-700">
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.state}, {cart.shippingAddress.pincode}
                        </p>
                        <p className="text-gray-700">
                            <strong>Phone: </strong> {cart.shippingAddress.phone}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-charcoal mb-4 pb-2 border-b">Payment Method</h2>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="paymentMethod" value="Razorpay" checked readOnly className="accent-saffron" />
                                <span>Razorpay (Online)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-gray-400">
                                <input type="radio" name="paymentMethod" value="COD" disabled className="accent-saffron" />
                                <span>Cash on Delivery (Not available)</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-charcoal mb-4 pb-2 border-b">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div className="space-y-4">
                                {cart.cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <img src={item.images[0]?.url || 'https://via.placeholder.com/50'} alt={item.name} className="w-16 h-16 rounded object-cover" />
                                        <Link to={`/product/${item.slug}`} className="flex-1 font-medium hover:text-saffron">
                                            {item.name}
                                        </Link>
                                        <div className="text-gray-600">
                                            {item.qty} x ₹{item.price} = <span className="font-bold text-maroon">₹{(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-charcoal mb-4 pb-2 border-b">Order Summary</h2>
                        
                        <div className="space-y-3 mb-4 text-gray-600">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>₹{cart.itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{cart.shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹{cart.taxPrice}</span>
                            </div>
                        </div>
                        
                        <div className="border-t pt-3 mb-6">
                            <div className="flex justify-between font-bold text-lg text-charcoal">
                                <span>Total</span>
                                <span className="text-maroon">₹{cart.totalPrice}</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={placeOrderHandler}
                            disabled={cart.cartItems === 0}
                            className="w-full bg-saffron text-white py-3 rounded font-bold shadow-md hover:bg-orange-600 transition-colors"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
