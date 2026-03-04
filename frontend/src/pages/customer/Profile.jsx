import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { userAPI, authAPI } from "../../api/services.js";
import { User, MapPin, Lock } from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
    const { user, fetchUser } = useAuth();
    const [tab, setTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });

    const updateProfile = async (e) => {
        e.preventDefault(); setLoading(true);
        try { await userAPI.updateProfile(profileForm); await fetchUser(); toast.success("Profile updated!"); }
        catch (e) { toast.error(e.response?.data?.message || "Failed"); }
        finally { setLoading(false); }
    };

    const changePw = async (e) => {
        e.preventDefault(); setLoading(true);
        try { await authAPI.changePassword(pwForm); setPwForm({ currentPassword: "", newPassword: "" }); toast.success("Password changed!"); }
        catch (e) { toast.error(e.response?.data?.message || "Failed"); }
        finally { setLoading(false); }
    };

    const tabs = [
        { id: "profile", label: "Profile", icon: <User size={16} /> },
        { id: "addresses", label: "Addresses", icon: <MapPin size={16} /> },
        { id: "password", label: "Password", icon: <Lock size={16} /> },
    ];
    const inputCls = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400";

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-dark-900 mb-6">My Profile</h1>
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {tabs.map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? "bg-primary-600 text-white shadow-lg" : "bg-white text-dark-700 shadow-soft hover:shadow-card"}`}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {tab === "profile" && (
                <form onSubmit={updateProfile} className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-700">{user?.name?.charAt(0)}</div>
                        <div><p className="font-semibold text-dark-900">{user?.name}</p><p className="text-sm text-dark-600">{user?.email}</p></div>
                    </div>
                    <input value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} placeholder="Name" className={inputCls} />
                    <input value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} placeholder="Phone" className={inputCls} />
                    <button type="submit" disabled={loading} className="bg-gradient-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            )}

            {tab === "addresses" && (
                <div className="bg-white rounded-2xl shadow-soft p-6">
                    <h3 className="font-semibold mb-4">Saved Addresses</h3>
                    {user?.addresses?.length > 0 ? (
                        <div className="space-y-3">
                            {user.addresses.map((a) => (
                                <div key={a._id} className="p-4 border border-gray-200 rounded-xl">
                                    <p className="font-medium text-dark-900">{a.fullName} · {a.phone}</p>
                                    <p className="text-sm text-dark-600">{a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}</p>
                                    <p className="text-sm text-dark-600">{a.city}, {a.state} - {a.pincode}</p>
                                    {a.isDefault && <span className="inline-block mt-1 text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium">Default</span>}
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-dark-600 text-sm">No saved addresses. Add one during checkout!</p>}
                </div>
            )}

            {tab === "password" && (
                <form onSubmit={changePw} className="bg-white rounded-2xl shadow-soft p-6 space-y-4 max-w-md">
                    <input type="password" required placeholder="Current Password" value={pwForm.currentPassword} onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))} className={inputCls} />
                    <input type="password" required placeholder="New Password" value={pwForm.newPassword} onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))} className={inputCls} />
                    <button type="submit" disabled={loading} className="bg-gradient-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {loading ? "Changing..." : "Change Password"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Profile;
