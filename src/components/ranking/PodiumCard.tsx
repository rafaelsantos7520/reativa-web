import { Trophy, Medal } from 'lucide-react';
import type { TeamMember } from '@/data/mock';
import { cn } from '@/lib/utils';

const RANK_BADGE = [
    { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    { bg: 'bg-slate-400/15', text: 'text-slate-300', border: 'border-slate-400/25' },
    { bg: 'bg-amber-800/20', text: 'text-amber-700', border: 'border-amber-700/30' },
];

const PODIUM = [
    // visual: left=2nd, center=1st, right=3rd
    {
        sellerIndex: 1,
        height: 'h-20',
        barBg: 'from-slate-400 to-slate-500',
        avatarSize: 'w-16 h-16 text-base',
        avatarBg: 'from-slate-300 to-slate-500',
        textColor: 'text-slate-300',
        label: '2º',
        delay: '200ms',
        glow: '',
    },
    {
        sellerIndex: 0,
        height: 'h-28',
        barBg: 'from-amber-400 to-yellow-500',
        avatarSize: 'w-20 h-20 text-xl',
        avatarBg: 'from-amber-300 to-yellow-500',
        textColor: 'text-amber-300',
        label: '1º',
        delay: '100ms',
        glow: 'shadow-amber-500/30 shadow-xl',
    },
    {
        sellerIndex: 2,
        height: 'h-12',
        barBg: 'from-amber-700 to-amber-800',
        avatarSize: 'w-14 h-14 text-sm',
        avatarBg: 'from-amber-600 to-amber-800',
        textColor: 'text-amber-700',
        label: '3º',
        delay: '300ms',
        glow: '',
    },
];

interface PodiumCardProps {
    sellers: TeamMember[];
}

export default function PodiumCard({ sellers }: PodiumCardProps) {
    return (
        <div
            className="glass-card rounded-2xl p-6 relative overflow-hidden animate-fade-in"
            style={{ animationDelay: '160ms', opacity: 0 }}
        >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] to-transparent pointer-events-none" />

            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8 text-center flex items-center justify-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Pódio do Mês
            </h2>

            <div className="flex items-end justify-center gap-6">
                {PODIUM.map((cfg) => {
                    const seller = sellers[cfg.sellerIndex];
                    if (!seller) return null;
                    const badge = RANK_BADGE[cfg.sellerIndex];
                    return (
                        <div
                            key={seller.id}
                            className="flex flex-col items-center gap-3 animate-fade-in"
                            style={{ animationDelay: cfg.delay, opacity: 0 }}
                        >
                            {/* Avatar + medal badge */}
                            <div className="relative">
                                <div className={cn(
                                    'rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white shadow-lg',
                                    cfg.avatarSize, cfg.avatarBg, cfg.glow
                                )}>
                                    {seller.avatar}
                                </div>
                                <div className={cn(
                                    'absolute -top-2 -right-1 w-6 h-6 rounded-full border flex items-center justify-center',
                                    badge.bg, badge.border
                                )}>
                                    <Medal className={cn('w-3 h-3', badge.text)} />
                                </div>
                            </div>

                            {/* Name + value */}
                            <div className="text-center">
                                <p className={cn('text-sm font-bold', cfg.textColor)}>
                                    {seller.name.split(' ')[0]}
                                </p>
                                <p className={cn('text-lg font-black', cfg.textColor)}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(seller.salesValue)}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{seller.salesCount} vendas</p>
                            </div>

                            {/* Podium platform bar */}
                            <div className={cn(
                                'w-24 rounded-t-xl flex items-center justify-center bg-gradient-to-t',
                                cfg.height, cfg.barBg
                            )}>
                                <span className="text-2xl font-black text-white/80">{cfg.label}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
