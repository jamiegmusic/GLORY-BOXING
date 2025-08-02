import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { websocketEngine, WebSocketState, MessageType } from '../../lib/websocket-engine';

interface WebSocketConnectionProps {
  userId: string;
  onConnectionChange?: (connected: boolean) => void;
}

const WebSocketConnection: React.FC<WebSocketConnectionProps> = ({ 
  userId, 
  onConnectionChange 
}) => {
  const [connectionState, setConnectionState] = useState<WebSocketState>(WebSocketState.DISCONNECTED);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>('');
  const [messageCount, setMessageCount] = useState(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Set up event listeners
    const handleStateChange = (state: WebSocketState) => {
      setConnectionState(state);
      setIsConnecting(state === WebSocketState.CONNECTING);
      onConnectionChange?.(state === WebSocketState.CONNECTED);
      
      if (state === WebSocketState.ERROR) {
        setError('Connection failed');
      } else {
        setError('');
      }
    };

    const handleMessage = (data: any) => {
      setLastMessage(JSON.stringify(data).substring(0, 100));
      setMessageCount(prev => prev + 1);
    };

    const handleError = (error: any) => {
      setError(error.message || 'Connection error');
    };

    // Add event listeners
    websocketEngine.on('stateChange', handleStateChange);
    websocketEngine.on('gameUpdate', handleMessage);
    websocketEngine.on('tournamentUpdate', handleMessage);
    websocketEngine.on('chatMessage', handleMessage);
    websocketEngine.on('error', handleError);

    return () => {
      // Clean up event listeners
      websocketEngine.off('stateChange', handleStateChange);
      websocketEngine.off('gameUpdate', handleMessage);
      websocketEngine.off('tournamentUpdate', handleMessage);
      websocketEngine.off('chatMessage', handleMessage);
      websocketEngine.off('error', handleError);
    };
  }, [onConnectionChange]);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError('');
      await websocketEngine.connect(userId);
    } catch (err) {
      setError('Failed to connect');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    websocketEngine.disconnect();
  };

  const handleReconnect = () => {
    if (connectionState !== WebSocketState.CONNECTED) {
      handleConnect();
    }
  };

  const getConnectionStatus = () => {
    switch (connectionState) {
      case WebSocketState.CONNECTED:
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          text: 'Connected',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case WebSocketState.CONNECTING:
        return {
          icon: <Clock className="w-5 h-5 text-yellow-500 animate-spin" />,
          text: 'Connecting...',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case WebSocketState.RECONNECTING:
        return {
          icon: <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />,
          text: 'Reconnecting...',
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case WebSocketState.ERROR:
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          text: 'Connection Error',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <WifiOff className="w-5 h-5 text-gray-500" />,
          text: 'Disconnected',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const status = getConnectionStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">WebSocket Connection</h3>
        <div className="flex items-center space-x-2">
          {status.icon}
          <span className={`font-medium ${status.color}`}>{status.text}</span>
        </div>
      </div>

      <div className={`border rounded-lg p-4 ${status.bgColor} ${status.borderColor}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Connection Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-mono text-gray-900">{userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session ID:</span>
                <span className="font-mono text-gray-900">
                  {websocketEngine.getSessionId() || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Messages:</span>
                <span className="font-mono text-gray-900">{messageCount}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Last Message</h4>
            <div className="bg-gray-100 rounded p-2 text-xs font-mono text-gray-700 max-h-20 overflow-y-auto">
              {lastMessage || 'No messages yet'}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex space-x-2">
          {connectionState === WebSocketState.DISCONNECTED && (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wifi className="w-4 h-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          )}

          {connectionState === WebSocketState.CONNECTED && (
            <button
              onClick={handleDisconnect}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <WifiOff className="w-4 h-4 mr-2" />
              Disconnect
            </button>
          )}

          {(connectionState === WebSocketState.ERROR || connectionState === WebSocketState.DISCONNECTED) && (
            <button
              onClick={handleReconnect}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reconnect
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="font-medium text-gray-700 mb-2">Connection Stats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {connectionState === WebSocketState.CONNECTED ? '1' : '0'}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{messageCount}</div>
            <div className="text-gray-600">Messages</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {websocketEngine.getUserId() ? '1' : '0'}
            </div>
            <div className="text-gray-600">Users</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {error ? '1' : '0'}
            </div>
            <div className="text-gray-600">Errors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketConnection; 