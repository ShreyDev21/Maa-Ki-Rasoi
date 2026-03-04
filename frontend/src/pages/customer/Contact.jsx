import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import toast from "react-hot-toast";

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate send — backend integration can be added later
        await new Promise((r) => setTimeout(r, 1000));
        toast.success("Message sent! We'll get back to you soon 🍲");
        setForm({ name: "", email: "", subject: "", message: "" });
        setLoading(false);
    };

    const inputCls = "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all";

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <section className="bg-gradient-hero py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-5xl mb-4 block">📬</span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-900 mb-4">Get in <span className="text-gradient">Touch</span></h1>
                    <p className="text-lg text-dark-600 max-w-xl mx-auto">Have a question, feedback, or just want to say hi? We&apos;d love to hear from you!</p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        {[
                            { icon: <MapPin size={20} />, title: "Visit Us", lines: ["Maa Ki Rasoi", "Malharganj, Indore", "Madhya Pradesh, India"] },
                            { icon: <Phone size={20} />, title: "Call Us", lines: ["+91 99931 27400"] },
                            { icon: <Mail size={20} />, title: "Email Us", lines: ["maakirasoi.indore@gmail.com"] },
                            { icon: <Clock size={20} />, title: "Working Hours", lines: ["Mon - Sat: 9AM - 7PM", "Sunday: 10AM - 4PM"] },
                        ].map((c) => (
                            <div key={c.title} className="bg-white rounded-2xl shadow-soft p-5 flex items-start gap-4">
                                <div className="p-3 bg-primary-50 rounded-xl text-primary-600 flex-shrink-0">{c.icon}</div>
                                <div>
                                    <h3 className="font-semibold text-dark-900 text-sm">{c.title}</h3>
                                    {c.lines.map((l, i) => <p key={i} className="text-sm text-dark-600">{l}</p>)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-soft p-6 md:p-8 space-y-4">
                            <h2 className="text-xl font-bold text-dark-900 mb-2">Send us a Message</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input required placeholder="Your Name *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
                                <input type="email" required placeholder="Your Email *" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className={inputCls} />
                            </div>
                            <input required placeholder="Subject *" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} className={inputCls} />
                            <textarea required rows={5} placeholder="Your Message *" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                                className={`${inputCls} resize-none`} />
                            <button type="submit" disabled={loading}
                                className="bg-gradient-primary text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50">
                                {loading ? "Sending..." : <><Send size={16} /> Send Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
