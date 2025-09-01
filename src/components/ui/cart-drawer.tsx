import { useCart } from '@/hooks/use-cart';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Image } from '@/components/ui/image';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { 
    items, 
    isOpen, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice, 
    openCart, 
    closeCart 
  } = useCart();

  const formatPrice = (price: number, currency: string = 'INR') => {
    if (currency === 'INR') {
      return `${price.toFixed(2)} Rs`;
    }
    return `${price.toFixed(2)}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => open ? openCart() : closeCart()}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 border-2 border-secondary-foreground/20 shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground font-bold animate-pulse">
              {getTotalItems()}
            </Badge>
          )}
          <span className="ml-2 font-paragraph font-semibold hidden sm:inline">
            Cart
          </span>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="font-heading text-xl">
              Shopping Cart ({getTotalItems()})
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-12 h-12 text-primary-foreground" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                Your cart is empty
              </h3>
              <p className="font-paragraph text-foreground/70 mb-6">
                Add some products to get started
              </p>
              <Button onClick={closeCart} className="rounded-xl">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 bg-secondary rounded-2xl"
                    >
                      <div className="w-16 h-16 bg-background rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.mainImage || 'https://static.wixstatic.com/media/bbc212_eabc4d23e0bb431da009d43f76881dcc~mv2.png?originWidth=128&originHeight=128'}
                          alt={item.productName || 'Product'}
                          className="w-full h-full object-cover"
                          width={64}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-paragraph font-medium text-secondary-foreground line-clamp-1 mb-1">
                          {item.productName}
                        </h4>
                        <p className="font-paragraph text-sm text-secondary-foreground/70 mb-2">
                          {formatPrice(item.price || 0, item.currency)}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 p-0 rounded-lg"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          
                          <span className="font-paragraph font-medium text-secondary-foreground w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 p-0 rounded-lg"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item._id)}
                            className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg ml-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Cart Summary */}
              <div className="border-t border-foreground/10 pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-lg font-semibold text-foreground">
                    Total
                  </span>
                  <span className="font-heading text-xl font-bold text-foreground">
                    {formatPrice(getTotalPrice(), items[0]?.currency)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Link to="/checkout">
                    <Button 
                      size="lg" 
                      onClick={closeCart}
                      className="w-full bg-secondary-foreground text-background hover:bg-secondary-foreground/90 rounded-2xl"
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={closeCart}
                    className="w-full rounded-2xl"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}