import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities/products';
import { Categories } from '@/entities/categories';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Grid, List, ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchParams] = useSearchParams();
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
        
        setProducts(productsResponse.items);
        setCategories(categoriesResponse.items.filter(cat => cat.isActive));
        
        // Check for category filter from URL
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
          setSelectedCategory(categoryParam);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange.min) {
      const minPrice = parseFloat(priceRange.min);
      filtered = filtered.filter(product => (product.price || 0) >= minPrice);
    }
    if (priceRange.max) {
      const maxPrice = parseFloat(priceRange.max);
      filtered = filtered.filter(product => (product.price || 0) <= maxPrice);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.productName || '').localeCompare(b.productName || '');
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, priceRange, categories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-primary/20 rounded-3xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
            Our Products
          </h1>
          <p className="font-paragraph text-xl text-foreground/70">
            Discover our complete collection of premium products
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-primary rounded-3xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-0 rounded-xl font-paragraph"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-background border-0 rounded-xl font-paragraph">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.slug || ''}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filters */}
            <Input
              placeholder="Min Price"
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="bg-background border-0 rounded-xl font-paragraph"
            />
            
            <Input
              placeholder="Max Price"
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="bg-background border-0 rounded-xl font-paragraph"
            />

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-background border-0 rounded-xl font-paragraph">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode and Clear Filters */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-xl"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-xl"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            {(searchTerm || selectedCategory !== 'all' || priceRange.min || priceRange.max) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPriceRange({ min: '', max: '' });
                }}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="font-paragraph text-foreground/70">
            Showing {filteredProducts.length} of {products.length} products
            {selectedCategory !== 'all' && (
              <span className="ml-2 text-primary">
                (filtered by: {categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory})
              </span>
            )}
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-primary-foreground" />
            </div>
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
              No products found
            </h3>
            <p className="font-paragraph text-foreground/70 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange({ min: '', max: '' });
            }} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-6"
          }>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                {viewMode === 'grid' ? (
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-secondary rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden">
                        <Image
                          src={product.mainImage || 'https://static.wixstatic.com/media/bbc212_8e6b6201766f482cb758302fbff606fd~mv2.png?originWidth=256&originHeight=256'}
                          alt={product.productName || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          width={300}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-lg font-semibold text-secondary-foreground mb-2 line-clamp-1">
                          {product.productName}
                        </h3>
                        <p className="font-paragraph text-secondary-foreground/80 mb-4 line-clamp-2 text-sm">
                          {product.shortDescription}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-heading text-xl font-bold text-secondary-foreground">
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
                              <Button size="sm" variant="outline" className="rounded-xl">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-primary rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-64 aspect-square md:aspect-auto overflow-hidden">
                          <Image
                            src={product.mainImage || 'https://static.wixstatic.com/media/bbc212_69269846694b4191bfca14d1951fb5a2~mv2.png?originWidth=256&originHeight=256'}
                            alt={product.productName || 'Product'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            width={256}
                          />
                        </div>
                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <h3 className="font-heading text-xl font-semibold text-primary-foreground mb-2">
                              {product.productName}
                            </h3>
                            <p className="font-paragraph text-primary-foreground/80 mb-4">
                              {product.shortDescription}
                            </p>
                            {product.sku && (
                              <p className="font-paragraph text-sm text-primary-foreground/60 mb-4">
                                SKU: {product.sku}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-heading text-2xl font-bold text-primary-foreground">
                              {formatPrice(product.price || 0, product.currency)}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                onClick={(e) => handleAddToCart(product, e)}
                                className="bg-secondary-foreground text-background hover:bg-secondary-foreground/90 rounded-xl"
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                              <Link to={`/products/${product._id}`}>
                                <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl">
                                  View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}