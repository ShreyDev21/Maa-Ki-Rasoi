import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { cartAPI } from "../api/services.js";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within CartProvider");
    return context;
};

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const { data } = await cartAPI.get();
            setCart(data.data);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        const { data } = await cartAPI.add({ productId, quantity });
        setCart(data.data);
        return data;
    };

    const updateQuantity = async (productId, quantity) => {
        const { data } = await cartAPI.updateItem(productId, { quantity });
        setCart(data.data);
        return data;
    };

    const removeFromCart = async (productId) => {
        const { data } = await cartAPI.removeItem(productId);
        setCart(data.data);
        return data;
    };

    const clearCart = async () => {
        const { data } = await cartAPI.clear();
        setCart(data.data);
        return data;
    };

    const cartCount = cart.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                fetchCart,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
