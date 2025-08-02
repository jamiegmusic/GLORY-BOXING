import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  MessageSquare, 
  Bell, 
  Trophy, 
  Target,
  Send,
  Check,
  X,
  Heart,
  Star,
  Award,
  Activity,
  Search,
  Filter
} from 'lucide-react';
import { 
  multiplayerEngine, 
  MultiplayerUser, 
  SocialFeature,
  ChatMessage
} from '../../lib/multiplayer-engine';

interface SocialFeaturesProps {
  currentUserId?: string;
  currentUsername?: string;
}

const SocialFeatures: React.FC<SocialFeaturesProps> = ({ 
  currentUserId = 'user1', 
  currentUsername = 'Player' 
}) => {
  const [users, setUsers] = useState<MultiplayerUser[]>([]);
  const [socialFeatures, setSocialFeatures] = useState<SocialFeature[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState('friends');
  const [selectedUser, setSelectedUser] = useState<MultiplayerUser | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [challengeType, setChallengeType] = useState('competitive');

  useEffect(() => {
    // Load initial data
    setUsers(multiplayerEngine.getUsers());
    setSocialFeatures(multiplayerEngine.getSocialFeatures(currentUserId));
    setChatMessages(multiplayerEngine.getChatMessages('global'));
    
    // Set up event listeners
    multiplayerEngine.on('userConnected', (user: MultiplayerUser) => {
      setUsers(multiplayerEngine.getUsers());
    });
    
    multiplayerEngine.on('friendRequestSent', (request: SocialFeature) => {
      setSocialFeatures(multiplayerEngine.getSocialFeatures(currentUserId));
    });
    
    multiplayerEngine.on('challengeSent', (challenge: SocialFeature) => {
      setSocialFeatures(multiplayerEngine.getSocialFeatures(currentUserId));
    });
    
    multiplayerEngine.on('messageSent', (message: ChatMessage) => {
      setChatMessages(multiplayerEngine.getChatMessages('global'));
    });
  }, [currentUserId]);

  const handleSendFriendRequest = async (toUserId: string) => {
    try {
      const success = await multiplayerEngine.sendFriendRequest(currentUserId, toUserId);
      if (success) {
        setShowAddFriend(false);
        setSocialFeatures(multiplayerEngine.getSocialFeatures(currentUserId));
      }
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handleSendChallenge = async (toUserId: string, gameType: string) => {
    try {
      const success = await multiplayerEngine.sendChallenge(currentUserId, toUserId, gameType);
      if (success) {
        setSocialFeatures(multiplayerEngine.getSocialFeatures(currentUserId));
      }
    } catch (error) {
      console.error('Failed to send challenge:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const success = await multiplayerEngine.sendMessage('global', currentUserId, newMessage);
        if (success) {
          setNewMessage('');
          setChatMessages(multiplayerEngine.getChatMessages('global'));
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleRespondToRequest = async (requestId: string, response: 'accepted' | 'declined') => {
    // Update the request status
    const updatedFeatures = socialFeatures.map(feature => 
      feature.id === requestId ? { ...feature, status: response } : feature
    );
    setSocialFeatures(updatedFeatures);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    user.id !== currentUserId
  );

  const onlineUsers = filteredUsers.filter(user => user.isOnline);
  const offlineUsers = filteredUsers.filter(user => !user.isOnline);
  const pendingRequests = socialFeatures.filter(feature => feature.status === 'pending');

  const renderFriendsTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Friends & Players</h3>
        <button 
          onClick={() => setShowAddFriend(true)}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search players..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="space-y-4">
        {onlineUsers.length > 0 && (
          <div>
            <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Online Players ({onlineUsers.length})
            </h4>
            <div className="space-y-2">
              {onlineUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">Rank {user.rank} • Level {user.level}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSendChallenge(user.id, challengeType)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Challenge
                    </button>
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {offlineUsers.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-600 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              Offline Players ({offlineUsers.length})
            </h4>
            <div className="space-y-2">
              {offlineUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">
                        Last active: {user.lastActive.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleSendFriendRequest(user.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Add Friend
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No players found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderRequestsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pending Requests</h3>
      
      {pendingRequests.length > 0 ? (
        <div className="space-y-3">
          {pendingRequests.map(request => (
            <div key={request.id} className="p-4 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {request.type === 'friend_request' && <UserPlus className="w-4 h-4 text-blue-500" />}
                    {request.type === 'challenge' && <Target className="w-4 h-4 text-red-500" />}
                    <span className="font-medium">{request.content}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    From: {request.fromUserId} • {request.timestamp.toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRespondToRequest(request.id, 'accepted')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Accept
                  </button>
                  <button 
                    onClick={() => handleRespondToRequest(request.id, 'declined')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No pending requests</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      )}
    </div>
  );

  const renderChatTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Global Chat</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            Global
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
            Tournament
          </button>
        </div>
      </div>
      
      <div className="bg-white border rounded-lg h-96 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            {chatMessages.length > 0 ? (
              chatMessages.map(message => (
                <div key={message.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {message.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{message.username}</span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm mt-1">{message.message}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-gray-500 py-4">
                Welcome to Glory Boxing Manager Global Chat!
              </div>
            )}
          </div>
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      
      <div className="space-y-3">
        {socialFeatures.slice(0, 10).map(feature => (
          <div key={feature.id} className="p-3 border rounded-lg bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                {feature.type === 'friend_request' ? <UserPlus className="w-4 h-4" /> :
                 feature.type === 'challenge' ? <Target className="w-4 h-4" /> :
                 feature.type === 'achievement' ? <Award className="w-4 h-4" /> :
                 <Activity className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="text-sm">{feature.content}</div>
                <div className="text-xs text-gray-500">
                  {feature.timestamp.toLocaleString()}
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs ${
                feature.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                feature.status === 'accepted' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {feature.status}
              </div>
            </div>
          </div>
        ))}
        
        {socialFeatures.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No recent activity</p>
            <p className="text-sm">Start interacting with other players!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAddFriendModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Friend</h2>
          <button 
            onClick={() => setShowAddFriend(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Player
            </label>
            <select 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                if (e.target.value) {
                  handleSendFriendRequest(e.target.value);
                }
              }}
            >
              <option value="">Choose a player...</option>
              {users.filter(user => user.id !== currentUserId).map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} (Rank {user.rank})
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddFriend(false)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'friends', label: 'Friends', icon: <Users className="w-4 h-4" /> },
    { id: 'requests', label: 'Requests', icon: <Bell className="w-4 h-4" /> },
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'activity', label: 'Activity', icon: <Activity className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'friends':
        return renderFriendsTab();
      case 'requests':
        return renderRequestsTab();
      case 'chat':
        return renderChatTab();
      case 'activity':
        return renderActivityTab();
      default:
        return renderFriendsTab();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Social Features</h2>
        <div className="flex gap-2">
          <span className="text-sm text-gray-500">
            {onlineUsers.length} online • {users.length} total players
          </span>
        </div>
      </div>
      
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        {renderTabContent()}
      </div>
      
      {showAddFriend && renderAddFriendModal()}
    </div>
  );
};

export default SocialFeatures; 