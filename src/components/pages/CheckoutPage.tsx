import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
// TODO: Replace with actual integrations when available
// import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import { Orders } from '@/entities/orders';
import { OrderItems } from '@/entities/order-items';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Image } from '@/components/ui/image';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  // TODO: Replace with actual member hook when integrations are available
  // const { member } = useMember();
  const member = null; // Temporary placeholder
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [paymentForm, setPaymentForm] = useState({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  const formatPrice = (price: number, currency: string = 'INR') => {
    if (currency === 'INR') {
      return `${price.toFixed(2)} Rs`;
    }
    return `${price.toFixed(2)}`;
  };

  const handleShippingChange = (field: string, value: string) => {
    setShippingForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Generate order number
      const orderNum = `ORD-${Date.now()}`;
      setOrderNumber(orderNum);

      // Calculate totals
      const subtotal = getTotalPrice();
      const shipping = subtotal > 1000 ? 0 : 50;
      const tax = subtotal * 0.18;
      const total = subtotal + shipping + tax;

      // Create order
      const orderData = {
        _id: crypto.randomUUID(),
        orderNumber: orderNum,
        orderDate: new Date(),
        totalAmount: total,
        orderStatus: 'Pending',
        shippingAddress: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.pincode}, ${shippingForm.country}`,
        shippingMethod: 'Standard Shipping',
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        userId: member?.loginEmail || 'guest' // Use member's email as user identifier
      };

      // TODO: Replace with actual API calls when integrations are available
      await BaseCrudService.create('orders', orderData);

      // Create order items
      for (const item of items) {
        const orderItemData = {
          _id: crypto.randomUUID(),
          orderId: orderData._id,
          productName: item.productName,
          productSku: item.sku,
          productImage: item.mainImage,
          productDescription: item.shortDescription,
          quantity: item.quantity,
          unitPrice: item.price || 0,
          lineItemTotal: (item.price || 0) * item.quantity
        };

        await BaseCrudService.create('orderitems', orderItemData);
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setOrderPlaced(true);
      clearCart();

      toast({
        title: "Order placed successfully!",
        description: `Order ${orderNum} has been confirmed. You will receive a confirmation email shortly.`,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Your cart is empty
          </h1>
          <p className="font-paragraph text-foreground/70 mb-8">
            Add some products to proceed to checkout
          </p>
          <Button onClick={() => navigate('/products')} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Order Confirmed!
            </h1>
            <p className="font-paragraph text-xl text-foreground/70 mb-4">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <div className="bg-secondary rounded-2xl p-6 mb-8">
              <p className="font-paragraph text-secondary-foreground">
                <strong>Order Number:</strong> {orderNumber}
              </p>
              <p className="font-paragraph text-secondary-foreground/70 text-sm mt-2">
                You will receive a confirmation email with tracking details shortly.
              </p>
            </div>
            <div className="space-y-4">
              <Button onClick={() => navigate('/products')} className="rounded-xl mr-4">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/profile')} className="rounded-xl">
                View Orders
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 1000 ? 0 : 50; // Free shipping over ₹1000
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-foreground/70 hover:text-foreground font-paragraph transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="font-heading text-4xl font-bold text-foreground">
            Checkout
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <Card className="border-0 bg-primary rounded-3xl">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-primary-foreground flex items-center gap-3">
                    <Truck className="w-6 h-6" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-paragraph text-primary-foreground font-medium">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={shippingForm.firstName}
                        onChange={(e) => handleShippingChange('firstName', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-paragraph text-primary-foreground font-medium">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={shippingForm.lastName}
                        onChange={(e) => handleShippingChange('lastName', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-paragraph text-primary-foreground font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingForm.email}
                        onChange={(e) => handleShippingChange('email', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-paragraph text-primary-foreground font-medium">
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        value={shippingForm.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-paragraph text-primary-foreground font-medium">
                      Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={shippingForm.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      required
                      className="bg-background border-0 rounded-xl"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="font-paragraph text-primary-foreground font-medium">
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={shippingForm.city}
                        onChange={(e) => handleShippingChange('city', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="font-paragraph text-primary-foreground font-medium">
                        State *
                      </Label>
                      <Input
                        id="state"
                        value={shippingForm.state}
                        onChange={(e) => handleShippingChange('state', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="font-paragraph text-primary-foreground font-medium">
                        Pincode *
                      </Label>
                      <Input
                        id="pincode"
                        value={shippingForm.pincode}
                        onChange={(e) => handleShippingChange('pincode', e.target.value)}
                        required
                        className="bg-background border-0 rounded-xl"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="border-0 bg-secondary rounded-3xl">
                <CardHeader>
                  <CardTitle className="font-heading text-2xl text-secondary-foreground flex items-center gap-3">
                    <CreditCard className="w-6 h-6" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-paragraph text-secondary-foreground font-medium">
                      Payment Method
                    </Label>
                    <Select value={paymentForm.method} onValueChange={(value) => handlePaymentChange('method', value)}>
                      <SelectTrigger className="bg-background border-0 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="netbanking">Net Banking</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentForm.method === 'card' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard" className="font-paragraph text-secondary-foreground font-medium">
                          Name on Card *
                        </Label>
                        <Input
                          id="nameOnCard"
                          value={paymentForm.nameOnCard}
                          onChange={(e) => handlePaymentChange('nameOnCard', e.target.value)}
                          required
                          className="bg-background border-0 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="font-paragraph text-secondary-foreground font-medium">
                          Card Number *
                        </Label>
                        <Input
                          id="cardNumber"
                          value={paymentForm.cardNumber}
                          onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          required
                          className="bg-background border-0 rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate" className="font-paragraph text-secondary-foreground font-medium">
                            Expiry Date *
                          </Label>
                          <Input
                            id="expiryDate"
                            value={paymentForm.expiryDate}
                            onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                            placeholder="MM/YY"
                            required
                            className="bg-background border-0 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="font-paragraph text-secondary-foreground font-medium">
                            CVV *
                          </Label>
                          <Input
                            id="cvv"
                            value={paymentForm.cvv}
                            onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                            placeholder="123"
                            required
                            className="bg-background border-0 rounded-xl"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentForm.method === 'cod' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="font-paragraph text-yellow-800 text-sm">
                        You will pay {total.toFixed(2)} Rs when your order is delivered.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="border-0 bg-background rounded-3xl sticky top-4">
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-foreground">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item._id} className="flex gap-3">
                        <div className="w-12 h-12 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={item.mainImage || 'https://static.wixstatic.com/media/bbc212_a3981fd4e4854c929f0bbd1b715ccb09~mv2.png?originWidth=128&originHeight=128'}
                            alt={item.productName || 'Product'}
                            className="w-full h-full object-cover"
                            width={48}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-paragraph font-medium text-foreground text-sm line-clamp-1">
                            {item.productName}
                          </h4>
                          <p className="font-paragraph text-foreground/60 text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-paragraph font-medium text-foreground text-sm">
                            {formatPrice((item.price || 0) * item.quantity, item.currency)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-paragraph text-foreground/70">Subtotal</span>
                      <span className="font-paragraph text-foreground">{subtotal.toFixed(2)} Rs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-paragraph text-foreground/70">Shipping</span>
                      <span className="font-paragraph text-foreground">
                        {shipping === 0 ? 'Free' : `${shipping.toFixed(2)} Rs`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-paragraph text-foreground/70">Tax (GST 18%)</span>
                      <span className="font-paragraph text-foreground">{tax.toFixed(2)} Rs</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-heading text-lg font-bold text-foreground">Total</span>
                      <span className="font-heading text-lg font-bold text-foreground">{total.toFixed(2)} Rs</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="font-paragraph text-green-800 text-xs">
                        Secure checkout with SSL encryption
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isProcessing}
                    className="w-full bg-secondary-foreground text-background hover:bg-secondary-foreground/90 font-paragraph text-lg py-4 rounded-2xl"
                  >
                    {isProcessing ? "Processing..." : `Place Order - ${total.toFixed(2)} Rs`}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}