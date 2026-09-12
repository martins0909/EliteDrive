import express from 'express';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create payment
router.post('/', async (req, res) => {
  try {
    const { orderId, amount, paymentMethod, walletAddress, txid } = req.body;
    const payment = new Payment({ orderId, amount, paymentMethod, walletAddress, txid });
    await payment.save();

    await Order.findByIdAndUpdate(orderId, { status: 'paid' });

    res.status(201).json(payment);
  } catch (error) {
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
