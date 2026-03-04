import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authAPI } from "../../api/services.js";
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("register"); // "register" | "otp"
    const [email, setEmail] = useState("");
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
    const [otp, setOtp] = useState("");
    const [resending, setResending] = useState(false);

    // Step 1: Register
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authAPI.register(form);
            setEmail(form.email);
            setStep("otp");
            toast.success(data.message || "OTP sent to your email!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally { setLoading(false); }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await authAPI.verifyOTP({ email, otp });
            toast.success(data.message || "Email verified! 🎉");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally { setLoading(false); }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        setResending(true);
        try {
            const { data } = await authAPI.resendOTP({ email });
            toast.success(data.message || "New OTP sent!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend");
        } finally { setResending(false); }
    };

    const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all";

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-5xl">🍲</span>
                    <h1 className="text-2xl font-bold text-dark-900 mt-4">
                        {step === "register" ? "Create Account" : "Verify Email"}
                    </h1>
                    <p className="text-dark-600 mt-1">
                        {step === "register"
                            ? "Join the Maa Ki Rasoi family"
                            : `Enter the 6-digit code sent to ${email}`}
                    </p>
                </div>

                {/* ─── STEP 1: Registration Form ─── */}
                {step === "register" && (
                    <form onSubmit={handleRegister} className="bg-white rounded-2xl shadow-card p-8 space-y-4">
                        <div>
                            <label className="text-sm font-medium text-dark-800 mb-1 block">Full Name</label>
                            <input type="text" required value={form.name}
                                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                className={inputCls} placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-dark-800 mb-1 block">Email</label>
                            <input type="email" required value={form.email}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                className={inputCls} placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-dark-800 mb-1 block">Phone (optional)</label>
                            <input type="tel" value={form.phone}
                                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                className={inputCls} placeholder="+91 98765 43210" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-dark-800 mb-1 block">Password</label>
                            <div className="relative">
                                <input type={show ? "text" : "password"} required value={form.password}
                                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                    className={`${inputCls} pr-10`} placeholder="Min 6 chars, 1 upper, 1 number" />
                                <button type="button" onClick={() => setShow(!show)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-600">
                                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                        <p className="text-center text-sm text-dark-600">Already have an account?{" "}
                            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Login</Link>
                        </p>
                    </form>
                )}

                {/* ─── STEP 2: OTP Verification ─── */}
                {step === "otp" && (
                    <form onSubmit={handleVerifyOTP} className="bg-white rounded-2xl shadow-card p-8 space-y-5">
                        <div>
                            <label className="text-sm font-medium text-dark-800 mb-2 block">Enter OTP</label>
                            <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                maxLength={6} inputMode="numeric" autoComplete="one-time-code"
                                className="w-full px-4 py-4 border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
                                placeholder="● ● ● ● ● ●" />
                        </div>

                        <button type="submit" disabled={loading || otp.length !== 6}
                            className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                            {loading ? "Verifying..." : "Verify Email"}
                        </button>

                        <div className="text-center text-sm text-dark-600">
                            Didn&apos;t receive the code?{" "}
                            <button type="button" onClick={handleResendOTP} disabled={resending}
                                className="text-primary-600 font-semibold hover:underline disabled:opacity-50">
                                {resending ? "Sending..." : "Resend OTP"}
                            </button>
                        </div>

                        <button type="button" onClick={() => setStep("register")}
                            className="flex items-center gap-1 text-sm text-dark-600 hover:text-primary-600 mx-auto">
                            <ArrowLeft size={14} /> Back to registration
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
