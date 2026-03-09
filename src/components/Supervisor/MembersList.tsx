import { Users, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type TeamMemberPerformance } from '@/services/team.service';
import { MemberCard, MemberCardSkeleton } from './MemberCard';

interface MembersListProps {
    members: TeamMemberPerformance[];
    isLoading: boolean;
    isFetching: boolean;
}

export function MembersList({ members, isLoading, isFetching }: MembersListProps) {
    return (
        <div className="solid-card overflow-hidden animate-fade-in">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold">Membros</h2>
                    {!isLoading && (
                        <Badge
                            variant="outline"
                            className="text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                        >
                            {members.length}
                        </Badge>
                    )}
                </div>
                {isFetching && !isLoading && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Atualizando...
                    </div>
                )}
            </div>

            <div className="p-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <MemberCardSkeleton key={i} />
                        ))}
                    </div>
                ) : members.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 text-muted-foreground/30" />
                        <p className="text-muted-foreground text-sm">Nenhum membro encontrado na sua equipe</p>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 transition-opacity duration-200',
                            isFetching && !isLoading && 'opacity-50',
                        )}
                    >
                        {members.map(member => (
                            <MemberCard key={member.id} member={member} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
