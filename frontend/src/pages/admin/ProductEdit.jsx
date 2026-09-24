import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload } from 'lucide-react';
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
            stock,
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

                    <div className="flex justify-end pt-4 border-t border-gray-100">
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
