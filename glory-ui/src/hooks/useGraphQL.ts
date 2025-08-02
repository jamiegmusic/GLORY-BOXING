import { useState, useEffect } from 'react';
import { graphqlClient, GET_FIGHTERS, GET_MATCHES, GetFightersResponse, GetMatchesResponse } from '../lib/graphql-client';

export const useFighters = () => {
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFighters = async () => {
      try {
        setLoading(true);
        const data: GetFightersResponse = await graphqlClient.request(GET_FIGHTERS);
        setFighters(data.getFighters);
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
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data: GetMatchesResponse = await graphqlClient.request(GET_MATCHES);
        setMatches(data.getMatches);
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