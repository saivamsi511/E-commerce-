import { useMember } from '@/integrations';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CartDrawer } from '@/components/ui/cart-drawer';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold text-foreground">ShopVibe</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`font-paragraph ${isActive('/') ? 'text-primary-foreground font-semibold' : 'text-foreground hover:text-primary-foreground'} transition-colors`}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`font-paragraph ${isActive('/products') ? 'text-primary-foreground font-semibold' : 'text-foreground hover:text-primary-foreground'} transition-colors`}
              >
                Products
              </Link>
              <Link 
                to="/contact" 
                className={`font-paragraph ${isActive('/contact') ? 'text-primary-foreground font-semibold' : 'text-foreground hover:text-primary-foreground'} transition-colors`}
              >
                Contact
              </Link>
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Enhanced Cart with Badge */}
              <div className="relative">
                <CartDrawer />
              </div>
              
              {isLoading && <LoadingSpinner />}
              {!isAuthenticated && !isLoading && (
                <div className="flex items-center space-x-3">
                  {/* Enhanced Sign In Button */}
                  <Button 
                    onClick={actions.login} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph font-semibold px-6 py-2 rounded-xl shadow-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                  <Link to="/register">
                    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-paragraph font-semibold px-6 py-2 rounded-xl">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2 text-foreground hover:text-primary-foreground transition-colors">
                    <User className="w-5 h-5" />
                    <span className="font-paragraph">{member?.profile?.nickname || 'Profile'}</span>
                  </Link>
                  <Button variant="outline" onClick={actions.logout} className="font-paragraph rounded-xl">
                    Sign Out
                  </Button>
                </div>
              )}
              
              {/* Admin Login Link */}
              <div className="border-l border-gray-200 pl-4">
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-foreground font-paragraph text-xs font-bold bg-secondary">
                    Admin
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Enhanced Mobile Cart */}
              <div className="relative">
                <CartDrawer />
              </div>
              
              {/* Enhanced Mobile Sign In */}
              {!isAuthenticated && !isLoading && (
                <Button 
                  onClick={actions.login} 
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph font-semibold px-4 py-2 rounded-xl"
                >
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`font-paragraph ${isActive('/') ? 'text-primary-foreground font-semibold' : 'text-foreground'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/products" 
                  className={`font-paragraph ${isActive('/products') ? 'text-primary-foreground font-semibold' : 'text-foreground'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link 
                  to="/contact" 
                  className={`font-paragraph ${isActive('/contact') ? 'text-primary-foreground font-semibold' : 'text-foreground'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                {!isAuthenticated && !isLoading && (
                  <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                    <Button 
                      onClick={actions.login} 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph font-semibold rounded-xl"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-paragraph rounded-xl">
                        Register
                      </Button>
                    </Link>
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-foreground/60 hover:text-foreground font-paragraph text-sm">
                        Admin Login
                      </Button>
                    </Link>
                  </div>
                )}
                {isAuthenticated && (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 text-foreground font-paragraph"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>{member?.profile?.nickname || 'Profile'}</span>
                    </Link>
                    <Button variant="outline" onClick={actions.logout} className="font-paragraph rounded-xl">
                      Sign Out
                    </Button>
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full text-foreground/60 hover:text-foreground font-paragraph text-sm">
                        Admin Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      {/* Footer */}
      <footer className="bg-primary py-16">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-heading font-bold text-primary-foreground">ShopVibe</span>
              </div>
              <p className="text-primary-foreground font-paragraph text-sm">
                Discover amazing products with a modern shopping experience designed for you.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-primary-foreground">Quick Links</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/" className="text-primary-foreground hover:text-primary-foreground/80 font-paragraph text-sm transition-colors">
                  Home
                </Link>
                <Link to="/products" className="text-primary-foreground hover:text-primary-foreground/80 font-paragraph text-sm transition-colors">
                  Products
                </Link>
                <Link to="/contact" className="text-primary-foreground hover:text-primary-foreground/80 font-paragraph text-sm transition-colors">
                  Contact
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-primary-foreground">Account</h3>
              <div className="flex flex-col space-y-2">
                {!isAuthenticated ? (
                  <>
                    <button onClick={actions.login} className="text-left text-primary-foreground hover:text-primary-foreground/80 font-paragraph text-sm transition-colors">
                      Sign In
                    </button>
                    <Link to="/register" className="text-primary-foreground hover:text-primary-foreground/80 font-paragraph text-sm transition-colors">
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="text-primary-foreground hover:text-primary-foreground/80 font-paragraph text-sm transition-colors">
                      Profile
                    </Link>
                    <button onClick={actions.logout} className="text-left text-primary-foreground hover:text-primary-foreground/80 font-paragraph text-sm transition-colors">
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-heading font-semibold text-primary-foreground">Support</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/contact" className="text-primary-foreground hover:text-primary-foreground/80 font-paragraph text-sm transition-colors">
                  Contact Us
                </Link>
                <span className="text-primary-foreground font-paragraph text-sm">
                  help@shopvibe.com
                </span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-12 pt-8">
            <p className="text-center text-primary-foreground font-paragraph text-sm">
              © 2024 ShopVibe. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}