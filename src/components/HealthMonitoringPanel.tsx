import React, { useState, useEffect } from 'react'
import { Fighter, Injury } from '../lib/unified-types'
import { healthMonitoringSystem, HealthAssessment, ConcussionProtocol } from '../lib/health-monitoring-system'
import { 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity,
  Shield,
  Brain,
  Eye,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Stethoscope,
  Zap
} from 'lucide-react'

interface HealthMonitoringPanelProps {
  fighters: Fighter[]
  onUpdateFighter?: (fighter: Fighter) => void
}

const HealthMonitoringPanel: React.FC<HealthMonitoringPanelProps> = ({
  fighters,
  onUpdateFighter
}) => {
  const [selectedFighter, setSelectedFighter] = useState<Fighter | null>(null)
  const [healthAssessment, setHealthAssessment] = useState<HealthAssessment | null>(null)
  const [recoveryTimeline, setRecoveryTimeline] = useState<any>(null)
  const [showInjuryModal, setShowInjuryModal] = useState(false)
  const [injuryForm, setInjuryForm] = useState({
    type: '',
    severity: 'mild' as 'mild' | 'moderate' | 'severe'
  })

  useEffect(() => {
    if (selectedFighter) {
      const assessment = healthMonitoringSystem.assessFighterHealth(selectedFighter)
      const timeline = healthMonitoringSystem.getRecoveryTimeline(selectedFighter)
      setHealthAssessment(assessment)
      setRecoveryTimeline(timeline)
    }
  }, [selectedFighter])

  const handleFighterSelect = (fighter: Fighter) => {
    setSelectedFighter(fighter)
  }

  const handleSimulateInjury = () => {
    if (!selectedFighter) return

    try {
      const injury = healthMonitoringSystem.simulateInjury(
        selectedFighter,
        injuryForm.type,
        injuryForm.severity
      )

      const updatedFighter = {
        ...selectedFighter,
        injuries: [...(selectedFighter.injuries || []), injury]
      }

      onUpdateFighter?.(updatedFighter)
      setShowInjuryModal(false)
      setInjuryForm({ type: '', severity: 'mild' })
    } catch (error) {
      console.error('Failed to simulate injury:', error)
    }
  }

  const handleActivateConcussionProtocol = (severity: 'mild' | 'moderate' | 'severe') => {
    if (!selectedFighter) return

    const protocol = healthMonitoringSystem.activateConcussionProtocol(selectedFighter, severity)
    console.log('Concussion protocol activated:', protocol)
  }

  const getHealthStatusColor = (health: number) => {
    if (health >= 80) return 'text-green-600'
    if (health >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthStatusIcon = (health: number) => {
    if (health >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (health >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const injuryTypes = [
    'concussion', 'hand_fracture', 'rib_fracture', 'eye_injury',
    'shoulder_dislocation', 'knee_injury', 'cut', 'bruising'
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Heart className="w-6 h-6 mr-2 text-red-600" />
          Health Monitoring System
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Medical Clearance:</span>
          <span className="text-sm font-medium text-green-600">
            {fighters.filter(f => healthMonitoringSystem.checkMedicalClearance(f)).length}/{fighters.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fighter List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fighter Health Status</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {fighters.map(fighter => {
              const assessment = healthMonitoringSystem.assessFighterHealth(fighter)
              const isSelected = selectedFighter?.id === fighter.id
              
              return (
                <div
                  key={fighter.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleFighterSelect(fighter)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getHealthStatusIcon(assessment.overallHealth)}
                      <div>
                        <p className="font-medium text-gray-900">{fighter.name}</p>
                        <p className="text-sm text-gray-600">{fighter.weight_class}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getHealthStatusColor(assessment.overallHealth)}`}>
                        {assessment.overallHealth.toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {assessment.recoveryStatus}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Health Assessment */}
        <div className="lg:col-span-2">
          {selectedFighter && healthAssessment ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Health Assessment: {selectedFighter.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowInjuryModal(true)}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Simulate Injury
                  </button>
                  <button
                    onClick={() => handleActivateConcussionProtocol('mild')}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    Concussion Protocol
                  </button>
                </div>
              </div>

              {/* Health Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Health</span>
                    {getHealthStatusIcon(healthAssessment.overallHealth)}
                  </div>
                  <p className={`text-2xl font-bold ${getHealthStatusColor(healthAssessment.overallHealth)}`}>
                    {healthAssessment.overallHealth.toFixed(0)}%
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Injury Risk</span>
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className={`text-2xl font-bold ${healthAssessment.injuryRisk > 50 ? 'text-red-600' : 'text-green-600'}`}>
                    {healthAssessment.injuryRisk.toFixed(0)}%
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Medical Clearance</span>
                    {healthAssessment.medicalClearance ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className={`text-2xl font-bold ${healthAssessment.medicalClearance ? 'text-green-600' : 'text-red-600'}`}>
                    {healthAssessment.medicalClearance ? 'CLEARED' : 'RESTRICTED'}
                  </p>
                </div>
              </div>

              {/* Recovery Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recovery Status</h4>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {healthAssessment.recoveryStatus.replace('_', ' ')}
                </p>
                
                {healthAssessment.restrictions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Restrictions:</p>
                    <div className="flex flex-wrap gap-2">
                      {healthAssessment.restrictions.map((restriction, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full"
                        >
                          {restriction.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {healthAssessment.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                    <ul className="space-y-1">
                      {healthAssessment.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recovery Timeline */}
              {recoveryTimeline && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recovery Timeline</h4>
                  
                  {recoveryTimeline.injuries.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Active Injuries:</p>
                      {recoveryTimeline.injuries.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-900 capitalize">
                                {item.injury.type.replace('_', ' ')}
                              </p>
                              <p className="text-sm text-gray-600 capitalize">
                                {item.injury.severity} severity
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {item.daysUntilRecovery} days
                            </p>
                            <p className="text-xs text-gray-500">until recovery</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {recoveryTimeline.concussionProtocol && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Brain className="w-4 h-4 text-yellow-600" />
                          <div>
                            <p className="font-medium text-gray-900">Concussion Protocol Active</p>
                            <p className="text-sm text-gray-600 capitalize">
                              {recoveryTimeline.concussionProtocol.protocol.severity} severity
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {recoveryTimeline.concussionProtocol.daysUntilClearance} days
                          </p>
                          <p className="text-xs text-gray-500">until clearance</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {recoveryTimeline.injuries.length === 0 && !recoveryTimeline.concussionProtocol && (
                    <p className="text-sm text-gray-500">No active recovery timeline</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a fighter to view health assessment</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Injury Simulation Modal */}
      {showInjuryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulate Injury</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Injury Type
                </label>
                <select
                  value={injuryForm.type}
                  onChange={(e) => setInjuryForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select injury type</option>
                  {injuryTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity
                </label>
                <div className="space-y-2">
                  {(['mild', 'moderate', 'severe'] as const).map(severity => (
                    <label key={severity} className="flex items-center">
                      <input
                        type="radio"
                        name="severity"
                        value={severity}
                        checked={injuryForm.severity === severity}
                        onChange={(e) => setInjuryForm(prev => ({ ...prev, severity: e.target.value as any }))}
                        className="mr-2"
                      />
                      <span className="capitalize">{severity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowInjuryModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSimulateInjury}
                disabled={!injuryForm.type}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simulate Injury
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthMonitoringPanel 