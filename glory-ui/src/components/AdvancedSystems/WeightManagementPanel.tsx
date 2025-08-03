import React, { useState, useEffect } from 'react';
import {
  weightManagementSystem,
  type WeightCuttingPlan,
  type CatchweightNegotiation,
  type WalkAroundWeight,
  WeightClass,
  WeightCuttingMethod
} from '../../lib/weight-management-system';

const WeightManagementPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('weight-cutting');
  const [weightCuttingPlans, setWeightCuttingPlans] = useState<WeightCuttingPlan[]>([]);
  const [catchweightNegotiations, setCatchweightNegotiations] = useState<CatchweightNegotiation[]>([]);
  const [walkAroundWeights, setWalkAroundWeights] = useState<WalkAroundWeight[]>([]);

  useEffect(() => {
    // Load data from the system
    setWeightCuttingPlans(weightManagementSystem.getWeightCuttingPlans());
    setCatchweightNegotiations(weightManagementSystem.getCatchweightNegotiations());
    setWalkAroundWeights(weightManagementSystem.getWalkAroundWeights());

    // Listen for events
    const handleWeightCuttingPlanCreated = (plan: WeightCuttingPlan) => {
      setWeightCuttingPlans(prev => [...prev, plan]);
    };

    const handleCatchweightNegotiationCreated = (negotiation: CatchweightNegotiation) => {
      setCatchweightNegotiations(prev => [...prev, negotiation]);
    };

    const handleWalkAroundWeightSet = (weight: WalkAroundWeight) => {
      setWalkAroundWeights(prev => [...prev, weight]);
    };

    weightManagementSystem.on('weightCuttingPlanCreated', handleWeightCuttingPlanCreated);
    weightManagementSystem.on('catchweightNegotiationCreated', handleCatchweightNegotiationCreated);
    weightManagementSystem.on('walkAroundWeightSet', handleWalkAroundWeightSet);

    return () => {
      weightManagementSystem.off('weightCuttingPlanCreated', handleWeightCuttingPlanCreated);
      weightManagementSystem.off('catchweightNegotiationCreated', handleCatchweightNegotiationCreated);
      weightManagementSystem.off('walkAroundWeightSet', handleWalkAroundWeightSet);
    };
  }, []);

  const createSampleWeightCuttingPlan = () => {
    const plan: Omit<WeightCuttingPlan, 'id' | 'dailyProgress'> = {
      fighterId: 'fighter-1',
      targetWeight: 147,
      currentWeight: 165,
      startWeight: 165,
      timeline: 30,
      method: WeightCuttingMethod.GRADUAL,
      nutritionPlan: {
        calories: 2000,
        protein: 180,
        carbs: 150,
        fats: 60,
        supplements: ['Multivitamin', 'Electrolytes', 'BCAAs'],
        mealTiming: [],
        hydrationTarget: 3
      },
      hydrationStrategy: {
        preWeighIn: {
          duration: 24,
          fluidIntake: 0.5,
          electrolyteBalance: { sodium: 500, potassium: 200, magnesium: 50, calcium: 200 },
          monitoring: { urineColor: 'Dark', thirstLevel: 8, energyLevel: 4, crampRisk: 7 }
        },
        postWeighIn: {
          duration: 24,
          fluidIntake: 2.4,
          electrolyteBalance: { sodium: 2000, potassium: 1000, magnesium: 200, calcium: 500 },
          monitoring: { urineColor: 'Light', thirstLevel: 3, energyLevel: 7, crampRisk: 3 }
        },
        fightNight: {
          duration: 6,
          fluidIntake: 1.2,
          electrolyteBalance: { sodium: 1500, potassium: 800, magnesium: 150, calcium: 400 },
          monitoring: { urineColor: 'Clear', thirstLevel: 2, energyLevel: 9, crampRisk: 2 }
        },
        recovery: {
          duration: 48,
          fluidIntake: 0.4,
          electrolyteBalance: { sodium: 1000, potassium: 600, magnesium: 100, calcium: 300 },
          monitoring: { urineColor: 'Light', thirstLevel: 1, energyLevel: 8, crampRisk: 1 }
        }
      },
      riskAssessment: {
        dehydrationRisk: 5,
        performanceImpact: 4,
        healthRisk: 3,
        recoveryTime: 2,
        recommendations: ['Monitor hydration levels', 'Adjust training intensity']
      }
    };

    weightManagementSystem.createWeightCuttingPlan(plan);
  };

  const createSampleCatchweightNegotiation = () => {
    const negotiation: Omit<CatchweightNegotiation, 'id'> = {
      fighterA: 'fighter-1',
      fighterB: 'fighter-2',
      requestedWeight: 150,
      financialPenalty: 25000,
      performanceImpact: {
        staminaReduction: 10,
        powerReduction: 8,
        speedReduction: 5,
        recoveryTime: 2
      },
      agreementReached: false
    };

    weightManagementSystem.createCatchweightNegotiation(negotiation);
  };

  const createSampleWalkAroundWeight = () => {
    const walkAroundWeight: WalkAroundWeight = {
      fighterId: 'fighter-1',
      naturalWeight: 170,
      comfortableWeight: 165,
      weightClassComfort: [
        {
          weightClass: WeightClass.WELTERWEIGHT,
          comfortLevel: 7,
          performanceImpact: 3,
          sustainability: 9
        },
        {
          weightClass: WeightClass.MIDDLEWEIGHT,
          comfortLevel: 9,
          performanceImpact: 1,
          sustainability: 12
        }
      ],
      transitionDifficulty: 4
    };

    weightManagementSystem.setWalkAroundWeight(walkAroundWeight);
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return 'bg-green-100 text-green-800';
    if (risk <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRiskLevel = (risk: number) => {
    if (risk <= 3) return 'Low';
    if (risk <= 6) return 'Medium';
    return 'High';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weight Management System</h1>
          <p className="text-gray-600">Manage weight cutting, rehydration, catchweight negotiations, and walk-around weights</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6">
          {[
            { id: 'weight-cutting', label: 'Weight Cutting', count: weightCuttingPlans.length },
            { id: 'catchweight', label: 'Catchweight', count: catchweightNegotiations.length },
            { id: 'walk-around', label: 'Walk-Around', count: walkAroundWeights.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'weight-cutting' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Weight Cutting Plans</h2>
                <button
                  onClick={createSampleWeightCuttingPlan}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Create Sample Plan
                </button>
              </div>
              
              <div className="grid gap-6">
                {weightCuttingPlans.map(plan => {
                  const riskAssessment = weightManagementSystem.assessCuttingRisk(plan);
                  const rehydrationPlan = weightManagementSystem.createRehydrationPlan(plan);
                  
                  return (
                    <div key={plan.id} className="border rounded-lg p-6 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">Weight Cutting Plan</h3>
                          <p className="text-gray-600">Fighter ID: {plan.fighterId}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getRiskColor(riskAssessment.healthRisk)}`}>
                          {getRiskLevel(riskAssessment.healthRisk)} Risk
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="font-medium">Target Weight:</span> {plan.targetWeight} lbs
                        </div>
                        <div>
                          <span className="font-medium">Current Weight:</span> {plan.currentWeight} lbs
                        </div>
                        <div>
                          <span className="font-medium">Timeline:</span> {plan.timeline} days
                        </div>
                        <div>
                          <span className="font-medium">Method:</span> {plan.method.replace('_', ' ')}
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Risk Assessment</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="font-medium">Dehydration:</span> {riskAssessment.dehydrationRisk}/10
                          </div>
                          <div>
                            <span className="font-medium">Performance:</span> {riskAssessment.performanceImpact}/10
                          </div>
                          <div>
                            <span className="font-medium">Health:</span> {riskAssessment.healthRisk}/10
                          </div>
                          <div>
                            <span className="font-medium">Recovery:</span> {riskAssessment.recoveryTime} days
                          </div>
                        </div>
                        {riskAssessment.recommendations.length > 0 && (
                          <div className="mt-2">
                            <span className="font-medium text-sm">Recommendations:</span>
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                              {riskAssessment.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Rehydration Plan */}
                      <div>
                        <h4 className="font-semibold mb-2">Rehydration Plan</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span className="font-medium">Post-Weigh-In:</span> {rehydrationPlan.postWeighIn.fluidIntake}L
                          </div>
                          <div>
                            <span className="font-medium">Fight Night:</span> {rehydrationPlan.fightNight.fluidIntake}L
                          </div>
                          <div>
                            <span className="font-medium">Recovery:</span> {rehydrationPlan.recovery.fluidIntake}L
                          </div>
                          <div>
                            <span className="font-medium">Total:</span> {(rehydrationPlan.postWeighIn.fluidIntake + rehydrationPlan.fightNight.fluidIntake + rehydrationPlan.recovery.fluidIntake).toFixed(1)}L
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'catchweight' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Catchweight Negotiations</h2>
                <button
                  onClick={createSampleCatchweightNegotiation}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Create Sample Negotiation
                </button>
              </div>
              
              <div className="grid gap-4">
                {catchweightNegotiations.map(negotiation => {
                  const impact = weightManagementSystem.assessCatchweightImpact(negotiation.requestedWeight, 160);
                  
                  return (
                    <div key={negotiation.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {negotiation.fighterA} vs {negotiation.fighterB}
                          </h3>
                          <p className="text-gray-600">Requested Weight: {negotiation.requestedWeight} lbs</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          negotiation.agreementReached ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {negotiation.agreementReached ? 'Agreed' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Financial Penalty:</span> £{negotiation.financialPenalty.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Stamina Impact:</span> -{impact.staminaReduction}%
                        </div>
                        <div>
                          <span className="font-medium">Power Impact:</span> -{impact.powerReduction}%
                        </div>
                        <div>
                          <span className="font-medium">Recovery Time:</span> {impact.recoveryTime} days
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'walk-around' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Walk-Around Weights</h2>
                <button
                  onClick={createSampleWalkAroundWeight}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Create Sample Weight
                </button>
              </div>
              
              <div className="grid gap-4">
                {walkAroundWeights.map(weight => {
                  const comfortLevels = weightManagementSystem.calculateWeightClassComfort(weight.fighterId);
                  
                  return (
                    <div key={weight.fighterId} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">Walk-Around Weight</h3>
                          <p className="text-gray-600">Fighter ID: {weight.fighterId}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          Difficulty: {weight.transitionDifficulty}/10
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="font-medium">Natural Weight:</span> {weight.naturalWeight} lbs
                        </div>
                        <div>
                          <span className="font-medium">Comfortable Weight:</span> {weight.comfortableWeight} lbs
                        </div>
                        <div>
                          <span className="font-medium">Weight Classes:</span> {comfortLevels.length}
                        </div>
                        <div>
                          <span className="font-medium">Transition Difficulty:</span> {weight.transitionDifficulty}/10
                        </div>
                      </div>

                      {/* Weight Class Comfort */}
                      <div>
                        <h4 className="font-semibold mb-2">Weight Class Comfort</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {comfortLevels.map((comfort, index) => (
                            <div key={index} className="border rounded p-3 bg-white">
                              <div className="font-medium text-sm">{comfort.weightClass}</div>
                              <div className="text-xs text-gray-600">
                                <div>Comfort: {comfort.comfortLevel}/10</div>
                                <div>Performance Impact: {comfort.performanceImpact}/10</div>
                                <div>Sustainability: {comfort.sustainability} months</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightManagementPanel; 