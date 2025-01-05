const { asyncHandler } = require('../utils/helpers');
const LayoutService = require('../services/layout.service');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../utils/errors');
const Layout = require('../models/layout.model'); 

class LayoutController {
  async saveLayout(req, res, next) {
    try {
      const { userId } = req.user;
      const { layout } = req.body;

      if (!Array.isArray(layout)) {
        return res.status(400).json({
          error: 'Layout must be an array'
        });
      }

      await LayoutService.saveLayout(userId, layout);
      res.json({ message: 'Layout saved successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getLayout(req, res, next) {
    try {
      const { userId } = req.user;
      const layout = await LayoutService.getLayout(userId);
      res.json({ layout });
    } catch (error) {
      next(error);
    }
  }
}

const saveLayout = catchAsync(async (req, res, next) => {
    const { userId } = req.user;
    const { layoutData } = req.body;

    if (!layoutData) {
        throw new AppError('Layout data is required', 400);
    }

    const layout = await Layout.create({ userId, layoutData });

    res.status(201).json({
        status: 'success',
        data: layout
    });
});

const getLayouts = asyncHandler(async (req, res) => {
  res.json({ message: 'Fetched layouts successfully' });
});

const activateLayout = asyncHandler(async (req, res) => {
  const { layoutId } = req.params;
  res.json({ message: `Layout ${layoutId} activated successfully` });
});

module.exports = {
  saveLayout,
  getLayouts,
  activateLayout
};