import api from './api';
import type { LeaderboardEntry } from '@/components/ranking/types';

export const LeaderboardService = {
    getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
        const response = await api.get<LeaderboardEntry[]>('/api/leaderboard');
        return Array.isArray(response.data) ? response.data : [];
    },
};