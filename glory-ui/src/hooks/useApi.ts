import { useState, useEffect } from 'react';
import { apiClient, Fighter, Match } from '../lib/api-client';

export const useFighters = () => {
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFighters = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getFighters();
        setFighters(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching fighters:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch fighters');
      } finally {
        setLoading(false);
      }
    };

    fetchFighters();
  }, []);

  return { fighters, loading, error };
};

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getMatches();
        setMatches(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return { matches, loading, error };
}; 