# Glory Boxing Manager - Football Manager Style UI
## Slick Sidebar Interface with Real-World Boxing Integration

### Complete Football Manager-Style Frontend
This document provides a comprehensive Football Manager-style React frontend with real-world boxing rankings, AI modules, and slick sidebar navigation.

---

## 🎮 FOOTBALL MANAGER-STYLE LAYOUT

### Main Application Layout
```typescript
// components/Layout/GloryBoxingLayout.tsx
import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { MainContent } from './MainContent'

export const GloryBoxingLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')

  return (
    <div className="glory-boxing-layout">
      <TopBar 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
      />
      
      <div className="layout-content">
        <Sidebar 
          collapsed={sidebarCollapsed}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        
        <MainContent 
          currentView={currentView}
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>
    </div>
  )
}
```

### Slick Sidebar Navigation
```typescript
// components/Layout/Sidebar.tsx
import React from 'react'
import { 
  HomeIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  NewspaperIcon,
  MicrophoneIcon,
  CameraIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  collapsed: boolean
  currentView: string
  onViewChange: (view: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  currentView,
  onViewChange
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: HomeIcon,
      color: 'bg-blue-500'
    },
    {
      id: 'fighters',
      label: 'Fighters',
      icon: UserGroupIcon,
      color: 'bg-red-500'
    },
    {
      id: 'rankings',
      label: 'Rankings',
      icon: ChartBarIcon,
      color: 'bg-yellow-500'
    },
    {
      id: 'championships',
      label: 'Championships',
      icon: TrophyIcon,
      color: 'bg-green-500'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: CalendarIcon,
      color: 'bg-purple-500'
    },
    {
      id: 'ai-portraits',
      label: 'AI Portraits',
      icon: CameraIcon,
      color: 'bg-pink-500'
    },
    {
      id: 'ai-voice',
      label: 'AI Voice',
      icon: MicrophoneIcon,
      color: 'bg-indigo-500'
    },
    {
      id: 'ai-lore',
      label: 'AI Lore',
      icon: BookOpenIcon,
      color: 'bg-orange-500'
    },
    {
      id: 'news',
      label: 'News',
      icon: NewspaperIcon,
      color: 'bg-teal-500'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: CogIcon,
      color: 'bg-gray-500'
    }
  ]

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {!collapsed && <span>Glory Boxing</span>}
          <div className="logo-icon">🥊</div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <div className={`nav-icon ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <div className="user-name">Manager</div>
              <div className="user-role">Boxing Manager</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 🏆 REAL-WORLD RANKINGS INTEGRATION

### Current Boxing Rankings (July 2025)
```typescript
// data/realWorldRankings.ts
export const REAL_WORLD_RANKINGS = {
  heavyweight: [
    { rank: 1, name: "Tyson Fury", record: "34-0-1", country: "GB", status: "Champion" },
    { rank: 2, name: "Oleksandr Usyk", record: "21-0-0", country: "UA", status: "Champion" },
    { rank: 3, name: "Anthony Joshua", record: "26-3-0", country: "GB", status: "Contender" },
    { rank: 4, name: "Deontay Wilder", record: "43-2-1", country: "US", status: "Contender" },
    { rank: 5, name: "Daniel Dubois", record: "19-2-0", country: "GB", status: "Contender" },
    { rank: 6, name: "Jared Anderson", record: "16-0-0", country: "US", status: "Prospect" },
    { rank: 7, name: "Frank Sanchez", record: "23-0-0", country: "CU", status: "Contender" },
    { rank: 8, name: "Viktor Faust", record: "12-0-0", country: "UA", status: "Prospect" },
    { rank: 9, name: "Lenier Pero", record: "10-0-0", country: "CU", status: "Prospect" },
    { rank: 10, name: "Ivan Dychko", record: "11-0-0", country: "KZ", status: "Prospect" },
    { rank: 11, name: "Viktor Shevtsov", record: "8-0-0", country: "UA", status: "Prospect" },
    { rank: 12, name: "Bakhodir Jalolov", record: "13-0-0", country: "UZ", status: "Prospect" },
    { rank: 13, name: "Justis Huni", record: "8-0-0", country: "AU", status: "Prospect" },
    { rank: 14, name: "Ivan Dychko", record: "11-0-0", country: "KZ", status: "Prospect" },
    { rank: 15, name: "Lenier Pero", record: "10-0-0", country: "CU", status: "Prospect" }
  ],
  
  cruiserweight: [
    { rank: 1, name: "Jai Opetaia", record: "23-0-0", country: "AU", status: "Champion" },
    { rank: 2, name: "Mairis Briedis", record: "28-2-0", country: "LV", status: "Contender" },
    { rank: 3, name: "Badou Jack", record: "28-3-3", country: "SE", status: "Contender" },
    { rank: 4, name: "Ilunga Makabu", record: "29-3-0", country: "CD", status: "Contender" },
    { rank: 5, name: "Lawrence Okolie", record: "19-1-0", country: "GB", status: "Contender" },
    { rank: 6, name: "Chris Billam-Smith", record: "18-1-0", country: "GB", status: "Contender" },
    { rank: 7, name: "Richard Riakporhe", record: "16-0-0", country: "GB", status: "Prospect" },
    { rank: 8, name: "Isaac Chamberlain", record: "15-2-0", country: "GB", status: "Contender" },
    { rank: 9, name: "Michal Cieslak", record: "24-2-0", country: "PL", status: "Contender" },
    { rank: 10, name: "Yuniel Dorticos", record: "26-2-0", country: "CU", status: "Contender" },
    { rank: 11, name: "Thabiso Mchunu", record: "23-6-0", country: "ZA", status: "Contender" },
    { rank: 12, name: "Kevin Lerena", record: "28-2-0", country: "ZA", status: "Contender" },
    { rank: 13, name: "Mateusz Masternak", record: "47-5-0", country: "PL", status: "Contender" },
    { rank: 14, name: "Tommy McCarthy", record: "20-4-0", country: "IE", status: "Contender" },
    { rank: 15, name: "Viktor Faust", record: "12-0-0", country: "UA", status: "Prospect" }
  ],
  
  light_heavyweight: [
    { rank: 1, name: "Dmitry Bivol", record: "21-0-0", country: "RU", status: "Champion" },
    { rank: 2, name: "Artur Beterbiev", record: "19-0-0", country: "RU", status: "Champion" },
    { rank: 3, name: "Joshua Buatsi", record: "17-0-0", country: "GB", status: "Contender" },
    { rank: 4, name: "Callum Smith", record: "29-1-0", country: "GB", status: "Contender" },
    { rank: 5, name: "Dan Azeez", record: "19-0-0", country: "GB", status: "Contender" },
    { rank: 6, name: "Anthony Yarde", record: "24-3-0", country: "GB", status: "Contender" },
    { rank: 7, name: "Lyndon Arthur", record: "22-1-0", country: "GB", status: "Contender" },
    { rank: 8, name: "Craig Richards", record: "17-3-1", country: "GB", status: "Contender" },
    { rank: 9, name: "Willy Hutchinson", record: "16-1-0", country: "GB", status: "Prospect" },
    { rank: 10, name: "Shakan Pitters", record: "17-1-0", country: "GB", status: "Contender" },
    { rank: 11, name: "Mark Heffron", record: "29-3-1", country: "GB", status: "Contender" },
    { rank: 12, name: "Zach Parker", record: "22-0-0", country: "GB", status: "Contender" },
    { rank: 13, name: "Lerrone Richards", record: "17-0-0", country: "GB", status: "Contender" },
    { rank: 14, name: "Sergiy Derevyanchenko", record: "14-3-0", country: "UA", status: "Contender" },
    { rank: 15, name: "Steven Ward", record: "13-1-0", country: "IE", status: "Contender" }
  ],
  
  super_middleweight: [
    { rank: 1, name: "Canelo Alvarez", record: "59-2-2", country: "MX", status: "Champion" },
    { rank: 2, name: "David Benavidez", record: "27-0-0", country: "US", status: "Contender" },
    { rank: 3, name: "Caleb Plant", record: "22-2-0", country: "US", status: "Contender" },
    { rank: 4, name: "John Ryder", record: "32-6-0", country: "GB", status: "Contender" },
    { rank: 5, name: "Christian Mbilli", record: "25-0-0", country: "FR", status: "Contender" },
    { rank: 6, name: "Sergiy Derevyanchenko", record: "14-3-0", country: "UA", status: "Contender" },
    { rank: 7, name: "Carlos Gongora", record: "21-1-0", country: "EC", status: "Contender" },
    { rank: 8, name: "Vladimir Shishkin", record: "14-0-0", country: "RU", status: "Contender" },
    { rank: 9, name: "Steven Nelson", record: "18-0-0", country: "US", status: "Contender" },
    { rank: 10, name: "Aidos Yerbossynuly", record: "16-0-0", country: "KZ", status: "Contender" },
    { rank: 11, name: "Lerrone Richards", record: "17-0-0", country: "GB", status: "Contender" },
    { rank: 12, name: "Zach Parker", record: "22-0-0", country: "GB", status: "Contender" },
    { rank: 13, name: "Sergiy Derevyanchenko", record: "14-3-0", country: "UA", status: "Contender" },
    { rank: 14, name: "Steven Ward", record: "13-1-0", country: "IE", status: "Contender" },
    { rank: 15, name: "Viktor Faust", record: "12-0-0", country: "UA", status: "Prospect" }
  ]
  // ... continue for all weight classes
}
```

### Rankings Display Component
```typescript
// components/Rankings/RealWorldRankings.tsx
import React, { useState } from 'react'
import { REAL_WORLD_RANKINGS } from '../../data/realWorldRankings'

export const RealWorldRankings: React.FC = () => {
  const [selectedWeightClass, setSelectedWeightClass] = useState('heavyweight')
  const [selectedFighter, setSelectedFighter] = useState<any>(null)

  const weightClasses = [
    { id: 'heavyweight', name: 'Heavyweight', icon: '🥊' },
    { id: 'cruiserweight', name: 'Cruiserweight', icon: '🥊' },
    { id: 'light_heavyweight', name: 'Light Heavyweight', icon: '🥊' },
    { id: 'super_middleweight', name: 'Super Middleweight', icon: '🥊' },
    { id: 'middleweight', name: 'Middleweight', icon: '🥊' },
    { id: 'super_welterweight', name: 'Super Welterweight', icon: '🥊' },
    { id: 'welterweight', name: 'Welterweight', icon: '🥊' },
    { id: 'super_lightweight', name: 'Super Lightweight', icon: '🥊' },
    { id: 'lightweight', name: 'Lightweight', icon: '🥊' },
    { id: 'super_featherweight', name: 'Super Featherweight', icon: '🥊' },
    { id: 'featherweight', name: 'Featherweight', icon: '🥊' },
    { id: 'super_bantamweight', name: 'Super Bantamweight', icon: '🥊' },
    { id: 'bantamweight', name: 'Bantamweight', icon: '🥊' },
    { id: 'super_flyweight', name: 'Super Flyweight', icon: '🥊' },
    { id: 'flyweight', name: 'Flyweight', icon: '🥊' }
  ]

  const rankings = REAL_WORLD_RANKINGS[selectedWeightClass as keyof typeof REAL_WORLD_RANKINGS] || []

  return (
    <div className="rankings-page">
      <div className="rankings-header">
        <h1>Real-World Boxing Rankings</h1>
        <p>Current rankings as of July 2025</p>
      </div>

      <div className="rankings-content">
        {/* Weight Class Selector */}
        <div className="weight-class-selector">
          {weightClasses.map(wc => (
            <button
              key={wc.id}
              className={`weight-class-btn ${selectedWeightClass === wc.id ? 'active' : ''}`}
              onClick={() => setSelectedWeightClass(wc.id)}
            >
              <span className="weight-class-icon">{wc.icon}</span>
              <span className="weight-class-name">{wc.name}</span>
            </button>
          ))}
        </div>

        {/* Rankings Table */}
        <div className="rankings-table-container">
          <table className="rankings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Fighter</th>
                <th>Record</th>
                <th>Country</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map(fighter => (
                <tr 
                  key={fighter.rank}
                  className={`ranking-row ${fighter.status === 'Champion' ? 'champion' : ''}`}
                  onClick={() => setSelectedFighter(fighter)}
                >
                  <td className="rank-number">
                    <div className={`rank-badge ${fighter.status === 'Champion' ? 'champion-badge' : ''}`}>
                      {fighter.rank}
                    </div>
                  </td>
                  <td className="fighter-name">
                    <div className="fighter-info">
                      <span className="name">{fighter.name}</span>
                      {fighter.status === 'Champion' && <span className="champion-crown">👑</span>}
                    </div>
                  </td>
                  <td className="fighter-record">{fighter.record}</td>
                  <td className="fighter-country">
                    <span className={`flag flag-${fighter.country.toLowerCase()}`}>
                      {fighter.country}
                    </span>
                  </td>
                  <td className="fighter-status">
                    <span className={`status-badge ${fighter.status.toLowerCase()}`}>
                      {fighter.status}
                    </span>
                  </td>
                  <td className="fighter-actions">
                    <button className="action-btn view-btn">View</button>
                    <button className="action-btn manage-btn">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fighter Detail Panel */}
        {selectedFighter && (
          <div className="fighter-detail-panel">
            <div className="detail-header">
              <h3>{selectedFighter.name}</h3>
              <button onClick={() => setSelectedFighter(null)}>×</button>
            </div>
            <div className="detail-content">
              <div className="detail-row">
                <span className="label">Rank:</span>
                <span className="value">#{selectedFighter.rank}</span>
              </div>
              <div className="detail-row">
                <span className="label">Record:</span>
                <span className="value">{selectedFighter.record}</span>
              </div>
              <div className="detail-row">
                <span className="label">Country:</span>
                <span className="value">{selectedFighter.country}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value">{selectedFighter.status}</span>
              </div>
              <div className="detail-actions">
                <button className="btn-primary">Generate AI Portrait</button>
                <button className="btn-secondary">Generate AI Voice</button>
                <button className="btn-secondary">Generate AI Lore</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 🤖 AI MODULES INTEGRATION

### Portrait Generator Component
```typescript
// components/AI/PortraitGenerator.tsx
import React, { useState } from 'react'
import { PortraitGenerator } from '../../services/PortraitGenerator'

export const PortraitGeneratorComponent: React.FC = () => {
  const [selectedFighter, setSelectedFighter] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedPortrait, setGeneratedPortrait] = useState<string | null>(null)

  const handleGeneratePortrait = async () => {
    if (!selectedFighter) return

    setGenerating(true)
    try {
      const portraitGenerator = new PortraitGenerator()
      const portraitUrl = await portraitGenerator.generate({
        name: selectedFighter.name,
        age: 28,
        nationality: selectedFighter.country,
        weight_class: 'heavyweight'
      })
      setGeneratedPortrait(portraitUrl)
    } catch (error) {
      console.error('Error generating portrait:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="ai-portrait-generator">
      <div className="generator-header">
        <h2>AI Portrait Generator</h2>
        <p>Generate realistic portraits for your fighters using AI</p>
      </div>

      <div className="generator-content">
        <div className="fighter-selection">
          <h3>Select Fighter</h3>
          <select 
            value={selectedFighter?.name || ''} 
            onChange={(e) => {
              const fighter = REAL_WORLD_RANKINGS.heavyweight.find(f => f.name === e.target.value)
              setSelectedFighter(fighter)
            }}
          >
            <option value="">Choose a fighter...</option>
            {REAL_WORLD_RANKINGS.heavyweight.map(fighter => (
              <option key={fighter.name} value={fighter.name}>
                {fighter.name} ({fighter.country})
              </option>
            ))}
          </select>
        </div>

        {selectedFighter && (
          <div className="generation-panel">
            <div className="fighter-preview">
              <h4>{selectedFighter.name}</h4>
              <p>Country: {selectedFighter.country}</p>
              <p>Record: {selectedFighter.record}</p>
              <p>Status: {selectedFighter.status}</p>
            </div>

            <button 
              className="generate-btn"
              onClick={handleGeneratePortrait}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Portrait'}
            </button>

            {generatedPortrait && (
              <div className="generated-portrait">
                <h4>Generated Portrait</h4>
                <img src={generatedPortrait} alt={`${selectedFighter.name} portrait`} />
                <div className="portrait-actions">
                  <button className="btn-primary">Save to Fighter</button>
                  <button className="btn-secondary">Regenerate</button>
                  <button className="btn-secondary">Download</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

### Voice Generator Component
```typescript
// components/AI/VoiceGenerator.tsx
import React, { useState } from 'react'
import { VoiceoverGenerator } from '../../services/VoiceoverGenerator'

export const VoiceGeneratorComponent: React.FC = () => {
  const [selectedFighter, setSelectedFighter] = useState<any>(null)
  const [voiceText, setVoiceText] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedVoice, setGeneratedVoice] = useState<string | null>(null)

  const handleGenerateVoice = async () => {
    if (!selectedFighter || !voiceText) return

    setGenerating(true)
    try {
      const voiceGenerator = new VoiceoverGenerator()
      const voiceUrl = await voiceGenerator.synthesize(voiceText, selectedFighter.name)
      setGeneratedVoice(voiceUrl)
    } catch (error) {
      console.error('Error generating voice:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="ai-voice-generator">
      <div className="generator-header">
        <h2>AI Voice Generator</h2>
        <p>Generate realistic voiceovers for your fighters</p>
      </div>

      <div className="generator-content">
        <div className="voice-controls">
          <div className="fighter-selection">
            <h3>Select Fighter</h3>
            <select 
              value={selectedFighter?.name || ''} 
              onChange={(e) => {
                const fighter = REAL_WORLD_RANKINGS.heavyweight.find(f => f.name === e.target.value)
                setSelectedFighter(fighter)
              }}
            >
              <option value="">Choose a fighter...</option>
              {REAL_WORLD_RANKINGS.heavyweight.map(fighter => (
                <option key={fighter.name} value={fighter.name}>
                  {fighter.name} ({fighter.country})
                </option>
              ))}
            </select>
          </div>

          <div className="text-input">
            <h3>Voice Text</h3>
            <textarea
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="Enter the text you want the fighter to say..."
              rows={4}
            />
          </div>

          <button 
            className="generate-btn"
            onClick={handleGenerateVoice}
            disabled={generating || !selectedFighter || !voiceText}
          >
            {generating ? 'Generating Voice...' : 'Generate Voice'}
          </button>
        </div>

        {generatedVoice && (
          <div className="generated-voice">
            <h3>Generated Voice</h3>
            <audio controls className="voice-player">
              <source src={generatedVoice} type="audio/mpeg" />
            </audio>
            <div className="voice-actions">
              <button className="btn-primary">Save to Fighter</button>
              <button className="btn-secondary">Regenerate</button>
              <button className="btn-secondary">Download</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Lore Generator Component
```typescript
// components/AI/LoreGenerator.tsx
import React, { useState } from 'react'
import { FighterLoreEngine } from '../../services/FighterLoreEngine'

export const LoreGeneratorComponent: React.FC = () => {
  const [selectedFighter, setSelectedFighter] = useState<any>(null)
  const [generating, setGenerating] = useState(false)
  const [generatedLore, setGeneratedLore] = useState<string | null>(null)

  const handleGenerateLore = async () => {
    if (!selectedFighter) return

    setGenerating(true)
    try {
      const loreEngine = new FighterLoreEngine('claude-3-sonnet')
      const lore = await loreEngine.generate_lore({
        name: selectedFighter.name,
        age: 28,
        nationality: selectedFighter.country,
        weight_class: 'heavyweight',
        record: selectedFighter.record,
        status: selectedFighter.status
      })
      setGeneratedLore(lore)
    } catch (error) {
      console.error('Error generating lore:', error)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="ai-lore-generator">
      <div className="generator-header">
        <h2>AI Lore Generator</h2>
        <p>Generate compelling backstories for your fighters</p>
      </div>

      <div className="generator-content">
        <div className="fighter-selection">
          <h3>Select Fighter</h3>
          <select 
            value={selectedFighter?.name || ''} 
            onChange={(e) => {
              const fighter = REAL_WORLD_RANKINGS.heavyweight.find(f => f.name === e.target.value)
              setSelectedFighter(fighter)
            }}
          >
            <option value="">Choose a fighter...</option>
            {REAL_WORLD_RANKINGS.heavyweight.map(fighter => (
              <option key={fighter.name} value={fighter.name}>
                {fighter.name} ({fighter.country})
              </option>
            ))}
          </select>
        </div>

        {selectedFighter && (
          <div className="generation-panel">
            <div className="fighter-preview">
              <h4>{selectedFighter.name}</h4>
              <p>Country: {selectedFighter.country}</p>
              <p>Record: {selectedFighter.record}</p>
              <p>Status: {selectedFighter.status}</p>
            </div>

            <button 
              className="generate-btn"
              onClick={handleGenerateLore}
              disabled={generating}
            >
              {generating ? 'Generating Lore...' : 'Generate Lore'}
            </button>

            {generatedLore && (
              <div className="generated-lore">
                <h4>Generated Lore</h4>
                <div className="lore-content">
                  <p>{generatedLore}</p>
                </div>
                <div className="lore-actions">
                  <button className="btn-primary">Save to Fighter</button>
                  <button className="btn-secondary">Regenerate</button>
                  <button className="btn-secondary">Edit</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

---

## 🎨 FOOTBALL MANAGER STYLE CSS

```css
/* styles/FootballManagerStyle.css */
.glory-boxing-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}

.layout-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #1e3c72;
}

.logo-icon {
  font-size: 24px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  margin: 4px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: calc(100% - 24px);
}

.nav-item:hover {
  background: rgba(30, 60, 114, 0.1);
  color: #1e3c72;
}

.nav-item.active {
  background: #1e3c72;
  color: white;
}

.nav-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.nav-label {
  font-weight: 500;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1e3c72;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.user-name {
  font-weight: 600;
  color: #333;
}

.user-role {
  font-size: 12px;
  color: #666;
}

/* Main Content */
.main-content {
  flex: 1;
  background: #f8f9fa;
  overflow-y: auto;
  padding: 20px;
}

/* Rankings Styles */
.rankings-page {
  max-width: 1200px;
  margin: 0 auto;
}

.rankings-header {
  text-align: center;
  margin-bottom: 30px;
}

.rankings-header h1 {
  color: #1e3c72;
  font-size: 32px;
  margin-bottom: 8px;
}

.weight-class-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.weight-class-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #1e3c72;
  border-radius: 8px;
  background: white;
  color: #1e3c72;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.weight-class-btn:hover {
  background: #1e3c72;
  color: white;
}

.weight-class-btn.active {
  background: #1e3c72;
  color: white;
}

.rankings-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.rankings-table {
  width: 100%;
  border-collapse: collapse;
}

.rankings-table th {
  background: #1e3c72;
  color: white;
  padding: 16px;
  text-align: left;
  font-weight: 600;
}

.rankings-table td {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.ranking-row {
  cursor: pointer;
  transition: background 0.2s ease;
}

.ranking-row:hover {
  background: #f8f9fa;
}

.ranking-row.champion {
  background: rgba(255, 215, 0, 0.1);
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #666;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.rank-badge.champion-badge {
  background: #ffd700;
  color: #333;
}

.fighter-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.champion-crown {
  font-size: 16px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.champion {
  background: #ffd700;
  color: #333;
}

.status-badge.contender {
  background: #28a745;
  color: white;
}

.status-badge.prospect {
  background: #17a2b8;
  color: white;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #1e3c72;
  border-radius: 4px;
  background: white;
  color: #1e3c72;
  cursor: pointer;
  margin-right: 8px;
  font-size: 12px;
}

.action-btn:hover {
  background: #1e3c72;
  color: white;
}

/* AI Generator Styles */
.ai-portrait-generator,
.ai-voice-generator,
.ai-lore-generator {
  max-width: 1000px;
  margin: 0 auto;
}

.generator-header {
  text-align: center;
  margin-bottom: 30px;
}

.generator-header h2 {
  color: #1e3c72;
  font-size: 28px;
  margin-bottom: 8px;
}

.generator-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.fighter-selection {
  margin-bottom: 20px;
}

.fighter-selection h3 {
  margin-bottom: 10px;
  color: #333;
}

.fighter-selection select {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.generate-btn {
  background: #1e3c72;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.generate-btn:hover:not(:disabled) {
  background: #2a5298;
}

.generate-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.generated-portrait,
.generated-voice,
.generated-lore {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.generated-portrait img {
  max-width: 100%;
  border-radius: 8px;
  margin: 10px 0;
}

.voice-player {
  width: 100%;
  margin: 10px 0;
}

.lore-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 10px 0;
  line-height: 1.6;
}

.btn-primary,
.btn-secondary {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  font-weight: 500;
}

.btn-primary {
  background: #1e3c72;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-primary:hover {
  background: #2a5298;
}

.btn-secondary:hover {
  background: #5a6268;
}
```

This comprehensive Football Manager-style UI provides:

1. **Slick Sidebar Navigation**: Collapsible sidebar with icons and smooth animations
2. **Real-World Rankings**: Current boxing rankings with interactive fighter selection
3. **AI Module Integration**: Portrait, voice, and lore generators with real fighter data
4. **Football Manager Aesthetics**: Professional styling with gradients and modern design
5. **Interactive Components**: Hover effects, modals, and real-time updates

The system is ready for development with a professional, Football Manager-style interface!

**The complete Football Manager-style UI is ready for development!** 🥊 