import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload, Percent, Truck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [mrp, setMrp] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [stock, setStock] = useState(0);
    const [gstPercent, setGstPercent] = useState(0);
    const [shippingCharge, setShippingCharge] = useState(0);
    const [description, setDescription] = useState('');
    
    // Feature flags
    const [isFeatured, setIsFeatured] = useState(false);
    const [isFlashSale, setIsFlashSale] = useState(false);
    const [isBestSeller, setIsBestSeller] = useState(false);
    const [isNewArrival, setIsNewArrival] = useState(false);
    
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(isEditMode);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/api/categories');
                setCategories(data);
                if (!isEditMode && data.length > 0) {
                    setCategory(data[0]._id);
                }
            } catch (error) {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();

        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await api.get(`/api/products/${id}`);
                    setName(data.name);
                    setPrice(data.price);
                    setMrp(data.mrp);
                    setImage(data.images?.[0]?.url || '');
                    setBrand(data.brand);
                    setCategory(data.category?._id || data.category);
                    setStock(data.stock);
                    setGstPercent(data.gstPercent !== undefined ? data.gstPercent : 0);
                    setShippingCharge(data.shippingCharge !== undefined ? data.shippingCharge : 0);
                    setDescription(data.description);
                    setIsFeatured(data.isFeatured || false);
                    setIsFlashSale(data.isFlashSale || false);
                    setIsBestSeller(data.isBestSeller || false);
                    setIsNewArrival(data.isNewArrival || false);
                    setLoading(false);
                } catch (error) {
                    console.error("Failed to fetch product");
                    toast.error("Failed to fetch product details");
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        const productData = {
            name,
            price,
            mrp,
            images: [{ url: image }],
            brand,
            category,
            stock: Number(stock),
            gstPercent: Number(gstPercent),
            shippingCharge: Number(shippingCharge),
            description,
            isFeatured,
            isFlashSale,
            isBestSeller,
            isNewArrival
        };

        try {
            if (isEditMode) {
                await api.put(`/api/products/${id}`, productData);
                toast.success('Product updated successfully');
            } else {
                await api.post('/api/products', productData);
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Save Error:', error.response || error);
            const errorMsg = error.response?.data?.message || error.response?.data || 'Failed to save product';
            toast.error(`Save failed: ${errorMsg}`);
            setLoading(false);
        }
    };

    const deleteProductHandler = async () => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            setLoading(true);
            try {
                await api.delete(`/api/products/${id}`);
                toast.success('Product deleted successfully');
                navigate('/admin/products');
            } catch (error) {
                console.error('Delete Error:', error);
                const errorMsg = error.response?.data?.message || 'Failed to delete product';
                toast.error(`Delete failed: ${errorMsg}`);
                setLoading(false);
            }
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await api.post('/api/upload', formData);
            setImage(data.url);
            setUploading(false);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload Error:', error.response || error);
            setUploading(false);
            const errorMsg = error.response?.data?.message || error.response?.data || 'Image upload failed';
            toast.error(`Upload failed: ${errorMsg}`);
        }
    };

    if (loading && isEditMode) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/admin/products" className="p-2 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                placeholder="Enter product name"
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={mrp}
                                    onChange={(e) => setMrp(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <input
                                type="text"
                                required
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                required
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron bg-white"
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={stock}
                                onChange={(e) => setStock(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                            />
                        </div>
                    </div>

                    <div className="bg-amber-50/50 p-5 rounded-lg border border-amber-200/70 space-y-4">
                        <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                <Percent size={18} className="text-saffron" />
                                GST & Shipping Settings (Admin)
                            </h3>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                                Per Product
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                            {/* GST Rate */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    GST Rate (%)
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            value={gstPercent}
                                            onChange={(e) => setGstPercent(e.target.value === '' ? '' : Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded px-4 py-2 pr-8 focus:outline-none focus:border-saffron bg-white"
                                            placeholder="0"
                                        />
                                        <span className="absolute right-3 top-2.5 text-gray-400 font-medium text-sm">%</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    <span className="text-xs text-gray-500 mr-1 self-center">Quick Set:</span>
                                    {[0, 5, 12, 18, 28].map((rate) => (
                                        <button
                                            key={rate}
                                            type="button"
                                            onClick={() => setGstPercent(rate)}
                                            className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                                                Number(gstPercent) === rate
                                                    ? 'bg-saffron text-white border-saffron font-medium'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                            }`}
                                        >
                                            {rate === 0 ? '0% (Exempt)' : `${rate}%`}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Pooja samagri/hawan items may be 0% or 5%, manufactured goods 12% or 18%.
                                </p>
                            </div>

                            {/* Shipping Charge */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                    <Truck size={16} className="text-saffron" />
                                    Shipping Charge (₹)
                                </label>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-2.5 text-gray-400 font-medium text-sm">₹</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={shippingCharge}
                                            onChange={(e) => setShippingCharge(e.target.value === '' ? '' : Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded pl-8 pr-4 py-2 focus:outline-none focus:border-saffron bg-white"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    <span className="text-xs text-gray-500 mr-1 self-center">Quick Set:</span>
                                    {[0, 40, 50, 70, 100].map((amt) => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setShippingCharge(amt)}
                                            className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                                                Number(shippingCharge) === amt
                                                    ? 'bg-saffron text-white border-saffron font-medium'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                            }`}
                                        >
                                            {amt === 0 ? 'Free Shipping (₹0)' : `₹${amt}`}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Set 0 for Free Shipping, or custom amount for heavy/special delivery.
                                </p>
                            </div>
                        </div>

                        {/* Live calculation banner */}
                        <div className="bg-white/80 rounded p-2.5 border border-amber-200/80 text-xs text-gray-700 flex flex-wrap justify-between items-center gap-2">
                            <span>
                                💡 <strong>Price:</strong> ₹{price || 0}
                            </span>
                            <span>
                                <strong>GST ({gstPercent || 0}%):</strong> ₹{(((Number(price) || 0) * (Number(gstPercent) || 0)) / 100).toFixed(2)}
                            </span>
                            <span>
                                <strong>Shipping:</strong> {Number(shippingCharge) > 0 ? `₹${shippingCharge}` : <span className="text-green-700 font-semibold">Free</span>}
                            </span>
                            <span className="font-semibold text-maroon">
                                Estimated Total / Unit: ₹{(
                                    (Number(price) || 0) +
                                    (((Number(price) || 0) * (Number(gstPercent) || 0)) / 100) +
                                    (Number(shippingCharge) || 0)
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        {image && (
                            <div className="mb-2">
                                <img src={image} alt="Preview" className="w-24 h-24 object-cover rounded border border-gray-200" />
                            </div>
                        )}
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                placeholder="Enter image URL"
                            />
                            <label className="cursor-pointer bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 flex items-center gap-2">
                                <Upload size={18} />
                                {uploading ? '...' : 'Upload'}
                                <input type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-3">
                        <h3 className="text-sm font-medium text-gray-800 border-b pb-2">Featuring Options</h3>
                        <div className="flex flex-wrap gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isFlashSale} onChange={(e) => setIsFlashSale(e.target.checked)} className="w-4 h-4 text-saffron rounded" />
                                <span className="text-sm text-gray-700">Flash Sale</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} className="w-4 h-4 text-saffron rounded" />
                                <span className="text-sm text-gray-700">Best Seller</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="w-4 h-4 text-saffron rounded" />
                                <span className="text-sm text-gray-700">New Arrival</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 text-saffron rounded" />
                                <span className="text-sm text-gray-700">General Featured</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            rows="4"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron resize-y"
                        ></textarea>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        {isEditMode ? (
                            <button 
                                type="button" 
                                onClick={deleteProductHandler}
                                disabled={loading}
                                className="bg-red-50 text-red-600 border border-red-200 px-5 py-2.5 rounded font-medium flex items-center gap-2 hover:bg-red-100 transition-colors disabled:opacity-70"
                            >
                                <Trash2 size={18} />
                                Delete Product
                            </button>
                        ) : <div />}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-saffron text-white px-8 py-2.5 rounded font-medium flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-70"
                        >
                            <Save size={20} />
                            {loading ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEdit;
