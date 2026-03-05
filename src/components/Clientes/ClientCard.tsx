import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor } from '@/lib/client-utils';
import type { ReengagementUser } from '@/services/customer.service';

export function ClientCard({ client }: { client: ReengagementUser }) {
    const navigate = useNavigate();
    const initials = getInitials(client.name);
    const colorClass = getAvatarColor(client.name);

    return (
        <div className="solid-card p-4 space-y-3 border border-border/50">
            <div className="flex items-center gap-3">
                {client.personal_data?.avatar ? (
                    <img
                        src={client.personal_data.avatar}
                        alt={client.name}
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0',
                        colorClass
                    )}>
                        {initials}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{client.login}</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: #{client.id}</p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/50">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-0.5">Pedidos</span>
                    <span className="text-lg font-semibold">{client.total_orders}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-0.5">Pagos</span>
                    <span className={cn(
                        'text-lg font-semibold',
                        client.paid_orders > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                    )}>
                        {client.paid_orders}
                    </span>
                </div>
            </div>

            <Button
                onClick={() => navigate(`/clientes/${client.id}`)}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white gap-1.5"
            >
                <MessageCircle className="w-3.5 h-3.5" />
                Iniciar atendimento
            </Button>
        </div>
    );
}
