import { Link } from "react-router-dom";
import { Leaf, Heart, Award, Users, ArrowRight } from "lucide-react";

const About = () => (
    <div className="animate-fade-in">
        {/* Hero */}
        <section className="bg-gradient-hero py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <span className="text-6xl mb-4 block">👩‍🍳</span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-dark-900 mb-4">About <span className="text-gradient">Maa Ki Rasoi</span></h1>
                <p className="text-lg text-dark-600 max-w-2xl mx-auto">Where every jar is filled with the warmth of a mother&apos;s love and the richness of generations-old recipes.</p>
            </div>
        </section>

        {/* Story */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">Our Story</span>
                    <h2 className="text-3xl font-bold text-dark-900 mt-4 mb-4">From a Mother&apos;s Kitchen to Your Table</h2>
                    <p className="text-dark-600 leading-relaxed mb-4">Maa Ki Rasoi was born from a simple idea by <strong>Aman Porwal</strong> — to bring the authentic taste of his mother&apos;s homemade food from the heart of <strong>Malharganj, Indore</strong> to your table. Every recipe has been passed down through generations, perfected over decades of love and passion in our family kitchen.</p>
                    <p className="text-dark-600 leading-relaxed mb-4">What began as making pickles and preserves for family and friends in Madhya Pradesh soon grew into a beloved brand trusted by hundreds of food lovers across India. Today, we continue the same tradition — making everything by hand, using only the finest natural ingredients sourced locally.</p>
                    <p className="text-dark-600 leading-relaxed">No factories. No machines. No preservatives. Just a mother&apos;s kitchen in Indore, her recipes, and an unwavering commitment to quality.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { emoji: "🫙", text: "Traditional Pickles" }, { emoji: "🍯", text: "Pure Preserves" },
                        { emoji: "🫗", text: "Fresh Ruh Afza" }, { emoji: "🥫", text: "Homemade Chutneys" },
                    ].map((item) => (
                        <div key={item.text} className="bg-white rounded-2xl shadow-soft p-6 text-center hover:shadow-card transition-shadow">
                            <span className="text-4xl block mb-2">{item.emoji}</span>
                            <p className="font-medium text-sm text-dark-900">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Values */}
        <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-dark-900 text-center mb-10">What We Stand For</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { icon: <Leaf className="w-8 h-8" />, title: "100% Natural", desc: "No preservatives, no artificial colors or flavors" },
                        { icon: <Heart className="w-8 h-8" />, title: "Made with Love", desc: "Every product is handcrafted with care and devotion" },
                        { icon: <Award className="w-8 h-8" />, title: "Premium Quality", desc: "Only the freshest, finest ingredients make the cut" },
                        { icon: <Users className="w-8 h-8" />, title: "Community First", desc: "Supporting local farmers and sustainable practices" },
                    ].map((v) => (
                        <div key={v.title} className="text-center p-6">
                            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">{v.icon}</div>
                            <h3 className="font-semibold text-dark-900 mb-2">{v.title}</h3>
                            <p className="text-sm text-dark-600">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 md:p-12 text-center text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Taste the Tradition</h2>
                <p className="text-primary-100 mb-6">Browse our collection and bring home the authentic taste of love.</p>
                <Link to="/products" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-full font-bold hover:shadow-xl transition-all">Shop Now <ArrowRight size={18} /></Link>
            </div>
        </section>
    </div>
);

export default About;
