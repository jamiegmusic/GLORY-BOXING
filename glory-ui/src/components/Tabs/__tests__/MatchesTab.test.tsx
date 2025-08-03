import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import MatchesTab from '../MatchesTab';

// Mock data
const mockMatches = [
  {
    id: 1,
    fighter_a: 'Fighter One',
    fighter_b: 'Fighter Two',
    weight_class: 'heavyweight',
    scheduled_date: '2024-02-15',
    status: 'scheduled'
  }
];

const mockCommentaryResponse = {
  commentary: 'An explosive fight that lived up to the hype. Froch showed his power early, but Bellew had moments of brilliance. The knockout came from a devastating right hand that sent Bellew crashing to the canvas.',
  highlights: [
    'Carl Froch wins by KO',
    '1 knockdown(s) in the fight',
    '2 significant combinations landed'
  ],
  roundByRound: [
    'Round 1: Both fighters are feeling each other out, looking for openings.',
    'Round 8: DRAMATIC MOMENT! Carl Froch scores a knockdown! The crowd is on their feet!'
  ],
  analysis: 'This was a devastating performance. Carl Froch showed superior power and timing.',
  rating: 8.5
};

// Setup global mocks
beforeAll(() => {
  global.fetch = vi.fn();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('MatchesTab', () => {
  it('renders match list with commentary generation', () => {
    render(<MatchesTab />);
    
    expect(screen.getByText('Match Results')).toBeInTheDocument();
    expect(screen.getByText('Carl Froch vs Tony Bellew')).toBeInTheDocument();
    expect(screen.getByText('Oleksandr Usyk vs Dmitry Bivol')).toBeInTheDocument();
  });

  it('expands match details when view button is clicked', async () => {
    render(<MatchesTab />);
    
    const viewButtons = screen.getAllByText(/View Details/);
    await userEvent.click(viewButtons[0]);
    
    expect(screen.getByText('Fight Commentary')).toBeInTheDocument();
    expect(screen.getByText(/An explosive fight that lived up to the hype/)).toBeInTheDocument();
    expect(screen.getByText('Official Scorecard')).toBeInTheDocument();
  });

  it('generates AI commentary when button is clicked', async () => {
    const mockFetch = global.fetch as any;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCommentaryResponse
    });
    
    render(<MatchesTab />);
    
    // Expand match details
    const viewButtons = screen.getAllByText(/View Details/);
    await userEvent.click(viewButtons[0]);
    
    // Click AI Commentary button
    const commentaryButton = screen.getByText('AI Commentary');
    await userEvent.click(commentaryButton);
    
    // Verify API call was made
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/commentary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"style":"neutral"')
      });
    });
  });

  it('displays commentary panel after successful generation', async () => {
    const mockFetch = global.fetch as any;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCommentaryResponse
    });
    
    render(<MatchesTab />);
    
    // Expand match details and generate commentary
    const viewButtons = screen.getAllByText(/View Details/);
    await userEvent.click(viewButtons[0]);
    
    const commentaryButton = screen.getByText('AI Commentary');
    await userEvent.click(commentaryButton);
    
    // Wait for commentary panel to appear
    await waitFor(() => {
      expect(screen.getByText('Fight Commentary')).toBeInTheDocument();
      expect(screen.getByText(/An explosive fight that lived up to the hype/)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const mockFetch = global.fetch as any;
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<MatchesTab />);
    
    // Expand match details
    const viewButtons = screen.getAllByText(/View Details/);
    await userEvent.click(viewButtons[0]);
    
    // Click AI Commentary button
    const commentaryButton = screen.getByText('AI Commentary');
    await userEvent.click(commentaryButton);
    
    // Should still show the button after error
    await waitFor(() => {
      expect(screen.getByText('AI Commentary')).toBeInTheDocument();
    });
  });

  it('shows loading state during commentary generation', async () => {
    const mockFetch = global.fetch as any;
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<MatchesTab />);
    
    // Expand match details
    const viewButtons = screen.getAllByText(/View Details/);
    await userEvent.click(viewButtons[0]);
    
    // Click AI Commentary button
    const commentaryButton = screen.getByText('AI Commentary');
    await userEvent.click(commentaryButton);
    
    // Should show loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });

  it('displays title fight information correctly', () => {
    render(<MatchesTab />);
    
    const viewButtons = screen.getAllByText(/View Details/);
    userEvent.click(viewButtons[0]);
    
    expect(screen.getByText('WBC Light Heavyweight')).toBeInTheDocument();
    expect(screen.getByText('WBA Heavyweight')).toBeInTheDocument();
  });

  it('shows press conference and rankings buttons', () => {
    render(<MatchesTab />);
    
    const viewButtons = screen.getAllByText(/View Details/);
    userEvent.click(viewButtons[0]);
    
    expect(screen.getByText('View Press Conference')).toBeInTheDocument();
    expect(screen.getByText('Update Rankings')).toBeInTheDocument();
  });

  it('collapses match details when hide button is clicked', async () => {
    render(<MatchesTab />);
    
    const viewButtons = screen.getAllByText(/View Details/);
    await userEvent.click(viewButtons[0]);
    
    // Should show "Hide Details" button
    expect(screen.getByText('Hide Details')).toBeInTheDocument();
    
    // Click hide button
    const hideButton = screen.getByText('Hide Details');
    await userEvent.click(hideButton);
    
    // Should show "View Details" button again
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });

  it('displays batch operations section', () => {
    render(<MatchesTab />);
    
    expect(screen.getByText('Batch Operations')).toBeInTheDocument();
    expect(screen.getByText('Simulate all upcoming matches at once')).toBeInTheDocument();
    expect(screen.getByText('Simulate All Matches')).toBeInTheDocument();
  });
}); 