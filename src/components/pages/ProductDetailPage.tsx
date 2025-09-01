import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities/products';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Star, ShoppingCart, Share2, Heart, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Products | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number, currency: string = 'INR') => {
    if (currency === 'INR') {
      return `${price.toFixed(2)} Rs`;
    }
    return `${price.toFixed(2)}`;
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.productName} added to your cart.`,
      });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await BaseCrudService.getById<Products>('products', id);
        setProduct(productData);
        
        // Fetch related products (excluding current product)
        const allProducts = await BaseCrudService.getAll<Products>('products');
        const related = allProducts.items
          .filter(p => p._id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-primary/20 rounded-3xl h-96 lg:h-[600px] animate-pulse"></div>
            <div className="space-y-6">
              <div className="bg-primary/20 rounded-2xl h-8 animate-pulse"></div>
              <div className="bg-primary/20 rounded-2xl h-6 animate-pulse"></div>
              <div className="bg-primary/20 rounded-2xl h-12 animate-pulse"></div>
              <div className="bg-primary/20 rounded-2xl h-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="font-paragraph text-foreground/70 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/products">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-foreground/70 hover:text-foreground font-paragraph transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-primary rounded-3xl overflow-hidden aspect-square">
              {imageLoading && (
                <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-3xl"></div>
              )}
              <Image
                src={product.mainImage || 'https://static.wixstatic.com/media/bbc212_ba4ff7afcef749d79ad83ac2752a60e2~mv2.png?originWidth=576&originHeight=576'}
                alt={product.productName || 'Product'}
                className="w-full h-full object-cover"
                width={600}
                onLoad={() => setImageLoading(false)}
              />
            </div>
            
            {product.isFeatured && (
              <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground font-paragraph">
                Featured
              </Badge>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
                {product.productName}
              </h1>
              
              {product.sku && (
                <p className="font-paragraph text-foreground/60 mb-4">
                  SKU: {product.sku}
                </p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <span className="font-heading text-4xl font-bold text-foreground">
                  {formatPrice(product.price || 0, product.currency)}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="font-paragraph text-foreground/70 ml-2">(4.8)</span>
                </div>
              </div>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div className="bg-secondary rounded-2xl p-6">
                <p className="font-paragraph text-lg text-secondary-foreground">
                  {product.shortDescription}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-paragraph font-medium text-foreground">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 p-0 rounded-xl"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-paragraph font-semibold text-foreground w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 p-0 rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleAddToCart}
                className="flex-1 bg-secondary-foreground text-background hover:bg-secondary-foreground/90 font-paragraph text-lg py-4 rounded-2xl"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="rounded-2xl">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-2xl">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="text-center p-4 bg-primary rounded-2xl">
                <div className="font-heading text-2xl font-bold text-primary-foreground mb-1">Free</div>
                <div className="font-paragraph text-sm text-primary-foreground/80">Shipping</div>
              </div>
              <div className="text-center p-4 bg-primary rounded-2xl">
                <div className="font-heading text-2xl font-bold text-primary-foreground mb-1">30</div>
                <div className="font-paragraph text-sm text-primary-foreground/80">Day Returns</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Description */}
        {product.longDescription && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="border-0 bg-primary rounded-3xl">
              <CardContent className="p-8">
                <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-6">
                  Product Description
                </h2>
                <div className="font-paragraph text-primary-foreground/90 leading-relaxed whitespace-pre-line">
                  {product.longDescription}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-8 text-center">
              You Might Also Like
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-secondary rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={relatedProduct.mainImage || 'https://static.wixstatic.com/media/bbc212_b76e765a5d39483ab7e3140f3f8e5ccf~mv2.png?originWidth=256&originHeight=256'}
                          alt={relatedProduct.productName || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={300}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-lg font-semibold text-secondary-foreground mb-2 line-clamp-1">
                          {relatedProduct.productName}
                        </h3>
                        <p className="font-paragraph text-secondary-foreground/80 mb-4 line-clamp-2 text-sm">
                          {relatedProduct.shortDescription}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-heading text-xl font-bold text-secondary-foreground">
                            {formatPrice(relatedProduct.price || 0, relatedProduct.currency)}
                          </span>
                          <Link to={`/products/${relatedProduct._id}`}>
                            <Button size="sm" className="bg-secondary-foreground text-background hover:bg-secondary-foreground/90 rounded-xl">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}