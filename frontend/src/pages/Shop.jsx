import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Parse selected filters from URL
    const categoryParam = searchParams.get('category');
    const keywordParam = searchParams.get('keyword');
    const selectedCategories = categoryParam ? categoryParam.split(',') : [];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/api/categories');
                setCategories(data);
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Construct URL with filters
                let url = '/api/products?pageNumber=1&pageSize=50';
                if (categoryParam) {
                    url += `&category=${categoryParam}`;
                }
                if (keywordParam) {
                    url += `&keyword=${keywordParam}`;
                }
                
                const { data } = await api.get(url);
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryParam, keywordParam]);

    const handleCategoryChange = (categoryId) => {
        let newCategories = [...selectedCategories];
        if (newCategories.includes(categoryId)) {
            newCategories = newCategories.filter(id => id !== categoryId);
        } else {
            newCategories.push(categoryId);
        }

        if (newCategories.length > 0) {
            searchParams.set('category', newCategories.join(','));
        } else {
            searchParams.delete('category');
        }
        setSearchParams(searchParams);
    };

    if (loading && products.length === 0) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-hindi text-maroon font-bold mb-8">
                {keywordParam ? `Search results for "${keywordParam}"` : "Shop All Products"}
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="font-bold text-lg mb-4 text-charcoal border-b pb-2">Filters</h2>
                        <div className="mb-6">
                            <h3 className="font-medium text-sm mb-3">Categories</h3>
                            <ul className="space-y-2 text-sm text-gray-600 max-h-96 overflow-y-auto pr-2">
                                {categories.map(c => (
                                    <li key={c._id}>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="accent-saffron w-4 h-4 cursor-pointer"
                                                checked={selectedCategories.includes(c._id)}
                                                onChange={() => handleCategoryChange(c._id)}
                                            /> 
                                            {c.name}
                                        </label>
                                    </li>
                                ))}
                                {categories.length === 0 && <p className="text-gray-400">No categories found.</p>}
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading && products.length > 0 && <div className="text-center py-4 text-gray-500">Updating...</div>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.length === 0 ? (
                            <p className="col-span-full text-center py-10 text-gray-500 text-lg">No products found matching your filters.</p>
                        ) : (
                            products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
