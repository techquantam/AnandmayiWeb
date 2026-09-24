import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3 }) => {
    return (
        <nav className="flex justify-center mb-8">
            <ol className="flex items-center w-full max-w-2xl text-sm font-medium text-center text-gray-500 sm:text-base">
                <li className={`flex md:w-full items-center ${step1 ? 'text-saffron' : ''} after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                        {step1 ? (
                            <Link to="/shipping" className="flex items-center gap-2 font-bold">
                                <span className="w-6 h-6 bg-saffron text-white rounded-full flex items-center justify-center text-xs">1</span>
                                Address
                            </Link>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">1</span>
                                Address
                            </span>
                        )}
                    </span>
                </li>
                
                <li className={`flex md:w-full items-center ${step2 ? 'text-saffron' : ''} after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}>
                    <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
                        {step2 ? (
                            <Link to="/placeorder" className="flex items-center gap-2 font-bold">
                                <span className="w-6 h-6 bg-saffron text-white rounded-full flex items-center justify-center text-xs">2</span>
                                Summary
                            </Link>
                        ) : (
                            <span className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">2</span>
                                Summary
                            </span>
                        )}
                    </span>
                </li>
                
                <li className={`flex items-center ${step3 ? 'text-saffron' : ''}`}>
                    <span className="flex items-center gap-2 font-bold">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step3 ? 'bg-saffron text-white' : 'bg-gray-200'}`}>3</span>
                        Payment
                    </span>
                </li>
            </ol>
        </nav>
    );
};

export default CheckoutSteps;
