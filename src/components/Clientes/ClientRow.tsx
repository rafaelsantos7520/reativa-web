import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor } from '@/lib/client-utils';
import type { ReengagementUser } from '@/services/customer.service';

export function ClientRow({ client }: { client: ReengagementUser }) {
    const navigate = useNavigate();
    const initials = getInitials(client.name);
    const colorClass = getAvatarColor(client.name);

    return (
        <TableRow className="border-border hover:bg-muted/50 transition-colors">
            <TableCell className="py-3 w-[15%] px-4">
                <span className="text-xs text-muted-foreground font-mono">#{client.id}</span>
            </TableCell>
            <TableCell className="py-3 px-4">
                <div className="flex items-center gap-3">
                    {client.personal_data?.avatar ? (
                        <img
                            src={client.personal_data.avatar}
                            alt={client.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                    ) : (
                        <div className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
                            colorClass
                        )}>
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{client.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{client.login}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-3 text-center w-[12%] px-4">
                <span className="text-sm font-medium">{client.total_orders}</span>
            </TableCell>
            <TableCell className="py-3 text-center w-[12%] px-4">
                <span className={cn(
                    'text-sm font-medium',
                    client.paid_orders > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                )}>
                    {client.paid_orders}
                </span>
            </TableCell>
            <TableCell className="py-3 text-right w-[20%] px-4">
                <Button
                    size="sm"
                    onClick={() => navigate(`/clientes/${client.id}`)}
                    className="h-7 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
                >
                    <MessageCircle className="w-3 h-3" />
                    Iniciar atendimento
                </Button>
            </TableCell>
        </TableRow>
    );
}
