import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    X,
    Headphones,
    RefreshCcw,
    TrendingUp,
    Users,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
    customerService,
    type ReengagementUser,
    type ReengagementMetrics,
} from '@/services/customer.service';

type FilterStatus = 'todos' | 'sem_pedidos' | 'com_pedidos' | 'com_pagos';

/* ── Helpers ── */

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(p => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

function getAvatarColor(name: string): string {
    const colors = [
        'bg-teal-600',
        'bg-violet-600',
        'bg-amber-600',
        'bg-emerald-600',
        'bg-rose-600',
        'bg-blue-600',
    ];
    const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return colors[hash % colors.length];
}



/* ── Main Component ── */

export default function Clientes() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
    const [showDiasDropdown, setShowDiasDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [clients, setClients] = useState<ReengagementUser[]>([]);
    const [metrics, setMetrics] = useState<ReengagementMetrics>({ totalInProgress: 0, totalReactivated: 0 });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
    const [totalShowing, setTotalShowing] = useState({ from: 0, to: 0 });

    const fetchClients = useCallback(async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await customerService.getReengagements(page);
            if (response.success) {
                setClients(response.data.users.data);
                setMetrics(response.data.metrics);
                setCurrentPage(response.data.users.current_page);
                setNextPageUrl(response.data.users.next_page_url);
                setPrevPageUrl(response.data.users.prev_page_url);
                setTotalShowing({
                    from: response.data.users.from,
                    to: response.data.users.to,
                });
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClients(1);
    }, [fetchClients]);

    useEffect(() => {
        if (!showDiasDropdown) return;
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDiasDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showDiasDropdown]);

    const stats = useMemo(() => {
        const total = clients.length;
        const taxa = total > 0 ? Math.round((metrics.totalReactivated / (metrics.totalInProgress + metrics.totalReactivated || 1)) * 100) : 0;
        return {
            emAtendimento: metrics.totalInProgress,
            reativados: metrics.totalReactivated,
            taxa,
            disponiveis: total,
        };
    }, [clients, metrics]);

    const filteredClients = useMemo(() => {
        let list = [...clients];

        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                c =>
                    c.name.toLowerCase().includes(q) ||
                    c.email.toLowerCase().includes(q) ||
                    c.login.toLowerCase().includes(q) ||
                    (c.personal_data?.whatsapp || '').includes(q)
            );
        }

        if (filterStatus === 'sem_pedidos') {
            list = list.filter(c => c.total_orders === 0);
        } else if (filterStatus === 'com_pedidos') {
            list = list.filter(c => c.total_orders > 0);
        } else if (filterStatus === 'com_pagos') {
            list = list.filter(c => c.paid_orders > 0);
        }

        return list;
    }, [clients, search, filterStatus]);

    const handleClearFilters = () => {
        setSearch('');
        setFilterStatus('todos');
    };

    const handleNextPage = () => {
        if (nextPageUrl) fetchClients(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (prevPageUrl) fetchClients(currentPage - 1);
    };

    const statsCards = [
        {
            label: 'Em Atendimento',
            value: stats.emAtendimento,
            icon: Headphones,
            color: 'text-teal-500 dark:text-teal-400',
            bg: 'bg-teal-50 dark:bg-teal-500/10',
            iconBg: 'bg-teal-500',
        },
        {
            label: 'Reativados',
            value: stats.reativados,
            icon: RefreshCcw,
            color: 'text-emerald-500 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-500/10',
            iconBg: 'bg-emerald-500',
        },
        {
            label: 'Taxa de Conversão',
            value: `${stats.taxa}%`,
            icon: TrendingUp,
            color: 'text-amber-500 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            iconBg: 'bg-amber-500',
        },
        {
            label: 'Disponíveis',
            value: stats.disponiveis,
            icon: Users,
            color: 'text-violet-500 dark:text-violet-400',
            bg: 'bg-violet-50 dark:bg-violet-500/10',
            iconBg: 'bg-violet-500',
        },
    ];

    const filterOptions: { key: FilterStatus; label: string }[] = [
        { key: 'sem_pedidos', label: 'Sem pedidos' },
        { key: 'com_pedidos', label: 'Com Pedidos' },
        { key: 'com_pagos', label: 'Com Pedidos Pagos' },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        Reativação de Clientes
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Gerencie seus clientes inativos para reativação
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/meus-atendimentos')}
                    className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white gap-2"
                >
                    <Headphones className="w-4 h-4" />
                    Meus atendimentos
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {statsCards.map((card, i) => (
                    <div
                        key={card.label}
                        className="solid-card p-4 sm:p-5 animate-fade-in hover:scale-[1.01] transition-transform"
                        style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                {card.label}
                            </p>
                            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', card.iconBg)}>
                                <card.icon className="w-4 h-4 text-white" />
                            </div>
                        </div>
                        <p className={cn('text-2xl sm:text-3xl font-black tracking-tight', card.color)}>
                            {loading ? '...' : card.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div
                className="solid-card p-4 animate-fade-in"
                style={{ animationDelay: '200ms', opacity: 0 }}
            >
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Filtros</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar por nome, email ou WhatsApp..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 h-9 text-sm"
                        />
                    </div>

                    <div className="w-px h-6 bg-border hidden sm:block" />

                    {/* Toggle filters */}
                    {filterOptions.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() =>
                                setFilterStatus(prev => (prev === opt.key ? 'todos' : opt.key))
                            }
                            className={cn(
                                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                                filterStatus === opt.key
                                    ? 'bg-teal-50 dark:bg-teal-500/15 border-teal-300 dark:border-teal-500/30 text-teal-700 dark:text-teal-400'
                                    : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground'
                            )}
                        >
                            <div
                                className={cn(
                                    'w-3 h-3 rounded-full border-2 transition-colors',
                                    filterStatus === opt.key
                                        ? 'border-teal-500 bg-teal-500'
                                        : 'border-muted-foreground/30'
                                )}
                            />
                            {opt.label}
                        </button>
                    ))}

                    <div className="flex-1" />

                    {/* Actions */}
                    <Button
                        size="sm"
                        onClick={() => fetchClients(currentPage)}
                        className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white gap-1.5 h-9 text-xs"
                    >
                        <RefreshCcw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
                        Atualizar
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleClearFilters}
                        className="gap-1.5 h-9 text-xs"
                    >
                        <X className="w-3.5 h-3.5" />
                        Limpar filtros
                    </Button>
                </div>
            </div>

            {/* Tabela de Clientes */}
            <div
                className="solid-card overflow-hidden animate-fade-in"
                style={{ animationDelay: '280ms', opacity: 0 }}
            >
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold">Clientes</h2>
                        <Badge variant="outline" className="text-[10px] bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20">
                            {filteredClients.length}
                        </Badge>
                    </div>
                    {totalShowing.from > 0 && (
                        <span className="text-xs text-muted-foreground">
                            Exibindo {totalShowing.from} - {totalShowing.to}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                        <span className="ml-3 text-sm text-muted-foreground">Carregando clientes...</span>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground w-[80px]">
                                    ID
                                </TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    Cliente
                                </TableHead>

                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[100px]">
                                    Pedidos
                                </TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[100px]">
                                    Pagos
                                </TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right w-[110px]">
                                    Ações
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.map((client) => (
                                <ClientRow key={client.id} client={client} />
                            ))}
                            {filteredClients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <p className="text-muted-foreground text-sm">
                                            Nenhum cliente encontrado
                                        </p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}

                {/* Paginação */}
                {!loading && (prevPageUrl || nextPageUrl) && (
                    <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            Página {currentPage}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handlePrevPage}
                                disabled={!prevPageUrl}
                                className="h-8 w-8 p-0 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleNextPage}
                                disabled={!nextPageUrl}
                                className="h-8 w-8 p-0 disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ClientRow({ client }: { client: ReengagementUser }) {
    const navigate = useNavigate();
    const initials = getInitials(client.name);
    const colorClass = getAvatarColor(client.name);

    return (
        <TableRow
            className="border-border hover:bg-muted/50 transition-colors group"
        >
            {/* ID */}
            <TableCell className="py-3">
                <span className="text-xs text-muted-foreground font-mono">#{client.id}</span>
            </TableCell>

            {/* Cliente */}
            <TableCell className="py-3">
                <div className="flex items-center gap-3">
                    {client.personal_data?.avatar ? (
                        <img
                            src={client.personal_data.avatar}
                            alt={client.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                    ) : (
                        <div
                            className={cn(
                                'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
                                colorClass
                            )}
                        >
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{client.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{client.email}</p>
                    </div>
                </div>
            </TableCell>

   

            {/* Pedidos */}
            <TableCell className="py-3 text-center">
                <span className="text-sm font-medium">{client.total_orders}</span>
            </TableCell>

            {/* Pagos */}
            <TableCell className="py-3 text-center">
                <span className={cn(
                    'text-sm font-medium',
                    client.paid_orders > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                )}>
                    {client.paid_orders}
                </span>
            </TableCell>

            {/* Ações */}
            <TableCell className="py-3 text-right">
                <Button
                    size="sm"
                    onClick={() => navigate(`/clientes/${client.id}`)}
                    className="h-7 text-xs gap-1.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                >
                    <MessageCircle className="w-3 h-3" />
                    Iniciar atendimento
                </Button>
            </TableCell>
        </TableRow>
    );
}
