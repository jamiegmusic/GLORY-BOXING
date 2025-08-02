import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentaryPanel from '../CommentaryPanel';
import fetchMock from 'jest-fetch-mock';

// Mock data
const mockMatchData = {
  id: 'test-match-1',
  fighterA: { name: 'Carl Froch', record: '33-2-0' },
  fighterB: { name: 'Tony Bellew', record: '30-3-1' },
  venue: 'O2 Arena, London',
  weightClass: 'Light Heavyweight',
  rounds: 8,
  events: [
    { action: 'knockdown', fighter: 'Carl Froch', round: 3, timeInRound: '2:15' },
    { action: 'punch', fighter: 'Tony Bellew', round: 4, timeInRound: '1:30', combo: true, comboCount: 3 }
  ],
  result: { winner: 'Carl Froch', method: 'ko', round: 8, timeInRound: '2:45' }
};

const mockCommentaryData = {
  commentary: 'O2 Arena is electric tonight as Carl Froch (33-2-0) takes on Tony Bellew (30-3-1) in what promises to be an explosive encounter. The stakes couldn\'t be higher in this Light Heavyweight showdown.\n\nRound 3: DRAMATIC MOMENT! Carl Froch scores a knockdown! The crowd is on their feet!\n\nRound 4: Tony Bellew lands a beautiful combination, showing excellent hand speed and accuracy.\n\nThis was a devastating performance. Carl Froch showed superior power and timing. The key turning point came when Carl Froch began to land the heavier shots.\n\nAnd there it is! Carl Froch takes the victory by KO in round 8. This result sends a message to the division. What a night of boxing!',
  highlights: [
    'Carl Froch wins by ko',
    '1 knockdown(s) in the fight',
    '1 significant combinations landed'
  ],
  roundByRound: [
    'Round 3: DRAMATIC MOMENT! Carl Froch scores a knockdown! The crowd is on their feet!',
    'Round 4: Tony Bellew lands a beautiful combination, showing excellent hand speed and accuracy.'
  ],
  analysis: 'This was a devastating performance. Carl Froch showed superior power and timing. The key turning point came when Carl Froch began to land the heavier shots.',
  rating: 8.5
};

beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('CommentaryPanel', () => {
  test('renders empty state when no commentary is provided', () => {
    render(<CommentaryPanel matchData={mockMatchData} />);
    
    expect(screen.getByText('Fight Commentary')).toBeInTheDocument();
    expect(screen.getByText('No commentary generated yet')).toBeInTheDocument();
    expect(screen.getByText('Generate AI Commentary')).toBeInTheDocument();
  });

  test('displays AI narrative on successful fetch', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockCommentaryData));
    
    render(<CommentaryPanel matchData={mockMatchData} />);
    
    const generateButton = screen.getByText('Generate AI Commentary');
    await userEvent.click(generateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/O2 Arena is electric tonight/)).toBeInTheDocument();
    });
  });

  test('shows full commentary with expand/collapse functionality', () => {
    render(
      <CommentaryPanel 
        matchData={mockMatchData}
        commentary={mockCommentaryData.commentary}
        highlights={mockCommentaryData.highlights}
        roundByRound={mockCommentaryData.roundByRound}
        analysis={mockCommentaryData.analysis}
        rating={mockCommentaryData.rating}
      />
    );

    // Check that commentary is initially truncated
    expect(screen.getByText(/O2 Arena is electric tonight/)).toBeInTheDocument();
    
    // Click show more button
    const showMoreButton = screen.getByText('Show More');
    fireEvent.click(showMoreButton);
    
    // Should now show "Show Less"
    expect(screen.getByText('Show Less')).toBeInTheDocument();
  });

  test('displays round-by-round commentary', () => {
    render(
      <CommentaryPanel 
        matchData={mockMatchData}
        commentary={mockCommentaryData.commentary}
        roundByRound={mockCommentaryData.roundByRound}
      />
    );

    expect(screen.getByText('Round by Round')).toBeInTheDocument();
    expect(screen.getByText(/DRAMATIC MOMENT! Carl Froch scores a knockdown!/)).toBeInTheDocument();
    expect(screen.getByText(/Tony Bellew lands a beautiful combination/)).toBeInTheDocument();
  });

  test('displays fight analysis', () => {
    render(
      <CommentaryPanel 
        matchData={mockMatchData}
        commentary={mockCommentaryData.commentary}
        analysis={mockCommentaryData.analysis}
      />
    );

    expect(screen.getByText('Fight Analysis')).toBeInTheDocument();
    expect(screen.getByText(/devastating performance/)).toBeInTheDocument();
  });

  test('displays key highlights', () => {
    render(
      <CommentaryPanel 
        matchData={mockMatchData}
        commentary={mockCommentaryData.commentary}
        highlights={mockCommentaryData.highlights}
      />
    );

    expect(screen.getByText('Key Highlights')).toBeInTheDocument();
    expect(screen.getByText('Carl Froch wins by ko')).toBeInTheDocument();
    expect(screen.getByText('1 knockdown(s) in the fight')).toBeInTheDocument();
    expect(screen.getByText('1 significant combinations landed')).toBeInTheDocument();
  });

  test('displays fight statistics', () => {
    render(
      <CommentaryPanel 
        matchData={mockMatchData}
        commentary={mockCommentaryData.commentary}
      />
    );

    expect(screen.getByText('8')).toBeInTheDocument(); // Rounds
    expect(screen.getByText('1')).toBeInTheDocument(); // Knockdowns
    expect(screen.getByText('1')).toBeInTheDocument(); // Combos
    expect(screen.getByText('KO')).toBeInTheDocument(); // Result
  });

  test('displays star rating', () => {
    render(
      <CommentaryPanel 
        matchData={mockMatchData}
        commentary={mockCommentaryData.commentary}
        rating={4.5}
      />
    );

    expect(screen.getByText('(4.5/5)')).toBeInTheDocument();
  });

  test('handles play/pause button functionality', () => {
    render(
      <CommentaryPanel 
        matchData={mockMatchData}
        commentary={mockCommentaryData.commentary}
      />
    );

    const playButton = screen.getByRole('button', { name: /play/i });
    expect(playButton).toBeInTheDocument();
    
    fireEvent.click(playButton);
    
    // Should now show pause button
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  test('calls onGenerateCommentary when generate button is clicked', async () => {
    const mockOnGenerate = jest.fn();
    
    render(
      <CommentaryPanel 
        matchData={mockMatchData}
        onGenerateCommentary={mockOnGenerate}
      />
    );

    const generateButton = screen.getByText('Generate AI Commentary');
    await userEvent.click(generateButton);
    
    expect(mockOnGenerate).toHaveBeenCalledTimes(1);
  });

  test('handles API error gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('API Error'));
    
    render(<CommentaryPanel matchData={mockMatchData} />);
    
    const generateButton = screen.getByText('Generate AI Commentary');
    await userEvent.click(generateButton);
    
    // Should still show the generate button after error
    await waitFor(() => {
      expect(screen.getByText('Generate AI Commentary')).toBeInTheDocument();
    });
  });

  test('displays loading state during commentary generation', async () => {
    fetchMock.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<CommentaryPanel matchData={mockMatchData} />);
    
    const generateButton = screen.getByText('Generate AI Commentary');
    await userEvent.click(generateButton);
    
    // Should show loading state
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });
}); 