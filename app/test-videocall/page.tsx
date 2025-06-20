"use client";

import React, { useState } from 'react';
import VideoCallCard from '@/components/shared/VideoCallCard';

const TestVideoCallPage: React.FC = () => {
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Video Call Card Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test with Mock Video Call */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Mock Video Call</h2>
            <VideoCallCard
              videoCallUrl="/mock-videocall?roomId=test_room&userName=Expert"
              title="Mock Consultation"
              subtitle="Testing interface"
              onClose={() => console.log('Mock call closed')}
              className="w-full"
            />
          </div>

          {/* Test with Real 100ms URL */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Real 100ms Video Call</h2>
            <VideoCallCard
              videoCallUrl="https://app.100ms.live/meeting/room_123?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
              title="Real Consultation"
              subtitle="100ms integration"
              onClose={() => console.log('Real call closed')}
              isFullScreen={isFullScreen}
              onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
              className="w-full"
            />
          </div>
        </div>

        {/* Test Modal */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Modal Video Call</h2>
          <button
            onClick={() => setShowVideoCall(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Video Call Modal
          </button>
        </div>

        {/* Modal */}
        {showVideoCall && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-4xl">
              <VideoCallCard
                videoCallUrl="/mock-videocall?roomId=modal_test&userName=Expert"
                title="Modal Consultation"
                subtitle="Testing modal functionality"
                onClose={() => setShowVideoCall(false)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestVideoCallPage; 