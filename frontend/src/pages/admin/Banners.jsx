import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Upload, Search, Package, Link as LinkIcon, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState('');
    
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [targetType, setTargetType] = useState('product'); // 'product' or 'custom'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productSearch, setProductSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchDropdownRef = useRef(null);

    const [link, setLink] = useState('');
    const [image, setImage] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchBanners = async () => {
        try {
            const { data } = await api.get('/api/banners/admin');
            setBanners(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch banners");
            setLoading(false);
        }
    };

    // Search products when user types in productSearch
    useEffect(() => {
        if (!showModal || targetType !== 'product') return;

        const timer = setTimeout(async () => {
            try {
                setSearching(true);
                const query = productSearch.trim() ? `?keyword=${encodeURIComponent(productSearch.trim())}&pageSize=8` : '?pageSize=8';
                const { data } = await api.get(`/api/products${query}`);
                setSearchResults(data.products || []);
                setSearching(false);
            } catch (err) {
                console.error('Failed to search products:', err);
                setSearching(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [productSearch, showModal, targetType]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await api.delete(`/api/banners/${id}`);
                setBanners(banners.filter(b => b._id !== id));
                toast.success('Banner deleted');
            } catch (error) {
                toast.error('Failed to delete banner');
            }
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
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

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const bannerData = {
                title,
                subtitle,
                product: targetType === 'product' && selectedProduct ? selectedProduct._id : null,
                link: targetType === 'product' && selectedProduct 
                    ? `/product/${selectedProduct.slug || selectedProduct._id}` 
                    : (link || ''),
                image: { url: image },
                isActive
            };
            
            if (editMode) {
                await api.put(`/api/banners/${currentId}`, bannerData);
                toast.success('Banner updated');
            } else {
                await api.post('/api/banners', bannerData);
                toast.success('Banner created');
            }
            setShowModal(false);
            fetchBanners();
        } catch (error) {
            toast.error('Failed to save banner');
        }
    };

    const openEditModal = (banner) => {
        setEditMode(true);
        setCurrentId(banner._id);
        setTitle(banner.title);
        setSubtitle(banner.subtitle || '');
        setImage(banner.image?.url || '');
        setIsActive(banner.isActive);
        
        if (banner.product) {
            setTargetType('product');
            setSelectedProduct(banner.product);
            setLink(banner.link || `/product/${banner.product.slug}`);
        } else if (banner.link) {
            setTargetType('custom');
            setSelectedProduct(null);
            setLink(banner.link);
        } else {
            setTargetType('product');
            setSelectedProduct(null);
            setLink('');
        }

        setProductSearch('');
        setShowDropdown(false);
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditMode(false);
        setCurrentId('');
        setTitle('');
        setSubtitle('');
        setLink('');
        setImage('');
        setIsActive(true);
        setTargetType('product');
        setSelectedProduct(null);
        setProductSearch('');
        setShowDropdown(false);
        setShowModal(true);
    };

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setLink(`/product/${product.slug || product._id}`);
        setShowDropdown(false);
        setProductSearch('');
    };

    const handleClearSelectedProduct = () => {
        setSelectedProduct(null);
        setLink('');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Home Banners</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage carousel banners and link them to products or custom pages</p>
                </div>
                <button 
                    onClick={openAddModal}
                    className="bg-saffron text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm font-medium"
                >
                    <Plus size={18} />
                    Add Banner
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading banners...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-3.5 font-semibold">Image</th>
                                    <th className="px-6 py-3.5 font-semibold">Banner Info</th>
                                    <th className="px-6 py-3.5 font-semibold">Shop Now Target</th>
                                    <th className="px-6 py-3.5 font-semibold">Status</th>
                                    <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                {banners.map((banner) => (
                                    <tr key={banner._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img 
                                                src={banner.image?.url} 
                                                alt={banner.title} 
                                                className="w-28 h-14 object-cover rounded-md border shadow-2xs" 
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{banner.title}</div>
                                            {banner.subtitle && (
                                                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{banner.subtitle}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {banner.product ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                                                        <Package size={13} className="text-amber-600 flex-shrink-0" />
                                                        <span className="font-semibold max-w-[200px] truncate">{banner.product.name}</span>
                                                        <span className="text-amber-700 font-bold ml-1">₹{banner.product.price}</span>
                                                    </span>
                                                </div>
                                            ) : banner.link ? (
                                                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-mono bg-blue-50 px-2.5 py-1 rounded border border-blue-100 w-fit max-w-[220px] truncate">
                                                    <LinkIcon size={12} className="flex-shrink-0" />
                                                    <span className="truncate">{banner.link}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Default (Shop All)</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {banner.isActive ? (
                                                <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                                                    <CheckCircle size={14} className="mr-1 text-green-600" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                                                    <XCircle size={14} className="mr-1 text-red-500" /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openEditModal(banner)} 
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Edit Banner"
                                                >
                                                    <Edit size={17} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteHandler(banner._id)} 
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete Banner"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{editMode ? 'Edit Banner' : 'Add New Banner'}</h2>
                                <p className="text-xs text-gray-500">Configure banner image and destination link</p>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitHandler} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Banner Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Dhan Varsha potali"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Subtitle / Caption (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Lakshmi prapti hetu tijori me sthapit karein"
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron"
                                />
                            </div>

                            {/* Destination / Shop Now Linking Options */}
                            <div className="border border-amber-200/80 bg-amber-50/40 rounded-xl p-4 space-y-3">
                                <label className="block text-sm font-semibold text-gray-800">
                                    Shop Now Button Destination
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                        <input
                                            type="radio"
                                            name="targetType"
                                            value="product"
                                            checked={targetType === 'product'}
                                            onChange={() => setTargetType('product')}
                                            className="text-saffron focus:ring-saffron w-4 h-4"
                                        />
                                        <span>Specific Product (Recommended)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                        <input
                                            type="radio"
                                            name="targetType"
                                            value="custom"
                                            checked={targetType === 'custom'}
                                            onChange={() => setTargetType('custom')}
                                            className="text-saffron focus:ring-saffron w-4 h-4"
                                        />
                                        <span>Custom URL</span>
                                    </label>
                                </div>

                                {targetType === 'product' ? (
                                    <div className="relative pt-1" ref={searchDropdownRef}>
                                        {/* If a product is currently selected */}
                                        {selectedProduct ? (
                                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-300 shadow-2xs">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <img 
                                                        src={selectedProduct.images?.[0]?.url || 'https://via.placeholder.com/60'} 
                                                        alt={selectedProduct.name}
                                                        className="w-12 h-12 object-cover rounded-md border border-gray-100 flex-shrink-0"
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-sm text-gray-900 truncate">
                                                            {selectedProduct.name}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                            <span className="font-bold text-amber-600">₹{selectedProduct.price}</span>
                                                            <span className="text-gray-300">•</span>
                                                            <span className="text-gray-400 font-mono truncate">/product/{selectedProduct.slug || selectedProduct._id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleClearSelectedProduct}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors ml-2 flex-shrink-0"
                                                    title="Change Product"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            /* Search Input */
                                            <div className="relative">
                                                <div className="relative">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={productSearch}
                                                        onChange={(e) => {
                                                            setProductSearch(e.target.value);
                                                            setShowDropdown(true);
                                                        }}
                                                        onFocus={() => setShowDropdown(true)}
                                                        placeholder="Search product by name to link..."
                                                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron"
                                                    />
                                                    {searching && (
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
                                                            Searching...
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Dropdown Results */}
                                                {showDropdown && (
                                                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto divide-y divide-gray-100">
                                                        {searchResults.length > 0 ? (
                                                            searchResults.map((prod) => (
                                                                <button
                                                                    key={prod._id}
                                                                    type="button"
                                                                    onClick={() => handleSelectProduct(prod)}
                                                                    className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-amber-50/60 transition-colors cursor-pointer"
                                                                >
                                                                    <img 
                                                                        src={prod.images?.[0]?.url || 'https://via.placeholder.com/40'} 
                                                                        alt={prod.name}
                                                                        className="w-10 h-10 object-cover rounded border border-gray-100 flex-shrink-0"
                                                                    />
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="text-sm font-medium text-gray-800 truncate">
                                                                            {prod.name}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 flex items-center gap-2">
                                                                            <span className="font-bold text-amber-600">₹{prod.price}</span>
                                                                            {prod.category?.name && (
                                                                                <span className="text-gray-400 truncate">({prod.category.name})</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-xs font-medium text-saffron bg-orange-50 px-2 py-0.5 rounded border border-orange-200 flex-shrink-0">
                                                                        Select
                                                                    </span>
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="p-4 text-center text-xs text-gray-500">
                                                                {searching ? 'Loading products...' : 'No products found. Try typing another keyword.'}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-[11px] text-gray-500 mt-1.5">
                                            Clicking "Shop Now" on this banner will take the user directly to the selected product page.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="text"
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            placeholder="e.g. /shop or /shop?category=puja-samagri"
                                            className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron"
                                        />
                                        <p className="text-[11px] text-gray-500 mt-1">
                                            Enter internal path (e.g. /shop) or external URL.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Banner Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Banner Image <span className="text-red-500">*</span>
                                </label>
                                {image && (
                                    <div className="mb-2.5 relative group">
                                        <img 
                                            src={image} 
                                            alt="Preview" 
                                            className="w-full h-36 object-cover rounded-lg border shadow-2xs" 
                                        />
                                    </div>
                                )}
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        required
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron"
                                        placeholder="Image URL or upload below"
                                    />
                                    <label className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-sm font-medium transition-colors">
                                        <Upload size={16} />
                                        {uploading ? 'Uploading...' : 'Upload'}
                                        <input type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center gap-2 pt-1">
                                <input 
                                    type="checkbox" 
                                    id="isActive"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4 text-saffron accent-saffron rounded"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Active (Display on Homepage Slider)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={uploading} 
                                    className="px-5 py-2 bg-saffron text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium text-sm disabled:opacity-50"
                                >
                                    {editMode ? 'Save Changes' : 'Create Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBanners;

