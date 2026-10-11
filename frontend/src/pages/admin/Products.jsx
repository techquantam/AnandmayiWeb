import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/api/products?pageSize=1000');
                setProducts(data.products || []);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch products", error);
                toast.error("Failed to fetch products");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            try {
                await api.delete(`/api/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted successfully');
            } catch (error) {
                console.error('Delete product error:', error);
                const errorMsg = error.response?.data?.message || 'Failed to delete product';
                toast.error(errorMsg);
            }
        }
    };

    const filteredProducts = products.filter((product) => {
        const query = searchTerm.toLowerCase().trim();
        if (!query) return true;
        const nameMatch = product.name?.toLowerCase().includes(query);
        const categoryMatch = product.category?.name?.toLowerCase().includes(query);
        const idMatch = product._id?.toLowerCase().includes(query);
        const skuMatch = product.sku?.toLowerCase().includes(query);
        const brandMatch = product.brand?.toLowerCase().includes(query);
        return nameMatch || categoryMatch || idMatch || skuMatch || brandMatch;
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {searchTerm ? `Found ${filteredProducts.length} of ${products.length} products` : `Total ${products.length} products`}
                    </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search name, SKU, category..."
                            className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-saffron shadow-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                                title="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <Link to="/admin/product/new" className="bg-saffron text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm whitespace-nowrap text-sm font-medium">
                        <Plus size={18} />
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading products...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm">
                                    <th className="px-6 py-3 font-medium">ID</th>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Price</th>
                                    <th className="px-6 py-3 font-medium">GST (%)</th>
                                    <th className="px-6 py-3 font-medium">Shipping</th>
                                    <th className="px-6 py-3 font-medium">Category</th>
                                    <th className="px-6 py-3 font-medium">Stock</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-xs">{product._id.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-3">
                                                <img src={product.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={product.name} className="w-10 h-10 rounded object-cover" />
                                                <span title={product.name} className="line-clamp-1 max-w-[200px]">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">₹{product.price}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                                {product.gstPercent !== undefined ? `${product.gstPercent}%` : '0%'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                Number(product.shippingCharge) > 0
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                            }`}>
                                                {Number(product.shippingCharge) > 0 ? `₹${product.shippingCharge}` : 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{product.category?.name || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link to={`/admin/product/${product._id}/edit`} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit Product">
                                                    <Edit size={18} />
                                                </Link>
                                                <button onClick={() => deleteHandler(product._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Product">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                                            {searchTerm ? (
                                                <div>
                                                    <p className="font-medium text-gray-700">No products found</p>
                                                    <p className="text-xs text-gray-400 mt-1">No products match "{searchTerm}"</p>
                                                </div>
                                            ) : (
                                                'No products available.'
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProducts;
