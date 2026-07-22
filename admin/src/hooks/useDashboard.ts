import { useQuery } from '@tanstack/react-query';
import { getStats, getRecent } from '../services/stats.service';

export function useStats() {
  return useQuery({ queryKey: ['stats'], queryFn: getStats });
}

export function useRecent() {
  return useQuery({ queryKey: ['recent'], queryFn: () => getRecent(8) });
}
