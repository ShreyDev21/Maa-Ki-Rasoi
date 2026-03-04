import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Users, ShoppingBag, IndianRupee, TrendingUp, ArrowRight } from "lucide-react";
import { orderAPI, userAPI, productAPI } from "../../api/services.js";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.allSettled([
                    orderAPI.adminGetStats(),
                    orderAPI.adminGetAll({ limit: 5 }),
                ]);
                if (statsRes.status === "fulfilled") setStats(statsRes.value.data.data);
                if (ordersRes.status === "fulfilled") setRecentOrders(ordersRes.value.data.data.orders);
            } catch { } finally { setLoading(false); }
        };
        fetch();
    }, []);

    const statCards = [
        { icon: <IndianRupee size={24} />, label: "Total Revenue", value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, color: "from-green-500 to-green-700" },
        { icon: <Package size={24} />, label: "Total Orders", value: stats?.totalOrders || 0, color: "from-blue-500 to-blue-700" },
        { icon: <ShoppingBag size={24} />, label: "Pending Orders", value: stats?.statusBreakdown?.find((s) => s._id === "pending")?.count || 0, color: "from-amber-500 to-amber-700" },
        { icon: <TrendingUp size={24} />, label: "Delivered", value: stats?.statusBreakdown?.find((s) => s._id === "delivered")?.count || 0, color: "from-purple-500 to-purple-700" },
    ];

    const statusColors = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", processing: "bg-purple-100 text-purple-700", shipped: "bg-indigo-100 text-indigo-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-dark-900">Admin Dashboard</h1>
                    <p className="text-dark-600 text-sm mt-1">Overview of your store</p>
                </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2 mb-8">
                {[
                    { to: "/admin/products", label: "Manage Products", icon: <ShoppingBag size={16} /> },
                    { to: "/admin/categories", label: "Manage Categories", icon: <Package size={16} /> },
                    { to: "/admin/orders", label: "Manage Orders", icon: <Package size={16} /> },
                    { to: "/admin/users", label: "Manage Users", icon: <Users size={16} /> },
                ].map((l) => (
                    <Link key={l.to} to={l.to} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-soft text-sm font-medium text-dark-800 hover:shadow-card hover:text-primary-600 transition-all">
                        {l.icon} {l.label}
                    </Link>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => (
                    <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-white/20 rounded-xl">{s.icon}</div>
                        </div>
                        <p className="text-2xl font-bold">{loading ? "..." : s.value}</p>
                        <p className="text-sm text-white/80">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-dark-900">Recent Orders</h3>
                    <Link to="/admin/orders" className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight size={14} /></Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-2 text-dark-600 font-medium">Order</th>
                                <th className="text-left py-2 text-dark-600 font-medium">Customer</th>
                                <th className="text-left py-2 text-dark-600 font-medium">Amount</th>
                                <th className="text-left py-2 text-dark-600 font-medium">Status</th>
                                <th className="text-left py-2 text-dark-600 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((o) => (
                                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-3 font-medium">{o.orderNumber}</td>
                                    <td className="py-3 text-dark-600">{o.user?.name || "N/A"}</td>
                                    <td className="py-3 font-medium">₹{o.totalAmount}</td>
                                    <td className="py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[o.orderStatus] || "bg-gray-100"}`}>{o.orderStatus.replace("_", " ")}</span></td>
                                    <td className="py-3 text-dark-600">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentOrders.length === 0 && <p className="text-center py-8 text-dark-600">No orders yet</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
