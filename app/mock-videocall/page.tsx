'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Mic, MicOff, Video, VideoOff, Phone, PhoneOff, MessageSquare, 
  Users, Settings, Monitor, Share, MoreVertical, X, Send, Maximize2, Minimize2
} from 'lucide-react';

export default function MockVideoCall() {
  const searchParams = useSearchParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Patient', message: 'Hello doctor, can you hear me?', time: '10:30 AM' },
    { id: 2, sender: 'Expert', message: 'Yes, I can hear you clearly. How are you feeling today?', time: '10:31 AM' },
    { id: 3, sender: 'Patient', message: 'I have been experiencing some symptoms...', time: '10:32 AM' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [participants] = useState([
    { id: 1, name: 'Dr. Sarah Johnson', role: 'Expert', isSpeaking: true, isVideoOn: true },
    { id: 2, name: 'John Smith', role: 'Patient', isSpeaking: false, isVideoOn: true }
  ]);

  // Get URL parameters
  const roomId = searchParams.get('roomId') || 'default_room';
  const userName = searchParams.get('userName') || 'User';

  // Fix hydration by ensuring component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      sender: userName,
      message: newMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleEndCall = () => {
    window.close();
  };

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-white text-sm">Loading video call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-red-500 w-2 h-2 rounded-full animate-pulse"></div>
          <div>
            <h3 className="font-semibold">Mock Video Call</h3>
            <p className="text-gray-400 text-sm">Room: {roomId} | User: {userName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-2 rounded-lg transition-colors ${
              showParticipants ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            title="Participants"
          >
            <Users size={16} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Video Area */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Main Video */}
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
              <div className="flex-1 bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Video size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400">Main Video Feed</p>
                  <p className="text-sm text-gray-500 mt-2">Dr. Sarah Johnson</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                <span className="bg-red-500 w-2 h-2 rounded-full inline-block mr-2"></span>
                Live
              </div>
            </div>

            {/* Secondary Video */}
            <div className="bg-gray-800 rounded-lg p-4 flex flex-col">
              <div className="flex-1 bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Video size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400">Your Video</p>
                  <p className="text-sm text-gray-500 mt-2">{userName}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                <span className="bg-green-500 w-2 h-2 rounded-full inline-block mr-2"></span>
                Connected
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          {/* Chat Panel */}
          {showChat && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h4 className="font-semibold">Chat</h4>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-400">{msg.sender}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3 text-sm">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Participants Panel */}
          {showParticipants && !showChat && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h4 className="font-semibold">Participants ({participants.length})</h4>
                <button
                  onClick={() => setShowParticipants(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">{participant.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{participant.name}</p>
                      <p className="text-xs text-gray-400">{participant.role}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      {participant.isSpeaking && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      {participant.isVideoOn ? (
                        <Video size={12} className="text-green-500" />
                      ) : (
                        <VideoOff size={12} className="text-gray-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full transition-colors ${
              isMuted ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3 rounded-full transition-colors ${
              isVideoOff ? 'bg-red-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-full transition-colors ${
              isScreenSharing ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          >
            <Monitor size={18} />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full transition-colors ${
              showChat ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
            title="Chat"
          >
            <MessageSquare size={18} />
          </button>

          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
            title="End call"
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>
    </div>
  );
} 