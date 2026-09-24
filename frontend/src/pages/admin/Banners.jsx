import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Upload } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState('');
    
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [link, setLink] = useState('');
    const [image, setImage] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const { data } = await api.get('/api/banners/admin');
            setBanners(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch banners");
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await api.delete(`/api/banners/${id}`);
                setBanners(banners.filter(b => b._id !== id));
                toast.success('Banner deleted');
            } catch (error) {
                toast.error('Failed to delete banner');
            }
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await api.post('/api/upload', formData);
            setImage(data.url);
            setUploading(false);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload Error:', error.response || error);
            setUploading(false);
            const errorMsg = error.response?.data?.message || error.response?.data || 'Image upload failed';
            toast.error(`Upload failed: ${errorMsg}`);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const bannerData = { title, subtitle, link, image: { url: image }, isActive };
            
            if (editMode) {
                await api.put(`/api/banners/${currentId}`, bannerData);
                toast.success('Banner updated');
            } else {
                await api.post('/api/banners', bannerData);
                toast.success('Banner created');
            }
            setShowModal(false);
            fetchBanners();
        } catch (error) {
            toast.error('Failed to save banner');
        }
    };

    const openEditModal = (banner) => {
        setEditMode(true);
        setCurrentId(banner._id);
        setTitle(banner.title);
        setSubtitle(banner.subtitle || '');
        setLink(banner.link || '');
        setImage(banner.image?.url || '');
        setIsActive(banner.isActive);
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditMode(false);
        setCurrentId('');
        setTitle('');
        setSubtitle('');
        setLink('');
        setImage('');
        setIsActive(true);
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
                <button 
                    onClick={openAddModal}
                    className="bg-saffron text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Add Banner
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading banners...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm">
                                    <th className="px-6 py-3 font-medium">Image</th>
                                    <th className="px-6 py-3 font-medium">Title</th>
                                    <th className="px-6 py-3 font-medium">Link</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                {banners.map((banner) => (
                                    <tr key={banner._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <img src={banner.image?.url} alt={banner.title} className="w-24 h-12 object-cover rounded border" />
                                        </td>
                                        <td className="px-6 py-4 font-medium">{banner.title}</td>
                                        <td className="px-6 py-4">{banner.link || '-'}</td>
                                        <td className="px-6 py-4">
                                            {banner.isActive ? (
                                                <span className="flex items-center text-green-600"><CheckCircle size={16} className="mr-1" /> Active</span>
                                            ) : (
                                                <span className="flex items-center text-red-500"><XCircle size={16} className="mr-1" /> Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditModal(banner)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => deleteHandler(banner._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold">{editMode ? 'Edit Banner' : 'Add Banner'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={submitHandler} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Optional)</label>
                                <input
                                    type="text"
                                    value={subtitle}
                                    onChange={(e) => setSubtitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL (Optional)</label>
                                <input
                                    type="text"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                {image && (
                                    <div className="mb-2">
                                        <img src={image} alt="Preview" className="w-full h-32 object-cover rounded border" />
                                    </div>
                                )}
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-saffron"
                                        placeholder="Image URL"
                                    />
                                    <label className="cursor-pointer bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 flex items-center gap-2">
                                        <Upload size={18} />
                                        {uploading ? '...' : 'Upload'}
                                        <input type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <input 
                                    type="checkbox" 
                                    id="isActive"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="w-4 h-4 text-saffron rounded"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (Show on Homepage)</label>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={uploading} className="px-4 py-2 bg-saffron text-white rounded hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50">
                                    {editMode ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBanners;
