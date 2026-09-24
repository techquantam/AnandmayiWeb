import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import api from '../services/api';
import { addToCart } from '../features/cartSlice';

const ProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${slug}`);
                setProduct(data);
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0].url);
                }
                setLoading(false);
            } catch (err) {
                setError('Product not found');
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        // Could add a toast notification here
        navigate('/cart');
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Product Images */}
                    <div className="w-full md:w-1/2">
                        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-4">
                            <img 
                                src={activeImage || 'https://via.placeholder.com/600?text=Product'} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images?.map((img, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setActiveImage(img.url)}
                                    className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${activeImage === img.url ? 'border-saffron' : 'border-transparent'}`}
                                >
                                    <img src={img.url} alt={`${product.name} ${index}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        {product.brand && (
                            <span className="text-sm text-saffron font-semibold uppercase tracking-wider mb-2">
                                {product.brand}
                            </span>
                        )}
                        <h1 className="text-2xl md:text-3xl font-hindi text-charcoal font-bold mb-4">
                            {product.name}
                        </h1>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center text-gold">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < Math.round(product.rating) ? "currentColor" : "none"} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.numReviews} Reviews)</span>
                        </div>

                        <div className="flex items-end gap-4 mb-6">
                            <span className="text-3xl font-bold text-maroon">₹{product.price}</span>
                            {product.mrp > product.price && (
                                <>
                                    <span className="text-lg text-gray-400 line-through mb-1">₹{product.mrp}</span>
                                    <span className="text-sm font-bold text-green-600 mb-1">
                                        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.shortDescription || product.description}
                        </p>

                        <div className="mb-8 pb-8 border-b border-gray-100">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="font-medium text-gray-700">Quantity:</span>
                                <div className="flex items-center border border-gray-300 rounded">
                                    <button 
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        max={product.stock}
                                        value={qty} 
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        className="w-12 text-center py-1 border-x border-gray-300 focus:outline-none"
                                        readOnly
                                    />
                                    <button 
                                        onClick={() => setQty(Math.min(product.stock, qty + 1))}
                                        className="px-3 py-1 hover:bg-gray-100 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                </span>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    onClick={addToCartHandler}
                                    disabled={product.stock === 0}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded font-medium transition-colors ${
                                        product.stock === 0 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-saffron text-white hover:bg-orange-600 shadow-md'
                                    }`}
                                >
                                    <ShoppingCart size={20} />
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <button className="p-3 border border-gray-300 rounded hover:bg-gray-50 hover:text-saffron transition-colors">
                                    <Heart size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-saffron" size={20} />
                                <span>100% Authentic Products</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Truck className="text-saffron" size={20} />
                                <span>Fast Delivery</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <RotateCcw className="text-saffron" size={20} />
                                <span>Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Tabs */}
                <div className="mt-16">
                    <h2 className="text-xl font-bold border-b pb-2 mb-4 text-charcoal">Product Description</h2>
                    <div className="prose max-w-none text-gray-600">
                        {product.description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
