import { Settings as SettingsIcon, Save } from 'lucide-react';

const Settings = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-charcoal">Store Settings</h2>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 max-w-2xl">
                <form className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">General Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                                <input type="text" defaultValue="Anandmayi Puja Bhandar" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                <input type="email" defaultValue="support@anandmayi.com" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input type="text" defaultValue="+91 9876543210" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Payment Gateway</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key ID</label>
                                <input type="password" defaultValue="rzp_test_xxxxxx" className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-saffron" />
                            </div>
                            <p className="text-xs text-gray-500">Edit these settings in your backend .env file for production security.</p>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="button" className="bg-saffron text-white px-6 py-2 rounded font-medium hover:bg-orange-600 flex items-center gap-2">
                            <Save size={18} /> Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
