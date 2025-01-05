import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PlaylistCard from './PlaylistCard';
import VideoList from './VideoList';
import { usePlaylist } from '../../hooks/usePlaylist';
import Button from '../common/Button';
import { Save, Download } from 'lucide-react';

const PlaylistGrid = () => {
  const { 
    playlists, 
    setPlaylists, 
    loading, 
    error,
    saveLayout,
    loadLayout,
    fetchPlaylists 
  } = usePlaylist();

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  useEffect(() => {
    try {
      // Get user data from different possible storage keys
      const userString = localStorage.getItem('user');
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      console.log('Found in localStorage:', { userString, userId, token });

      let userData = null;

      if (userString) {
        const parsedUser = JSON.parse(userString);
        userData = {
          id: parsedUser.data.user.id,
          email: parsedUser.data.user.email,
          token: parsedUser.data.token
        };
      } else if (userId && token) {
        userData = {
          id: userId,
          token: token
        };
      }

      console.log('Processed user data:', userData);
      
      if (userData && userData.id) {
        setCurrentUser(userData);
      } else {
        console.log('No valid user data found');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setPlaylists((prevPlaylists) => {
      const newPlaylists = [...prevPlaylists];
      const draggedItem = newPlaylists[dragIndex];
      newPlaylists.splice(dragIndex, 1);
      newPlaylists.splice(hoverIndex, 0, draggedItem);
      return newPlaylists;
    });
  }, []);

  const handleSaveLayout = async () => {
    try {
      setSaving(true);
      const layoutData = playlists.map(p => p.id);
      await saveLayout(layoutData);
      console.log('Layout saved successfully');
    } catch (error) {
      console.error('Failed to save layout:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Failed to load playlists</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <Button onClick={fetchPlaylists}>Try Again</Button>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Product Playlists</h2>
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={loadLayout}
              disabled={!currentUser}
              className="flex items-center"
            >
              <Download size={16} className="mr-2" />
              Load Layout
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveLayout}
              disabled={saving || !currentUser}
              className="flex items-center"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Saving...' : 'Save Layout'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, index) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              index={index}
              moveCard={moveCard}
              onClick={setSelectedPlaylist}
            />
          ))}
        </div>

        {selectedPlaylist && (
          <VideoList
            playlist={selectedPlaylist}
            onClose={() => setSelectedPlaylist(null)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default PlaylistGrid;
