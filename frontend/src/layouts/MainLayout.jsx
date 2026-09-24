import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-grow">
                <Outlet />
            </main>
            
            <footer className="bg-charcoal text-ivory py-12 mt-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Column 1: Brand & Socials */}
                        <div>
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold text-saffron tracking-wide">ANANDMAYI</h2>
                                <p className="text-sm text-gray-300 mt-1 tracking-wider uppercase">Puja Bhandar</p>
                            </div>
                            <h3 className="text-lg font-bold mb-3">Follow us on</h3>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                    <MessageCircle size={20} />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-saffron">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
                                <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: Get In Touch */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-saffron">Get In Touch</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-gray-300">
                                    <Mail className="flex-shrink-0 text-saffron" size={20} />
                                    <a href="mailto:info@pujasamagrionline.in" className="hover:text-white transition-colors">info@pujasamagrionline.in</a>
                                </li>
                                <li className="flex gap-3 text-gray-300">
                                    <Phone className="flex-shrink-0 text-saffron" size={20} />
                                    <a href="tel:+919870365855" className="hover:text-white transition-colors">+91 9870365855</a>
                                </li>
                                <li className="flex gap-3 text-gray-300">
                                    <MapPin className="flex-shrink-0 text-saffron mt-1" size={20} />
                                    <span>8-A/13 sector 15, Rohini, Delhi, 110089</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
