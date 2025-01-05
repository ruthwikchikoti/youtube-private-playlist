import api from './api';

export const getAuthUrl = async () => {
  try {
    const response = await api.get('/youtube/auth-url');
    return response.data?.data?.authUrl;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get auth URL');
  }
};

export const getPlaylists = async () => {
  try {
    const response = await api.get('/youtube/playlists');
    return response.data?.data || [];
  } catch (error) {
    if (error.response?.status === 401 && error.response?.data?.data?.authUrl) {
      window.location.href = error.response.data.data.authUrl;
      return [];
    }
    throw error;
  }
};

export const getPlaylistVideos = async (playlistId) => {
  try {
    const response = await api.get(`/youtube/playlist/${playlistId}/videos`);
    return response.data?.data || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch videos');
  }
};

// Add the missing handleCallback function
export const handleCallback = async (code, state) => {
  try {
    const response = await api.get('/youtube/callback', {
      params: { code, state }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to complete YouTube authorization');
  }
};