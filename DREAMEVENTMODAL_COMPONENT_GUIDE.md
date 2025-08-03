# 🎭 DreamEventModal Component Guide

## Overview

A vintage 1920s-styled modal component for displaying dream events in the Dreamworld expansion. Features soft focus effects, rounded corners, large fonts, and an immersive dreamlike aesthetic.

## 🎨 Component Features

### Visual Design
- **Vintage 1920s Aesthetic**: Sepia color palette with art deco influences
- **Soft Focus Background**: Backdrop blur for dreamy atmosphere
- **Rounded Corners**: Large border radius (3xl) for softer appearance
- **Large Typography**: Easy-to-read font sizes (text-lg to text-xl)
- **Gradient Backgrounds**: Subtle gradients for depth and warmth
- **Texture Overlay**: Vintage film grain effect

### Interactive Elements
- **Dream Type Badge**: Color-coded badge with icon
- **Impact Score Visualization**: 5-dot meter showing dream importance
- **Choice Buttons**: Large, accessible buttons with hover effects
- **Smooth Animations**: Fade-in backdrop, slide-in modal

## 📁 Files

1. **`src/components/Dreamworld/DreamEventModal.tsx`** - Main component
2. **`src/components/Dreamworld/DreamEventModalDemo.tsx`** - Demo showcase
3. **`src/app/dream-modal-demo/page.tsx`** - Demo route

## 🚀 Usage

### Basic Usage

```typescript
import DreamEventModal from '@/components/Dreamworld/DreamEventModal'

function MyComponent() {
  const [showModal, setShowModal] = useState(false)

  const handleChoice = (choiceIndex: number) => {
    console.log(`Player chose option ${choiceIndex}`)
    setShowModal(false)
  }

  return (
    <DreamEventModal
      dreamType="prophecy"
      content="You see visions of future glory..."
      impactScore={85}
      actionableInsight="Train harder to achieve this destiny"
      onChoice={handleChoice}
      onClose={() => setShowModal(false)}
      isOpen={showModal}
    />
  )
}
```

### With Custom Choices

```typescript
<DreamEventModal
  dreamType="warning"
  content="Danger lurks in the shadows..."
  impactScore={70}
  actionableInsight="Be cautious of new partnerships"
  choices={[
    { text: 'Investigate further', impact: 'cautious' },
    { text: 'Prepare defenses', impact: 'defensive' },
    { text: 'Strike first', impact: 'aggressive' }
  ]}
  onChoice={handleChoice}
  isOpen={true}
/>
```

## 🎭 Dream Types

### 1. **Prophecy** (amber/yellow)
- Icon: Eye
- Use for: Future visions, destiny revelations
- Example: Championship predictions

### 2. **Warning** (red/orange)
- Icon: AlertTriangle
- Use for: Danger alerts, threat notifications
- Example: Rival schemes, financial risks

### 3. **Inspiration** (purple/pink)
- Icon: Sparkles
- Use for: Creative insights, training breakthroughs
- Example: New techniques, motivation boosts

### 4. **Nightmare** (gray/purple)
- Icon: Moon
- Use for: Fears, negative possibilities
- Example: Failure scenarios, dark paths

### 5. **Vision** (blue/teal)
- Icon: Zap
- Use for: Multiple futures, critical decisions
- Example: Career crossroads, legacy choices

## 🎨 Styling Details

### Color Scheme
```css
/* Background */
from-sepia-50 via-sepia-100 to-amber-50

/* Borders */
border-sepia-300/50

/* Text */
text-sepia-800 (content)
text-sepia-700 (labels)
text-sepia-600 (secondary)
```

### Key Classes
```typescript
// Modal container
"bg-gradient-to-br from-sepia-50 via-sepia-100 to-amber-50 
 rounded-3xl shadow-2xl border-4 border-sepia-300/50"

// Choice buttons
"bg-gradient-to-r from-sepia-200 to-amber-200 
 hover:from-sepia-300 hover:to-amber-300"

// Dream content box
"border-2 rounded-2xl p-6 relative overflow-hidden"
```

## 🔧 Props Interface

```typescript
interface DreamEventModalProps {
  dreamType: 'prophecy' | 'warning' | 'inspiration' | 'nightmare' | 'vision'
  content: string              // Main dream narrative
  impactScore: number         // 0-100 importance rating
  actionableInsight: string   // Strategic advice
  choices?: DreamChoice[]     // Optional custom choices
  onChoice: (choiceIndex: number) => void
  onClose?: () => void       // Optional close handler
  isOpen?: boolean           // Control visibility
}

interface DreamChoice {
  text: string              // Choice description
  impact?: string          // Impact description
  consequence?: string     // Future consequence
}
```

## 📱 Responsive Design

- **Mobile**: Full screen with padding
- **Tablet**: Centered with margins
- **Desktop**: Max width 672px (max-w-2xl)

## 🎭 Animation Specifications

### Backdrop
```css
animation: fadeIn 0.3s ease-out
opacity: 0 → 1
```

### Modal
```css
animation: slideIn 0.4s ease-out
transform: translateY(20px) scale(0.95) → translateY(0) scale(1)
opacity: 0 → 1
```

### Buttons
```css
transform: scale(1) → scale(1.02) on hover
transition: all 200ms
```

## 🌟 Best Practices

1. **Content Length**: Keep dream content between 50-150 words
2. **Actionable Insights**: Always provide clear, strategic advice
3. **Choice Variety**: Offer 2-4 choices with distinct approaches
4. **Impact Scores**: Use meaningfully (60-70 moderate, 80+ significant)
5. **Dream Type Match**: Ensure content matches the dream type mood

## 🎮 Integration Example

```typescript
// In your game logic
const generateDreamEvent = () => {
  const event = {
    dreamType: 'prophecy',
    content: generatePropheticContent(),
    impactScore: calculateImpact(),
    actionableInsight: deriveInsight(),
    choices: generateChoices()
  }
  
  return event
}

// In your component
const [dreamEvent, setDreamEvent] = useState(null)

<DreamEventModal
  {...dreamEvent}
  onChoice={(index) => {
    applyChoice(dreamEvent.choices[index])
    setDreamEvent(null)
  }}
  onClose={() => setDreamEvent(null)}
  isOpen={!!dreamEvent}
/>
```

## 🚀 Demo Access

Visit `/dream-modal-demo` to see all dream types in action with interactive examples.

---

The DreamEventModal brings the mystical 1920s dreamworld to life with style! 🌙✨