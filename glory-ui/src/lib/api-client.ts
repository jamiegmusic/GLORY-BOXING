import { Fighter, Match } from './unified-types';

const API_BASE_URL = 'http://127.0.0.1:8000';

export { Fighter, Match };

export const apiClient = {
  // Fighter endpoints
  async getFighters() {
    const response = await fetch(`${API_BASE_URL}/api/fighters`);
    if (!response.ok) {
      throw new Error(`Failed to fetch fighters: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  async createFighter(fighter: {
    name: string;
    weight_class: string;
    record: string;
    nationality?: string;
    age?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/fighters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify(fighter),
    });
    if (!response.ok) {
      throw new Error(`Failed to create fighter: ${response.statusText}`);
    }
    return response.json();
  },

  // Match endpoints
  async getMatches() {
    const response = await fetch(`${API_BASE_URL}/api/matches`);
    if (!response.ok) {
      throw new Error(`Failed to fetch matches: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
  },

  async createMatch(match: {
    fighter_a_id: number;
    fighter_b_id: number;
    venue: string;
    date: string;
    result?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/matches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify(match),
    });
    if (!response.ok) {
      throw new Error(`Failed to create match: ${response.statusText}`);
    }
    return response.json();
  },

  async updateMatchResult(matchId: number, result: string) {
    const response = await fetch(`${API_BASE_URL}/api/matches/${matchId}/result`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token',
      },
      body: JSON.stringify({ result }),
    });
    if (!response.ok) {
      throw new Error(`Failed to update match result: ${response.statusText}`);
    }
    return response.json();
  },
}; 