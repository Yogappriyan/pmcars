/**
 * Razorpay Payment Gateway Client Integration
 * Provides secure interaction with backend /create-order and /verify-payment endpoints,
 * dynamic SDK script loading, and checkout modal management.
 */

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const metaEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};

export interface RazorpayConfig {
  keyId: string;
  isConfigured: boolean;
}

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  keyId?: string;
  order?: any;
  isSimulated?: boolean;
  error?: string;
  message?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  verified: boolean;
  paymentId?: string;
  orderId?: string;
  message?: string;
  error?: string;
  isSimulated?: boolean;
}

/**
 * Ensures the Razorpay checkout.js script is loaded in the DOM.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    // Check if script element already exists
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay checkout script.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Fetches Razorpay public configuration from the server.
 */
export async function getRazorpayPublicConfig(): Promise<RazorpayConfig> {
  try {
    const res = await fetch('/api/razorpay/config');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      keyId: data.keyId || metaEnv.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      isConfigured: Boolean(data.isConfigured)
    };
  } catch (err) {
    console.warn('Could not fetch server Razorpay config, using client fallback:', err);
    return {
      keyId: metaEnv.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      isConfigured: Boolean(metaEnv.VITE_RAZORPAY_KEY_ID)
    };
  }
}

/**
 * Creates an order on the server via /api/create-order.
 * @param amountInRupees Amount in Indian Rupees (₹)
 * @param notes Custom metadata notes (e.g. vehicleId, customer details)
 */
export async function createRazorpayOrder(
  amountInRupees: number,
  notes: Record<string, string> = {}
): Promise<CreateOrderResult> {
  try {
    const amountInPaise = Math.round(amountInRupees * 100);
    const receipt = `rcpt_pmc_${Date.now()}`;

    const res = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes
      })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Server error (status ${res.status})`
      };
    }

    return {
      success: true,
      orderId: data.orderId,
      keyId: data.keyId,
      order: data.order,
      isSimulated: data.isSimulated,
      message: data.message
    };
  } catch (err: any) {
    console.error('Failed to create Razorpay order:', err);
    return {
      success: false,
      error: err.message || 'Network error while contacting server.'
    };
  }
}

/**
 * Verifies the payment signature on the server via /api/verify-payment.
 */
export async function verifyRazorpayPayment(
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature?: string;
  }
): Promise<VerifyPaymentResult> {
  try {
    const res = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.verified) {
      return {
        success: false,
        verified: false,
        error: data.error || 'Payment signature verification failed.'
      };
    }

    return {
      success: true,
      verified: true,
      paymentId: data.paymentId,
      orderId: data.orderId,
      message: data.message,
      isSimulated: data.isSimulated
    };
  } catch (err: any) {
    console.error('Payment verification error:', err);
    return {
      success: false,
      verified: false,
      error: err.message || 'Network error during payment verification.'
    };
  }
}

export interface OpenCheckoutParams {
  amountInRupees: number;
  title?: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (paymentResult: VerifyPaymentResult, response: RazorpayPaymentResponse) => void;
  onFailure: (errorMessage: string) => void;
  onDismiss?: () => void;
}

/**
 * Coordinates end-to-end Razorpay Checkout:
 * 1. Loads SDK
 * 2. Creates order on server
 * 3. Launches Razorpay Modal
 * 4. Submits signature to /verify-payment
 * 5. Calls onSuccess or onFailure callback
 */
export async function openRazorpayCheckout({
  amountInRupees,
  title = 'PM CARS ARIYALUR',
  description,
  prefill,
  notes = {},
  onSuccess,
  onFailure,
  onDismiss
}: OpenCheckoutParams) {
  // Step 1: Ensure SDK is loaded
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onFailure('Failed to load Razorpay payment gateway SDK. Please check your internet connection.');
    return;
  }

  // Step 2: Create order on backend
  const orderResult = await createRazorpayOrder(amountInRupees, notes);
  if (!orderResult.success || !orderResult.orderId) {
    onFailure(orderResult.error || 'Unable to generate payment order from server.');
    return;
  }

  const keyToUse = orderResult.keyId || metaEnv.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder';

  // Step 3: Configure Razorpay Checkout options
  const options = {
    key: keyToUse,
    amount: Math.round(amountInRupees * 100),
    currency: 'INR',
    name: title,
    description: description,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=128&q=80',
    order_id: orderResult.orderId,
    prefill: {
      name: prefill?.name || '',
      email: prefill?.email || '',
      contact: prefill?.contact || ''
    },
    notes: {
      ...notes,
      dealership: 'PM Cars Ariyalur'
    },
    theme: {
      color: '#0f172a' // Slate-900 / High contrast brand theme
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      }
    },
    handler: async (response: RazorpayPaymentResponse) => {
      try {
        // Step 4: Verify on backend
        const verificationResult = await verifyRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });

        if (verificationResult.verified) {
          onSuccess(verificationResult, response);
        } else {
          onFailure(verificationResult.error || 'Payment was received but authenticity verification failed.');
        }
      } catch (err: any) {
        onFailure(err.message || 'Error occurred while verifying transaction signature.');
      }
    }
  };

  try {
    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      console.error('Razorpay payment failed:', response.error);
      onFailure(response.error?.description || response.error?.reason || 'Payment failed or was declined by your bank/UPI app.');
    });
    rzp.open();
  } catch (err: any) {
    console.error('Error opening Razorpay checkout modal:', err);
    onFailure('Could not open Razorpay checkout modal: ' + (err.message || 'Unknown error'));
  }
}
