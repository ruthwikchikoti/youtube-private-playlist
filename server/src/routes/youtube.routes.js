// src/routes/youtube.routes.js
const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtube.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/callback', youtubeController.handleCallback);

// Protected routes
router.use(authMiddleware);
router.get('/auth-url', youtubeController.getAuthUrl);
router.get('/playlists', youtubeController.getPlaylists);
router.get('/playlist/:playlistId/videos', youtubeController.getPlaylistVideos);

module.exports = router;