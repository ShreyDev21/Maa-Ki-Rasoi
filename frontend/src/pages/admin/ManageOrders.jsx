import { useEffect, useState } from "react";
import { orderAPI } from "../../api/services.js";
import toast from "react-hot-toast";

const statusColors = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", processing: "bg-purple-100 text-purple-700", shipped: "bg-indigo-100 text-indigo-700", out_for_delivery: "bg-teal-100 text-teal-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };
const statuses = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        try { const { data } = await orderAPI.adminGetAll({ limit: 50, status: statusFilter || undefined }); setOrders(data.data.orders); }
        catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchOrders(); }, [statusFilter]);

    const updateStatus = async (orderId, status) => {
        try { await orderAPI.adminUpdateStatus(orderId, { status }); toast.success("Status updated"); fetchOrders(); }
        catch (e) { toast.error(e.response?.data?.message || "Failed"); }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark-900 mb-6">Manage Orders</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => setStatusFilter("")} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!statusFilter ? "bg-primary-600 text-white" : "bg-white text-dark-700 shadow-soft"}`}>All</button>
                {statuses.map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${statusFilter === s ? "bg-primary-600 text-white" : "bg-white text-dark-700 shadow-soft"}`}>{s.replace("_", " ")}</button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-cream-50">
                            <tr><th className="text-left px-4 py-3 font-medium text-dark-600">Order #</th><th className="text-left px-4 py-3 font-medium text-dark-600">Customer</th><th className="text-left px-4 py-3 font-medium text-dark-600">Items</th><th className="text-left px-4 py-3 font-medium text-dark-600">Total</th><th className="text-left px-4 py-3 font-medium text-dark-600">Payment</th><th className="text-left px-4 py-3 font-medium text-dark-600">Status</th><th className="text-left px-4 py-3 font-medium text-dark-600">Update</th></tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o._id} className="border-t border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                                    <td className="px-4 py-3"><p className="text-dark-900">{o.user?.name}</p><p className="text-xs text-dark-600">{o.user?.email}</p></td>
                                    <td className="px-4 py-3">{o.items.length} items</td>
                                    <td className="px-4 py-3 font-medium">₹{o.totalAmount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs font-medium uppercase ${o.paymentInfo?.method === "cod" ? "text-amber-600" : "text-blue-600"}`}>
                                            {o.paymentInfo?.method === "cod" ? "COD" : "Razorpay"}
                                        </span>
                                        <br />
                                        {o.paymentInfo?.isPaid ? (
                                            <span className="text-xs text-green-600">✅ Paid</span>
                                        ) : (
                                            <button
                                                onClick={() => markPaid(o._id)}
                                                className="text-xs text-yellow-600 hover:text-green-600 hover:underline cursor-pointer mt-0.5"
                                            >
                                                ⏳ Mark Paid
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[o.orderStatus]}`}>{o.orderStatus.replace("_", " ")}</span></td>
                                    <td className="px-4 py-3">
                                        <select value={o.orderStatus} onChange={(e) => updateStatus(o._id, e.target.value)}
                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-400">
                                            {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <p className="text-center py-12 text-dark-600">No orders found</p>}
                </div>
            </div>
        </div>
    );
};

export default ManageOrders;
