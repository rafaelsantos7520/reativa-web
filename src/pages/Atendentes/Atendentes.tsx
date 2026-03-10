import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserCog, RefreshCcw } from 'lucide-react';
import { teamService, type AttendantsFilters } from '@/services/team.service';
import { AttendantsList } from '@/components/Atendentes/AttendantsList';
import { AttendantsFiltersBar } from '@/components/Atendentes/AttendantsFiltersBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

export default function Atendentes() {
    const [filters, setFilters] = useState<AttendantsFilters>({});
    const debouncedSearch = useDebounce(filters.search ?? '', 400);

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['attendants', debouncedSearch, filters.type, filters.country_code],
        queryFn: () =>
            teamService.getAttendants({
                search: debouncedSearch || undefined,
                type: filters.type,
                country_code: filters.country_code,
            }),
        refetchInterval: 5 * 60 * 1000,
    });

    const attendants = data?.attendants?.data ?? [];
    const total = data?.attendants?.meta?.total;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 py-8 sm:p-6">
            <div className="space-y-5 max-w-7xl mx-auto">
                {/* Header */}
                <div className="animate-fade-in">
                    <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                                    <UserCog className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h1 className="text-3xl font-extrabold tracking-tight">Atendentes</h1>
                            </div>
                            <p className="text-muted-foreground text-base">
                                Gerencie e visualize todos os atendentes da plataforma
                            </p>
                        </div>
                        <Button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            size="lg"
                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <RefreshCcw className={cn('w-4 h-4', isFetching && 'animate-spin')} />
                            {isFetching ? 'Atualizando...' : 'Atualizar'}
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <AttendantsFiltersBar
                    filters={filters}
                    meta={data}
                    onChange={setFilters}
                />

                {/* Lista */}
                <AttendantsList
                    attendants={attendants}
                    total={total}
                    isLoading={isLoading}
                    isFetching={isFetching}
                />
            </div>
        </div>
    );
}
