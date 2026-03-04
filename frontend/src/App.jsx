import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import {
  ProtectedRoute,
  AdminRoute,
  GuestRoute,
  CustomerRoute,
} from "./components/common/RouteGuards.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

// ─── Pages (Lazy imports for code splitting) ──────────────
import Home from "./pages/customer/Home.jsx";
import Products from "./pages/customer/Products.jsx";
import ProductDetail from "./pages/customer/ProductDetail.jsx";
import Cart from "./pages/customer/Cart.jsx";
import Checkout from "./pages/customer/Checkout.jsx";
import Login from "./pages/customer/Login.jsx";
import Register from "./pages/customer/Register.jsx";
import Profile from "./pages/customer/Profile.jsx";
import Orders from "./pages/customer/Orders.jsx";
import OrderDetail from "./pages/customer/OrderDetail.jsx";
import About from "./pages/customer/About.jsx";
import Contact from "./pages/customer/Contact.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminProducts from "./pages/admin/ManageProducts.jsx";
import AdminOrders from "./pages/admin/ManageOrders.jsx";
import AdminUsers from "./pages/admin/ManageUsers.jsx";
import AdminCategories from "./pages/admin/ManageCategories.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1a1a2e",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 16px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#22c55e", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#fff" },
              },
            }}
          />

          <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
              <Routes>
                {/* Public */}
                <Route path="/" element={<CustomerRoute><Home /></CustomerRoute>} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* Guest Only */}
                <Route
                  path="/login"
                  element={
                    <GuestRoute>
                      <Login />
                    </GuestRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <GuestRoute>
                      <Register />
                    </GuestRoute>
                  }
                />

                {/* Protected */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Admin */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <AdminRoute>
                      <AdminCategories />
                    </AdminRoute>
                  }
                />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                      <h1 className="text-6xl font-bold text-primary-300 mb-4">
                        404
                      </h1>
                      <p className="text-xl text-dark-600 mb-6">
                        Page not found
                      </p>
                      <a
                        href="/"
                        className="bg-gradient-primary text-white px-6 py-3 rounded-full 
                                   font-semibold hover:shadow-lg transition-all"
                      >
                        Go Home
                      </a>
                    </div>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
