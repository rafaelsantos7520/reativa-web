import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    MessageCircle,
    ExternalLink,
    Package,
    Loader2,
    Tag,
    User,
    Clock,
    ShoppingBag,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    customerService,
    type UserDetail,
    type CustomerReengagement,
    type PersonalOrder,
} from '@/services/customer.service';

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

function formatDateTime(dateStr: string | null): string {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatCurrency(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

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

const orderStatusMap: Record<number, { label: string; color: string; icon: typeof CheckCircle2 }> = {
    1: { label: 'Pendente', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20', icon: Clock },
    2: { label: 'Pago', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', icon: CheckCircle2 },
    3: { label: 'Cancelado', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20', icon: XCircle },
};

const deliveryStatusMap: Record<number, { label: string; color: string }> = {
    1: { label: 'Aguardando', color: 'text-amber-600 dark:text-amber-400' },
    2: { label: 'Em preparação', color: 'text-blue-600 dark:text-blue-400' },
    3: { label: 'Enviado', color: 'text-violet-600 dark:text-violet-400' },
    4: { label: 'Entregue', color: 'text-emerald-600 dark:text-emerald-400' },
};

const reengagementStatusMap: Record<number, { label: string; color: string }> = {
    1: { label: 'Em Atendimento', color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20' },
    2: { label: 'Reativado', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' },
};

export default function ClienteDetalhes() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<UserDetail | null>(null);
    const [reengagement, setReengagement] = useState<CustomerReengagement | null>(null);
    const [statusMap, setStatusMap] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await customerService.getUserDetail(Number(id));
                if (response.success) {
                    setUser(response.data.user);
                    setReengagement(response.data.customerReengagement);
                    setStatusMap(response.data.statusReengagements);
                }
            } catch (err: unknown) {
                console.error('Erro ao carregar detalhes:', err);
                setError('Erro ao carregar os detalhes do cliente.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                    <p className="text-sm text-muted-foreground">Carregando detalhes do cliente...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                    <p className="text-sm text-muted-foreground">{error || 'Cliente não encontrado.'}</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/clientes')}
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                </div>
            </div>
        );
    }

    const whatsapp = user.personal_data?.whatsapp || user.phone_number;
    const initials = getInitials(user.name);
    const avatarColor = getAvatarColor(user.name);
    const order = user.personal_orders;
    const address = user.personal_address;
    const reengStatus = reengagement ? reengagementStatusMap[reengagement.status] : null;

    return (
        <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 animate-fade-in">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 rounded-xl shrink-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-xl font-extrabold tracking-tight">Detalhes do Cliente</h1>
                    <p className="text-xs text-muted-foreground">#{user.id} - {user.login}</p>
                </div>
                {reengStatus && (
                    <Badge className={cn('text-xs border', reengStatus.color)}>
                        {reengStatus.label}
                    </Badge>
                )}
            </div>

            {/* Card principal */}
            <div className="solid-card p-5 sm:p-6 animate-fade-in" style={{ animationDelay: '60ms', opacity: 0 }}>
                <div className="flex items-start gap-4 sm:gap-5">
                    {/* Avatar */}
                    {user.personal_data?.avatar ? (
                        <img
                            src={user.personal_data.avatar}
                            alt={user.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shrink-0"
                        />
                    ) : (
                        <div
                            className={cn(
                                'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0',
                                avatarColor
                            )}
                        >
                            {initials}
                        </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-3">
                        <div>
                            <h2 className="text-lg font-bold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground">{user.classification}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <InfoItem icon={Mail} iconBg="bg-violet-500" label={user.email} />
                            <InfoItem
                                icon={MessageCircle}
                                iconBg="bg-emerald-500"
                                label={
                                    <a
                                        href={getWhatsAppLink(whatsapp)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 inline-flex items-center gap-1.5"
                                    >
                                        {formatWhatsApp(whatsapp)}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                }
                            />
                            <InfoItem icon={Phone} iconBg="bg-blue-500" label={formatWhatsApp(user.phone_number)} />
                            <InfoItem icon={Calendar} iconBg="bg-amber-500" label={`Cadastro: ${formatDate(user.created_at)}`} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Endereço */}
                <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '120ms', opacity: 0 }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold">Endereço</h3>
                    </div>
                    {address ? (
                        <div className="space-y-1.5 text-sm text-muted-foreground">
                            <p>{address.address_line}, {address.number}</p>
                            {address.complement && <p>{address.complement}</p>}
                            <p>{address.district}</p>
                            <p>{address.city?.name} - {address.state?.uf}</p>
                            <p>CEP: {address.zip_code}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground/60">Sem endereço cadastrado</p>
                    )}
                </div>

                {/* Info do Atendimento */}
                <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '180ms', opacity: 0 }}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold">Atendimento</h3>
                    </div>
                    {reengagement ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Status</span>
                                <Badge className={cn('text-xs border', reengStatus?.color)}>
                                    {reengStatus?.label || statusMap[String(reengagement.status)] || 'Desconhecido'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Iniciado em</span>
                                <span className="text-sm font-medium">{formatDateTime(reengagement.created_at)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">ID Atendimento</span>
                                <span className="text-sm font-mono text-muted-foreground">#{reengagement.id}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground/60">Sem dados de atendimento</p>
                    )}
                </div>
            </div>

            {/* Ultimo Pedido */}
            {order && <OrderCard order={order} />}

            {/* Ações rápidas */}
            <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '300ms', opacity: 0 }}>
                <h3 className="text-sm font-semibold mb-4">Ações rápidas</h3>
                <div className="flex flex-wrap gap-3">
                    <a
                        href={getWhatsAppLink(whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <MessageCircle className="w-4 h-4" />
                            Enviar WhatsApp
                        </Button>
                    </a>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => navigate('/meus-atendimentos')}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Meus Atendimentos
                    </Button>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon: Icon, iconBg, label }: { icon: typeof Mail; iconBg: string; label: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2.5 text-sm">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', iconBg)}>
                <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="truncate text-muted-foreground">{label}</span>
        </div>
    );
}

function OrderCard({ order }: { order: PersonalOrder }) {
    const status = orderStatusMap[order.status] || orderStatusMap[1];
    const deliveryStatus = deliveryStatusMap[order.delivery_status];
    const StatusIcon = status.icon;

    return (
        <div className="solid-card p-5 animate-fade-in" style={{ animationDelay: '240ms', opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold">Pedido #{order.code}</h3>
                </div>
                <Badge className={cn('text-xs border gap-1.5', status.color)}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Valor</p>
                    <p className="text-lg font-black text-teal-600 dark:text-teal-400">{formatCurrency(order.value)}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Pontos</p>
                    <p className="text-lg font-black text-violet-600 dark:text-violet-400">{parseFloat(order.points).toFixed(0)}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Data</p>
                    <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Entrega</p>
                    <p className={cn('text-sm font-medium', deliveryStatus?.color || 'text-muted-foreground')}>
                        {deliveryStatus?.label || '--'}
                    </p>
                </div>
            </div>

            {/* Itens do pedido */}
            {order.personal_order_items && order.personal_order_items.length > 0 && (
                <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                        Itens do pedido
                    </p>
                    <div className="space-y-2">
                        {order.personal_order_items.map(item => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
                                        <Tag className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {item.internationalization?.product_name || `Produto #${item.product_id}`}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {item.amount}x {formatCurrency(item.unit_value)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-3">
                                    <p className="text-sm font-semibold">
                                        {formatCurrency(parseFloat(item.unit_value) * item.amount)}
                                    </p>
                                    <p className="text-[10px] text-violet-600 dark:text-violet-400">{parseFloat(item.points).toFixed(0)} pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
