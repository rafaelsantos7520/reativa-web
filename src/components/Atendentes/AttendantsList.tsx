import { Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { type ManagerAttendant } from '@/services/team.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getInitials } from '@/lib/client-utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const typeColors: Record<number, string> = {
    1: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
    2: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    3: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
};


interface AttendantsListProps {
    attendants: ManagerAttendant[];
    total?: number;
    isLoading: boolean;
    isFetching: boolean;
}

export function AttendantsList({ attendants, total, isLoading, isFetching }: AttendantsListProps) {
    return (
        <div className="solid-card overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold">Atendentes</h2>
                        <p className="text-xs text-muted-foreground">Lista completa de todos os atendentes</p>
                    </div>
                    {!isLoading && (
                        <Badge
                            variant="outline"
                            className="ml-2 text-[10px] bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                        >
                            {total ?? attendants.length}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Tabela */}
            <div className={cn('overflow-x-auto transition-opacity duration-200', isFetching && !isLoading && 'opacity-50')}>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Atendente</TableHead>
                            <TableHead>Cargo</TableHead>
                            <TableHead>Graduação</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <TableRow key={i} className="hover:bg-muted/40">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-3.5 w-32" />
                                                <Skeleton className="h-2.5 w-20" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-20 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-3.5 w-14" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-3.5 w-8 ml-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-3.5 w-8 ml-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-3.5 w-10 ml-auto" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-3.5 w-20 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : attendants.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={7} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-3 rounded-full bg-muted/50">
                                            <Users className="w-6 h-6 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-muted-foreground text-sm font-medium">Nenhum atendente encontrado</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            attendants.map(attendant => {
                            

                                return (
                                    <TableRow key={attendant.id} className="hover:bg-muted/40 transition-colors">
                                        {/* Atendente */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                               <Avatar >
                                                    <AvatarImage src={attendant.user.personal_data?.avatar} />
                                                    <AvatarFallback>{getInitials(attendant.user?.name)}</AvatarFallback>
                                               </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-sm truncate">{attendant.user?.name}</p>
                                                    <p className="text-md text-muted-foreground truncate">@{attendant.user?.login}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Tipo */}
                                        <TableCell>
                                            <Badge variant="outline" className={cn('text-[10px] px-2 h-5', typeColors[attendant.type])}>
                                                {attendant.type_label}
                                            </Badge>
                                        </TableCell>

                                        {/* Graduação */}
                                        <TableCell className="text-sm text-muted-foreground">
                                            {attendant.graduation_label}
                                        </TableCell>

                                        {/* Ações */}
                                        <TableCell className="text-right font-medium tabular-nums">
                                            <div className="text-xs text-muted-foreground">-</div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );


}
