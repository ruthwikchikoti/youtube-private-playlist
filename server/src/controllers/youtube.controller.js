const youtubeService = require('../services/youtube.service');
const { google } = require('googleapis');
const { AppError } = require('../utils/errors');
const PalcodeUser = require('../models/user.model');
const catchAsync = require('../utils/catchAsync'); 
const youtubeController = {
    async getAuthUrl(req, res) {
        try {
            const userId = req.user.id;
            const authUrl = await youtubeService.getAuthUrl(userId);
            res.json({
                status: 'success',
                data: { authUrl }
            });
        } catch (error) {
            console.error('Auth URL error:', error);
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    },

    async handleCallback(req, res) {
        try {
            const { code, state } = req.query;
            console.log('Handling callback:', { code: code?.substring(0, 10), state });

            if (!code || !state) {
                return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=Missing required parameters`);
            }

            await youtubeService.handleCallback(code, state);
            
            res.redirect(`${process.env.FRONTEND_URL}/dashboard?youtube=success`);
        } catch (error) {
            console.error('Callback error:', error);
            const errorMessage = encodeURIComponent(error.message || 'Authorization failed');
            res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=${errorMessage}`);
        }
    },

    async getPlaylists(req, res, next) {
        try {
            const playlists = await youtubeService.getPlaylists(req.user.id);
            
            res.json({
                status: 'success',
                data: playlists
            });
        } catch (error) {
            next(error);
        }
    },

    async getPlaylistVideos(req, res, next) {
        try {
            const { playlistId } = req.params;
            const videos = await youtubeService.getVideosFromPlaylist(req.user.id, playlistId);
            
            res.json({
                status: 'success',
                data: videos
            });
        } catch (error) {
            next(error);
        }
    },

    getVideosFromPlaylist: catchAsync(async (req, res, next) => {
        const { userId } = req.user;
        const { playlistId } = req.params;

        const videos = await youtubeService.getVideosFromPlaylist(userId, playlistId);

        res.status(200).json({
            status: 'success',
            data: videos
        });
    })
};

module.exports = youtubeController;