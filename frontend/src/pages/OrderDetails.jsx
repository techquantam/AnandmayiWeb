import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sdkReady, setSdkReady] = useState(false);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/api/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching order", error);
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    useEffect(() => {
        const addRazorpayScript = () => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };

        if (order && !order.isPaid && order.paymentMethod === 'Razorpay') {
            if (!window.Razorpay) {
                addRazorpayScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [order]);

    const paymentHandler = async () => {
        setPaying(true);
        try {
            // 0. Fetch config
            const { data: clientId } = await api.get('/api/config/razorpay');

            // 1. Create Razorpay order on backend
            const { data: rzpOrder } = await api.post(`/api/orders/${id}/pay`);

            // 2. Open Razorpay Checkout
            const options = {
                key: clientId,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                name: "Anandmayi Puja Bhandar",
                description: `Payment for Order ${id}`,
                order_id: rzpOrder.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const { data } = await api.post(`/api/orders/${id}/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        setOrder(data);
                        toast.success('Payment Successful!');
                    } catch (error) {
                        toast.error('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: order.user.name,
                    email: order.user.email,
                    contact: order.shippingAddress.phone,
                },
                theme: {
                    color: "#D32F2F" // Maroon
                }
            };
            const rzp = new window.Razorpay(options);
            
            rzp.on('payment.failed', function (response){
                toast.error(response.error.description);
            });

            rzp.open();
            setPaying(false);
        } catch (error) {
            toast.error("Failed to initiate payment");
            setPaying(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-16 text-center text-gray-500">Loading Order Details...</div>;
    }

    if (!order) {
        return <div className="container mx-auto px-4 py-16 text-center text-red-500">Order not found.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-charcoal">Order Details</h1>
                        <p className="text-sm text-gray-500 mt-1">Order ID: <span className="font-mono">{order._id}</span></p>
                    </div>
                    <Link to="/profile" className="text-saffron font-medium hover:underline text-sm">Back to Profile</Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Status Banners */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-4 justify-between">
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-700 mb-2">Payment Status</h3>
                                {order.isPaid ? (
                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded font-medium">
                                        <CheckCircle size={20} />
                                        Paid on {new Date(order.paidAt).toLocaleDateString()}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded font-medium">
                                        <AlertCircle size={20} />
                                        Not Paid
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-700 mb-2">Delivery Status</h3>
                                {order.isDelivered ? (
                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded font-medium">
                                        <CheckCircle size={20} />
                                        Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-orange-500 bg-orange-50 p-3 rounded font-medium">
                                        <AlertCircle size={20} />
                                        {order.orderStatus || 'Processing Order'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping details */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-charcoal mb-4 pb-2 border-b">Shipping Address</h2>
                            <p className="text-gray-700"><strong>Name: </strong> {order.shippingAddress.fullName || order.user.name}</p>
                            <p className="text-gray-700 mt-1">
                                <strong>Address: </strong> 
                                {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.state}, {order.shippingAddress.pincode}
                            </p>
                            <p className="text-gray-700 mt-1"><strong>Phone: </strong> {order.shippingAddress.phone}</p>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-charcoal mb-4 pb-2 border-b">Order Items</h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                            {item.image ? (
                                                <img 
                                                    src={item.image.startsWith('/') ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${item.image}` : item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover" 
                                                    referrerPolicy="no-referrer"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">Image</div>
                                            )}
                                        </div>
                                        <div className="flex-1 font-medium text-gray-800">
                                            {item.name}
                                        </div>
                                        <div className="text-gray-600 text-sm">
                                            {item.qty} x ₹{item.price} = <span className="font-bold text-maroon">₹{(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-charcoal mb-4 pb-2 border-b">Order Summary</h2>
                            
                            <div className="space-y-3 mb-4 text-gray-600 text-sm">
                                <div className="flex justify-between">
                                    <span>Items</span>
                                    <span>₹{order.itemsPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>₹{order.shippingPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>₹{order.taxPrice}</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-b py-3 mb-6">
                                <div className="flex justify-between font-bold text-lg text-charcoal">
                                    <span>Total</span>
                                    <span className="text-maroon">₹{order.totalPrice}</span>
                                </div>
                            </div>

                            {!order.isPaid && order.paymentMethod === 'Razorpay' && (
                                <div>
                                    {sdkReady ? (
                                        <button 
                                            onClick={paymentHandler}
                                            disabled={paying}
                                            className="w-full bg-saffron text-white py-3 rounded font-bold shadow-md hover:bg-orange-600 transition-colors disabled:opacity-70"
                                        >
                                            {paying ? 'Processing...' : 'Pay Now with Razorpay'}
                                        </button>
                                    ) : (
                                        <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded font-bold">
                                            Loading Payment Gateway...
                                        </button>
                                    )}
                                </div>
                            )}

                            {!order.isPaid && order.paymentMethod === 'COD' && (
                                <div className="text-center text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded">
                                    Payment to be collected on delivery.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
