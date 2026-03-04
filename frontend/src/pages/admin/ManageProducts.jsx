import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { productAPI, categoryAPI } from "../../api/services.js";
import toast from "react-hot-toast";

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: "", description: "", shortDescription: "", price: "", discountPrice: "", category: "", stock: "", unit: "pcs", weight: "", ingredients: "", isVeg: true, isFeatured: false, tags: "" });
    const [files, setFiles] = useState([]);

    const fetchProducts = async () => {
        setLoading(true);
        try { const { data } = await productAPI.adminGetAll({ limit: 50 }); setProducts(data.data.products); } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); categoryAPI.getAll().then((r) => setCategories(r.data.data)).catch(() => { }); }, []);

    const openAdd = () => { setEditId(null); setForm({ name: "", description: "", shortDescription: "", price: "", discountPrice: "", category: "", stock: "", unit: "pcs", weight: "", ingredients: "", isVeg: true, isFeatured: false, tags: "" }); setFiles([]); setShowModal(true); };
    const openEdit = (p) => { setEditId(p._id); setForm({ name: p.name, description: p.description, shortDescription: p.shortDescription || "", price: p.price, discountPrice: p.discountPrice || "", category: p.category?._id || "", stock: p.stock, unit: p.unit, weight: p.weight || "", ingredients: p.ingredients || "", isVeg: p.isVeg, isFeatured: p.isFeatured, tags: p.tags?.join(", ") || "" }); setFiles([]); setShowModal(true); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([k, v]) => formData.append(k, v));
        files.forEach((f) => formData.append("images", f));
        try {
            if (editId) { await productAPI.update(editId, formData); toast.success("Product updated!"); }
            else { await productAPI.create(formData); toast.success("Product created!"); }
            setShowModal(false); fetchProducts();
        } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return;
        try { await productAPI.delete(id); toast.success("Deleted"); fetchProducts(); }
        catch { toast.error("Failed to delete"); }
    };

    const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark-900">Manage Products</h1>
                <button onClick={openAdd} className="bg-gradient-primary text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg transition-all"><Plus size={16} /> Add Product</button>
            </div>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-cream-50">
                            <tr><th className="text-left px-4 py-3 font-medium text-dark-600">Product</th><th className="text-left px-4 py-3 font-medium text-dark-600">Category</th><th className="text-left px-4 py-3 font-medium text-dark-600">Price</th><th className="text-left px-4 py-3 font-medium text-dark-600">Stock</th><th className="text-left px-4 py-3 font-medium text-dark-600">Status</th><th className="text-right px-4 py-3 font-medium text-dark-600">Actions</th></tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3"><div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-cream-100 rounded-lg overflow-hidden flex-shrink-0">{p.images?.[0]?.url ? <img src={p.images[0].url} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-lg">🍲</span>}</div>
                                        <div><p className="font-medium text-dark-900 truncate max-w-[200px]">{p.name}</p>{p.isFeatured && <span className="text-[10px] bg-accent-100 text-accent-700 px-1 rounded">Featured</span>}</div>
                                    </div></td>
                                    <td className="px-4 py-3 text-dark-600">{p.category?.name || "—"}</td>
                                    <td className="px-4 py-3"><span className="font-medium">₹{p.price}</span>{p.discountPrice > 0 && <span className="text-xs text-primary-600 ml-1">→ ₹{p.discountPrice}</span>}</td>
                                    <td className="px-4 py-3"><span className={p.stock > 0 ? "text-primary-600" : "text-red-500"}>{p.stock}</span></td>
                                    <td className="px-4 py-3"><span className={`text-xs font-medium ${p.isActive ? "text-green-600" : "text-red-500"}`}>{p.isActive ? "Active" : "Inactive"}</span></td>
                                    <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                                        <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-primary-50 rounded-lg text-dark-600 hover:text-primary-600 transition-colors"><Edit size={14} /></button>
                                        <button onClick={() => handleDelete(p._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-dark-600 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                    </div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && <p className="text-center py-12 text-dark-600">No products yet. Add your first product!</p>}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-elevated w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg">{editId ? "Edit" : "Add"} Product</h3><button onClick={() => setShowModal(false)}><X size={20} /></button></div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input required placeholder="Product Name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
                            <textarea required rows={3} placeholder="Description *" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={`${inputCls} resize-none`} />
                            <input placeholder="Short Description" value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} className={inputCls} />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" required placeholder="Price *" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className={inputCls} />
                                <input type="number" placeholder="Discount Price" value={form.discountPrice} onChange={(e) => setForm((p) => ({ ...p, discountPrice: e.target.value }))} className={inputCls} />
                                <select required value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className={inputCls}>
                                    <option value="">Select Category *</option>{categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                                <input type="number" required placeholder="Stock *" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className={inputCls} />
                                <select value={form.unit} onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))} className={inputCls}>
                                    {["kg", "g", "ml", "l", "pcs", "pack", "bottle", "jar"].map((u) => <option key={u} value={u}>{u}</option>)}
                                </select>
                                <input placeholder="Weight (e.g. 500g)" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} className={inputCls} />
                            </div>
                            <input placeholder="Ingredients" value={form.ingredients} onChange={(e) => setForm((p) => ({ ...p, ingredients: e.target.value }))} className={inputCls} />
                            <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} className={inputCls} />
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isVeg} onChange={(e) => setForm((p) => ({ ...p, isVeg: e.target.checked }))} className="text-primary-600" /> <span className="text-sm">🌱 Vegetarian</span></label>
                                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} className="text-accent-600" /> <span className="text-sm">⭐ Featured</span></label>
                            </div>
                            <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} className="text-sm" />
                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="flex-1 bg-gradient-primary text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all">{editId ? "Update" : "Create"} Product</button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 text-dark-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;
