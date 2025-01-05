const { google } = require('googleapis');
const PalcodeUser = require('../models/user.model');
const { AppError } = require('../utils/errors');

class YouTubeService {
    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.YOUTUBE_CLIENT_ID,
            process.env.YOUTUBE_CLIENT_SECRET,
            process.env.YOUTUBE_REDIRECT_URI
        );

        this.SCOPES = [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.force-ssl'
        ];
    }

    async getAuthUrl(userId) {
        try {
            if (!userId) throw new AppError('User ID is required', 400);

            const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
            
            return this.oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: this.SCOPES,
                state,
                prompt: 'consent'
            });
        } catch (error) {
            console.error('Get auth URL error:', error);
            throw new AppError('Failed to generate auth URL', 500);
        }
    }

    async handleCallback(code, state) {
        try {
            console.log('Processing callback with code:', code.substring(0, 10));
            
            const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
            const { userId } = decodedState;

            if (!userId) {
                throw new AppError('Invalid state parameter', 400);
            }

            const user = await PalcodeUser.findById(userId);
            if (!user) {
                throw new AppError('User not found', 404);
            }

            const { tokens } = await this.oauth2Client.getToken(code);
            console.log('Received tokens:', {
                access_token: tokens.access_token ? '✓' : '✗',
                refresh_token: tokens.refresh_token ? '✓' : '✗',
                expiry_date: tokens.expiry_date
            });

            // Update user with new tokens
            await PalcodeUser.findByIdAndUpdate(userId, {
                youtube: {
                    connected: true,
                    lastConnected: new Date(),
                    credentials: {
                        access_token: tokens.access_token,
                        refresh_token: tokens.refresh_token,
                        expiry_date: tokens.expiry_date
                    }
                }
            });

            console.log('Updated user YouTube connection status and credentials:', userId);

            return { success: true };
        } catch (error) {
            if (error.response?.data?.error === 'invalid_grant') {
                console.error('Invalid grant error:', error.response.data);
                throw new AppError('Invalid authorization code', 400);
            }
            console.error('Callback error:', error);
            throw new AppError('Failed to process YouTube authorization', 500);
        }
    }

    async refreshTokenIfNeeded(user) {
        if (!user.youtubeRefreshToken) {
            throw new AppError('No refresh token available', 401);
        }

        try {
            this.oauth2Client.setCredentials({
                refresh_token: user.youtubeRefreshToken
            });

            const { credentials } = await this.oauth2Client.refreshAccessToken();
            await PalcodeUser.findByIdAndUpdate(user._id, {
                'youtube.accessToken': credentials.access_token,
                'youtube.tokenExpiry': new Date(credentials.expiry_date)
            });

            return credentials;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw new AppError('Failed to refresh token', 401);
        }
    }

    async getPlaylists(userId) {
        try {
            const user = await PalcodeUser.findById(userId);
            if (!user?.youtube?.connected) {
                throw new AppError('YouTube not connected', 401);
            }

            this.oauth2Client.setCredentials(user.youtube.credentials);

            const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
            
            let playlists = [];
            let nextPageToken = null;

            do {
                const response = await youtube.playlists.list({
                    part: 'snippet,contentDetails',
                    mine: true,
                    maxResults: 50,
                    pageToken: nextPageToken
                });

                console.log('YouTube API response:', response.data);

                playlists = playlists.concat(response.data.items);
                nextPageToken = response.data.nextPageToken;
            } while (nextPageToken);

            if (playlists.length === 0) {
                return [];
            }

            return playlists.map(playlist => ({
                id: playlist.id,
                title: playlist.snippet.title,
                description: playlist.snippet.description,
                thumbnail: playlist.snippet.thumbnails?.medium?.url || '',
                videoCount: playlist.contentDetails.itemCount,
                url: `https://www.youtube.com/playlist?list=${playlist.id}`
            }));
        } catch (error) {
            console.error('Get playlist error:', error);
            if (error.code === 401) {
                // Token expired, mark as disconnected
                await PalcodeUser.findByIdAndUpdate(userId, {
                    'youtube.connected': false
                });
            } else if (error.errors?.some(e => e.reason === 'channelNotFound')) {
                throw new AppError('YouTube channel not found. Please create a YouTube channel and try again.', 404);
            }
            throw error;
        }
    }

    async getVideosFromPlaylist(userId, playlistId) {
        try {
            const user = await PalcodeUser.findById(userId);
            console.log('User found:', user);

            if (!user?.youtube?.connected) {
                throw new AppError('YouTube not connected', 401);
            }

            this.oauth2Client.setCredentials(user.youtube.credentials);

            const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });
            
            let videos = [];
            let nextPageToken = null;

            do {
                const response = await youtube.playlistItems.list({
                    part: 'snippet',
                    playlistId: playlistId,
                    maxResults: 50,
                    pageToken: nextPageToken
                });

                console.log('YouTube API response:', response.data);

                videos = videos.concat(response.data.items);
                nextPageToken = response.data.nextPageToken;
            } while (nextPageToken);

            return videos.map(item => ({
                title: item.snippet.title,
                videoId: item.snippet.resourceId.videoId,
                videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                thumbnail: item.snippet.thumbnails?.medium?.url || '',
                description: item.snippet.description
            }));
        } catch (error) {
            console.error('Get videos from playlist error:', error);
            if (error.code === 401) {
                await PalcodeUser.findByIdAndUpdate(userId, {
                    'youtube.connected': false
                });
            }
            throw error;
        }
    }
}

module.exports = new YouTubeService();