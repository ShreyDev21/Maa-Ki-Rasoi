import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { categoryAPI } from "../../api/services.js";
import toast from "react-hot-toast";

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [file, setFile] = useState(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await categoryAPI.getAll();
            setCategories(data.data);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const openAdd = () => {
        setEditId(null);
        setForm({ name: "", description: "" });
        setFile(null);
        setShowModal(true);
    };

    const openEdit = (cat) => {
        setEditId(cat._id);
        setForm({ name: cat.name, description: cat.description || "" });
        setFile(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        if (file) formData.append("image", file);

        try {
            if (editId) {
                await categoryAPI.update(editId, formData);
                toast.success("Category updated!");
            } else {
                await categoryAPI.create(formData);
                toast.success("Category created!");
            }
            setShowModal(false);
            fetchCategories();
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this category?")) return;
        try {
            await categoryAPI.delete(id);
            toast.success("Category deleted");
            fetchCategories();
        } catch {
            toast.error("Failed to delete");
        }
    };

    const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400";

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark-900">Manage Categories</h1>
                <button onClick={openAdd}
                    className="bg-gradient-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all">
                    <Plus size={16} /> Add Category
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-40 bg-cream-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-soft">
                    <span className="text-5xl block mb-3">📂</span>
                    <h2 className="text-lg font-semibold text-dark-900 mb-1">No categories yet</h2>
                    <p className="text-dark-600 text-sm mb-4">Create your first category to organize products</p>
                    <button onClick={openAdd} className="bg-gradient-primary text-white px-5 py-2 rounded-xl text-sm font-semibold">
                        Add Category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                        <div key={cat._id} className="bg-white rounded-2xl shadow-soft overflow-hidden group hover:shadow-card transition-shadow">
                            <div className="h-32 bg-cream-50 flex items-center justify-center overflow-hidden">
                                {cat.image?.url ? (
                                    <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">🏷️</span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-dark-900">{cat.name}</h3>
                                        {cat.description && (
                                            <p className="text-xs text-dark-600 mt-1 line-clamp-2">{cat.description}</p>
                                        )}
                                        <p className="text-xs text-dark-500 mt-2">
                                            {cat.productCount ?? 0} product{(cat.productCount ?? 0) !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(cat)}
                                            className="p-1.5 hover:bg-primary-50 rounded-lg text-dark-600 hover:text-primary-600 transition-colors">
                                            <Edit size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(cat._id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg text-dark-600 hover:text-red-600 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-elevated w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">{editId ? "Edit" : "Add"} Category</h3>
                            <button onClick={() => setShowModal(false)} className="text-dark-600 hover:text-dark-900">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-dark-800 mb-1 block">Category Name *</label>
                                <input required placeholder="e.g. Pickles, Preserves, Chutneys" value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    className={inputCls} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-dark-800 mb-1 block">Description</label>
                                <textarea rows={3} placeholder="Brief description of this category" value={form.description}
                                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                    className={`${inputCls} resize-none`} />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-dark-800 mb-1 block">Image</label>
                                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}
                                    className="text-sm" />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="submit"
                                    className="flex-1 bg-gradient-primary text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all">
                                    {editId ? "Update" : "Create"} Category
                                </button>
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 text-dark-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCategories;
