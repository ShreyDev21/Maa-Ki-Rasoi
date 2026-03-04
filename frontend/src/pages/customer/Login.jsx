import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login(form);
            toast.success("Welcome back! 🍲");
            const isAdmin = result.data.user.role === "admin";
            navigate(isAdmin ? "/admin" : "/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-5xl">🍲</span>
                    <h1 className="text-2xl font-bold text-dark-900 mt-4">Welcome Back</h1>
                    <p className="text-dark-600 mt-1">Login to continue shopping</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-dark-800 mb-1 block">Email</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-dark-800 mb-1 block">Password</label>
                        <div className="relative">
                            <input type={show ? "text" : "password"} required value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all" placeholder="••••••" />
                            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-600">
                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <p className="text-center text-sm text-dark-600">Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-primary-600 font-semibold hover:underline">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
