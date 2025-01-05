// src/pages/YouTubeCallback.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as youtubeService from '../services/youtube';
import { usePlaylist } from '../hooks/usePlaylist';

const YouTubeCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchPlaylists } = usePlaylist();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code || !state) {
          throw new Error('Missing required parameters');
        }

        await youtubeService.handleCallback(code, state);
        
        await fetchPlaylists();
        
        navigate('/dashboard', {
          state: { message: 'YouTube account connected successfully!' },
          replace: true
        });
      } catch (error) {
        console.error('YouTube callback error:', error);
        navigate('/dashboard', {
          state: { error: 'Failed to connect YouTube account. Please try again.' },
          replace: true
        });
      }
    };

    handleAuthCallback();
  }, [location, navigate, fetchPlaylists]);

  return (
    <div className="min-h-screen bg-[#1a1d24] flex items-center justify-center">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Connecting YouTube Account
        </h2>
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
        <p className="text-gray-300">Please wait while we connect your account...</p>
      </div>
    </div>
  );
};

export default YouTubeCallback;  