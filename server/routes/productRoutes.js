import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
} from '../controllers/productController.js';
import { importData } from '../seed/seedCatalog.js';

const router = express.Router();

router.get('/seed', async (req, res) => {
  try {
    const result = await importData();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProductBySlug);
router.get('/:slug/related', getRelatedProducts);

export default router;
