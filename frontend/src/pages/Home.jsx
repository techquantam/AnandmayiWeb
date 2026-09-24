import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [flashSale, setFlashSale] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Fetch Banners
                const { data: bannersData } = await api.get('/api/banners');
                setBanners(bannersData);

                // Fetch Categories
                const { data: categoriesData } = await api.get('/api/categories');
                setCategories(categoriesData);

                // Fetch Products for different sections (we can do 3 concurrent requests or just one and filter locally. Since we have standard /api/products, let's fetch all and filter locally for simplicity in this demo, but ideally backend handles it)
                const { data: productsData } = await api.get('/api/products?pageNumber=1&pageSize=50');
                const products = productsData.products || [];

                setFlashSale(products.filter(p => p.isFlashSale));
                setBestSellers(products.filter(p => p.isBestSeller));
                setNewArrivals(products.filter(p => p.isNewArrival));
                
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch home data:', error);
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-maroon font-medium">Loading...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero Section / Banner Slider */}
            {banners.length > 0 ? (
                <section className="container mx-auto px-2 md:px-4 py-4 md:py-6">
                    <div className="w-full h-[250px] md:h-[350px] lg:h-[450px] rounded-xl md:rounded-2xl overflow-hidden shadow-lg bg-gray-100 relative">
                        <Swiper
                            spaceBetween={0}
                            centeredSlides={true}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={true}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="w-full h-full"
                        >
                            {banners.map(banner => (
                                <SwiperSlide key={banner._id}>
                                    <div className="relative w-full h-full">
                                        <img src={banner.image?.url} alt={banner.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="text-center text-white px-4">
                                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-hindi font-bold mb-3 md:mb-4 drop-shadow-md">
                                                    {banner.title}
                                                </h2>
                                                {banner.subtitle && (
                                                    <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-8 drop-shadow-md">
                                                        {banner.subtitle}
                                                    </p>
                                                )}
                                                <Link to={banner.link || '/shop'} className="bg-saffron hover:bg-orange-600 text-white font-medium py-2 md:py-3 px-6 md:px-8 rounded shadow-md transition duration-300 inline-block text-sm md:text-base">
                                                    Shop Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
            ) : (
                <section className="bg-ivory py-20 relative overflow-hidden">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-hindi text-maroon font-bold mb-6">
                            हर पूजा की सामग्री, एक ही स्थान पर।
                        </h1>
                        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                            शुद्ध, विश्वसनीय और आवश्यक पूजा सामग्री अब आसानी से ऑनलाइन ऑर्डर करें।
                        </p>
                        <Link to="/shop" className="bg-saffron hover:bg-orange-600 text-white font-medium py-3 px-8 rounded shadow-md transition duration-300">
                            Shop Now
                        </Link>
                    </div>
                </section>
            )}

            {/* Categories Section */}
            {categories.length > 0 && (
                <section className="container mx-auto px-4 py-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Shop By Category</h2>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                        {categories.map((category) => (
                            <Link key={category._id} to={`/shop?category=${category._id}`} className="flex flex-col items-center group">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:shadow-xl group-hover:border-saffron transition-all duration-300 mb-3 bg-white flex items-center justify-center p-2">
                                    {category.image?.url ? (
                                        <img src={category.image.url} alt={category.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <span className="text-gray-400 text-2xl font-bold">{category.name.charAt(0)}</span>
                                    )}
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-saffron transition-colors text-center w-24 md:w-32 truncate">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Flash Sale Section */}
            {flashSale.length > 0 && (
                <section className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="text-red-500">⚡</span> Flash Sale
                        </h2>
                        <Link to="/shop" className="text-saffron hover:underline font-medium">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {flashSale.slice(0, 5).map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* Best Sellers Section */}
            {bestSellers.length > 0 && (
                <section className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">🔥 Best Sellers</h2>
                        <Link to="/shop" className="text-saffron hover:underline font-medium">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {bestSellers.slice(0, 5).map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* New Arrivals Section */}
            {newArrivals.length > 0 && (
                <section className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">🌟 New Arrivals</h2>
                        <Link to="/shop" className="text-saffron hover:underline font-medium">View All</Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {newArrivals.slice(0, 5).map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
