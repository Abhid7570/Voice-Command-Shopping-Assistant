import express from 'express';
import { body, validationResult } from 'express-validator';
import { 
  getShoppingList, 
  addShoppingItem, 
  updateShoppingItem, 
  deleteShoppingItem, 
  searchProducts,
  getSmartSuggestions 
} from '../controllers/shoppingController.js';

const router = express.Router();

// Validation middleware
const validateShoppingItem = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Item name must be between 2 and 100 characters'),
  body('quantity').isInt({ min: 1, max: 100 }).withMessage('Quantity must be between 1 and 100'),
  body('category').isIn(['produce', 'dairy', 'meat', 'pantry', 'frozen', 'beverages', 'snacks', 'household', 'personal-care', 'other']).withMessage('Invalid category'),
  body('brand').optional().trim().isLength({ max: 100 }).withMessage('Brand must be less than 100 characters'),
  body('size').optional().trim().isLength({ max: 50 }).withMessage('Size must be less than 50 characters')
];

const validateSearchQuery = [
  body('query').trim().isLength({ min: 2, max: 200 }).withMessage('Search query must be between 2 and 200 characters'),
  body('filters.priceRange').optional().isIn(['under-5', '5-10', '10-20', 'over-20']).withMessage('Invalid price range')
];

// Get shopping list
router.get('/', async (req, res, next) => {
  try {
    const items = await getShoppingList();
    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    next(error);
  }
});

// Add shopping item
router.post('/', validateShoppingItem, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const newItem = await addShoppingItem(req.body);
    res.status(201).json({
      success: true,
      data: newItem,
      message: 'Item added successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update shopping item
router.put('/:id', validateShoppingItem, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const updatedItem = await updateShoppingItem(req.params.id, req.body);
    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete shopping item
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await deleteShoppingItem(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Search products
router.post('/search', validateSearchQuery, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { query, filters } = req.body;
    const results = await searchProducts(query, filters);
    
    res.json({
      success: true,
      data: results,
      count: results.length,
      query,
      filters
    });
  } catch (error) {
    next(error);
  }
});

// Get smart suggestions
router.get('/suggestions', async (req, res, next) => {
  try {
    const suggestions = await getSmartSuggestions();
    res.json({
      success: true,
      data: suggestions,
      count: suggestions.length
    });
  } catch (error) {
    next(error);
  }
});

// Clear all items
router.delete('/', async (req, res, next) => {
  try {
    await clearAllItems();
    res.json({
      success: true,
      message: 'All items cleared successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
