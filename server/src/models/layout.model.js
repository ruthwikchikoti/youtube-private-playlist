const mongoose = require('mongoose');

const layoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  layoutData: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

const Layout = mongoose.model('Layout', layoutSchema);
module.exports = Layout;