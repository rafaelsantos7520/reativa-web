import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Layers, LogOut, Users, DollarSign, ShoppingCart,
    Star, TrendingUp, TrendingDown, UserPlus, FileText,
    Settings, MessageSquare, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
    {
        label: 'Usuários ativos',
        value: '1.248',
        change: '+12%',
        up: true,
        icon: Users,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
    },
    {
        label: 'Receita mensal',
        value: 'R$ 42.5k',
        change: '+8%',
        up: true,
        icon: DollarSign,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
    },
    {
        label: 'Pedidos hoje',
        value: '356',
        change: '-3%',
        up: false,
        icon: ShoppingCart,
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
    },
    {
        label: 'Avaliação média',
        value: '4.8',
        change: '+24%',
        up: true,
        icon: Star,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
    },
];

const actions = [
    {
        label: 'Gerenciar Usuários',
        description: 'Adicionar e editar usuários',
        icon: UserPlus,
    },
    {
        label: 'Relatórios',
        description: 'Visualizar dados e métricas',
        icon: FileText,
    },
    {
        label: 'Configurações',
        description: 'Preferências do sistema',
        icon: Settings,
    },
    {
        label: 'Mensagens',
        description: 'Central de comunicação',
        icon: MessageSquare,
    },
];

export default function Home() {
    const { user, logoutFunction } = useAuth();

    const name = user?.name ?? 'Usuário';
    const email = user?.email ?? '';

    const getInitials = (n: string) =>
        n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Bom dia';
        if (h < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center glow-sm">
                            <Layers className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-base gradient-text">Reativa</span>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full glass border border-white/10">
                            <Avatar className="w-7 h-7">
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-xs font-bold">
                                    {getInitials(name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                                <span className="text-sm font-semibold text-foreground">{name}</span>
                                <span className="text-xs text-muted-foreground">{email}</span>
                            </div>
                        </div>

                        <Button
                            id="logout-btn"
                            variant="ghost"
                            size="icon"
                            onClick={logoutFunction}
                            title="Sair"
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                {/* Welcome */}
                <section className="mb-8 animate-fade-in">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 flex items-center gap-2">
                        {getGreeting()},{' '}
                        <span className="gradient-text">{name.split(' ')[0]}</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Aqui está um resumo rápido do seu painel
                    </p>
                </section>

                {/* Stats grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            className="glass-card rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg animate-fade-in"
                            style={{ animationDelay: `${i * 80}ms` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                                    <stat.icon className={cn('w-5 h-5', stat.color)} />
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        'text-xs font-semibold gap-1 px-2',
                                        stat.up
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    )}
                                >
                                    {stat.up
                                        ? <TrendingUp className="w-3 h-3" />
                                        : <TrendingDown className="w-3 h-3" />
                                    }
                                    {stat.change}
                                </Badge>
                            </div>
                            <p className="text-2xl font-extrabold tracking-tight mb-0.5">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <Separator className="mb-8 opacity-30" />

                {/* Quick actions */}
                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Ações rápidas
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {actions.map((action, i) => (
                            <button
                                key={action.label}
                                className="glass rounded-xl p-4 text-left flex items-center gap-3 hover:bg-white/[0.06] hover:border-indigo-500/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 animate-fade-in group"
                                style={{ animationDelay: `${400 + i * 80}ms` }}
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 glow-sm">
                                    <action.icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{action.label}</p>
                                    <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-indigo-400 shrink-0 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
