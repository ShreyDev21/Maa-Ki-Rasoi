import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();

    const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
    const displayPrice = hasDiscount ? product.discountPrice : product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            return;
        }

        try {
            await addToCart(product._id, 1);
            toast.success(`${product.name} added to cart!`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add to cart");
        }
    };

    return (
        <Link
            to={`/products/${product.slug}`}
            className="group bg-white rounded-2xl shadow-soft hover:shadow-card overflow-hidden 
                 transition-all duration-300 hover:-translate-y-1 flex flex-col"
        >
            {/* Image */}
            <div className="relative aspect-square bg-cream-100 overflow-hidden">
                {product.images?.[0]?.url ? (
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">🍲</span>
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {hasDiscount && (
                        <span className="bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {discountPercent}% OFF
                        </span>
                    )}
                    {product.isVeg && (
                        <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            🌱 VEG
                        </span>
                    )}
                </div>

                {/* Quick Add */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-3 right-3 bg-primary-500 text-white p-2.5 rounded-full 
                     shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 
                     group-hover:translate-y-0 transition-all duration-300 
                     hover:bg-primary-600 active:scale-90"
                >
                    <ShoppingCart size={16} />
                </button>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col">
                {product.category && (
                    <span className="text-[11px] text-primary-600 font-medium uppercase tracking-wider mb-1">
                        {product.category.name}
                    </span>
                )}
                <h3 className="font-semibold text-dark-900 text-sm line-clamp-2 mb-2 flex-1">
                    {product.name}
                </h3>
                {/* Rating */}
                {product.ratingsCount > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                        <Star size={12} className="text-accent-400 fill-accent-400" />
                        <span className="text-xs text-dark-600">
                            {product.ratingsAverage} ({product.ratingsCount})
                        </span>
                    </div>
                )}
                {/* Price */}
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-dark-900">
                        ₹{displayPrice}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-dark-600 line-through">
                            ₹{product.price}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
