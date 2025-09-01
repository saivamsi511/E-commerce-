import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { Products } from '@/entities/products';
import { Categories } from '@/entities/categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Package, 
  FolderOpen, 
  Users, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Eye,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Products[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState<Products | null>(null);
  const [editingCategory, setEditingCategory] = useState<Categories | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Product form state
  const [productForm, setProductForm] = useState({
    productName: '',
    mainImage: '',
    shortDescription: '',
    longDescription: '',
    price: 0,
    sku: '',
    isFeatured: false,
    category: '',
    currency: 'INR'
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    categoryImage: '',
    isActive: true,
    displayOrder: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        BaseCrudService.getAll<Products>('products'),
        BaseCrudService.getAll<Categories>('categories')
      ]);
      
      setProducts(productsResponse.items);
      setCategories(categoriesResponse.items);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin panel.",
    });
    navigate('/');
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await BaseCrudService.update('products', {
          ...productForm,
          _id: editingProduct._id
        });
        toast({
          title: "Product Updated",
          description: "Product has been successfully updated.",
        });
      } else {
        await BaseCrudService.create('products', {
          ...productForm,
          _id: crypto.randomUUID()
        });
        toast({
          title: "Product Created",
          description: "New product has been successfully created.",
        });
      }
      
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      resetProductForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await BaseCrudService.update('categories', {
          ...categoryForm,
          _id: editingCategory._id
        });
        toast({
          title: "Category Updated",
          description: "Category has been successfully updated.",
        });
      } else {
        await BaseCrudService.create('categories', {
          ...categoryForm,
          _id: crypto.randomUUID()
        });
        toast({
          title: "Category Created",
          description: "New category has been successfully created.",
        });
      }
      
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
      resetCategoryForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await BaseCrudService.delete('products', id);
        toast({
          title: "Product Deleted",
          description: "Product has been successfully deleted.",
        });
        fetchData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await BaseCrudService.delete('categories', id);
        toast({
          title: "Category Deleted",
          description: "Category has been successfully deleted.",
        });
        fetchData();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete category. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const resetProductForm = () => {
    setProductForm({
      productName: '',
      mainImage: '',
      shortDescription: '',
      longDescription: '',
      price: 0,
      sku: '',
      isFeatured: false,
      category: '',
      currency: 'INR'
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      categoryImage: '',
      isActive: true,
      displayOrder: 0
    });
  };

  const openProductDialog = (product?: Products) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        productName: product.productName || '',
        mainImage: product.mainImage || '',
        shortDescription: product.shortDescription || '',
        longDescription: product.longDescription || '',
        price: product.price || 0,
        sku: product.sku || '',
        isFeatured: product.isFeatured || false,
        category: product.category || '',
        currency: product.currency || 'INR'
      });
    } else {
      setEditingProduct(null);
      resetProductForm();
    }
    setIsProductDialogOpen(true);
  };

  const openCategoryDialog = (category?: Categories) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        categoryImage: category.categoryImage || '',
        isActive: category.isActive || true,
        displayOrder: category.displayOrder || 0
      });
    } else {
      setEditingCategory(null);
      resetCategoryForm();
    }
    setIsCategoryDialogOpen(true);
  };

  // Calculate stats
  const totalProducts = products.length;
  const featuredProducts = products.filter(p => p.isFeatured).length;
  const totalCategories = categories.length;
  const activeCategories = categories.filter(c => c.isActive).length;
  const totalRevenue = products.reduce((sum, p) => sum + (p.price || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="font-paragraph text-foreground/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary border-b border-primary-foreground/20">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-heading text-xl font-bold text-primary-foreground">
                Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/seed-data')}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl"
              >
                <Database className="w-4 h-4 mr-2" />
                Seed Data
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-secondary rounded-2xl p-1">
            <TabsTrigger value="overview" className="rounded-xl font-paragraph">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-xl font-paragraph">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-xl font-paragraph">
              <FolderOpen className="w-4 h-4 mr-2" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-xl font-paragraph">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl font-bold text-foreground">
                Dashboard Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 bg-primary rounded-3xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-paragraph text-primary-foreground/80 text-sm">Total Products</p>
                        <p className="font-heading text-3xl font-bold text-primary-foreground">{totalProducts}</p>
                      </div>
                      <Package className="w-8 h-8 text-primary-foreground/60" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-secondary rounded-3xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-paragraph text-secondary-foreground/80 text-sm">Featured Products</p>
                        <p className="font-heading text-3xl font-bold text-secondary-foreground">{featuredProducts}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-secondary-foreground/60" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-primary rounded-3xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-paragraph text-primary-foreground/80 text-sm">Categories</p>
                        <p className="font-heading text-3xl font-bold text-primary-foreground">{activeCategories}/{totalCategories}</p>
                      </div>
                      <FolderOpen className="w-8 h-8 text-primary-foreground/60" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-secondary rounded-3xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-paragraph text-secondary-foreground/80 text-sm">Total Value</p>
                        <p className="font-heading text-3xl font-bold text-secondary-foreground">${totalRevenue.toFixed(0)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-secondary-foreground/60" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-background rounded-3xl">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-foreground">Recent Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product) => (
                        <div key={product._id} className="flex items-center justify-between">
                          <div>
                            <p className="font-paragraph font-medium text-foreground">{product.productName}</p>
                            <p className="font-paragraph text-foreground/60 text-sm">{product.price?.toFixed(2)} Rs</p>
                          </div>
                          {product.isFeatured && (
                            <Badge className="bg-secondary text-secondary-foreground">Featured</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-background rounded-3xl">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-foreground">Categories Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.slice(0, 5).map((category) => (
                        <div key={category._id} className="flex items-center justify-between">
                          <div>
                            <p className="font-paragraph font-medium text-foreground">{category.name}</p>
                            <p className="font-paragraph text-foreground/60 text-sm">{category.description}</p>
                          </div>
                          <Badge className={category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-heading text-3xl font-bold text-foreground">
                  Products Management
                </h2>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openProductDialog()} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-xl">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="productName" className="font-paragraph font-medium">Product Name</Label>
                          <Input
                            id="productName"
                            value={productForm.productName}
                            onChange={(e) => setProductForm(prev => ({ ...prev, productName: e.target.value }))}
                            required
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sku" className="font-paragraph font-medium">SKU</Label>
                          <Input
                            id="sku"
                            value={productForm.sku}
                            onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category" className="font-paragraph font-medium">Category</Label>
                          <Select value={productForm.category} onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category._id} value={category.slug || ''}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency" className="font-paragraph font-medium">Currency</Label>
                          <Select value={productForm.currency} onValueChange={(value) => setProductForm(prev => ({ ...prev, currency: value }))}>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INR">INR (₹)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="mainImage" className="font-paragraph font-medium">Main Image URL</Label>
                        <Input
                          id="mainImage"
                          value={productForm.mainImage}
                          onChange={(e) => setProductForm(prev => ({ ...prev, mainImage: e.target.value }))}
                          className="rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price" className="font-paragraph font-medium">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="shortDescription" className="font-paragraph font-medium">Short Description</Label>
                        <Textarea
                          id="shortDescription"
                          value={productForm.shortDescription}
                          onChange={(e) => setProductForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                          rows={2}
                          className="rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="longDescription" className="font-paragraph font-medium">Long Description</Label>
                        <Textarea
                          id="longDescription"
                          value={productForm.longDescription}
                          onChange={(e) => setProductForm(prev => ({ ...prev, longDescription: e.target.value }))}
                          rows={4}
                          className="rounded-xl"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isFeatured"
                          checked={productForm.isFeatured}
                          onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, isFeatured: checked as boolean }))}
                        />
                        <Label htmlFor="isFeatured" className="font-paragraph">Featured Product</Label>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1 rounded-xl">
                          {editingProduct ? 'Update Product' : 'Create Product'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)} className="rounded-xl">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product._id} className="border-0 bg-secondary rounded-3xl">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-heading text-lg font-semibold text-secondary-foreground line-clamp-1">
                            {product.productName}
                          </h3>
                          {product.isFeatured && (
                            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                          )}
                        </div>
                        
                        <p className="font-paragraph text-secondary-foreground/80 text-sm line-clamp-2">
                          {product.shortDescription}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-heading text-xl font-bold text-secondary-foreground">
                            {product.currency === 'INR' ? `${product.price?.toFixed(2)} Rs` : `${product.price?.toFixed(2)}`}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openProductDialog(product)}
                              className="rounded-xl"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product._id)}
                              className="rounded-xl text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-heading text-3xl font-bold text-foreground">
                  Categories Management
                </h2>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => openCategoryDialog()} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-xl">
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryName" className="font-paragraph font-medium">Category Name</Label>
                          <Input
                            id="categoryName"
                            value={categoryForm.name}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                            required
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="slug" className="font-paragraph font-medium">Slug</Label>
                          <Input
                            id="slug"
                            value={categoryForm.slug}
                            onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="categoryImage" className="font-paragraph font-medium">Category Image URL</Label>
                        <Input
                          id="categoryImage"
                          value={categoryForm.categoryImage}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, categoryImage: e.target.value }))}
                          className="rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="displayOrder" className="font-paragraph font-medium">Display Order</Label>
                        <Input
                          id="displayOrder"
                          type="number"
                          value={categoryForm.displayOrder}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                          className="rounded-xl"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="categoryDescription" className="font-paragraph font-medium">Description</Label>
                        <Textarea
                          id="categoryDescription"
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="rounded-xl"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isActive"
                          checked={categoryForm.isActive}
                          onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, isActive: checked as boolean }))}
                        />
                        <Label htmlFor="isActive" className="font-paragraph">Active Category</Label>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button type="submit" className="flex-1 rounded-xl">
                          {editingCategory ? 'Update Category' : 'Create Category'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)} className="rounded-xl">
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <Card key={category._id} className="border-0 bg-primary rounded-3xl">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                            {category.name}
                          </h3>
                          <Badge className={category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <p className="font-paragraph text-primary-foreground/80 text-sm">
                          {category.description}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-paragraph text-primary-foreground/60 text-sm">
                            Order: {category.displayOrder}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openCategoryDialog(category)}
                              className="rounded-xl border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteCategory(category._id)}
                              className="rounded-xl border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl font-bold text-foreground">
                User Management
              </h2>
              
              <Card className="border-0 bg-secondary rounded-3xl">
                <CardContent className="p-8 text-center">
                  <Users className="w-16 h-16 text-secondary-foreground/60 mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold text-secondary-foreground mb-2">
                    User Management Coming Soon
                  </h3>
                  <p className="font-paragraph text-secondary-foreground/80">
                    Advanced user management features will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}