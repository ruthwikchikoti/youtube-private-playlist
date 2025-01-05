const Layout = require('../models/layout.model');

class LayoutService {
  async saveLayout(userId, playlistIds) {
    try {
      await Layout.updateMany(
        { userId },
        { isActive: false }
      );

      const layout = new Layout({
        userId,
        layout: playlistIds.map((playlistId, index) => ({
          playlistId,
          position: index
        })),
        isActive: true
      });

      await layout.save();
      return layout;
    } catch (error) {
      console.error('Save layout error:', error);
      throw new Error('Failed to save layout');
    }
  }

  async getLayout(userId) {
    try {
      const layout = await Layout.findOne({
        userId,
        isActive: true
      }).sort({ createdAt: -1 });

      if (!layout) {
        return []; 
      }

      return layout.layout.sort((a, b) => a.position - b.position)
        .map(item => item.playlistId);
    } catch (error) {
      console.error('Get layout error:', error);
      throw new Error('Failed to retrieve layout');
    }
  }

  async getLayouts(userId) {
    try {
      const layouts = await Layout.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5); 
      return layouts.map(layout => ({
        id: layout._id,
        layout: layout.layout.sort((a, b) => a.position - b.position)
          .map(item => item.playlistId),
        createdAt: layout.createdAt,
        isActive: layout.isActive
      }));
    } catch (error) {
      console.error('Get layouts error:', error);
      throw new Error('Failed to retrieve layouts');
    }
  }

  async activateLayout(userId, layoutId) {
    try {
      await Layout.updateMany(
        { userId },
        { isActive: false }
      );

      const layout = await Layout.findOneAndUpdate(
        { _id: layoutId, userId },
        { isActive: true },
        { new: true }
      );

      if (!layout) {
        throw new Error('Layout not found');
      }

      return layout.layout.sort((a, b) => a.position - b.position)
        .map(item => item.playlistId);
    } catch (error) {
      console.error('Activate layout error:', error);
      throw new Error('Failed to activate layout');
    }
  }
}

module.exports = new LayoutService();