// ============================================================
// GAMIFICATION DATA — Missões, badges e metas mensais
// ============================================================

export interface Mission {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    coinsReward: number;
    progress: number; // 0-100
    completed: boolean;
}

// icon: nome do ícone Lucide (string) — renderizado no componente
export interface BadgeItem {
    id: string;
    iconName: string;
    label: string;
    unlocked: boolean;
}

export interface RecentAchievement {
    id: number;
    text: string;
    highlight: string;
    time: string;
    iconName: string; // nome do ícone Lucide
}

// — Metas mensais —
export const monthlyGoals = {
    salesTarget: 60000,
    salesCurrent: 45000,
    closingsTarget: 70,
    closingsCurrent: 32,
    bonusThreshold: 15000,
};

// — Missões ativas —
export const activeMissions: Mission[] = [
    {
        id: 'first_of_day',
        title: 'Primeira do Dia',
        description: 'Faça o primeiro fechamento antes das 10h.',
        xpReward: 150,
        coinsReward: 50,
        progress: 100,
        completed: true,
    },
    {
        id: 'cold_calls',
        title: 'Maratona de Ligações',
        description: 'Faça 50 ligações qualificadas em um dia.',
        xpReward: 500,
        coinsReward: 200,
        progress: 72,
        completed: false,
    },
    {
        id: 'reactivation_3',
        title: 'Reativador',
        description: 'Reative 3 clientes inativos essa semana.',
        xpReward: 300,
        coinsReward: 120,
        progress: 66,
        completed: false,
    },
    {
        id: 'conversion_boost',
        title: 'Taxa Implacável',
        description: 'Mantenha conversão acima de 70% por 5 dias.',
        xpReward: 400,
        coinsReward: 150,
        progress: 40,
        completed: false,
    },
];

// — Badges — (iconName = nome do componente Lucide)
export const badges: BadgeItem[] = [
    { id: 'first_sale', iconName: 'Target', label: 'Primeira Venda', unlocked: true },
    { id: 'streak_7', iconName: 'Flame', label: '7 dias seguidos', unlocked: true },
    { id: 'closer', iconName: 'Zap', label: 'The Closer', unlocked: true },
    { id: 'reactivator', iconName: 'RefreshCw', label: 'Reativador', unlocked: true },
    { id: 'top3', iconName: 'Trophy', label: 'Top 3 do mês', unlocked: true },
    { id: 'revenue_25k', iconName: 'DollarSign', label: 'R$ 25k no mês', unlocked: false },
    { id: 'streak_30', iconName: 'Gem', label: '30 dias seguidos', unlocked: false },
    { id: 'mentor', iconName: 'Handshake', label: 'Mentoria', unlocked: false },
];

// — Conquistas recentes (feed) — (iconName = nome do componente Lucide)
export const recentAchievements: RecentAchievement[] = [
    { id: 1, text: 'subiu para o', highlight: 'Nível 5', time: 'há 2 minutos', iconName: 'TrendingUp' },
    { id: 2, text: 'conquistou a badge', highlight: '"The Closer"', time: 'há 1 hora', iconName: 'Zap' },
    { id: 3, text: 'bateu a meta', highlight: 'semanal', time: 'há 3 horas', iconName: 'Target' },
    { id: 4, text: 'completou a missão', highlight: '"Primeira do Dia"', time: 'há 5 horas', iconName: 'CheckCircle2' },
];

// — XP do seller logado (simulado) —
export const currentSellerStats = {
    xp: 850,
    xpMax: 1000,
    level: 42,
    streak: 12,
    winRate: 72,
};
