import { useState, useEffect } from 'react';
import { Pavilion } from '../types/pavilion';

export function usePavilions() {
  const [pavilions, setPavilions] = useState<Pavilion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPavilions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/pavilions-sample.json');
        if (!response.ok) {
          throw new Error('Failed to fetch pavilions data');
        }
        const data = await response.json();
        setPavilions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPavilions();
  }, []);

  return { pavilions, loading, error };
}