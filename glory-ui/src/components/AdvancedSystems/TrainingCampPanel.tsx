import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { 
  MapPin, 
  Users, 
  Target, 
  Film, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import type { 
  TrainingCamp, 
  CoachingStaff, 
  SparringPartner, 
  FilmStudySession,
  OpponentAnalysis,
  CampLocationValue,
  TrainingFocusValue
} from '../../lib/training-camp-system';
import { trainingCampSystem } from '../../lib/training-camp-system';

const TrainingCampPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [camps, setCamps] = useState<TrainingCamp[]>([]);
  const [staff, setStaff] = useState<CoachingStaff[]>([]);
  const [partners, setSparringPartners] = useState<SparringPartner[]>([]);
  const [sessions, setFilmStudySessions] = useState<FilmStudySession[]>([]);

  const createSampleCamp = () => {
    const camp: Omit<TrainingCamp, 'id'> = {
      fighterId: 'fighter1',
      location: 'big_bear' as CampLocationValue,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      focus: 'technical_skills' as TrainingFocusValue,
      facilities: ['Gym', 'Pool', 'Track', 'Recovery Room'],
      dailySchedule: [
        { time: '6:00 AM', activity: 'Morning run', duration: 60 },
        { time: '8:00 AM', activity: 'Breakfast', duration: 30 },
        { time: '9:00 AM', activity: 'Technical training', duration: 120 }
      ],
      budget: 50000,
      staffCount: 5,
      sparringPartners: [],
      filmStudySessions: []
    };

    const newCamp = trainingCampSystem.createTrainingCamp(camp);
    setCamps([...camps, newCamp]);
  };

  const createSampleStaff = () => {
    const staffMember: Omit<CoachingStaff, 'id'> = {
      name: 'Coach John',
      role: 'Head Coach',
      experience: 15,
      salary: 8000,
      specialties: ['Technical Skills', 'Strategy'],
      availability: 40,
      fighterId: 'fighter1',
      campId: camps[0]?.id || 'camp1'
    };

    const newStaff = trainingCampSystem.hireCoachingStaff(staffMember);
    setStaff([...staff, newStaff]);
  };

  const createSamplePartner = () => {
    const partner: Omit<SparringPartner, 'id'> = {
      name: 'Sparring Partner',
      weightClass: 'Welterweight',
      style: 'Aggressive',
      experience: 8,
      compensation: 2000,
      availability: 20,
      fighterId: 'fighter1',
      campId: camps[0]?.id || 'camp1'
    };

    const newPartner = trainingCampSystem.addSparringPartner(partner);
    setSparringPartners([...partners, newPartner]);
  };

  const createSampleSession = () => {
    const session: Omit<FilmStudySession, 'id'> = {
      fighterId: 'fighter1',
      opponentId: 'opponent1',
      duration: 90,
      focus: 'Defensive patterns',
      keyInsights: ['Tends to lead with left', 'Weak to body shots'],
      gamePlanAdjustments: ['Focus on body work', 'Counter left hooks'],
      campId: camps[0]?.id || 'camp1'
    };

    const newSession = trainingCampSystem.createFilmStudySession(session);
    setFilmStudySessions([...sessions, newSession]);
  };

  const analyzeOpponent = (fighterId: string, opponentId: string): OpponentAnalysis => {
    return trainingCampSystem.analyzeOpponent(fighterId, opponentId);
  };

  const tabs = [
    {
      name: 'Training Camps',
      icon: MapPin,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Training Camps</h3>
            <button
              onClick={createSampleCamp}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Sample Camp
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {camps.map((camp) => (
              <div key={camp.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Camp at {camp.location}</h4>
                  <span className="text-sm text-gray-500">
                    {camp.focus.replace('_', ' ')}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Duration:</strong> {Math.ceil((camp.endDate.getTime() - camp.startDate.getTime()) / (1000 * 60 * 60 * 24))} days</p>
                  <p><strong>Budget:</strong> £{camp.budget.toLocaleString()}</p>
                  <p><strong>Staff:</strong> {camp.staffCount} members</p>
                  <p><strong>Facilities:</strong> {camp.facilities.length} available</p>
                </div>
                <div className="mt-3">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Effectiveness: {trainingCampSystem.calculateCampEffectiveness(camp.id)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      name: 'Coaching Staff',
      icon: Users,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Coaching Staff</h3>
            <button
              onClick={createSampleStaff}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Hire Sample Staff
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{member.name}</h4>
                  <span className="text-sm text-gray-500">{member.role}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p><strong>Experience:</strong> {member.experience} years</p>
                  <p><strong>Salary:</strong> £{member.salary.toLocaleString()}/month</p>
                  <p><strong>Availability:</strong> {member.availability} hrs/week</p>
                  <p><strong>Specialties:</strong> {member.specialties.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      name: 'Sparring Partners',
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sparring Partners</h3>
            <button
              onClick={createSamplePartner}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Sample Partner
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{partner.name}</h4>
                  <span className="text-sm text-gray-500">{partner.weightClass}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p><strong>Style:</strong> {partner.style}</p>
                  <p><strong>Experience:</strong> {partner.experience} years</p>
                  <p><strong>Compensation:</strong> £{partner.compensation}/session</p>
                  <p><strong>Availability:</strong> {partner.availability} hrs/week</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      name: 'Film Study',
      icon: Film,
      content: (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Film Study Sessions</h3>
            <button
              onClick={createSampleSession}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Create Sample Session
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Film Study</h4>
                  <span className="text-sm text-gray-500">{session.duration} min</span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Focus:</strong> {session.focus}</p>
                  <p><strong>Key Insights:</strong></p>
                  <ul className="list-disc list-inside ml-2">
                    {session.keyInsights.map((insight, index) => (
                      <li key={index}>{insight}</li>
                    ))}
                  </ul>
                  <p><strong>Game Plan Adjustments:</strong></p>
                  <ul className="list-disc list-inside ml-2">
                    {session.gamePlanAdjustments.map((adjustment, index) => (
                      <li key={index}>{adjustment}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3">Opponent Analysis</h4>
            <button
              onClick={() => {
                const analysis = analyzeOpponent('fighter1', 'opponent1');
                console.log('Opponent Analysis:', analysis);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Analyze Sample Opponent
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Training Camp Management</h2>
      <p className="text-gray-600 mb-6">Manage training camps, coaching staff, sparring partners, and film study sessions.</p>

      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab, index) => (
            <Tab
              key={tab.name}
              className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                 ${selected
                   ? 'bg-white shadow text-blue-700'
                   : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                 }`
              }
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, index) => (
            <Tab.Panel
              key={index}
              className="rounded-xl bg-white p-3"
            >
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default TrainingCampPanel; 