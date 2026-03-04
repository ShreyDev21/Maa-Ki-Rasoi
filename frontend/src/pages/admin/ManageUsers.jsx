import { useEffect, useState } from "react";
import { userAPI } from "../../api/services.js";
import toast from "react-hot-toast";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try { const { data } = await userAPI.getAllUsers({ limit: 50, search: search || undefined }); setUsers(data.data.users); }
        catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (userId, role) => {
        try { await userAPI.updateUserRole(userId, { role }); toast.success("Role updated"); fetchUsers(); }
        catch (e) { toast.error(e.response?.data?.message || "Failed"); }
    };

    const toggleStatus = async (userId) => {
        try { await userAPI.toggleUserStatus(userId); toast.success("Status updated"); fetchUsers(); }
        catch (e) { toast.error(e.response?.data?.message || "Failed"); }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark-900 mb-6">Manage Users</h1>

            <div className="flex gap-3 mb-6">
                <input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 max-w-sm px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" />
                <button onClick={fetchUsers} className="bg-gradient-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">Search</button>
            </div>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-cream-50">
                            <tr><th className="text-left px-4 py-3 font-medium text-dark-600">User</th><th className="text-left px-4 py-3 font-medium text-dark-600">Email</th><th className="text-left px-4 py-3 font-medium text-dark-600">Phone</th><th className="text-left px-4 py-3 font-medium text-dark-600">Role</th><th className="text-left px-4 py-3 font-medium text-dark-600">Status</th><th className="text-left px-4 py-3 font-medium text-dark-600">Joined</th></tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3"><div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700">{u.name?.charAt(0)}</div>
                                        <span className="font-medium">{u.name}</span>
                                    </div></td>
                                    <td className="px-4 py-3 text-dark-600">{u.email}</td>
                                    <td className="px-4 py-3 text-dark-600">{u.phone || "—"}</td>
                                    <td className="px-4 py-3">
                                        <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-400">
                                            <option value="customer">Customer</option><option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => toggleStatus(u._id)}
                                            className={`text-xs font-medium px-2 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {u.isActive ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-dark-600">{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <p className="text-center py-12 text-dark-600">No users found</p>}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
