import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities/products';
import { Categories } from '@/entities/categories';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Star, Shield, Truck, HeadphonesIcon, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { member, isAuthenticated } = useMember();
  const [featuredProducts, setFeaturedProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number, currency: string = 'INR') => {
    if (currency === 'INR') {
      return `${price.toFixed(2)} Rs`;
    }
    return `${price.toFixed(2)}`;
  };

  const handleAddToCart = (product: Products, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.productName} has been added to your cart.`,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          BaseCrudService.getAll<Products>('products'),
          BaseCrudService.getAll<Categories>('categories')
        ]);
        
        // Get featured products
        const featured = productsResponse.items.filter(product => product.isFeatured).slice(0, 3);
        setFeaturedProducts(featured);
        
        // Get active categories
        const activeCategories = categoriesResponse.items
          .filter(category => category.isActive)
          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
          .slice(0, 4);
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* Welcome Section - Full Bleed */}
      <section className="w-full max-w-[120rem] mx-auto bg-gradient-to-br from-primary via-primary/80 to-secondary min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              Discover Your Perfect
              <br />
              Shopping Experience
            </h1>
            
            <div className="bg-background/10 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto">
              <p className="font-paragraph text-lg sm:text-xl text-primary-foreground/90 leading-relaxed">
                Comprehensive product selection designed for you and your lifestyle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/products">
                <Button size="lg" className="bg-secondary-foreground text-background hover:bg-secondary-foreground/90 font-paragraph text-lg px-8 py-4 rounded-2xl">
                  Start Shopping
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="outline" size="lg" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-paragraph text-lg px-8 py-4 rounded-2xl">
                    Join Our Community
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MIXED ROUTE: Shows different content for authenticated vs anonymous users */}
      {isAuthenticated && (
        <section className="py-16 bg-secondary">
          <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-secondary-foreground mb-4">
                Welcome back, {member?.profile?.nickname || member?.contact?.firstName || 'valued customer'}!
              </h2>
              <p className="font-paragraph text-lg text-secondary-foreground/80">
                Continue exploring our latest products and exclusive offers.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-20 bg-background">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6">
              Featured Products
            </h2>
            <p className="font-paragraph text-xl text-foreground/70 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products that deliver exceptional quality and value.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-primary/20 rounded-3xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-primary rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={product.mainImage || 'https://static.wixstatic.com/media/bbc212_85b73e993427429882ae142ddae73a3c~mv2.png?originWidth=384&originHeight=384'}
                          alt={product.productName || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={400}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-xl font-semibold text-primary-foreground mb-2">
                          {product.productName}
                        </h3>
                        <p className="font-paragraph text-primary-foreground/80 mb-4 line-clamp-2">
                          {product.shortDescription}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-heading text-2xl font-bold text-primary-foreground">
                            {formatPrice(product.price || 0, product.currency)}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={(e) => handleAddToCart(product, e)}
                              className="bg-secondary-foreground text-background hover:bg-secondary-foreground/90 rounded-xl"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
                            <Link to={`/products/${product._id}`}>
                              <Button size="sm" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-paragraph text-lg px-8 py-4 rounded-2xl">
                View All Products
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-right mb-16">
            <h2 className="font-heading text-4xl font-bold text-secondary-foreground mb-6">
              Shop by Category
            </h2>
            <p className="font-paragraph text-xl text-secondary-foreground/70 max-w-2xl ml-auto">
              Explore our diverse range of carefully curated product categories.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-primary/20 rounded-3xl h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/products?category=${category.slug}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-background rounded-3xl overflow-hidden h-full">
                      <CardContent className="p-0">
                        <div className="aspect-square overflow-hidden">
                          <Image
                            src={category.categoryImage || 'https://static.wixstatic.com/media/bbc212_e18914c479db4343ab348042a1088c2f~mv2.png?originWidth=256&originHeight=256'}
                            alt={category.name || 'Category'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            width={300}
                          />
                        </div>
                        <div className="p-6 text-center">
                          <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                            {category.name}
                          </h3>
                          <p className="font-paragraph text-foreground/70 text-sm">
                            {category.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-6">
              Why Choose ShopVibe
            </h2>
            <p className="font-paragraph text-xl text-foreground/70 max-w-3xl mx-auto">
              Experience shopping redefined with our commitment to quality, service, and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: "Premium Quality",
                description: "Carefully selected products that meet our high standards for excellence and durability."
              },
              {
                icon: Shield,
                title: "Secure Shopping",
                description: "Your privacy and security are our priority with encrypted transactions and data protection."
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Quick and reliable shipping to get your products to you when you need them."
              },
              {
                icon: HeadphonesIcon,
                title: "Expert Support",
                description: "Dedicated customer service team ready to assist you with any questions or concerns."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="font-paragraph text-foreground/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-4xl font-bold text-primary-foreground mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="font-paragraph text-xl text-primary-foreground/80 mb-8">
              Join thousands of satisfied customers who trust ShopVibe for their shopping needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-secondary-foreground text-background hover:bg-secondary-foreground/90 font-paragraph text-lg px-8 py-4 rounded-2xl">
                  Browse Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-paragraph text-lg px-8 py-4 rounded-2xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}