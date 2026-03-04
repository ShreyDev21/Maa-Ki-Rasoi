import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { orderAPI, paymentAPI } from "../../api/services.js";
import toast from "react-hot-toast";

const Checkout = () => {
    const { cart, fetchCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const [address, setAddress] = useState({
        fullName: user?.name || "", phone: user?.phone || "",
        addressLine1: "", addressLine2: "", city: "", state: "", pincode: "",
    });

    // Use saved address if available
    const savedAddresses = user?.addresses || [];
    const selectAddress = (addr) => setAddress({ ...addr });

    const shipping = cart.totalAmount >= 500 ? 0 : 50;
    const total = cart.totalAmount + shipping;

    const handleOrder = async (e) => {
        e.preventDefault();
        if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
            toast.error("Please fill all required address fields"); return;
        }
        setLoading(true);
        try {
            const { data: orderData } = await orderAPI.create({ shippingAddress: address, paymentMethod, notes: "" });
            const order = orderData.data;

            if (paymentMethod === "cod") {
                toast.success("Order placed successfully!");
                await fetchCart();
                navigate(`/orders/${order._id}`);
                return;
            }

            // Razorpay
            const { data: payData } = await paymentAPI.createOrder({ orderId: order._id });
            const { razorpayOrderId, amount, currency, keyId } = payData.data;

            const options = {
                key: keyId, amount, currency, name: "Maa Ki Rasoi", description: `Order #${order.orderNumber}`,
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        await paymentAPI.verify({ ...response, orderId: order._id });
                        toast.success("Payment successful! 🎉");
                        await fetchCart();
                        navigate(`/orders/${order._id}`);
                    } catch { toast.error("Payment verification failed"); }
                },
                prefill: { name: user?.name, email: user?.email, contact: address.phone },
                theme: { color: "#16a34a" },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", () => toast.error("Payment failed"));
            rzp.open();
        } catch (e) {
            toast.error(e.response?.data?.message || "Order failed");
        } finally { setLoading(false); }
    };

    const inputCls = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-dark-900 mb-8">Checkout</h1>
            <form onSubmit={handleOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Saved Addresses */}
                    {savedAddresses.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-soft p-5">
                            <h3 className="font-semibold text-dark-900 mb-3">Saved Addresses</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {savedAddresses.map((a) => (
                                    <button key={a._id} type="button" onClick={() => selectAddress(a)}
                                        className="text-left p-3 border border-gray-200 rounded-xl hover:border-primary-400 transition-colors text-sm">
                                        <p className="font-medium">{a.fullName}</p>
                                        <p className="text-dark-600 text-xs">{a.addressLine1}, {a.city} - {a.pincode}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Address Form */}
                    <div className="bg-white rounded-2xl shadow-soft p-5">
                        <h3 className="font-semibold text-dark-900 mb-4">Shipping Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input required placeholder="Full Name *" value={address.fullName} onChange={(e) => setAddress((p) => ({ ...p, fullName: e.target.value }))} className={inputCls} />
                            <input required placeholder="Phone *" value={address.phone} onChange={(e) => setAddress((p) => ({ ...p, phone: e.target.value }))} className={inputCls} />
                            <input required placeholder="Address Line 1 *" value={address.addressLine1} onChange={(e) => setAddress((p) => ({ ...p, addressLine1: e.target.value }))} className={`${inputCls} sm:col-span-2`} />
                            <input placeholder="Address Line 2" value={address.addressLine2} onChange={(e) => setAddress((p) => ({ ...p, addressLine2: e.target.value }))} className={`${inputCls} sm:col-span-2`} />
                            <input required placeholder="City *" value={address.city} onChange={(e) => setAddress((p) => ({ ...p, city: e.target.value }))} className={inputCls} />
                            <input required placeholder="State *" value={address.state} onChange={(e) => setAddress((p) => ({ ...p, state: e.target.value }))} className={inputCls} />
                            <input required placeholder="Pincode *" value={address.pincode} onChange={(e) => setAddress((p) => ({ ...p, pincode: e.target.value }))} className={inputCls} />
                        </div>
                    </div>
                    {/* Payment */}
                    <div className="bg-white rounded-2xl shadow-soft p-5">
                        <h3 className="font-semibold text-dark-900 mb-4">Payment Method</h3>
                        <div className="space-y-2">
                            {[{ val: "razorpay", label: "Pay Online (Razorpay)", desc: "UPI, Cards, Netbanking" },
                            { val: "cod", label: "Cash on Delivery", desc: "Pay when it arrives" }].map((m) => (
                                <label key={m.val} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === m.val ? "border-primary-400 bg-primary-50" : "border-gray-200 hover:border-gray-300"}`}>
                                    <input type="radio" name="payment" value={m.val} checked={paymentMethod === m.val}
                                        onChange={() => setPaymentMethod(m.val)} className="text-primary-600 focus:ring-primary-500" />
                                    <div><p className="font-medium text-sm">{m.label}</p><p className="text-xs text-dark-600">{m.desc}</p></div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                        <h3 className="font-semibold text-dark-900 mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm mb-4">
                            {cart.items.map((item) => (
                                <div key={item._id} className="flex justify-between">
                                    <span className="text-dark-600 truncate pr-2">{item.product?.name} × {item.quantity}</span>
                                    <span className="font-medium flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <hr className="border-gray-100 my-3" />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-dark-600">Subtotal</span><span>₹{cart.totalAmount?.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-dark-600">Shipping</span><span className="text-primary-600">{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between text-lg"><span className="font-semibold">Total</span><span className="font-bold">₹{total.toFixed(2)}</span></div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="mt-6 w-full bg-gradient-primary text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 active:scale-95">
                            {loading ? "Processing..." : paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
