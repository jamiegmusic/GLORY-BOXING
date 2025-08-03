import JazzSingersSecretQuest from '@/components/Dreamworld/JazzSingersSecretQuest'

export default function DreamworldQuestPage() {
  // In a real app, this would come from auth/session
  const playerId = '11111111-1111-1111-1111-111111111111'
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sepia-50 to-amber-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-sepia-900 mb-2">
          Dreamworld Quest System
        </h1>
        <p className="text-lg text-sepia-700 mb-8">
          Experience a full-stack quest workflow with choices, rewards, and legacy unlocks
        </p>
        
        {/* Quest Component */}
        <div className="mb-8">
          <JazzSingersSecretQuest playerId={playerId} />
        </div>
        
        {/* Quest Info */}
        <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-sepia-900 mb-4">
            About This Quest
          </h2>
          
          <div className="space-y-4 text-sepia-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">🎭 The Story</h3>
              <p>
                Billie Holiday has discovered sheet music from the future that can alter reality. 
                You must investigate this mystery through three phases, making choices that affect 
                your final reward.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">🧠 Choice System</h3>
              <p>
                Each phase offers two choices:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li><strong>Lucid Power:</strong> Use dreamworld abilities for direct results (costs lucid meter)</li>
                <li><strong>Logic:</strong> Apply wit and observation (no cost, but may get partial results)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">🏆 Rewards</h3>
              <p>Based on your choices, you'll receive one of three rewards:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li><strong>Legendary:</strong> Temporal Jazz Manuscript (all lucid choices)</li>
                <li><strong>Rare:</strong> Faded Jazz Notes (mixed choices)</li>
                <li><strong>Uncommon:</strong> Jazz Era Wisdom (all logic choices)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">🔄 Main Game Integration</h3>
              <p>
                Upon completion, your reward becomes a legacy unlock that persists in the main game, 
                providing permanent bonuses to your abilities.
              </p>
            </div>
          </div>
        </div>
        
        {/* Technical Implementation */}
        <div className="mt-8 bg-sepia-100/50 rounded-2xl p-6">
          <h3 className="font-semibold text-lg text-sepia-900 mb-3">
            🛠️ Technical Stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-sepia-700">
            <div>
              <strong>Backend:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>FastAPI endpoints for quest management</li>
                <li>Supabase for state persistence</li>
                <li>Dynamic reward calculation</li>
              </ul>
            </div>
            <div>
              <strong>Frontend:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>React hooks for quest logic</li>
                <li>Zustand for state management</li>
                <li>Animated modal UI components</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}