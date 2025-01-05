// src/context/PlaylistContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import * as youtubeService from '../services/youtube';
import * as layoutService from '../services/layout';
import axios from 'axios';

// Export the context so it can be imported by usePlaylist
export const PlaylistContext = createContext(null);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await youtubeService.getPlaylists();
      setPlaylists(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveLayout = async (layoutData) => {
    try {
      const userString = localStorage.getItem('user');
      const parsedUser = JSON.parse(userString);
      
      const requestData = {
        userId: parsedUser.data.user.id,
        layout: layoutData
      };
      
      console.log('Sending layout data:', requestData);
      const response = await axios.post('http://localhost:5000/layout/save', 
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${parsedUser.data.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving layout:', error);
      throw error;
    }
  };

  const loadLayout = useCallback(async () => {
    try {
      const layout = await layoutService.getLayout();
      if (layout && layout.length > 0) {
        const orderedPlaylists = layout
          .map(id => playlists.find(p => p.id === id))
          .filter(Boolean);
        setPlaylists(orderedPlaylists);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [playlists]);

  const value = {
    playlists,
    setPlaylists,
    loading,
    error,
    fetchPlaylists,
    saveLayout,
    loadLayout
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};