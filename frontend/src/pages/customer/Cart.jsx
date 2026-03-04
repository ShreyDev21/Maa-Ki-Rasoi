import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import toast from "react-hot-toast";

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();

    const handleQty = async (productId, newQty) => {
        try { await updateQuantity(productId, newQty); } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
    };

    const handleRemove = async (productId, name) => {
        try { await removeFromCart(productId); toast.success(`${name} removed`); } catch { toast.error("Failed to remove"); }
    };

    const handleClear = async () => {
        try { await clearCart(); toast.success("Cart cleared"); } catch { toast.error("Failed"); }
    };

    if (cart.items.length === 0) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
            <ShoppingBag size={64} className="text-primary-200 mb-4" />
            <h2 className="text-2xl font-bold text-dark-900 mb-2">Your cart is empty</h2>
            <p className="text-dark-600 mb-6">Looks like you haven&apos;t added anything yet</p>
            <Link to="/products" className="bg-gradient-primary text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                Browse Products <ArrowRight size={16} />
            </Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-dark-900">Shopping Cart</h1>
                <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors">Clear Cart</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.items.map((item) => {
                        const product = item.product;
                        if (!product) return null;
                        return (
                            <div key={item._id} className="bg-white rounded-2xl shadow-soft p-4 flex gap-4">
                                <Link to={`/products/${product.slug}`} className="w-20 h-20 md:w-24 md:h-24 bg-cream-100 rounded-xl overflow-hidden flex-shrink-0">
                                    {product.images?.[0]?.url ? (
                                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                    ) : <div className="w-full h-full flex items-center justify-center text-3xl">🍲</div>}
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/products/${product.slug}`} className="font-semibold text-dark-900 text-sm hover:text-primary-600 transition-colors line-clamp-2">{product.name}</Link>
                                    <p className="text-dark-600 text-xs mt-0.5">₹{item.price} per {product.unit}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center bg-cream-100 rounded-lg">
                                            <button onClick={() => handleQty(product._id, Math.max(1, item.quantity - 1))} className="p-1.5 hover:text-primary-600"><Minus size={14} /></button>
                                            <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                                            <button onClick={() => handleQty(product._id, item.quantity + 1)} className="p-1.5 hover:text-primary-600"><Plus size={14} /></button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-dark-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            <button onClick={() => handleRemove(product._id, product.name)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary */}
                <div>
                    <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                        <h3 className="font-semibold text-dark-900 mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-dark-600">Subtotal</span><span className="font-medium">₹{cart.totalAmount?.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span className="text-dark-600">Shipping</span><span className="font-medium text-primary-600">{cart.totalAmount >= 500 ? "FREE" : "₹50"}</span></div>
                            {cart.totalAmount < 500 && <p className="text-xs text-dark-600 bg-primary-50 p-2 rounded-lg">Add ₹{(500 - cart.totalAmount).toFixed(2)} more for free shipping!</p>}
                            <hr className="border-gray-100" />
                            <div className="flex justify-between text-lg"><span className="font-semibold">Total</span><span className="font-bold text-dark-900">₹{(cart.totalAmount + (cart.totalAmount >= 500 ? 0 : 50)).toFixed(2)}</span></div>
                        </div>
                        <Link to="/checkout" className="mt-6 w-full bg-gradient-primary text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95">
                            Proceed to Checkout <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
