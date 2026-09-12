import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Vehicle from '../models/Vehicle.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Check Cloudinary configuration
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
        folder: 'elitecarautos/vehicles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 800, crop: 'limit' }],
      } as any,
    })
  : multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Helper to validate image presence
const validateImage = (req: express.Request, res: express.Response) => {
  const vehicleData = JSON.parse(req.body.data || '{}');
  const hasImageUrl = !!vehicleData.image;
  const hasFile = !!req.file;

  if (!cloudinaryConfigured && !hasImageUrl) {
    res.status(400).json({
      message:
        'Cloudinary is not configured. Either provide an Image URL or set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env',
    });
    return false;
  }

  if (!hasFile && !hasImageUrl) {
    res.status(400).json({ message: 'Vehicle image is required. Upload a file or provide an image URL.' });
    return false;
  }
  return true;
};

// Get all vehicles (public)
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    console.error('Fetch vehicles error:', error);
    res.status(500).json({ message: 'Server error fetching vehicles' });
  }
});

// Create vehicle (admin only)
router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!validateImage(req, res)) return;

    const vehicleData = JSON.parse(req.body.data || '{}');
    if (req.file) {
      vehicleData.image = req.file.path;
    }

    // Generate unique id from name
    vehicleData.id = vehicleData.id || vehicleData.name.toLowerCase().replace(/\s+/g, '-');

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error: any) {
    console.error('Create vehicle error:', error);
    res.status(500).json({
      message: error.message || 'Server error creating vehicle',
    });
  }
});

// Update vehicle (admin only)
router.put('/:id', auth, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!validateImage(req, res)) return;

    const vehicleData = JSON.parse(req.body.data || '{}');
    if (req.file) {
      vehicleData.image = req.file.path;
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { id: req.params.id },
      vehicleData,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (error: any) {
    console.error('Update vehicle error:', error);
    res.status(500).json({
      message: error.message || 'Server error updating vehicle',
    });
  }
});

// Delete vehicle (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ id: req.params.id });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      message: error.message || 'Server error deleting vehicle',
    });
  }
});

export default router;
