import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';
import * as youtubeService from '../../services/youtube';
import { formatDuration } from '../../utils/helpers';

const VideoList = ({ playlist, onClose }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState(new Set());

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await youtubeService.getPlaylistVideos(playlist.id);
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [playlist.id]);

  useEffect(() => {
    setSelectedVideos(new Set());
  }, [playlist.id]);

  const handleVideoSelect = (videoId) => {
    if (!videoId) return; 
    setSelectedVideos((prevSelectedVideos) => {
      const newSelectedVideos = new Set(prevSelectedVideos);
      if (newSelectedVideos.has(videoId)) {
        newSelectedVideos.delete(videoId);
      } else {
        newSelectedVideos.add(videoId);
      }
      return newSelectedVideos;
    });
  };

  const handleAddToCampaign = () => {
    const selectedVideoIds = Array.from(selectedVideos);
    console.log('Selected videos:', selectedVideoIds);
  };

  if (loading) {
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-gray-800 shadow-xl p-6">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-gray-800 shadow-xl p-6">
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-gray-800 shadow-xl flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{playlist.title}</h3>
          <p className="text-sm text-gray-400">{videos.length} Videos</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {videos.map((video) => (
          <div
            key={video.id || video.videoId}
            className="p-4 border-b border-gray-700 flex items-center space-x-4"
          >
            <div className="flex-shrink-0 w-32 relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover rounded"
              />
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                {formatDuration(video.duration)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{video.title}</h4>
              <p className="text-sm text-gray-400 truncate">{video.description}</p>
            </div>
            <input
              type="checkbox"
              checked={selectedVideos.has(video.id || video.videoId)} 
              onChange={() => handleVideoSelect(video.id || video.videoId)} 
              className="w-5 h-5 rounded text-blue-600"
            />
          </div>
        ))}
      </div>

      {selectedVideos.size > 0 && (
        <div className="p-4 border-t border-gray-700">
          <Button className="w-full" onClick={handleAddToCampaign}>
            Add {selectedVideos.size} Videos to Campaign
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoList;