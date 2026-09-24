import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../features/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { MapPin } from 'lucide-react';

const Shipping = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    const { userInfo } = useSelector((state) => state.auth);

    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [phone, setPhone] = useState(shippingAddress.phone || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [state, setState] = useState(shippingAddress.state || '');
    const [pincode, setPincode] = useState(shippingAddress.pincode || '');
    
    // For selecting an existing address
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ fullName, phone, address, city, state, pincode }));
        navigate('/placeorder');
    };

    const handleSelectAddress = (addr, index) => {
        setSelectedAddressIndex(index);
        setFullName(addr.fullName);
        setPhone(addr.phone);
        setAddress(`${addr.address}${addr.apartment ? ', ' + addr.apartment : ''}${addr.landmark ? ', Landmark: ' + addr.landmark : ''}`);
        setCity(addr.city);
        setState(addr.state);
        setPincode(addr.pincode);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <CheckoutSteps step1 />
            
            <div className="max-w-2xl mx-auto">
                {/* Saved Addresses Section */}
                {userInfo && userInfo.addresses && userInfo.addresses.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-charcoal mb-4">Select a Saved Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userInfo.addresses.map((addr, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleSelectAddress(addr, idx)}
                                    className={`border rounded p-4 cursor-pointer transition-all ${
                                        selectedAddressIndex === idx 
                                        ? 'border-saffron bg-saffron/5 shadow-sm' 
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <MapPin className={`mt-1 flex-shrink-0 ${selectedAddressIndex === idx ? 'text-saffron' : 'text-gray-400'}`} size={20} />
                                        <div>
                                            <h4 className="font-bold text-gray-800">{addr.fullName}</h4>
                                            <p className="text-gray-600 text-sm mt-1">{addr.phone}</p>
                                            <p className="text-gray-600 text-sm mt-1">
                                                {addr.address}
                                                {addr.apartment && <>, {addr.apartment}</>}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                {addr.city}, {addr.state} {addr.pincode}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-charcoal mb-6 border-b pb-4">
                        {selectedAddressIndex >= 0 ? 'Confirm Delivery Details' : 'Enter Delivery Details'}
                    </h1>
                    
                    <form onSubmit={submitHandler} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                        setSelectedAddressIndex(-1);
                                    }}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value);
                                        setSelectedAddressIndex(-1);
                                    }}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address (House No, Building, Street)</label>
                            <input
                                type="text"
                                required
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                    setSelectedAddressIndex(-1);
                                }}
                                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    required
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                        setSelectedAddressIndex(-1);
                                    }}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    required
                                    value={state}
                                    onChange={(e) => {
                                        setState(e.target.value);
                                        setSelectedAddressIndex(-1);
                                    }}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                <input
                                    type="text"
                                    required
                                    value={pincode}
                                    onChange={(e) => {
                                        setPincode(e.target.value);
                                        setSelectedAddressIndex(-1);
                                    }}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button 
                                type="submit" 
                                className="w-full md:w-auto px-8 bg-saffron text-white py-3 rounded font-bold shadow-md hover:bg-orange-600 transition-colors float-right"
                            >
                                Continue to Summary
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
