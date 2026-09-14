import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

const storage = cloudinaryConfigured
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'elitecarautos/giftcards',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      } as any,
    })
  : multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Create payment
router.post('/', upload.single('giftCard'), async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, walletAddress, txid } = req.body;
    const paymentData: any = { orderId, amount, paymentMethod, walletAddress, txid };

    if (req.file) {
      paymentData.giftCardUrl = req.file.path;
    }

    const payment = new Payment(paymentData);
    await payment.save();

    await Order.findByIdAndUpdate(orderId, { status: 'paid' });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error creating payment' });
  }
});

// Get all payments (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching payments' });
  }
});

// Confirm payment (admin only)
router.patch('/:id/confirm', auth, adminOnly, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    await Order.findByIdAndUpdate(payment.orderId, { status: 'confirmed' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error confirming payment' });
  }
});

export default router;
