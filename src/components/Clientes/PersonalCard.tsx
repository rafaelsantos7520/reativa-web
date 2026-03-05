import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getInitials, getAvatarColor, formatWhatsApp, getWhatsAppLink, formatDate } from '@/lib/client-utils';
import { statusStyleMap } from '@/lib/status-style-map';
import type { PersonalReengagement } from '@/services/customer.service';

interface PersonalCardProps {
    reengagement: PersonalReengagement;
    statusRecollection: Record<string, string>;
}

export function PersonalCard({ reengagement, statusRecollection }: PersonalCardProps) {
    const navigate = useNavigate();
    const user = reengagement.user;
    const initials = getInitials(user.name);
    const colorClass = getAvatarColor(user.name);
    const statusStyle = statusStyleMap[reengagement.status] ?? statusStyleMap[1];
    const statusLabel = statusRecollection[String(reengagement.status)] || 'Desconhecido';

    return (
        <div className="solid-card p-4 space-y-3 border border-border/50">
            <div className="flex items-start gap-3">
                <div className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0',
                    colorClass
                )}>
                    {initials}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.login}</p>
                    <p className="text-xs text-muted-foreground mt-1">ID: #{user.id}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                {user.phone_number && (
                    <a
                        href={getWhatsAppLink(user.phone_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors text-xs"
                    >
                        <MessageCircle className="w-3 h-3 shrink-0" />
                        <span>{formatWhatsApp(user.phone_number)}</span>
                    </a>
                )}
                <div className="flex items-center justify-between gap-2">
                    <Badge className={cn('text-[10px] gap-1.5 whitespace-nowrap border', statusStyle.color)}>
                        <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusStyle.dotColor)} />
                        {statusLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {formatDate(reengagement.created_at)}
                    </span>
                </div>
            </div>

            <Button
                onClick={() => navigate(`/clientes/${user.id}`)}
                className="w-full h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
            >
                <Eye className="w-3 h-3" />
                Ver detalhes
            </Button>
        </div>
    );
}
