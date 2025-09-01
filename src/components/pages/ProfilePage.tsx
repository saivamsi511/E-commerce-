import { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Orders } from '@/entities/orders';
import { OrderItems } from '@/entities/order-items';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image } from '@/components/ui/image';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Calendar, Edit3, Save, X, Settings, ShoppingBag, Heart, Bell, Package, Truck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { member, actions } = useMember();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [orderItems, setOrderItems] = useState<{ [orderId: string]: OrderItems[] }>({});
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [formData, setFormData] = useState({
    firstName: member?.contact?.firstName || '',
    lastName: member?.contact?.lastName || '',
    nickname: member?.profile?.nickname || '',
    title: member?.profile?.title || '',
    phone: member?.contact?.phones?.[0] || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Simulate saving profile data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: member?.contact?.firstName || '',
      lastName: member?.contact?.lastName || '',
      nickname: member?.profile?.nickname || '',
      title: member?.profile?.title || '',
      phone: member?.contact?.phones?.[0] || ''
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const firstName = member?.contact?.firstName || '';
    const lastName = member?.contact?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} Rs`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMemberStatusColor = () => {
    switch (member?.status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return CheckCircle;
      case 'shipped':
        return Truck;
      case 'pending':
        return Package;
      default:
        return Package;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      // Use member's login email as the user identifier since that's what we have access to
      if (!member?.loginEmail) return;
      
      try {
        setLoadingOrders(true);
        
        // Fetch user's orders - filter by email since that's what we store in checkout
        const ordersResponse = await BaseCrudService.getAll<Orders>('orders');
        const userOrders = ordersResponse.items
          .filter(order => order.userId === member.loginEmail || order.userId === 'guest') // Include guest orders for demo
          .sort((a, b) => new Date(b.orderDate || 0).getTime() - new Date(a.orderDate || 0).getTime());
        
        setOrders(userOrders);

        // Fetch order items for each order
        const orderItemsMap: { [orderId: string]: OrderItems[] } = {};
        
        for (const order of userOrders) {
          const itemsResponse = await BaseCrudService.getAll<OrderItems>('orderitems');
          const items = itemsResponse.items.filter(item => item.orderId === order._id);
          orderItemsMap[order._id] = items;
        }
        
        setOrderItems(orderItemsMap);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to load order history. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [member?.loginEmail, toast]);

  const wishlistItems = [
    { id: '1', name: 'Premium Wireless Headphones', price: 299.99, image: 'https://static.wixstatic.com/media/bbc212_dd1fd132f18448bfba817cac72407bef~mv2.png?originWidth=384&originHeight=384' },
    { id: '2', name: 'Smart Fitness Watch', price: 199.99, image: 'https://static.wixstatic.com/media/bbc212_80f77fa759b041978c68e12f0ae93d18~mv2.png?originWidth=384&originHeight=384' }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="border-0 bg-primary rounded-3xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={member?.profile?.photo?.url} />
                  <AvatarFallback className="text-2xl font-heading font-bold bg-secondary text-secondary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <h1 className="font-heading text-3xl font-bold text-primary-foreground">
                      {member?.profile?.nickname || `${member?.contact?.firstName} ${member?.contact?.lastName}`}
                    </h1>
                    <Badge className={`w-fit ${getMemberStatusColor()}`}>
                      {member?.status || 'Unknown'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-primary-foreground/80">
                      <Mail className="w-4 h-4" />
                      <span className="font-paragraph">{member?.loginEmail}</span>
                    </div>
                    
                    {member?.contact?.phones?.[0] && (
                      <div className="flex items-center gap-2 text-primary-foreground/80">
                        <Phone className="w-4 h-4" />
                        <span className="font-paragraph">{member.contact.phones[0]}</span>
                      </div>
                    )}
                    
                    {member?._createdDate && (
                      <div className="flex items-center gap-2 text-primary-foreground/80">
                        <Calendar className="w-4 h-4" />
                        <span className="font-paragraph">
                          Member since {format(new Date(member._createdDate), 'MMM yyyy')}
                        </span>
                      </div>
                    )}
                    
                    {member?.lastLoginDate && (
                      <div className="flex items-center gap-2 text-primary-foreground/80">
                        <User className="w-4 h-4" />
                        <span className="font-paragraph">
                          Last login {format(new Date(member.lastLoginDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        className="bg-secondary-foreground text-background hover:bg-secondary-foreground/90 rounded-xl"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-secondary rounded-2xl p-1">
              <TabsTrigger value="profile" className="rounded-xl font-paragraph">
                <Settings className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-xl font-paragraph">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="rounded-xl font-paragraph">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-xl font-paragraph">
                <Bell className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="border-0 bg-secondary rounded-3xl">
                <CardContent className="p-8">
                  <h2 className="font-heading text-2xl font-bold text-secondary-foreground mb-6">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-paragraph text-secondary-foreground font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-0 rounded-xl font-paragraph"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-paragraph text-secondary-foreground font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-0 rounded-xl font-paragraph"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nickname" className="font-paragraph text-secondary-foreground font-medium">
                        Nickname
                      </Label>
                      <Input
                        id="nickname"
                        value={formData.nickname}
                        onChange={(e) => handleInputChange('nickname', e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-0 rounded-xl font-paragraph"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="font-paragraph text-secondary-foreground font-medium">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-0 rounded-xl font-paragraph"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-paragraph text-secondary-foreground font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        value={member?.loginEmail || ''}
                        disabled
                        className="bg-background/50 border-0 rounded-xl font-paragraph"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-paragraph text-secondary-foreground font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="bg-background border-0 rounded-xl font-paragraph"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card className="border-0 bg-primary rounded-3xl">
                <CardContent className="p-8">
                  <h2 className="font-heading text-2xl font-bold text-primary-foreground mb-6">
                    Order History
                  </h2>

                  {loadingOrders ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-primary-foreground/10 rounded-2xl h-24 animate-pulse"></div>
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-8 h-8 text-primary-foreground/60" />
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-primary-foreground mb-2">
                        No Orders Yet
                      </h3>
                      <p className="font-paragraph text-primary-foreground/70 mb-6">
                        You haven't placed any orders yet. Start shopping to see your order history here.
                      </p>
                      <Button 
                        onClick={() => window.location.href = '/products'}
                        className="bg-secondary-foreground text-background hover:bg-secondary-foreground/90 rounded-xl"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => {
                        const StatusIcon = getStatusIcon(order.orderStatus || '');
                        const items = orderItems[order._id] || [];
                        
                        return (
                          <Card key={order._id} className="border-0 bg-background rounded-2xl">
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-heading text-lg font-semibold text-foreground">
                                      {order.orderNumber}
                                    </h3>
                                    <Badge className={getStatusColor(order.orderStatus || '')}>
                                      <StatusIcon className="w-3 h-3 mr-1" />
                                      {order.orderStatus}
                                    </Badge>
                                  </div>
                                  <p className="font-paragraph text-foreground/70 text-sm">
                                    {order.orderDate && format(new Date(order.orderDate), 'MMMM dd, yyyy')} • {order.itemCount} items
                                  </p>
                                  {order.trackingNumber && (
                                    <p className="font-paragraph text-foreground/60 text-xs mt-1">
                                      Tracking: {order.trackingNumber}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <span className="font-heading text-xl font-bold text-foreground">
                                    {formatPrice(order.totalAmount || 0)}
                                  </span>
                                  <p className="font-paragraph text-foreground/60 text-sm">
                                    {order.shippingMethod}
                                  </p>
                                </div>
                              </div>

                              {/* Order Items */}
                              {items.length > 0 && (
                                <div className="border-t border-foreground/10 pt-4">
                                  <h4 className="font-paragraph font-medium text-foreground mb-3 text-sm">
                                    Order Items:
                                  </h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {items.map((item) => (
                                      <div key={item._id} className="flex gap-3 bg-secondary/30 rounded-xl p-3">
                                        <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                                          <Image
                                            src={item.productImage || 'https://static.wixstatic.com/media/bbc212_9729ac2372ad4770981126d716233d36~mv2.png?originWidth=128&originHeight=128'}
                                            alt={item.productName || 'Product'}
                                            className="w-full h-full object-cover"
                                            width={48}
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="font-paragraph font-medium text-foreground text-sm line-clamp-1">
                                            {item.productName}
                                          </h5>
                                          <p className="font-paragraph text-foreground/60 text-xs">
                                            Qty: {item.quantity} × {formatPrice(item.unitPrice || 0)}
                                          </p>
                                          <p className="font-paragraph font-medium text-foreground text-xs">
                                            {formatPrice(item.lineItemTotal || 0)}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Shipping Address */}
                              {order.shippingAddress && (
                                <div className="border-t border-foreground/10 pt-4 mt-4">
                                  <h4 className="font-paragraph font-medium text-foreground mb-2 text-sm">
                                    Shipping Address:
                                  </h4>
                                  <p className="font-paragraph text-foreground/70 text-sm">
                                    {order.shippingAddress}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card className="border-0 bg-secondary rounded-3xl">
                <CardContent className="p-8">
                  <h2 className="font-heading text-2xl font-bold text-secondary-foreground mb-6">
                    My Wishlist
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <Card key={item.id} className="border-0 bg-background rounded-2xl overflow-hidden">
                        <CardContent className="p-0">
                          <div className="aspect-square bg-primary/20"></div>
                          <div className="p-4">
                            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                              {item.name}
                            </h3>
                            <div className="flex justify-between items-center">
                              <span className="font-heading text-xl font-bold text-foreground">
                                ${item.price}
                              </span>
                              <Button size="sm" className="bg-secondary-foreground text-background hover:bg-secondary-foreground/90 rounded-xl">
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="border-0 bg-primary rounded-3xl">
                <CardContent className="p-8">
                  <h2 className="font-heading text-2xl font-bold text-primary-foreground mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                          Email Notifications
                        </h3>
                        <p className="font-paragraph text-primary-foreground/80 text-sm">
                          Receive updates about your orders and new products
                        </p>
                      </div>
                      <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl">
                        Enabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                          Marketing Emails
                        </h3>
                        <p className="font-paragraph text-primary-foreground/80 text-sm">
                          Get exclusive offers and promotional content
                        </p>
                      </div>
                      <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl">
                        Enabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                          SMS Notifications
                        </h3>
                        <p className="font-paragraph text-primary-foreground/80 text-sm">
                          Receive order updates via text message
                        </p>
                      </div>
                      <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary rounded-xl">
                        Disabled
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}