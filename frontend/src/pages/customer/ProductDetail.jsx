import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Minus, Plus, Star, ArrowLeft } from "lucide-react";
import { productAPI, reviewAPI } from "../../api/services.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import toast from "react-hot-toast";

const ProductDetail = () => {
    const { slug } = useParams();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [activeImg, setActiveImg] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await productAPI.getBySlug(slug);
                setProduct(data.data);
                const revRes = await reviewAPI.getProductReviews(data.data._id);
                setReviews(revRes.data.data.reviews);
            } catch { /* ignore */ } finally { setLoading(false); }
        };
        fetch();
    }, [slug]);

    const handleAdd = async () => {
        if (!isAuthenticated) { toast.error("Please login first"); return; }
        try {
            await addToCart(product._id, qty);
            toast.success("Added to cart!");
        } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-cream-100 rounded-2xl animate-pulse" />
                <div className="space-y-4">
                    <div className="h-8 bg-cream-100 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-cream-100 rounded animate-pulse w-1/2" />
                    <div className="h-32 bg-cream-100 rounded animate-pulse" />
                </div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <span className="text-6xl mb-4">😕</span>
            <h2 className="text-xl font-semibold mb-2">Product not found</h2>
            <Link to="/products" className="text-primary-600 font-medium">← Back to Products</Link>
        </div>
    );

    const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
    const price = hasDiscount ? product.discountPrice : product.price;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <Link to="/products" className="inline-flex items-center gap-1 text-dark-600 hover:text-primary-600 text-sm mb-6 transition-colors">
                <ArrowLeft size={16} /> Back to Products
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Images */}
                <div>
                    <div className="aspect-square bg-cream-100 rounded-2xl overflow-hidden mb-4">
                        {product.images?.[activeImg]?.url ? (
                            <img src={product.images[activeImg].url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"><span className="text-8xl">🍲</span></div>
                        )}
                    </div>
                    {product.images?.length > 1 && (
                        <div className="flex gap-2">
                            {product.images.map((img, i) => (
                                <button key={i} onClick={() => setActiveImg(i)}
                                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImg ? "border-primary-500" : "border-transparent"}`}>
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    {product.category && (
                        <span className="text-xs text-primary-600 font-semibold uppercase tracking-wider">{product.category.name}</span>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold text-dark-900 mt-1 mb-2">{product.name}</h1>

                    {product.ratingsCount > 0 && (
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className={i < Math.round(product.ratingsAverage) ? "text-accent-400 fill-accent-400" : "text-gray-200"} />
                            ))}</div>
                            <span className="text-sm text-dark-600">({product.ratingsCount} reviews)</span>
                        </div>
                    )}

                    <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-3xl font-bold text-dark-900">₹{price}</span>
                        {hasDiscount && <span className="text-lg text-dark-600 line-through">₹{product.price}</span>}
                        {hasDiscount && <span className="bg-accent-100 text-accent-700 text-xs font-bold px-2 py-1 rounded-full">
                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                        </span>}
                    </div>

                    <p className="text-dark-600 leading-relaxed mb-6">{product.description}</p>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                        {product.weight && <div className="bg-cream-50 p-3 rounded-xl"><span className="text-dark-600">Weight:</span> <span className="font-medium">{product.weight}</span></div>}
                        <div className="bg-cream-50 p-3 rounded-xl"><span className="text-dark-600">Unit:</span> <span className="font-medium">{product.unit}</span></div>
                        <div className="bg-cream-50 p-3 rounded-xl"><span className="text-dark-600">Stock:</span> <span className={`font-medium ${product.stock > 0 ? "text-primary-600" : "text-red-500"}`}>{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</span></div>
                        {product.isVeg && <div className="bg-primary-50 p-3 rounded-xl text-primary-700 font-medium">🌱 Vegetarian</div>}
                    </div>

                    {product.ingredients && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-dark-900 mb-1 text-sm">Ingredients</h3>
                            <p className="text-sm text-dark-600">{product.ingredients}</p>
                        </div>
                    )}

                    {/* Add to Cart */}
                    {product.stock > 0 && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-cream-100 rounded-xl">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:text-primary-600 transition-colors"><Minus size={16} /></button>
                                <span className="px-4 font-semibold text-dark-900">{qty}</span>
                                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3 hover:text-primary-600 transition-colors"><Plus size={16} /></button>
                            </div>
                            <button onClick={handleAdd}
                                className="flex-1 bg-gradient-primary text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95">
                                <ShoppingCart size={18} /> Add to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews */}
            <section className="mt-16">
                <h2 className="text-xl font-bold text-dark-900 mb-6">Customer Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((r) => (
                            <div key={r._id} className="bg-white p-5 rounded-2xl shadow-soft">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-semibold text-primary-700">{r.user?.name?.charAt(0)}</div>
                                        <span className="font-medium text-sm">{r.user?.name}</span>
                                    </div>
                                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < r.rating ? "text-accent-400 fill-accent-400" : "text-gray-200"} />)}</div>
                                </div>
                                {r.title && <p className="font-medium text-sm text-dark-900 mb-1">{r.title}</p>}
                                <p className="text-sm text-dark-600">{r.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-dark-600 text-center py-8">No reviews yet. Be the first to review! 🌟</p>
                )}
            </section>
        </div>
    );
};

export default ProductDetail;
