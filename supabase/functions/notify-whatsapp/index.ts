import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartItem {
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
}

interface NotificationRequest {
  customerInfo: CustomerInfo;
  cartItems: CartItem[];
  totalPrice: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerInfo, cartItems, totalPrice }: NotificationRequest = await req.json();

    // Format cart items for notification
    const itemsText = cartItems.map(item => 
      `• ${item.productName} x${item.quantity} - $${(item.productPrice * item.quantity).toFixed(2)}`
    ).join('\n');

    const notificationMessage = `🛒 NEW ORDER ALERT!\n\n` +
      `Customer: ${customerInfo.name}\n` +
      `Phone: ${customerInfo.phone}\n\n` +
      `Items:\n${itemsText}\n\n` +
      `💰 Total: $${totalPrice.toFixed(2)}\n\n` +
      `Please contact the customer to confirm the order.`;

    // Log the notification (you can replace this with actual WhatsApp API call)
    console.log('New order notification:', {
      customerInfo,
      cartItems,
      totalPrice,
      message: notificationMessage
    });

    // Here you would integrate with WhatsApp Business API
    // For now, we'll just log and return success
    
    // Example WhatsApp Business API integration:
    // const WHATSAPP_API_KEY = Deno.env.get('WHATSAPP_API_KEY');
    // const BUSINESS_PHONE = Deno.env.get('BUSINESS_PHONE_NUMBER');
    // 
    // if (WHATSAPP_API_KEY && BUSINESS_PHONE) {
    //   const response = await fetch('https://graph.facebook.com/v17.0/{phone-number-id}/messages', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${WHATSAPP_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       messaging_product: 'whatsapp',
    //       to: BUSINESS_PHONE,
    //       type: 'text',
    //       text: {
    //         body: notificationMessage
    //       }
    //     })
    //   });
    // }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in notify-whatsapp function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});