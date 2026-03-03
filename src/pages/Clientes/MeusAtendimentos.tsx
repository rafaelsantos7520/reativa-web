import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Headphones,
    RefreshCcw,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    ExternalLink,
    Eye,
    Loader2,
    Target,
    Zap,
    Users,
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
    type PersonalReengagement,
} from '@/services/customer.service';

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

function formatWhatsApp(phone: string | null | undefined): string {
    if (!phone) return '--';
    const digits = phone.replace(/\D/g, '');
    const national = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;
    if (national.length === 11) {
        return `(${national.slice(0, 2)}) ${national.slice(2, 7)}-${national.slice(7)}`;
    }
    if (national.length === 10) {
        return `(${national.slice(0, 2)}) ${national.slice(2, 6)}-${national.slice(6)}`;
    }
    return phone;
}

function getWhatsAppLink(phone: string | null | undefined): string {
    if (!phone) return '#';
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('55')) return `https://wa.me/${digits}`;
    return `https://wa.me/55${digits}`;
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

const statusMap: Record<number, { label: string; color: string; dotColor: string }> = {
    1: {
        label: 'Em Atendimento',
        color: 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20',
        dotColor: 'bg-teal-500',
    },
    2: {
        label: 'Reativado',
        color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
        dotColor: 'bg-emerald-500',
    },
};

export default function MeusAtendimentos() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const [reengagements, setReengagements] = useState<PersonalReengagement[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
    const [totalShowing, setTotalShowing] = useState({ from: 0, to: 0 });

    const [totalAttendances, setTotalAttendances] = useState(0);
    const [totalReactivated, setTotalReactivated] = useState(0);
    const [conversionRate, setConversionRate] = useState(0);
    const [commissionsReceived, setCommissionsReceived] = useState(0);

    const fetchData = useCallback(async (page: number = 1) => {
        setLoading(true);
        try {
            const response = await customerService.getPersonalReengagements(page);
            if (response.success) {
                const d = response.data;
                setReengagements(d.customerReengagement.data);
                setCurrentPage(d.customerReengagement.current_page);
                setNextPageUrl(d.customerReengagement.next_page_url);
                setPrevPageUrl(d.customerReengagement.prev_page_url);
                setTotalShowing({
                    from: d.customerReengagement.from || 0,
                    to: d.customerReengagement.to || 0,
                });
                setTotalAttendances(d.totalAttendances);
                setTotalReactivated(d.totalReactivated);
                setConversionRate(d.conversionRate);
                setCommissionsReceived(d.commissionsReceived);
            }
        } catch (error) {
            console.error('Erro ao carregar atendimentos:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(1);
    }, [fetchData]);

    const filteredList = useMemo(() => {
        if (!search) return reengagements;
        const q = search.toLowerCase();
        return reengagements.filter(r =>
            r.user.name.toLowerCase().includes(q) ||
            r.user.email.toLowerCase().includes(q) ||
            r.user.login.toLowerCase().includes(q) ||
            (r.user.phone_number || '').includes(q)
        );
    }, [reengagements, search]);

    const handleNextPage = () => {
        if (nextPageUrl) fetchData(currentPage + 1);
    };
    const handlePrevPage = () => {
        if (prevPageUrl) fetchData(currentPage - 1);
    };

    const statsCards = [
        {
            label: 'Meus Atendimentos',
            value: totalAttendances,
            icon: Headphones,
            color: 'text-teal-500 dark:text-teal-400',
            iconBg: 'bg-teal-500',
        },
        {
            label: 'Reativados',
            value: totalReactivated,
            icon: RefreshCcw,
            color: 'text-emerald-500 dark:text-emerald-400',
            iconBg: 'bg-emerald-500',
        },
        {
            label: 'Taxa de Conversão',
            value: `${conversionRate}%`,
            icon: TrendingUp,
            color: 'text-amber-500 dark:text-amber-400',
            iconBg: 'bg-amber-500',
        },
        {
            label: 'Comissões',
            value: commissionsReceived,
            icon: Zap,
            color: 'text-violet-500 dark:text-violet-400',
            iconBg: 'bg-violet-500',
        },
    ];

    return (
        <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <div>
                    <h1 className="text-2xl font-extrabold tracking-tight">
                        Meus Atendimentos
                    </h1>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Clientes que estou atendendo neste mês
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/clientes')}
                    className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white gap-2"
                >
                    <Target className="w-4 h-4" />
                    Lista Geral
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

            {/* Search + refresh */}
            <div
                className="solid-card p-4 animate-fade-in"
                style={{ animationDelay: '200ms', opacity: 0 }}
            >
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[180px] max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Pesquisar por nome, email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 h-9 text-sm"
                        />
                    </div>
                    <div className="flex-1" />
                    <Button
                        size="sm"
                        onClick={() => fetchData(currentPage)}
                        className="bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white gap-1.5 h-9 text-xs"
                    >
                        <RefreshCcw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
                        Atualizar
                    </Button>
                </div>
            </div>

            {/* Tabela */}
            <div
                className="solid-card overflow-hidden animate-fade-in"
                style={{ animationDelay: '280ms', opacity: 0 }}
            >
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold">Clientes em Atendimento</h2>
                        <Badge variant="outline" className="text-[10px] bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-500/20">
                            {filteredList.length}
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
                        <span className="ml-3 text-sm text-muted-foreground">Carregando...</span>
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
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                                    WhatsApp
                                </TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[120px]">
                                    Status
                                </TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-center w-[110px]">
                                    Início
                                </TableHead>
                                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground text-right w-[110px]">
                                    Ações
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredList.map(r => (
                                <PersonalRow key={r.id} reengagement={r} />
                            ))}
                            {filteredList.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <p className="text-muted-foreground text-sm">
                                            Nenhum atendimento encontrado
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

function PersonalRow({ reengagement }: { reengagement: PersonalReengagement }) {
    const navigate = useNavigate();
    const user = reengagement.user;
    const initials = getInitials(user.name);
    const colorClass = getAvatarColor(user.name);
    const status = statusMap[reengagement.status] || statusMap[1];

    return (
        <TableRow className="border-border hover:bg-muted/50 transition-colors group">
            <TableCell className="py-3">
                <span className="text-xs text-muted-foreground font-mono">#{user.id}</span>
            </TableCell>

            <TableCell className="py-3">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
                            colorClass
                        )}
                    >
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                </div>
            </TableCell>

            <TableCell className="py-3">
                {user.phone_number ? (
                    <a
                        href={getWhatsAppLink(user.phone_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors group/whatsapp"
                    >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-sm">{formatWhatsApp(user.phone_number)}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover/whatsapp:opacity-100 transition-opacity" />
                    </a>
                ) : (
                    <span className="text-sm text-muted-foreground">--</span>
                )}
            </TableCell>

            <TableCell className="py-3 text-center">
                <Badge className={cn('text-[10px] border gap-1.5', status.color)}>
                    <div className={cn('w-1.5 h-1.5 rounded-full', status.dotColor)} />
                    {status.label}
                </Badge>
            </TableCell>

            <TableCell className="py-3 text-center">
                <span className="text-xs text-muted-foreground">{formatDate(reengagement.created_at)}</span>
            </TableCell>

            <TableCell className="py-3 text-right">
                <Button
                    size="sm"
                    onClick={() => navigate(`/clientes/${user.id}`)}
                    className="h-7 text-xs gap-1.5 bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-500 text-white"
                >
                    <Eye className="w-3 h-3" />
                    Ver
                </Button>
            </TableCell>
        </TableRow>
    );
}
