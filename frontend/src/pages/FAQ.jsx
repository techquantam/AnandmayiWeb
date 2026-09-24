import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "How do you ensure the purity of the Puja Samagri?",
            answer: "We source all our puja items directly from trusted, traditional vendors who follow strict purity guidelines. Our items are packed in a clean, sanitized environment to maintain their sanctity."
        },
        {
            question: "Do you offer pre-packaged Puja Kits for specific festivals?",
            answer: "Yes! We offer comprehensive Puja Kits for Diwali, Navratri, Ganesh Chaturthi, Griha Pravesh, and many other occasions. Each kit contains everything you need for the specific ritual."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard delivery takes 3-5 business days across India. We also offer express delivery in select metro cities which takes 1-2 days."
        },
        {
            question: "Can I return an item if I am not satisfied?",
            answer: "Due to the sacred nature of puja items, we only accept returns if the product is delivered damaged or incorrect. Please contact our support team within 48 hours of delivery."
        },
        {
            question: "Are your God Idols made of pure materials?",
            answer: "Yes, our idols are crafted from high-quality materials including pure brass, copper, marble dust, and eco-friendly clay, depending on the specific product description."
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-hindi font-bold text-maroon mb-4">Frequently Asked Questions</h1>
                    <div className="w-24 h-1 bg-saffron mx-auto rounded"></div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative min-h-[300px]">
                        <img 
                            src="/images/faq-bg.jpg" 
                            alt="Spiritual FAQ background" 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center p-8">
                            <h2 className="text-white text-3xl font-bold leading-tight">Here to<br/>Help You.</h2>
                        </div>
                    </div>
                    
                    <div className="md:w-3/5 p-6 md:p-10 bg-gray-50">
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all">
                                    <button 
                                        className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                                        onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    >
                                        <span className="font-bold text-gray-800 pr-4">{faq.question}</span>
                                        {openIndex === index ? (
                                            <ChevronUp className="text-saffron flex-shrink-0" size={20} />
                                        ) : (
                                            <ChevronDown className="text-gray-400 flex-shrink-0" size={20} />
                                        )}
                                    </button>
                                    
                                    {openIndex === index && (
                                        <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 text-center text-sm text-gray-500">
                            Still have questions? <a href="/contact" className="text-saffron font-bold hover:underline">Contact our support</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
