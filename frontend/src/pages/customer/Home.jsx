import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Leaf,
    Truck,
    ShieldCheck,
    Star,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { productAPI, categoryAPI } from "../../api/services.js";
import ProductCard from "../../components/ui/ProductCard.jsx";

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.allSettled([
                    productAPI.getFeatured(),
                    categoryAPI.getAll(),
                ]);
                if (prodRes.status === "fulfilled")
                    setFeaturedProducts(prodRes.value.data.data);
                if (catRes.status === "fulfilled")
                    setCategories(catRes.value.data.data);
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const features = [
        {
            icon: <Leaf className="w-6 h-6" />,
            title: "100% Homemade",
            desc: "Made fresh in our kitchen with traditional recipes",
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: "Fast Delivery",
            desc: "Delivered to your doorstep within 3-5 days",
        },
        {
            icon: <ShieldCheck className="w-6 h-6" />,
            title: "Quality Assured",
            desc: "No preservatives, no artificial colors",
        },
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            text: "The mango pickle tastes exactly like my grandmother used to make. Absolutely authentic and delicious!",
            rating: 5,
        },
        {
            name: "Rahul Verma",
            text: "Best homemade food I've ordered online. The Ruh Afza is pure and refreshing. Will order again!",
            rating: 5,
        },
        {
            name: "Anita Patel",
            text: "Love the variety of pickles and preserves. Everything is fresh and packed with care. Highly recommended!",
            rating: 4,
        },
    ];

    return (
        <div className="animate-fade-in">
            {/* ─── HERO SECTION ──────────────────────────────────── */}
            <section className="bg-gradient-hero relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-slide-up">
                            <span className="inline-block bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                                🌿 100% Natural & Homemade
                            </span>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-dark-900 leading-tight mb-6">
                                Taste the Love of{" "}
                                <span className="text-gradient">Maa Ki Rasoi</span>
                            </h1>
                            <p className="text-lg text-dark-600 mb-8 max-w-lg">
                                Authentic homemade pickles, preserves, chutneys, and more — made
                                with love, traditional recipes, and the freshest ingredients.
                                Delivered right to your doorstep.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/products"
                                    className="bg-gradient-primary text-white px-8 py-3.5 rounded-full font-semibold
                             shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300
                             flex items-center gap-2 active:scale-95"
                                >
                                    Shop Now <ArrowRight size={18} />
                                </Link>
                                <Link
                                    to="/about"
                                    className="border-2 border-primary-400 text-primary-700 px-8 py-3.5 rounded-full
                             font-semibold hover:bg-primary-50 transition-all duration-300"
                                >
                                    Our Story
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 mt-10">
                                {[
                                    { value: "500+", label: "Happy Customers" },
                                    { value: "50+", label: "Products" },
                                    { value: "4.9", label: "Rating ⭐" },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <p className="text-2xl font-bold text-dark-900">
                                            {stat.value}
                                        </p>
                                        <p className="text-xs text-dark-600">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="relative w-80 h-80 md:w-96 md:h-96">
                                <div className="absolute inset-0 bg-primary-200/40 rounded-full animate-pulse" />
                                <div
                                    className="absolute inset-4 bg-gradient-to-br from-primary-100 to-cream-200 
                                rounded-full flex items-center justify-center"
                                >
                                    <span className="text-8xl md:text-9xl animate-float">🫙</span>
                                </div>
                                {/* Floating badges */}
                                <div
                                    className="absolute -left-4 top-1/4 bg-white rounded-2xl shadow-card 
                                px-4 py-3 animate-float"
                                    style={{ animationDelay: "0.5s" }}
                                >
                                    <p className="text-xs font-semibold text-primary-700">
                                        Fresh Daily
                                    </p>
                                    <p className="text-[10px] text-dark-600">Made with ❤️</p>
                                </div>
                                <div
                                    className="absolute -right-2 bottom-1/4 bg-white rounded-2xl shadow-card 
                                px-4 py-3 animate-float"
                                    style={{ animationDelay: "1s" }}
                                >
                                    <p className="text-xs font-semibold text-accent-600">
                                        No Preservatives
                                    </p>
                                    <p className="text-[10px] text-dark-600">100% Natural</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── PROMOTIONAL BANNERS ───────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            bg: "from-green-500 to-green-700",
                            off: "30% OFF",
                            title: "Fresh Pickles",
                            emoji: "🥒",
                        },
                        {
                            bg: "from-amber-500 to-amber-700",
                            off: "50% OFF",
                            title: "Premium Preserves",
                            emoji: "🍯",
                        },
                        {
                            bg: "from-rose-500 to-rose-700",
                            off: "25% OFF",
                            title: "Ruh Afza Special",
                            emoji: "🫗",
                        },
                    ].map((banner) => (
                        <Link
                            to="/products"
                            key={banner.title}
                            className={`bg-gradient-to-r ${banner.bg} rounded-2xl p-5 text-white 
                         flex items-center justify-between hover:shadow-xl hover:scale-[1.02] 
                         transition-all duration-300 group`}
                        >
                            <div>
                                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                                    {banner.off}
                                </span>
                                <p className="font-bold mt-2 text-lg">{banner.title}</p>
                                <p className="text-xs text-white/80 flex items-center gap-1 mt-1 group-hover:gap-2 transition-all">
                                    Shop Now <ArrowRight size={14} />
                                </p>
                            </div>
                            <span className="text-5xl">{banner.emoji}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── FEATURES ──────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-soft 
                         hover:shadow-card transition-shadow duration-300"
                        >
                            <div className="p-3 bg-primary-50 rounded-xl text-primary-600 flex-shrink-0">
                                {f.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-dark-900 mb-1">{f.title}</h3>
                                <p className="text-sm text-dark-600">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ─── CATEGORIES ────────────────────────────────────── */}
            {categories.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-dark-900">
                                Product Categories
                            </h2>
                            <p className="text-dark-600 mt-1">
                                Explore our range of homemade delights
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat._id}
                                to={`/products?category=${cat._id}`}
                                className="group flex flex-col items-center p-4 bg-white rounded-2xl shadow-soft 
                           hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                            >
                                <div
                                    className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center 
                                mb-3 group-hover:bg-primary-100 transition-colors"
                                >
                                    {cat.image?.url ? (
                                        <img
                                            src={cat.image.url}
                                            alt={cat.name}
                                            className="w-10 h-10 object-contain"
                                        />
                                    ) : (
                                        <span className="text-2xl">🍲</span>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-dark-800 text-center">
                                    {cat.name}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── FEATURED PRODUCTS ─────────────────────────────── */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-dark-900">
                                Top Products
                            </h2>
                            <p className="text-dark-600 mt-1">
                                Our most loved homemade treasures
                            </p>
                        </div>
                        <Link
                            to="/products"
                            className="hidden sm:flex items-center gap-1 text-primary-600 font-medium text-sm
                         hover:gap-2 transition-all"
                        >
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-cream-100 rounded-2xl h-72 animate-pulse"
                                />
                            ))}
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 block">🍲</span>
                            <p className="text-dark-600">
                                Products coming soon! Stay tuned.
                            </p>
                        </div>
                    )}

                    <div className="sm:hidden text-center mt-6">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-1 text-primary-600 font-medium text-sm"
                        >
                            View All Products <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── ABOUT/STORY SECTION ───────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative flex justify-center">
                        <div
                            className="w-72 h-72 md:w-80 md:h-80 bg-gradient-to-br from-cream-200 to-primary-100 
                            rounded-3xl flex items-center justify-center rotate-3 shadow-card"
                        >
                            <span className="text-8xl -rotate-3">👩‍🍳</span>
                        </div>
                        <div
                            className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-elevated 
                            p-4 text-center"
                        >
                            <p className="text-2xl font-bold text-primary-600">25+</p>
                            <p className="text-xs text-dark-600">Years of Tradition</p>
                        </div>
                    </div>

                    <div>
                        <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                            Our Story
                        </span>
                        <h2 className="text-3xl font-bold text-dark-900 mt-4 mb-4">
                            Made with{" "}
                            <span className="text-gradient">Mother's Love</span>
                        </h2>
                        <p className="text-dark-600 leading-relaxed mb-4">
                            Every jar of pickle, every bottle of preserve at Maa Ki Rasoi
                            carries the warmth and love of a mother's kitchen from Indore. Our recipes
                            have been perfected over generations, using only the freshest
                            ingredients and traditional Malwa methods.
                        </p>
                        <p className="text-dark-600 leading-relaxed mb-6">
                            No shortcuts. No preservatives. Just pure, authentic taste that
                            takes you back to happy family meals.
                        </p>
                        <Link
                            to="/about"
                            className="inline-flex items-center gap-2 text-primary-600 font-semibold 
                         hover:gap-3 transition-all"
                        >
                            Read Full Story <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ──────────────────────────────────── */}
            <section className="bg-primary-50/50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-dark-900">
                            What Our Customers Say
                        </h2>
                        <p className="text-dark-600 mt-2">
                            Real reviews from our happy food lovers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-card 
                           transition-shadow duration-300"
                            >
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, j) => (
                                        <Star
                                            key={j}
                                            size={16}
                                            className={
                                                j < t.rating
                                                    ? "text-accent-400 fill-accent-400"
                                                    : "text-gray-200"
                                            }
                                        />
                                    ))}
                                </div>
                                <p className="text-dark-700 text-sm leading-relaxed mb-4 italic">
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                        <span className="text-primary-700 font-semibold text-sm">
                                            {t.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-dark-900">
                                            {t.name}
                                        </p>
                                        <p className="text-xs text-dark-600">Verified Buyer</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA / NEWSLETTER ──────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div
                    className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl 
                        p-8 md:p-12 text-center text-white shadow-elevated"
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Ready to Taste the Difference?
                    </h2>
                    <p className="text-primary-100 mb-6 max-w-lg mx-auto">
                        Join our family of food lovers. Get 10% off on your first order!
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 
                       rounded-full font-bold hover:shadow-xl hover:scale-105 
                       transition-all duration-300 active:scale-95"
                    >
                        Start Shopping <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
