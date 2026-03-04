import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ShoppingCart, User, Search, Menu, X, LogOut, Package,
    LayoutDashboard, ShoppingBag, Users, FolderOpen,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const Navbar = () => {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate("/");
        setUserMenuOpen(false);
    };

    // Nav links based on role
    const customerLinks = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Products" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
    ];

    const adminLinks = [
        { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { to: "/admin/products", label: "Products", icon: <ShoppingBag size={16} /> },
        { to: "/admin/categories", label: "Categories", icon: <FolderOpen size={16} /> },
        { to: "/admin/orders", label: "Orders", icon: <Package size={16} /> },
        { to: "/admin/users", label: "Users", icon: <Users size={16} /> },
    ];

    const navLinks = isAdmin ? adminLinks : customerLinks;

    return (
        <nav className="sticky top-0 z-50 glass shadow-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-2xl">🍲</span>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gradient leading-tight">
                                Maa Ki Rasoi
                            </h1>
                            <p className="text-[10px] text-dark-600 -mt-1 hidden sm:block">
                                {isAdmin ? "Admin Panel" : "Homemade with Love"}
                            </p>
                        </div>
                    </Link>

                    {/* Search Bar — Desktop (customer only) */}
                    {!isAdmin && (
                        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search pickles, food items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2.5 rounded-full border border-primary-200 
                             bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-400 
                             focus:border-transparent text-sm transition-all"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full 
                             bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                >
                                    <Search size={16} />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Nav Links — Desktop */}
                    <div className="hidden md:flex items-center gap-5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-dark-800 hover:text-primary-600 font-medium text-sm transition-colors flex items-center gap-1.5"
                            >
                                {link.icon} {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Cart (customer only) */}
                        {isAuthenticated && !isAdmin && (
                            <Link to="/cart" className="relative p-2 rounded-full hover:bg-primary-50 transition-colors">
                                <ShoppingCart size={22} className="text-dark-800" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs 
                                   font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 p-2 rounded-full hover:bg-primary-50 transition-colors"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? "bg-amber-100" : "bg-primary-100"}`}>
                                        <span className={`font-semibold text-sm ${isAdmin ? "text-amber-700" : "text-primary-700"}`}>
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated 
                                    border border-gray-100 py-2 z-20 animate-fade-in">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="font-semibold text-sm text-dark-900">{user?.name}</p>
                                                <p className="text-xs text-dark-600">{user?.email}</p>
                                                {isAdmin && (
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>

                                            {isAdmin ? (
                                                <>
                                                    <Link to="/admin" onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-800 hover:bg-primary-50 transition-colors">
                                                        <LayoutDashboard size={16} /> Dashboard
                                                    </Link>
                                                    <Link to="/admin/products" onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-800 hover:bg-primary-50 transition-colors">
                                                        <ShoppingBag size={16} /> Manage Products
                                                    </Link>
                                                    <Link to="/admin/orders" onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-800 hover:bg-primary-50 transition-colors">
                                                        <Package size={16} /> Manage Orders
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-800 hover:bg-primary-50 transition-colors">
                                                        <User size={16} /> My Profile
                                                    </Link>
                                                    <Link to="/orders" onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark-800 hover:bg-primary-50 transition-colors">
                                                        <Package size={16} /> My Orders
                                                    </Link>
                                                </>
                                            )}

                                            <hr className="my-1 border-gray-100" />
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm 
                                   text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-gradient-primary text-white px-5 py-2 rounded-full text-sm 
                           font-semibold hover:shadow-lg hover:scale-105 transition-all 
                           duration-200 active:scale-95"
                            >
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X size={24} className="text-dark-800" />
                            ) : (
                                <Menu size={24} className="text-dark-800" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 border-t border-gray-100 animate-fade-in">
                        {!isAdmin && (
                            <form onSubmit={handleSearch} className="mt-3 mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 rounded-full border border-primary-200 
                               bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary-500 text-white"
                                    >
                                        <Search size={16} />
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-2.5 text-sm font-medium text-dark-800 
                             hover:bg-primary-50 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    {link.icon} {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
