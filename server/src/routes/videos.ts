import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Video from '../models/Video.js';
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
        folder: 'elitecarautos/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'webm', 'mov'],
      } as any,
    })
  : multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// Get all videos (public)
router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    const query: any = {};
    if (page && ['home', 'byd', 'tesla', 'rv'].includes(page as string)) {
      query.page = page;
    }
    const videos = await Video.find(query).sort({ order: 1, createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Fetch videos error:', error);
    res.status(500).json({ message: 'Server error fetching videos' });
  }
});

// Create video (admin only)
router.post('/', auth, adminOnly, upload.single('video'), async (req, res) => {
  try {
    const { title, order, page } = JSON.parse(req.body.data || '{}');
    if (!cloudinaryConfigured && !req.file?.path) {
      return res.status(400).json({ message: 'Cloudinary is not configured and no video URL provided' });
    }

    const video = new Video({
      title: title || 'Untitled Video',
      url: req.file?.path || '',
      order: order || 0,
      page: ['home', 'byd', 'tesla', 'rv'].includes(page) ? page : 'home',
    });
    await video.save();
    res.status(201).json(video);
  } catch (error: any) {
    console.error('Create video error:', error);
    res.status(500).json({ message: error.message || 'Server error creating video' });
  }
});

// Delete video (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ message: 'Video deleted successfully' });
  } catch (error: any) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: error.message || 'Server error deleting video' });
  }
});

export default router;
