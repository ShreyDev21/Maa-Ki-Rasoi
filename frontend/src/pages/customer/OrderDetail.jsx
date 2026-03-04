import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Circle, Package, Truck, MapPin } from "lucide-react";
import { orderAPI } from "../../api/services.js";
import toast from "react-hot-toast";

const statuses = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
const statusIcons = { pending: Circle, confirmed: CheckCircle, processing: Package, shipped: Truck, out_for_delivery: Truck, delivered: MapPin };

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { orderAPI.getById(id).then((r) => setOrder(r.data.data)).catch(() => { }).finally(() => setLoading(false)); }, [id]);

    const cancelOrder = async () => {
        try { const { data } = await orderAPI.cancel(id, { reason: "Changed my mind" }); setOrder(data.data); toast.success("Order cancelled"); }
        catch (e) { toast.error(e.response?.data?.message || "Failed"); }
    };

    if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="h-64 bg-cream-100 rounded-2xl animate-pulse" /></div>;
    if (!order) return <div className="min-h-[60vh] flex flex-col items-center justify-center"><span className="text-6xl mb-4">😕</span><h2 className="text-xl font-semibold">Order not found</h2></div>;

    const currentIdx = statuses.indexOf(order.orderStatus);
    const isCancelled = order.orderStatus === "cancelled";

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <Link to="/orders" className="inline-flex items-center gap-1 text-dark-600 hover:text-primary-600 text-sm mb-6"><ArrowLeft size={16} /> Back to Orders</Link>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark-900">{order.orderNumber}</h1>
                    <p className="text-dark-600 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                {["pending", "confirmed"].includes(order.orderStatus) && (
                    <button onClick={cancelOrder} className="text-sm text-red-500 hover:text-red-600 font-medium border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-all">Cancel Order</button>
                )}
            </div>

            {/* Status Tracker */}
            {!isCancelled && (
                <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
                    <h3 className="font-semibold text-dark-900 mb-4">Delivery Tracking</h3>
                    <div className="flex items-center justify-between relative">
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"><div className="h-full bg-primary-500 transition-all" style={{ width: `${(currentIdx / (statuses.length - 1)) * 100}%` }} /></div>
                        {statuses.map((s, i) => {
                            const Icon = statusIcons[s];
                            const done = i <= currentIdx;
                            return (
                                <div key={s} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? "bg-primary-500 text-white" : "bg-gray-200 text-gray-400"}`}><Icon size={16} /></div>
                                    <span className={`text-[10px] mt-1 capitalize ${done ? "text-primary-700 font-medium" : "text-dark-600"}`}>{s.replace("_", " ")}</span>
                                </div>
                            );
                        })}
                    </div>
                    {order.deliveryInfo?.estimatedDelivery && (
                        <p className="text-sm text-dark-600 mt-4">Estimated delivery: <span className="font-medium">{new Date(order.deliveryInfo.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span></p>
                    )}
                </div>
            )}

            {isCancelled && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6"><p className="text-red-700 font-medium">Order Cancelled</p><p className="text-sm text-red-600">{order.cancelReason}</p></div>}

            {/* Items */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
                <h3 className="font-semibold text-dark-900 mb-4">Items</h3>
                <div className="space-y-3">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-cream-100 rounded-xl overflow-hidden flex-shrink-0">
                                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl flex items-center justify-center h-full">🍲</span>}
                            </div>
                            <div className="flex-1"><p className="font-medium text-sm">{item.name}</p><p className="text-xs text-dark-600">Qty: {item.quantity} × ₹{item.price}</p></div>
                            <span className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <hr className="my-4 border-gray-100" />
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-dark-600">Subtotal</span><span>₹{order.itemsTotal}</span></div>
                    <div className="flex justify-between"><span className="text-dark-600">Shipping</span><span>{order.shippingCharge === 0 ? "FREE" : `₹${order.shippingCharge}`}</span></div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100"><span>Total</span><span>₹{order.totalAmount}</span></div>
                </div>
            </div>

            {/* Address & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl shadow-soft p-5">
                    <h3 className="font-semibold text-dark-900 mb-2 text-sm">Shipping Address</h3>
                    <p className="text-sm text-dark-800">{order.shippingAddress?.fullName}</p>
                    <p className="text-xs text-dark-600">{order.shippingAddress?.phone}</p>
                    <p className="text-xs text-dark-600">{order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-soft p-5">
                    <h3 className="font-semibold text-dark-900 mb-2 text-sm">Payment</h3>
                    <p className="text-sm capitalize">{order.paymentInfo?.method}</p>
                    <p className={`text-xs ${order.paymentInfo?.isPaid ? "text-green-600" : "text-yellow-600"}`}>{order.paymentInfo?.isPaid ? "✅ Paid" : "⏳ Pending"}</p>
                </div>
            </div>
        </div>
    );
};
export default OrderDetail;
