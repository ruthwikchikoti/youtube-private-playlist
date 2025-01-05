export const ItemTypes = {
  PLAYLIST: 'playlist',
  VIDEO: 'video'
};

export const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  YOUTUBE_CALLBACK: '/youtube/callback'
};

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/auth/send-otp',
    VERIFY_OTP: '/auth/verify-otp',
    VERIFY_TOKEN: '/auth/verify'
  },
  YOUTUBE: {
    AUTH_URL: '/youtube/auth-url',
    CALLBACK: '/youtube/callback',
    PLAYLISTS: '/youtube/playlists',
    PLAYLIST_VIDEOS: (id) => `/youtube/playlist/${id}/videos`
  },
  LAYOUT: {
    SAVE: '/layout/save',
    GET: '/layout',
    HISTORY: '/layout/history',
    ACTIVATE: (id) => `/layout/activate/${id}`
  }
};
