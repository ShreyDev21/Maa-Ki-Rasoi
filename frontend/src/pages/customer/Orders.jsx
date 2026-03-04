import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye } from "lucide-react";
import { orderAPI } from "../../api/services.js";

const statusColors = {
    pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700", shipped: "bg-indigo-100 text-indigo-700",
    out_for_delivery: "bg-teal-100 text-teal-700", delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700", returned: "bg-gray-100 text-gray-700",
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        orderAPI.getMyOrders().then((r) => setOrders(r.data.data.orders)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-cream-100 rounded-2xl animate-pulse" />)}</div></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark-900 mb-6">My Orders</h1>
            {orders.length === 0 ? (
                <div className="text-center py-16">
                    <Package size={64} className="text-primary-200 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                    <p className="text-dark-600 mb-4">Start shopping to see your orders here</p>
                    <Link to="/products" className="bg-gradient-primary text-white px-6 py-3 rounded-full font-semibold">Shop Now</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((o) => (
                        <Link key={o._id} to={`/orders/${o._id}`} className="block bg-white rounded-2xl shadow-soft p-5 hover:shadow-card transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-semibold text-dark-900">{o.orderNumber}</p>
                                    <p className="text-xs text-dark-600">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[o.orderStatus] || "bg-gray-100"}`}>
                                    {o.orderStatus.replace("_", " ")}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {o.items.slice(0, 3).map((item, i) => (
                                        <div key={i} className="w-10 h-10 rounded-lg bg-cream-100 border-2 border-white overflow-hidden">
                                            {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span className="text-lg flex items-center justify-center h-full">🍲</span>}
                                        </div>
                                    ))}
                                    {o.items.length > 3 && <div className="w-10 h-10 rounded-lg bg-cream-200 border-2 border-white flex items-center justify-center text-xs font-bold">+{o.items.length - 3}</div>}
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-dark-900">₹{o.totalAmount}</p>
                                    <p className="text-xs text-dark-600">{o.items.length} item{o.items.length > 1 ? "s" : ""}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
