import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState('');
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/api/categories');
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch categories");
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/api/categories/${id}`);
                setCategories(categories.filter(c => c._id !== id));
            } catch (error) {
                alert('Failed to delete category');
            }
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const categoryData = { name, slug, description, image: { url: image } };
            if (editMode) {
                await api.put(`/api/categories/${currentId}`, categoryData);
            } else {
                await api.post('/api/categories', categoryData);
            }
            setShowModal(false);
            fetchCategories(); // Refresh list
            toast.success('Category saved successfully');
        } catch (error) {
            toast.error('Failed to save category');
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

    const openEditModal = (category) => {
        setEditMode(true);
        setCurrentId(category._id);
        setName(category.name);
        setSlug(category.slug);
        setDescription(category.description || '');
        setImage(category.image?.url || '');
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditMode(false);
        setCurrentId('');
        setName('');
        setSlug('');
        setDescription('');
        setImage('');
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                <button 
                    onClick={openAddModal}
                    className="bg-saffron text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-6 text-center text-gray-500">Loading categories...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-sm">
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Slug</th>
                                    <th className="px-6 py-3 font-medium">Description</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                                {categories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{category.name}</td>
                                        <td className="px-6 py-4 font-mono text-xs">{category.slug}</td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={category.description}>{category.description}</td>
                                        <td className="px-6 py-4">
                                            {category.isActive ? (
                                                <span className="flex items-center text-green-600"><CheckCircle size={16} className="mr-1" /> Active</span>
                                            ) : (
                                                <span className="flex items-center text-red-500"><XCircle size={16} className="mr-1" /> Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openEditModal(category)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => deleteHandler(category._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editMode ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={submitHandler} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        // Auto-generate slug if in add mode
                                        if (!editMode) {
                                            setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                                        }
                                    }}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-saffron"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-saffron bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-saffron resize-y"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                {image && (
                                    <div className="mb-2">
                                        <img src={image} alt="Preview" className="w-16 h-16 object-cover rounded-full border border-gray-200" />
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

export default AdminCategories;
