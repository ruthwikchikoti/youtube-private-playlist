import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { Bell, HelpCircle, LogOut, Search } from 'lucide-react';
import * as youtubeService from '../../services/youtube';

const Header = () => {
  const { user, logout } = useAuth();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleImportYoutube = async () => {
    try {
      setImporting(true);
      const authUrl = await youtubeService.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
    } finally {
      setImporting(false);
      setShowImportModal(false);
    }
  };

  return (
    <header className="bg-[#1a1d24] border-b border-gray-800">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Design Studio</h1>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Project..."
              className="w-64 px-4 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-lg
                       text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>

          <Button 
            variant="primary"
            onClick={() => setShowImportModal(true)}
          >
            Import from YouTube
          </Button>

          <Button variant="secondary">
            Product Tour
          </Button>

          <button className="text-gray-400 hover:text-white transition-colors">
            <Bell size={24} />
          </button>

          <div className="flex items-center space-x-4">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.email || 'U'}&background=random`}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white">{user?.email}</span>
            <button 
              onClick={logout}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import from YouTube"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowImportModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleImportYoutube}
              loading={importing}
            >
              Continue
            </Button>
          </>
        }
      >
        <p className="text-gray-300">
          This will import your YouTube playlists into the application.
          You'll need to authorize access to your YouTube account.
        </p>
      </Modal>
    </header>
  );
};

export default Header;