import React, { useState } from 'react';
import { Settings, Database, Key, TestTube, Save, RefreshCw } from 'lucide-react';

const SettingsTab = () => {
  const [supabaseUrl, setSupabaseUrl] = useState('https://yutwoddmzgntofygfdve.supabase.co');
  const [supabaseKey, setSupabaseKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1dHdvZGRtemdudG9meWdmZHZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0ODE3NTYsImV4cCI6MjA2NzA1Nzc1Nn0.r6BkDQeoeFDKiWuHQPqbOUvMBxgsEnjnINhSGIlf3pI');
  const [testMode, setTestMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const handleSaveSettings = () => {
    console.log('Settings saved:', { supabaseUrl, supabaseKey, testMode, debugMode });
    // TODO: Save to localStorage or environment
  };

  const handleTestConnection = () => {
    console.log('Testing Supabase connection...');
    // TODO: Test Supabase connection
  };

  const handleResetDatabase = () => {
    console.log('Resetting database...');
    // TODO: Reset database
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-6 h-6 text-gray-400" />
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      {/* Supabase Configuration */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Supabase Configuration</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Supabase URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://your-project.supabase.co"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Supabase Anon Key</label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Supabase anon key"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleTestConnection}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center space-x-2"
            >
              <TestTube className="w-4 h-4" />
              <span>Test Connection</span>
            </button>
            <button
              onClick={handleSaveSettings}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Game Settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Game Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Test Mode</label>
              <p className="text-xs text-gray-400">Enable test mode for development</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Debug Mode</label>
              <p className="text-xs text-gray-400">Enable debug logging</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={debugMode}
                onChange={(e) => setDebugMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Database Management */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>Database Management</span>
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Matches</h4>
              <p className="text-2xl font-bold text-blue-400">12</p>
              <p className="text-xs text-gray-400">Total matches</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Fighters</h4>
              <p className="text-2xl font-bold text-green-400">45</p>
              <p className="text-xs text-gray-400">Active fighters</p>
          </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Press Conferences</h4>
              <p className="text-2xl font-bold text-purple-400">8</p>
              <p className="text-xs text-gray-400">Total conferences</p>
      </div>
    </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleResetDatabase}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Database</span>
          </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition duration-300">
              Export Data
          </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300">
              Import Data
          </button>
        </div>
      </div>
    </div>

      {/* System Information */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">System Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Version</p>
            <p className="font-medium">1.0.0</p>
        </div>
          <div>
            <p className="text-gray-400">Last Updated</p>
            <p className="font-medium">2024-01-15</p>
      </div>
          <div>
            <p className="text-gray-400">Environment</p>
            <p className="font-medium">Development</p>
    </div>
          <div>
            <p className="text-gray-400">Database Status</p>
            <p className="font-medium text-green-400">Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab; 