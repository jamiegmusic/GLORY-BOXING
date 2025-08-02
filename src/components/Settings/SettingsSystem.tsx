import React, { useState, useEffect } from 'react'
import { Settings, Volume2, Bell, Moon, Sun, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface GameSettings {
  id: string
  game_speed: 'slow' | 'normal' | 'fast'
  ai_commentary_enabled: boolean
  dark_mode_enabled: boolean
  notifications_enabled: boolean
  sound_effects_enabled: boolean
  auto_save_enabled: boolean
  difficulty_level: 'easy' | 'normal' | 'hard'
  language: string
}

export default function SettingsSystem() {
  const [settings, setSettings] = useState<GameSettings>({
    id: '1',
    game_speed: 'normal',
    ai_commentary_enabled: true,
    dark_mode_enabled: true,
    notifications_enabled: true,
    sound_effects_enabled: true,
    auto_save_enabled: true,
    difficulty_level: 'normal',
    language: 'en'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('game_settings')
        .select('*')
        .limit(1)
        .single()

      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('game_settings')
        .upsert(settings)

      if (error) throw error
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSettingChange = (key: keyof GameSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return <div className="text-white">Loading settings...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Settings</h2>

      <div className="grid gap-6">
        {/* Game Settings */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Game Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-300">Game Speed</label>
              <select
                value={settings.game_speed}
                onChange={(e) => handleSettingChange('game_speed', e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="slow">Slow</option>
                <option value="normal">Normal</option>
                <option value="fast">Fast</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-300">Difficulty Level</label>
              <select
                value={settings.difficulty_level}
                onChange={(e) => handleSettingChange('difficulty_level', e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-300">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Feature Toggles</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-300">AI Commentary</label>
              <input
                type="checkbox"
                checked={settings.ai_commentary_enabled}
                onChange={(e) => handleSettingChange('ai_commentary_enabled', e.target.checked)}
                className="form-checkbox text-red-600 bg-gray-700 border-gray-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-300">Dark Mode</label>
              <input
                type="checkbox"
                checked={settings.dark_mode_enabled}
                onChange={(e) => handleSettingChange('dark_mode_enabled', e.target.checked)}
                className="form-checkbox text-red-600 bg-gray-700 border-gray-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-300">Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications_enabled}
                onChange={(e) => handleSettingChange('notifications_enabled', e.target.checked)}
                className="form-checkbox text-red-600 bg-gray-700 border-gray-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-300">Sound Effects</label>
              <input
                type="checkbox"
                checked={settings.sound_effects_enabled}
                onChange={(e) => handleSettingChange('sound_effects_enabled', e.target.checked)}
                className="form-checkbox text-red-600 bg-gray-700 border-gray-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-gray-300">Auto Save</label>
              <input
                type="checkbox"
                checked={settings.auto_save_enabled}
                onChange={(e) => handleSettingChange('auto_save_enabled', e.target.checked)}
                className="form-checkbox text-red-600 bg-gray-700 border-gray-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  )
} 