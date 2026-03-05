import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableRow, TableCell } from '@/components/ui/table';
import { Eye, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor, formatWhatsApp, getWhatsAppLink, formatDate } from '@/lib/client-utils';
import { statusStyleMap } from '@/lib/status-style-map';
import type { PersonalReengagement } from '@/services/customer.service';

interface PersonalRowProps {
    reengagement: PersonalReengagement;
    statusRecollection: Record<string, string>;
}

export function PersonalRow({ reengagement, statusRecollection }: PersonalRowProps) {
    const navigate = useNavigate();
    const user = reengagement.user;
    const initials = getInitials(user.name);
    const colorClass = getAvatarColor(user.name);
    const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
    const statusLabel = statusRecollection[String(reengagement.status)] || 'Desconhecido';

    return (
        <TableRow className="border-border hover:bg-muted/50 transition-colors">
            <TableCell className="py-3 w-[8%] px-3">
                <span className="text-xs text-muted-foreground font-mono">#{user.id}</span>
            </TableCell>
            <TableCell className="py-3 px-3">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        'w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
                        colorClass
                    )}>
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.login}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-3 px-3 w-[18%]">
                {user.phone_number ? (
                    <a
                        href={getWhatsAppLink(user.phone_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors group/wa min-w-0"
                    >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs truncate">{formatWhatsApp(user.phone_number)}</span>
                    </a>
                ) : (
                    <span className="text-sm text-muted-foreground">--</span>
                )}
            </TableCell>
            <TableCell className="py-3 text-center w-[18%] px-3">
                <Badge className={cn(' border gap-1 whitespace-nowrap justify-center w-full', statusStyle.color)}>
                    <div className={cn('w-1 h-1 rounded-full shrink-0', statusStyle.dotColor)} />
                    <span className="truncate">{statusLabel}</span>
                </Badge>
            </TableCell>
            <TableCell className="py-3 text-center w-[15%] px-3">
                <span className="text-xs text-muted-foreground tabular-nums">
                    {formatDate(reengagement.created_at)}
                </span>
            </TableCell>
            <TableCell className="py-3 text-center w-[12%] px-3">
                <Button
                    size="sm"
                    onClick={() => navigate(`/clientes/${user.id}`)}
                    className="h-7 text-xs px-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white whitespace-nowrap"
                >
                    <Eye className="w-3 h-3" />
                    Ver
                </Button>
            </TableCell>
        </TableRow>
    );
}
