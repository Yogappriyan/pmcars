import 'dotenv/config';
import express from 'express';
import path from 'path';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // Helper to read and check Razorpay credentials
  function getRazorpayConfig() {
    const keyId = (process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '').trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
    const isConfigured = Boolean(
      keyId && 
      keySecret && 
      !keyId.toLowerCase().includes('placeholder') &&
      !keySecret.toLowerCase().includes('placeholder') &&
      !keyId.toLowerCase().includes('your_') &&
      !keySecret.toLowerCase().includes('your_')
    );
    return { keyId, keySecret, isConfigured };
  }

  // Lazy instantiate Razorpay instance
  function getRazorpayInstance() {
    const { keyId, keySecret, isConfigured } = getRazorpayConfig();
    if (!isConfigured) {
      return null;
    }
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }

  /* =========================================================================
     RAZORPAY API ENDPOINTS
     ========================================================================= */

  // 1. Get Public Configuration Status
  app.get('/api/razorpay/config', (req, res) => {
    const { keyId, isConfigured } = getRazorpayConfig();
    res.json({
      keyId: isConfigured ? keyId : (keyId || 'rzp_test_placeholder'),
      isConfigured
    });
  });

  // Handler for Create Order (both /create-order and /api/create-order supported)
  const handleCreateOrder: express.RequestHandler = async (req, res) => {
    try {
      const { amount, currency = 'INR', receipt, notes } = req.body;

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({
          success: false,
          error: 'Valid numeric amount in smallest currency unit (paise) is required.'
        });
        return;
      }

      const { keyId, isConfigured } = getRazorpayConfig();
      const razorpay = getRazorpayInstance();

      if (!isConfigured || !razorpay) {
        // If keys are not configured yet, return a clear, structured notice or simulated test order
        // This allows development/sandbox preview testing without crashing
        console.warn('Razorpay API keys not yet configured in environment. Providing simulated test order.');
        const mockOrderId = `order_sim_${Date.now()}`;
        res.status(200).json({
          success: true,
          isSimulated: true,
          orderId: mockOrderId,
          order: {
            id: mockOrderId,
            amount: Math.round(amount),
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            status: 'created'
          },
          keyId: keyId || 'rzp_test_simulation',
          message: 'Running in test simulation mode. Configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET in Settings to process real-time payments.'
        });
        return;
      }

      const options = {
        amount: Math.round(amount), // Amount in paise (₹1 = 100 paise)
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {}
      };

      const order = await razorpay.orders.create(options);
      res.status(200).json({
        success: true,
        orderId: order.id,
        order,
        keyId
      });
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({
        success: false,
        error: error?.error?.description || error?.message || 'Failed to create Razorpay order'
      });
    }
  };

  app.post('/create-order', handleCreateOrder);
  app.post('/api/create-order', handleCreateOrder);
  app.post('/api/razorpay/create-order', handleCreateOrder);

  // Handler for Verify Payment (both /verify-payment and /api/verify-payment supported)
  const handleVerifyPayment: express.RequestHandler = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id) {
        res.status(400).json({
          success: false,
          verified: false,
          error: 'Missing razorpay_order_id or razorpay_payment_id in request body.'
        });
        return;
      }

      const { keySecret, isConfigured } = getRazorpayConfig();

      // If simulated order in dev mode
      if (!isConfigured || razorpay_order_id.startsWith('order_sim_')) {
        console.warn('Verifying simulated test order payment.');
        res.status(200).json({
          success: true,
          verified: true,
          isSimulated: true,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          message: 'Payment simulated and verified successfully in sandbox mode.'
        });
        return;
      }

      if (!razorpay_signature) {
        res.status(400).json({
          success: false,
          verified: false,
          error: 'Missing razorpay_signature for verification.'
        });
        return;
      }

      // Generate expected HMAC SHA256 signature
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex');

      const isAuthentic = expectedSignature === razorpay_signature;

      if (isAuthentic) {
        res.status(200).json({
          success: true,
          verified: true,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          message: 'Payment signature verified successfully.'
        });
      } else {
        res.status(400).json({
          success: false,
          verified: false,
          error: 'Invalid payment signature. Payment verification failed.'
        });
      }
    } catch (error: any) {
      console.error('Error verifying Razorpay payment:', error);
      res.status(500).json({
        success: false,
        verified: false,
        error: error?.message || 'Server error during payment verification'
      });
    }
  };

  app.post('/verify-payment', handleVerifyPayment);
  app.post('/api/verify-payment', handleVerifyPayment);
  app.post('/api/razorpay/verify-payment', handleVerifyPayment);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  /* =========================================================================
     VITE & STATIC MIDDLEWARE SETUP
     ========================================================================= */

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
