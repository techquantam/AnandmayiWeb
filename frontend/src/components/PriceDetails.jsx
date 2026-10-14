import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PriceDetails = ({
    itemsPrice = 0,
    mrpPrice = 0,
    discountPrice = 0,
    shippingPrice = 0,
    taxPrice = 0,
    totalPrice = 0,
    totalSavings = 0,
    showCheckoutButton = true,
    buttonText = 'Proceed to Checkout',
    onButtonClick,
    buttonDisabled = false,
    className = ''
}) => {
    const [showFees, setShowFees] = useState(false);
    const [showDiscounts, setShowDiscounts] = useState(false);

    // Calculate effective values
    const effectiveItemsPrice = Number(itemsPrice) || 0;
    const effectiveMrp = Number(mrpPrice) > 0 ? Number(mrpPrice) : effectiveItemsPrice;
    const effectiveDiscount = Number(discountPrice) > 0 ? Number(discountPrice) : Math.max(0, effectiveMrp - effectiveItemsPrice);
    const effectiveShipping = Number(shippingPrice) || 0;
    const effectiveTax = Number(taxPrice) || 0;
    const effectiveFees = effectiveShipping + effectiveTax;
    const effectiveTotal = Number(totalPrice) || (effectiveItemsPrice + effectiveFees);
    const effectiveSavings = Number(totalSavings) > 0 ? Number(totalSavings) : Math.max(0, Math.round(effectiveMrp - effectiveTotal));

    return (
        <div className={`w-full ${className}`}>
            <h2 className="text-xl font-bold text-gray-800 mb-3 tracking-tight">Price Details</h2>
            
            <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-gray-100 shadow-2xs">
                {/* MRP Row */}
                <div className="flex justify-between items-center text-sm md:text-base text-gray-700 py-1">
                    <span className="underline decoration-dotted underline-offset-4 cursor-default text-gray-800">
                        MRP (incl. of all taxes)
                    </span>
                    <span className="font-semibold text-gray-900 tracking-tight">
                        ₹{effectiveMrp.toLocaleString('en-IN')}
                    </span>
                </div>

                {/* Fees Row (with chevron) */}
                <div className="mt-2.5">
                    <button
                        type="button"
                        onClick={() => setShowFees(!showFees)}
                        className="w-full flex justify-between items-center text-sm md:text-base text-gray-700 hover:text-gray-900 py-1 transition-colors group cursor-pointer"
                    >
                        <span className="flex items-center gap-1.5 font-normal text-gray-800">
                            Fees
                            <ChevronDown 
                                size={16} 
                                className={`text-gray-500 transition-transform duration-200 group-hover:text-gray-800 ${showFees ? 'rotate-180' : ''}`} 
                            />
                        </span>
                        <span className="font-semibold text-gray-900 tracking-tight">
                            {effectiveFees > 0 ? `₹${effectiveFees.toLocaleString('en-IN')}` : <span className="text-emerald-700 font-medium">Free</span>}
                        </span>
                    </button>

                    {/* Expandable breakdown for Fees */}
                    {showFees && (
                        <div className="pl-3.5 pr-2 py-2.5 my-1.5 text-xs text-gray-600 bg-white rounded-xl border border-gray-200/70 space-y-2 animate-in fade-in duration-150">
                            <div className="flex justify-between items-center">
                                <span>Delivery / Shipping Fee</span>
                                <span className={effectiveShipping > 0 ? 'font-medium text-gray-800' : 'text-emerald-700 font-semibold'}>
                                    {effectiveShipping > 0 ? `₹${effectiveShipping.toLocaleString('en-IN')}` : 'Free'}
                                </span>
                            </div>
                            {effectiveTax > 0 && (
                                <div className="flex justify-between items-center">
                                    <span>GST / Taxes</span>
                                    <span className="font-medium text-gray-800">₹{effectiveTax.toFixed(2)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Dotted Divider */}
                <div className="border-b border-dashed border-gray-200 my-3"></div>

                {/* Discounts Row (with chevron) */}
                <div>
                    <button
                        type="button"
                        onClick={() => setShowDiscounts(!showDiscounts)}
                        className="w-full flex justify-between items-center text-sm md:text-base text-gray-700 hover:text-gray-900 py-1 transition-colors group cursor-pointer"
                    >
                        <span className="flex items-center gap-1.5 font-normal text-gray-800">
                            Discounts
                            <ChevronDown 
                                size={16} 
                                className={`text-gray-500 transition-transform duration-200 group-hover:text-gray-800 ${showDiscounts ? 'rotate-180' : ''}`} 
                            />
                        </span>
                        <span className="font-semibold text-emerald-600 tracking-tight">
                            {effectiveDiscount > 0 ? `₹${effectiveDiscount.toLocaleString('en-IN')}` : '₹0'}
                        </span>
                    </button>

                    {/* Expandable breakdown for Discounts */}
                    {showDiscounts && (
                        <div className="pl-3.5 pr-2 py-2.5 my-1.5 text-xs text-gray-600 bg-white rounded-xl border border-gray-200/70 space-y-1.5 animate-in fade-in duration-150">
                            <div className="flex justify-between items-center">
                                <span>Product Discount on MRP</span>
                                <span className="text-emerald-600 font-semibold">
                                    -₹{effectiveDiscount.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Solid Divider */}
                <div className="border-b border-gray-200 my-3.5"></div>

                {/* Total Amount Row */}
                <div className="flex justify-between items-center text-base md:text-lg font-bold text-gray-900 pt-0.5">
                    <span>Total Amount</span>
                    <span className="text-gray-900 tracking-tight">₹{effectiveTotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Savings Banner */}
                {effectiveSavings > 0 && (
                    <div className="mt-4 bg-[#E8F8F0] text-[#0C8346] px-3.5 py-2.5 rounded-xl flex items-center gap-2 text-xs md:text-sm font-semibold border border-emerald-100/80">
                        <div className="w-5 h-5 rounded-full bg-[#0C8346] text-white flex items-center justify-center text-[11px] font-black flex-shrink-0 shadow-2xs">
                            %
                        </div>
                        <span className="tracking-tight">
                            You'll save ₹{effectiveSavings.toLocaleString('en-IN')} on this order!
                        </span>
                    </div>
                )}
            </div>

            {/* Action / Checkout Button */}
            {showCheckoutButton && (
                <button
                    type="button"
                    onClick={onButtonClick}
                    disabled={buttonDisabled}
                    className="w-full mt-4 bg-saffron hover:bg-orange-600 text-white py-3.5 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default PriceDetails;
