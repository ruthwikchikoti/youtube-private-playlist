const express = require('express');
const router = express.Router();
const layoutController = require('../controllers/layout.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { asyncHandler } = require('../utils/helpers');
const Layout = require('../models/layout.model');
const { AppError } = require('../utils/errors');

const getLayout = asyncHandler(async (req, res) => {
  res.json({ message: 'Layout endpoint working' });
});

router.use(authMiddleware);

router.get('/', getLayout);

router.post('/save', async (req, res, next) => {
  try {
    const { userId, layout } = req.body;

    if (!layout) {
      throw new AppError('Layout data is required', 400);
    }

    const layoutData = { layout };
    const layoutEntry = new Layout({ userId: userId, layoutData });
    await layoutEntry.save();

    res.status(201).json({
      status: 'success',
      message: 'Layout saved successfully',
      data: layoutEntry
    });
  } catch (error) {
    next(error);
  }
});

router.get('/history', layoutController.getLayouts);
router.post('/activate/:layoutId', layoutController.activateLayout);

module.exports = router;
