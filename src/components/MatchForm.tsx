import React, { useState } from 'react'
import { Calendar, MapPin, Users, Trophy } from 'lucide-react'
import { Match } from '../lib/unified-types'

interface MatchFormProps {
  onSubmit: (matchData: Partial<Match>) => void
  onCancel: () => void
  fighters?: Array<{ id: string; name: string }>
  venues?: Array<{ id: string; name: string }>
}

const MatchForm: React.FC<MatchFormProps> = ({ onSubmit, onCancel, fighters = [], venues = [] }) => {
  const [formData, setFormData] = useState({
    fighter_a: '',
    fighter_b: '',
    venue: '',
    date: '',
    title_bout: false,
    belt: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      date: new Date(formData.date).toISOString()
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Schedule New Match</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Fighter A
            </label>
            <select
              value={formData.fighter_a}
              onChange={(e) => handleChange('fighter_a', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Fighter</option>
              {fighters.map(fighter => (
                <option key={fighter.id} value={fighter.name}>
                  {fighter.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Fighter B
            </label>
            <select
              value={formData.fighter_b}
              onChange={(e) => handleChange('fighter_b', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Fighter</option>
              {fighters.map(fighter => (
                <option key={fighter.id} value={fighter.name}>
                  {fighter.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Venue
            </label>
            <select
              value={formData.venue}
              onChange={(e) => handleChange('venue', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Venue</option>
              {venues.map(venue => (
                <option key={venue.id} value={venue.name}>
                  {venue.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Date
            </label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.title_bout}
              onChange={(e) => handleChange('title_bout', e.target.checked)}
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
            Title Bout
          </label>

          {formData.title_bout && (
            <div className="flex-1">
              <select
                value={formData.belt}
                onChange={(e) => handleChange('belt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={formData.title_bout}
              >
                <option value="">Select Belt</option>
                <option value="WBC">WBC</option>
                <option value="WBA">WBA</option>
                <option value="IBF">IBF</option>
                <option value="WBO">WBO</option>
                <option value="The Ring">The Ring</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Schedule Match
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default MatchForm 