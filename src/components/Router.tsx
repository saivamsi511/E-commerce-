import { MemberProvider } from '@/integrations';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import HomePage from '@/components/pages/HomePage';
import ProductsPage from '@/components/pages/ProductsPage';
import ProductDetailPage from '@/components/pages/ProductDetailPage';
import ContactPage from '@/components/pages/ContactPage';
import RegisterPage from '@/components/pages/RegisterPage';
import ProfilePage from '@/components/pages/ProfilePage';
import CheckoutPage from '@/components/pages/CheckoutPage';
import AdminLoginPage from '@/components/pages/AdminLoginPage';
import AdminDashboardPage from '@/components/pages/AdminDashboardPage';
import DataSeederPage from '@/components/pages/DataSeederPage';

export default function AppRouter() {
  return (
    <MemberProvider>
      <BrowserRouter basename={import.meta.env.BASE_NAME}>
        <ScrollToTop />
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} /> {/* MIXED ROUTE: Shows different content for authenticated vs anonymous users */}
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
          
          {/* Protected Routes with Layout */}
          <Route path="/profile" element={
            <Layout>
              <MemberProtectedRoute messageToSignIn="Sign in to access your profile">
                <ProfilePage />
              </MemberProtectedRoute>
            </Layout>
          } />
          
          {/* Admin Routes (No Layout) */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/seed-data" element={<DataSeederPage />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </MemberProvider>
  );
}
