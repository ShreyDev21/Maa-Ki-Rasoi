import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, Search } from "lucide-react";
import { productAPI, categoryAPI } from "../../api/services.js";
import ProductCard from "../../components/ui/ProductCard.jsx";

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        category: searchParams.get("category") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        sort: searchParams.get("sort") || "-createdAt",
        isVeg: searchParams.get("isVeg") || "",
        page: searchParams.get("page") || 1,
    });

    useEffect(() => {
        categoryAPI.getAll().then((res) => setCategories(res.data.data)).catch(() => { });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters.page, filters.sort, filters.category]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            Object.entries(filters).forEach(([key, val]) => {
                if (val) params[key] = val;
            });
            const { data } = await productAPI.getAll(params);
            setProducts(data.data.products);
            setPagination(data.data.pagination);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters((prev) => ({ ...prev, page: 1 }));
        fetchProducts();
    };

    const clearFilters = () => {
        setFilters({ search: "", category: "", minPrice: "", maxPrice: "", sort: "-createdAt", isVeg: "", page: 1 });
        setSearchParams({});
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-dark-900">Our Products</h1>
                    <p className="text-dark-600 text-sm mt-1">
                        {pagination.total || 0} products found
                    </p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-soft text-sm font-medium"
                >
                    <Filter size={16} /> Filters
                </button>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Filters */}
                <aside className={`${showFilters ? "fixed inset-0 z-50 bg-black/50 lg:relative lg:bg-transparent" : "hidden"} lg:block lg:w-64 flex-shrink-0`}>
                    <div className={`${showFilters ? "absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto" : ""} lg:relative lg:w-auto lg:p-0`}>
                        {showFilters && (
                            <button onClick={() => setShowFilters(false)} className="lg:hidden absolute top-4 right-4">
                                <X size={20} />
                            </button>
                        )}

                        <div className="bg-white rounded-2xl shadow-soft p-5 space-y-5 lg:sticky lg:top-24">
                            <h3 className="font-semibold text-dark-900">Filters</h3>

                            {/* Search */}
                            <form onSubmit={handleSearch}>
                                <div className="relative">
                                    <input type="text" placeholder="Search..." value={filters.search}
                                        onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                                        className="w-full pl-3 pr-9 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
                                    />
                                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-dark-600">
                                        <Search size={16} />
                                    </button>
                                </div>
                            </form>

                            {/* Categories */}
                            <div>
                                <p className="text-xs font-semibold text-dark-600 uppercase mb-2">Category</p>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    <button onClick={() => setFilters((p) => ({ ...p, category: "", page: 1 }))}
                                        className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!filters.category ? "bg-primary-50 text-primary-700 font-medium" : "hover:bg-gray-50"}`}>
                                        All
                                    </button>
                                    {categories.map((cat) => (
                                        <button key={cat._id} onClick={() => setFilters((p) => ({ ...p, category: cat._id, page: 1 }))}
                                            className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${filters.category === cat._id ? "bg-primary-50 text-primary-700 font-medium" : "hover:bg-gray-50"}`}>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <p className="text-xs font-semibold text-dark-600 uppercase mb-2">Price Range</p>
                                <div className="flex gap-2">
                                    <input type="number" placeholder="Min" value={filters.minPrice}
                                        onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                                    />
                                    <input type="number" placeholder="Max" value={filters.maxPrice}
                                        onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <p className="text-xs font-semibold text-dark-600 uppercase mb-2">Sort By</p>
                                <select value={filters.sort}
                                    onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400">
                                    <option value="-createdAt">Newest First</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="-price">Price: High to Low</option>
                                    <option value="-ratingsAverage">Top Rated</option>
                                    <option value="-totalSold">Best Selling</option>
                                </select>
                            </div>

                            {/* Veg Filter */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={filters.isVeg === "true"}
                                    onChange={(e) => setFilters((p) => ({ ...p, isVeg: e.target.checked ? "true" : "" }))}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-dark-800">🌱 Veg Only</span>
                            </label>

                            <div className="flex gap-2">
                                <button onClick={fetchProducts}
                                    className="flex-1 bg-gradient-primary text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                                    Apply
                                </button>
                                <button onClick={clearFilters}
                                    className="px-4 py-2 text-sm text-dark-600 hover:text-dark-900 border border-gray-200 rounded-xl transition-colors">
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-cream-100 rounded-2xl h-72 animate-pulse" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                                {products.map((p) => <ProductCard key={p._id} product={p} />)}
                            </div>
                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {[...Array(pagination.pages)].map((_, i) => (
                                        <button key={i} onClick={() => setFilters((p) => ({ ...p, page: i + 1 }))}
                                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${pagination.page === i + 1
                                                    ? "bg-primary-600 text-white shadow-lg"
                                                    : "bg-white text-dark-800 hover:bg-primary-50 shadow-soft"
                                                }`}>
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <span className="text-6xl mb-4 block">🔍</span>
                            <h3 className="text-xl font-semibold text-dark-900 mb-2">No products found</h3>
                            <p className="text-dark-600">Try adjusting your filters or search query</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
