describe('Commentary Generation', () => {
  beforeEach(() => {
    // Mock the API response
    cy.intercept('POST', '/api/commentary', {
      statusCode: 200,
      body: {
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
      }
    }).as('generateCommentary');

    cy.visit('/');
  });

  it('renders narrative after simulation', () => {
    // Navigate to Matches tab
    cy.contains('Matches').click();
    
    // Expand match details
    cy.get('[data-testid=view-details-button]').first().click();
    
    // Click AI Commentary button
    cy.contains('AI Commentary').click();
    
    // Wait for API call
    cy.wait('@generateCommentary');
    
    // Verify commentary appears
    cy.contains('Tonight in London').should('be.visible');
    cy.contains('Carl Froch').should('be.visible');
    cy.contains('Tony Bellew').should('be.visible');
  });

  it('shows loading state during generation', () => {
    // Mock delayed response
    cy.intercept('POST', '/api/commentary', {
      statusCode: 200,
      delay: 1000,
      body: {
        commentary: 'Test commentary',
        highlights: ['Test highlight'],
        roundByRound: ['Test round'],
        analysis: 'Test analysis',
        rating: 5
      }
    }).as('delayedCommentary');

    cy.visit('/');
    cy.contains('Matches').click();
    cy.get('[data-testid=view-details-button]').first().click();
    cy.contains('AI Commentary').click();
    
    // Should show loading state
    cy.contains('Generating...').should('be.visible');
    
    cy.wait('@delayedCommentary');
    cy.contains('Test commentary').should('be.visible');
  });

  it('handles API errors gracefully', () => {
    // Mock error response
    cy.intercept('POST', '/api/commentary', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('commentaryError');

    cy.visit('/');
    cy.contains('Matches').click();
    cy.get('[data-testid=view-details-button]').first().click();
    cy.contains('AI Commentary').click();
    
    cy.wait('@commentaryError');
    
    // Should still show the button after error
    cy.contains('AI Commentary').should('be.visible');
  });

  it('displays commentary panel with all sections', () => {
    cy.visit('/');
    cy.contains('Matches').click();
    cy.get('[data-testid=view-details-button]').first().click();
    cy.contains('AI Commentary').click();
    
    cy.wait('@generateCommentary');
    
    // Check all sections are present
    cy.contains('Fight Commentary').should('be.visible');
    cy.contains('Full Commentary').should('be.visible');
    cy.contains('Round by Round').should('be.visible');
    cy.contains('Fight Analysis').should('be.visible');
    cy.contains('Key Highlights').should('be.visible');
    
    // Check statistics
    cy.contains('8').should('be.visible'); // Rounds
    cy.contains('1').should('be.visible'); // Knockdowns
    cy.contains('1').should('be.visible'); // Combos
    cy.contains('KO').should('be.visible'); // Result
  });

  it('expands and collapses commentary text', () => {
    cy.visit('/');
    cy.contains('Matches').click();
    cy.get('[data-testid=view-details-button]').first().click();
    cy.contains('AI Commentary').click();
    
    cy.wait('@generateCommentary');
    
    // Initially should show "Show More"
    cy.contains('Show More').should('be.visible');
    
    // Click to expand
    cy.contains('Show More').click();
    
    // Should now show "Show Less"
    cy.contains('Show Less').should('be.visible');
    
    // Click to collapse
    cy.contains('Show Less').click();
    
    // Should show "Show More" again
    cy.contains('Show More').should('be.visible');
  });

  it('displays star rating correctly', () => {
    cy.visit('/');
    cy.contains('Matches').click();
    cy.get('[data-testid=view-details-button]').first().click();
    cy.contains('AI Commentary').click();
    
    cy.wait('@generateCommentary');
    
    // Check rating display
    cy.contains('(8.5/5)').should('be.visible');
  });

  it('handles play/pause button functionality', () => {
    cy.visit('/');
    cy.contains('Matches').click();
    cy.get('[data-testid=view-details-button]').first().click();
    cy.contains('AI Commentary').click();
    
    cy.wait('@generateCommentary');
    
    // Initially should show play button
    cy.get('[data-testid=play-button]').should('be.visible');
    
    // Click to pause
    cy.get('[data-testid=play-button]').click();
    
    // Should now show pause button
    cy.get('[data-testid=pause-button]').should('be.visible');
  });
}); 