import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const YouTubeCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const youtube = params.get('youtube');
        const message = params.get('message');

        setTimeout(() => {
            navigate('/dashboard', {
                state: {
                    youtube,
                    message: message || (youtube === 'success' ? 'YouTube connected successfully!' : 'Failed to connect YouTube')
                }
            });
        }, 1000);
    }, [location, navigate]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                    Processing YouTube Authorization
                </h2>
                <div className="flex items-center justify-center mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                </div>
                <p className="text-gray-300">Please wait...</p>
            </div>
        </div>
    );
};

export default YouTubeCallback;