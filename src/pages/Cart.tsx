import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Cart = () => {
  const { items, customerInfo, removeFromCart, updateQuantity, setCustomerInfo, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(!customerInfo);
  const [customerData, setCustomerData] = useState({
    name: customerInfo?.name || '',
    phone: customerInfo?.phone || ''
  });

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerData.name || !customerData.phone) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and phone number",
        variant: "destructive"
      });
      return;
    }
    setCustomerInfo(customerData);
    setShowCustomerForm(false);
    toast({
      title: "Information Saved",
      description: "Your contact information has been saved"
    });
  };

  const handleWhatsAppCheckout = async () => {
    if (!customerInfo) {
      setShowCustomerForm(true);
      toast({
        title: "Contact Information Required",
        description: "Please provide your contact information first",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingOut(true);

    try {
      // Notify store owner via WhatsApp API
      const { error } = await supabase.functions.invoke('notify-whatsapp', {
        body: {
          customerInfo,
          cartItems: items,
          totalPrice: getTotalPrice()
        }
      });

      if (error) throw error;

      // Create WhatsApp message for customer
      const itemsText = items.map(item => 
        `${item.productName} x${item.quantity} - $${(item.productPrice * item.quantity).toFixed(2)}`
      ).join('\n');

      const whatsappMessage = `Hi! I'm interested in purchasing these items:\n\n${itemsText}\n\nTotal: $${getTotalPrice().toFixed(2)}\n\nCustomer: ${customerInfo.name}\nPhone: ${customerInfo.phone}`;
      
      // Replace with your actual WhatsApp Business number
      const whatsappNumber = "1234567890"; // Replace with your WhatsApp Business number
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Clear cart after successful checkout
      await clearCart();
      
      // Redirect to WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Redirecting to WhatsApp",
        description: "Your order details have been prepared for WhatsApp"
      });

    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Checkout Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some products to get started!</p>
            <Button asChild>
              <a href="/products">Continue Shopping</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.productName}</h3>
                      <p className="text-muted-foreground">${item.productPrice.toFixed(2)} each</p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Item Total */}
                    <div className="text-right">
                      <p className="font-semibold">${(item.productPrice * item.quantity).toFixed(2)}</p>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                {showCustomerForm ? (
                  <form onSubmit={handleCustomerSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={customerData.name}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Save Information
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {customerInfo?.name}</p>
                    <p><strong>Phone:</strong> {customerInfo?.phone}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowCustomerForm(true)}
                    >
                      Edit Information
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.productName} x{item.quantity}</span>
                      <span>${(item.productPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleWhatsAppCheckout}
                  disabled={isCheckingOut || !customerInfo}
                  className="w-full"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout via WhatsApp'}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  You will be redirected to WhatsApp to complete your order
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;