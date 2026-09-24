import React from 'react';

const About = () => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-hindi font-bold text-maroon mb-4">About Anandmayi Puja Bhandar</h1>
                    <div className="w-24 h-1 bg-saffron mx-auto rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <img 
                            src="/images/about-bg.jpg" 
                            alt="Traditional Puja Setup" 
                            className="rounded-lg shadow-xl w-full h-auto object-cover border-4 border-white"
                        />
                    </div>
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                        <p>
                            Welcome to <strong className="text-maroon">Anandmayi Puja Bhandar</strong>, your one-stop destination for all spiritual and devotional needs. We understand the sanctity of your rituals and the purity required for your offerings.
                        </p>
                        <p>
                            Since our inception, we have been dedicated to providing the highest quality Puja Samagri (ritual items), beautifully crafted God Idols, pure incense sticks, and comprehensive Puja Kits right to your doorstep.
                        </p>
                        <p>
                            Our mission is to make your spiritual journey seamless and deeply fulfilling. Every item in our store is carefully sourced to ensure it meets the highest standards of purity and tradition. 
                        </p>
                    </div>
                </div>

                <div className="bg-orange-50 rounded-2xl p-8 md:p-12 text-center shadow-sm border border-orange-100">
                    <h2 className="text-2xl font-bold text-maroon mb-4">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        <div>
                            <div className="text-4xl mb-3">🌺</div>
                            <h3 className="font-bold text-lg mb-2 text-charcoal">100% Pure & Authentic</h3>
                            <p className="text-gray-600 text-sm">We guarantee the purity of all our offerings, maintaining the sanctity of your rituals.</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-3">🚚</div>
                            <h3 className="font-bold text-lg mb-2 text-charcoal">Pan-India Delivery</h3>
                            <p className="text-gray-600 text-sm">Get your required puja items delivered safely and timely anywhere in India.</p>
                        </div>
                        <div>
                            <div className="text-4xl mb-3">🙏</div>
                            <h3 className="font-bold text-lg mb-2 text-charcoal">Customer Devotion</h3>
                            <p className="text-gray-600 text-sm">Our dedicated support ensures your spiritual needs are always met with respect and care.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
