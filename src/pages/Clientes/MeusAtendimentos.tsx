import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
    Search,
    Headphones,
    RefreshCcw,
    TrendingUp,
    Target,
    Users,
    X,
} from 'lucide-react';
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
import { SkeletonRow } from '@/components/Clientes/SkeletonRow';
import { SkeletonStat } from '@/components/Clientes/SkeletonStat';
import { PersonalRow } from '@/components/Clientes/PersonalRow';
import { PersonalCard } from '@/components/Clientes/PersonalCard';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { customerService } from '@/services/customer.service';


export default function MeusAtendimentos() {
    const navigate = useNavigate();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentDay = String(now.getDate()).padStart(2, '0');
    const currentMonthStart = `${currentYear}-${currentMonth}-01`;
    const today = `${currentYear}-${currentMonth}-${currentDay}`;

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [startDate, setStartDate] = useState(currentMonthStart);
    const [endDate, setEndDate] = useState(today);
    const [statusFilter, setStatusFilter] = useState('');
    const effectiveEndDate = startDate && !endDate ? today : (endDate || undefined);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['personal-reengagements', page, search, startDate, effectiveEndDate, statusFilter],
        queryFn: () => customerService.getPersonalReengagements({
            page,
            login: search || undefined,
            start_date: startDate || undefined,
            end_date: effectiveEndDate,
            status: statusFilter ? Number(statusFilter) : undefined,
        }),
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: true,
        refetchInterval: 5 * 60 * 1000, // 5 minutos
        select: (res) => res.data,
    });

    const allReengagements = data?.customerReengagement.data ?? [];
    const nextPageUrl = data?.customerReengagement.next_page_url ?? null;
    const prevPageUrl = data?.customerReengagement.prev_page_url ?? null;
    const currentPage = data?.customerReengagement.current_page ?? page;
    const showingFrom = data?.customerReengagement.from ?? 0;
    const showingTo = data?.customerReengagement.to ?? 0;
    const totalAttendances = data?.totalAttendances ?? 0;
    const totalReactivated = data?.totalReactivated ?? 0;
    const conversionRate = data?.conversionRate ?? 0;
    const statusRecollection = data?.statusRecollection ?? {};

    const filteredList = allReengagements;

    const handleNextPage = () => { if (nextPageUrl) setPage(p => p + 1); };
    const handlePrevPage = () => { if (prevPageUrl) setPage(p => Math.max(1, p - 1)); };
    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };
    const handleStartDate = (value: string) => {
        setStartDate(value);
        setPage(1);
    };
    const handleEndDate = (value: string) => {
        setEndDate(value);
        setPage(1);
    };
    const handleStatusFilter = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };
    const clearFilters = () => {
        setSearch('');
        setStartDate(currentMonthStart);
        setEndDate(today);
        setStatusFilter('');
        setPage(1);
    };

    const isDefaultPeriod = startDate === currentMonthStart && endDate === today;

    const statsCards = [
        { label: 'Meus Atendimentos (no período)', value: totalAttendances, icon: Headphones, color: 'text-blue-600 dark:text-blue-400', iconBg: 'bg-blue-600' },
        { label: 'Reativados (no período)', value: totalReactivated, icon: RefreshCcw, color: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-600' },
        { label: 'Taxa de Conversão (no período)', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-amber-500 dark:text-amber-400', iconBg: 'bg-amber-500' },
    ];

    return (
        <div className="p-4 py-8 sm:p-12 space-y-5 max-w-screen-2xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in flex-col sm:flex-row gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">Meus Atendimentos</h1>

                    <p className="text-muted-foreground text-sm mt-0.5 hidden sm:block">
                        Clientes que estou atendendo no período selecionado
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/clientes')}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white gap-2"
                >
                    <Target className="w-4 h-4" />
                    Lista Geral
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-in">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, idx) => <SkeletonStat key={idx} />)
                    : statsCards.map(card => (
                        <div
                            key={card.label}
                            className="solid-card p-4 sm:p-5 hover:scale-[1.01] transition-transform flex items-center gap-4"
                        >
                            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', card.iconBg)}>
                                <card.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                                    {card.label}
                                </p>
                                <p className={cn('text-2xl font-black tracking-tight tabular-nums', card.color)}>
                                    {card.value}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Filtros */}
            <div className="solid-card p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Filtros</span>
                </div>

                <div className="space-y-3 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-3">
                    {/* Search - Full width on mobile */}
                    <div className="relative w-full md:flex-1 md:min-w-[220px] md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar por nome, email ou WhatsApp..."
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            className="pl-9 h-9 text-sm w-full"
                        />
                        {search && (
                            <button
                                onClick={() => handleSearch('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="w-full h-px bg-border md:hidden" />

                    {/* Date inputs - Wrapper for responsive layout */}
                    <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={e => handleStartDate(e.target.value)}
                            className="h-9 text-xs flex-1 md:flex-none md:w-[140px]"
                            aria-label="Data inicial"
                        />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={e => handleEndDate(e.target.value)}
                            className="h-9 text-xs flex-1 md:flex-none md:w-[140px]"
                            aria-label="Data final"
                        />
                    </div>
                    {/* Select status */}
                    <select
                        value={statusFilter}
                        onChange={e => handleStatusFilter(e.target.value)}
                        className="h-9 w-full md:w-auto md:min-w-[160px] rounded-md border border-input bg-background px-3 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        aria-label="Filtrar por status"
                    >
                        <option value="">Todos os status</option>
                        {Object.entries(statusRecollection).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>

                    {/* Buttons */}
                    <div className="w-full h-px bg-border md:hidden" />
                    <div className="hidden md:block md:flex-1" />

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <Button
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white gap-1.5 h-9 text-xs w-full md:w-auto"
                        >
                            <RefreshCcw className={cn('w-3.5 h-3.5', isFetching && 'animate-spin')} />
                            {isFetching ? 'Atualizando...' : 'Atualizar'}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={clearFilters}
                            className="h-9 text-xs w-full md:w-auto"
                            disabled={!search && isDefaultPeriod && !statusFilter}
                        >
                            <X className="w-3.5 h-3.5" />
                            Limpar filtros
                        </Button>
                    </div>
                </div>
            </div>

            {/* Tabela */}
            <div className="border border-border rounded-lg overflow-hidden animate-fade-in">
                {/* Header Info */}
                <div className="px-5 py-4 border-b border-border bg-secondary/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold">Clientes em Atendimento</h2>
                      
                    </div>
                    <div className="flex items-center gap-3">
                       
                        {showingFrom > 0 && !isLoading && (
                            <span className="text-xs text-muted-foreground">
                                Exibindo {showingFrom}–{showingTo}
                            </span>
                        )}
                    </div>
                </div>

                {/* Desktop - Tabela */}
                <div className="hidden md:block">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border hover:bg-transparent bg-secondary/80 dark:bg-secondary/90 backdrop-blur-sm">
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground w-[8%] px-3">ID</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground px-3">Cliente</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground w-[18%] px-3">WhatsApp</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[18%] px-3">Status</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[15%] px-3">Início</TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[12%] px-3">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] overflow-x-auto">
                        <Table>
                            <TableBody className={cn('transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, idx) => <SkeletonRow key={idx} />)
                                ) : filteredList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-16">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="w-8 h-8 text-muted-foreground/30" />
                                                <p className="text-muted-foreground text-sm">
                                                    {search ? 'Nenhum resultado para a pesquisa' : 'Nenhum atendimento encontrado'}
                                                </p>
                                                {search && (
                                                    <button
                                                        onClick={() => handleSearch('')}
                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                                                    >
                                                        Limpar pesquisa
                                                    </button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredList.map(r => <PersonalRow key={r.id} reengagement={r} statusRecollection={statusRecollection} />)
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Mobile - Cards */}
                <div className="md:hidden">
                    <div className="max-h-[600px] overflow-y-auto p-4 space-y-3">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <div key={idx} className="solid-card p-4 space-y-3 border border-border/50">
                                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                        <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                                    </div>
                                </div>
                            ))
                        ) : filteredList.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="flex flex-col items-center gap-2">
                                    <Users className="w-8 h-8 text-muted-foreground/30" />
                                    <p className="text-muted-foreground text-sm">
                                        {search ? 'Nenhum resultado para a pesquisa' : 'Nenhum atendimento encontrado'}
                                    </p>
                                    {search && (
                                        <button
                                            onClick={() => handleSearch('')}
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                                        >
                                            Limpar pesquisa
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className={cn('space-y-3 transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                                {filteredList.map(r => (
                                    <PersonalCard key={r.id} reengagement={r} statusRecollection={statusRecollection} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Paginação */}
                {(prevPageUrl || nextPageUrl) && !isLoading && (
                    <Pagination
                        page={currentPage}
                        hasPrev={!!prevPageUrl}
                        hasNext={!!nextPageUrl}
                        onPrev={handlePrevPage}
                        onNext={handleNextPage}
                        isFetching={isFetching}
                    />
                )}
            </div>
        </div>

    );
}
