import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Order from '../models/Order.js';
import { auth, AuthRequest, adminOnly } from '../middleware/auth.js';

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'elitecarautos/documents',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  } as any,
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Create order (public but attach user if logged in)
router.post('/', upload.single('idDocument'), async (req: AuthRequest, res) => {
  try {
    const orderData = req.body;
    if (req.file) {
      orderData.idDocumentUrl = req.file.path;
    }
    if (req.user) {
      orderData.userId = req.user._id;
    }

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      id: order._id,
      carModel: order.carModel,
      deliveryFee: order.deliveryFee,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// Get all orders (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order' });
  }
});

export default router;
