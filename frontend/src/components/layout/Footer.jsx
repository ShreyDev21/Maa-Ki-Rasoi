import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark-900 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🍲</span>
                            <div>
                                <h3 className="text-xl font-bold text-primary-400">
                                    Maa Ki Rasoi
                                </h3>
                                <p className="text-xs text-gray-400">Homemade with Love</p>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            Authentic homemade pickles, preserves, and food items made with
                            love and traditional recipes passed down through generations.
                        </p>
                        <div className="flex gap-3">
                            {["facebook", "instagram", "twitter"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-dark-700 flex items-center justify-center
                             hover:bg-primary-600 transition-colors text-gray-400 hover:text-white"
                                >
                                    <span className="text-xs font-bold uppercase">
                                        {social.charAt(0)}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { to: "/", label: "Home" },
                                { to: "/products", label: "All Products" },
                                { to: "/about", label: "About Us" },
                                { to: "/contact", label: "Contact Us" },
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                            Customer Service
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                { to: "/profile", label: "My Account" },
                                { to: "/orders", label: "Order Tracking" },
                                { to: "/cart", label: "Shopping Cart" },
                                { to: "/contact", label: "Help Center" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                            Contact Us
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <MapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-400">
                                    Malharganj, Indore,
                                    <br /> Madhya Pradesh, India
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={16} className="text-primary-400 flex-shrink-0" />
                                <span className="text-sm text-gray-400">+91 99931 27400</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={16} className="text-primary-400 flex-shrink-0" />
                                <span className="text-sm text-gray-400">
                                    maakirasoi.indore@gmail.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-dark-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        <p className="text-xs text-gray-500">
                            &copy; {currentYear} Maa Ki Rasoi. All rights reserved.
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            Made with <Heart size={12} className="text-red-500 fill-red-500" /> in India
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
