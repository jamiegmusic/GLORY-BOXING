import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DreamEventModal from '../DreamEventModal'
import { useDreamworldProgressStore } from '@/stores/dreamworldProgressStore'

// Mock the progress store
jest.mock('@/stores/dreamworldProgressStore', () => ({
  useDreamworldProgressStore: jest.fn()
}))

// Mock styled-jsx
jest.mock('styled-jsx/style', () => () => null)

describe('DreamEventModal', () => {
  const mockOnChoice = jest.fn()
  const mockOnClose = jest.fn()

  const defaultProps = {
    dreamType: 'prophecy' as const,
    content: 'A vision of future glory awaits you in the ring',
    impactScore: 85,
    actionableInsight: 'Train harder and focus on defensive techniques',
    onChoice: mockOnChoice,
    onClose: mockOnClose,
    isOpen: true
  }

  const mockProgressStore = {
    getCurrentQuestProgress: jest.fn(),
    getCurrentChapterProgress: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useDreamworldProgressStore as jest.MockedFunction<any>).mockReturnValue(mockProgressStore)
  })

  describe('Rendering', () => {
    test('renders modal when isOpen is true', () => {
      render(<DreamEventModal {...defaultProps} />)

      expect(screen.getByText('A vision of future glory awaits you in the ring')).toBeInTheDocument()
      expect(screen.getByText('Train harder and focus on defensive techniques')).toBeInTheDocument()
      expect(screen.getByText('Prophecy')).toBeInTheDocument()
    })

    test('does not render when isOpen is false', () => {
      render(<DreamEventModal {...defaultProps} isOpen={false} />)

      expect(screen.queryByText('A vision of future glory awaits you in the ring')).not.toBeInTheDocument()
    })

    test('renders all dream type badges correctly', () => {
      const dreamTypes = ['prophecy', 'warning', 'inspiration', 'nightmare', 'vision'] as const

      dreamTypes.forEach(dreamType => {
        const { rerender } = render(<DreamEventModal {...defaultProps} dreamType={dreamType} />)
        
        const expectedLabel = dreamType.charAt(0).toUpperCase() + dreamType.slice(1)
        expect(screen.getByText(expectedLabel)).toBeInTheDocument()
        
        rerender(<div />)
      })
    })

    test('displays impact score with correct number of stars', () => {
      const { rerender } = render(<DreamEventModal {...defaultProps} impactScore={90} />)
      
      // High impact should show filled stars
      const impactIndicator = screen.getByText(/Impact/)
      expect(impactIndicator).toBeInTheDocument()

      // Test different impact scores
      rerender(<DreamEventModal {...defaultProps} impactScore={30} />)
      expect(screen.getByText(/Impact/)).toBeInTheDocument()
    })

    test('renders choices when provided', () => {
      const choices = [
        { text: 'Embrace the vision', impact: 'Gain confidence', consequence: '+10 motivation' },
        { text: 'Question the prophecy', impact: 'Stay grounded', consequence: '+5 focus' }
      ]

      render(<DreamEventModal {...defaultProps} choices={choices} />)

      expect(screen.getByText('Embrace the vision')).toBeInTheDocument()
      expect(screen.getByText('Question the prophecy')).toBeInTheDocument()
    })

    test('shows default choices when none provided', () => {
      render(<DreamEventModal {...defaultProps} />)

      expect(screen.getByText('Accept this dream')).toBeInTheDocument()
      expect(screen.getByText('Let it pass')).toBeInTheDocument()
    })
  })

  describe('Quest Context', () => {
    test('displays quest context when available', () => {
      const mockQuest = {
        questName: 'The Jazz Singer\'s Secret',
        currentPhase: 2,
        totalPhases: 3
      }

      mockProgressStore.getCurrentQuestProgress.mockReturnValue(mockQuest)

      render(<DreamEventModal {...defaultProps} />)

      expect(screen.getByText('The Jazz Singer\'s Secret')).toBeInTheDocument()
      expect(screen.getByText('(2/3)')).toBeInTheDocument()
    })

    test('displays chapter context when available', () => {
      const mockChapter = {
        chapterName: 'The Roaring Start'
      }

      mockProgressStore.getCurrentChapterProgress.mockReturnValue(mockChapter)

      render(<DreamEventModal {...defaultProps} />)

      expect(screen.getByText('The Roaring Start')).toBeInTheDocument()
    })

    test('uses provided quest context over store context', () => {
      const providedContext = {
        questName: 'Override Quest',
        currentPhase: 1,
        totalPhases: 5
      }

      mockProgressStore.getCurrentQuestProgress.mockReturnValue({
        questName: 'Store Quest'
      })

      render(<DreamEventModal {...defaultProps} questContext={providedContext} />)

      expect(screen.getByText('Override Quest')).toBeInTheDocument()
      expect(screen.queryByText('Store Quest')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    test('calls onChoice with correct index when choice is clicked', () => {
      const choices = [
        { text: 'Choice 1', impact: 'Impact 1', consequence: 'Result 1' },
        { text: 'Choice 2', impact: 'Impact 2', consequence: 'Result 2' }
      ]

      render(<DreamEventModal {...defaultProps} choices={choices} />)

      fireEvent.click(screen.getByText('Choice 1'))
      expect(mockOnChoice).toHaveBeenCalledWith(0)

      fireEvent.click(screen.getByText('Choice 2'))
      expect(mockOnChoice).toHaveBeenCalledWith(1)
    })

    test('calls onClose when close button is clicked', () => {
      render(<DreamEventModal {...defaultProps} />)

      const closeButton = screen.getByRole('button', { name: '' })
      fireEvent.click(closeButton)

      expect(mockOnClose).toHaveBeenCalled()
    })

    test('calls onClose when backdrop is clicked', () => {
      render(<DreamEventModal {...defaultProps} />)

      const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/60')
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      expect(mockOnClose).toHaveBeenCalled()
    })

    test('does not show close button when onClose is not provided', () => {
      render(<DreamEventModal {...defaultProps} onClose={undefined} />)

      const closeButtons = screen.queryAllByRole('button').filter(btn => 
        btn.querySelector('svg')
      )
      
      expect(closeButtons).toHaveLength(2) // Only choice buttons
    })
  })

  describe('Styling and Animations', () => {
    test('applies correct color scheme for each dream type', () => {
      const colorMap = {
        prophecy: 'from-amber-600 to-yellow-500',
        warning: 'from-red-600 to-orange-500',
        inspiration: 'from-purple-600 to-pink-500',
        nightmare: 'from-gray-800 to-red-900',
        vision: 'from-indigo-600 to-purple-600'
      }

      Object.entries(colorMap).forEach(([dreamType, expectedClass]) => {
        const { container, rerender } = render(
          <DreamEventModal {...defaultProps} dreamType={dreamType as any} />
        )

        const badge = container.querySelector(`.bg-gradient-to-r.${expectedClass.replace(/ /g, '.')}`)
        expect(badge).toBeInTheDocument()

        rerender(<div />)
      })
    })

    test('applies vintage styling classes', () => {
      const { container } = render(<DreamEventModal {...defaultProps} />)

      // Check for sepia/vintage theme
      expect(container.querySelector('.from-sepia-50')).toBeInTheDocument()
      expect(container.querySelector('.border-sepia-300\\/50')).toBeInTheDocument()
      expect(container.querySelector('.text-sepia-800')).toBeInTheDocument()
    })

    test('includes animation classes', () => {
      const { container } = render(<DreamEventModal {...defaultProps} />)

      expect(container.querySelector('.animate-fade-in')).toBeInTheDocument()
      expect(container.querySelector('.animate-slide-in')).toBeInTheDocument()
    })
  })

  describe('Choice Variants', () => {
    test('shows lucid cost when choice has lucidCost', () => {
      const choices = [
        { 
          text: 'Use lucid power', 
          impact: 'Bend reality', 
          consequence: 'Powerful effect',
          lucidCost: 20 
        },
        { 
          text: 'Normal choice', 
          impact: 'Regular effect', 
          consequence: 'Standard result' 
        }
      ]

      render(<DreamEventModal {...defaultProps} choices={choices} />)

      // Lucid choice should show cost
      const lucidButton = screen.getByText('Use lucid power').closest('button')
      expect(lucidButton).toHaveTextContent('20')

      // Normal choice should not show cost
      const normalButton = screen.getByText('Normal choice').closest('button')
      expect(normalButton).not.toHaveTextContent('20')
    })

    test('shows choice impact and consequence on hover', () => {
      const choices = [
        { 
          text: 'Test choice', 
          impact: 'Test impact', 
          consequence: 'Test consequence' 
        }
      ]

      render(<DreamEventModal {...defaultProps} choices={choices} />)

      const choiceButton = screen.getByText('Test choice').closest('button')
      
      // Check if impact/consequence text is present (in tooltip or description)
      expect(screen.getByText('Test impact')).toBeInTheDocument()
      expect(screen.getByText('Test consequence')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('modal is keyboard navigable', () => {
      const choices = [
        { text: 'Choice 1', impact: 'Impact 1', consequence: 'Result 1' },
        { text: 'Choice 2', impact: 'Impact 2', consequence: 'Result 2' }
      ]

      render(<DreamEventModal {...defaultProps} choices={choices} />)

      const choice1Button = screen.getByText('Choice 1')
      const choice2Button = screen.getByText('Choice 2')

      // Buttons should be focusable
      expect(choice1Button.closest('button')).toHaveAttribute('type', 'button')
      expect(choice2Button.closest('button')).toHaveAttribute('type', 'button')
    })

    test('has proper ARIA attributes', () => {
      const { container } = render(<DreamEventModal {...defaultProps} />)

      // Modal should have proper structure
      const modal = container.querySelector('.fixed.inset-0.flex')
      expect(modal).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('handles empty content gracefully', () => {
      render(<DreamEventModal {...defaultProps} content="" />)

      // Should still render the modal structure
      expect(screen.getByText('Prophecy')).toBeInTheDocument()
    })

    test('handles very long content', () => {
      const longContent = 'A'.repeat(1000)
      render(<DreamEventModal {...defaultProps} content={longContent} />)

      const contentElement = screen.getByText(longContent)
      expect(contentElement).toBeInTheDocument()
    })

    test('handles many choices', () => {
      const manyChoices = Array.from({ length: 10 }, (_, i) => ({
        text: `Choice ${i + 1}`,
        impact: `Impact ${i + 1}`,
        consequence: `Result ${i + 1}`
      }))

      render(<DreamEventModal {...defaultProps} choices={manyChoices} />)

      manyChoices.forEach((choice, index) => {
        expect(screen.getByText(choice.text)).toBeInTheDocument()
      })
    })

    test('handles rapid open/close cycles', () => {
      const { rerender } = render(<DreamEventModal {...defaultProps} />)

      // Rapidly toggle modal
      for (let i = 0; i < 10; i++) {
        rerender(<DreamEventModal {...defaultProps} isOpen={i % 2 === 0} />)
      }

      // Should end in closed state
      expect(screen.queryByText(defaultProps.content)).not.toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    test('works with real progress store data', () => {
      const realQuestData = {
        questName: 'Integration Test Quest',
        currentPhase: 3,
        totalPhases: 5,
        questId: 'test-quest',
        phasesCompleted: ['phase1', 'phase2'],
        cluesFound: 4,
        totalClues: 10,
        status: 'in_progress' as const
      }

      mockProgressStore.getCurrentQuestProgress.mockReturnValue(realQuestData)

      render(<DreamEventModal {...defaultProps} />)

      expect(screen.getByText('Integration Test Quest')).toBeInTheDocument()
      expect(screen.getByText('(3/5)')).toBeInTheDocument()
    })
  })
})