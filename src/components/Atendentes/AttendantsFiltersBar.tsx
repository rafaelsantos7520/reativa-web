import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type AttendantsFilters, type AttendantsResponse } from '@/services/team.service';

interface AttendantsFiltersProps {
    filters: AttendantsFilters;
    meta?: AttendantsResponse;
    onChange: (filters: AttendantsFilters) => void;
}

export function AttendantsFiltersBar({ filters, meta, onChange }: AttendantsFiltersProps) {
    const types = meta?.types ?? {};
    const countries = meta?.countries ?? [];

    const hasActiveFilters = filters.search || filters.type || filters.country_code;

    function clearFilters() {
        onChange({ search: undefined, type: undefined, country_code: undefined });
    }

    return (
        <div className="solid-card p-4 space-y-4 animate-fade-in">
            {/* Busca */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    value={filters.search ?? ''}
                    onChange={e => onChange({ ...filters, search: e.target.value || undefined })}
                    placeholder="Buscar por nome, login ou email..."
                    className="pl-9 h-9"
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* Filtro por tipo */}
                {Object.keys(types).length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {Object.entries(types).map(([key, label]) => (
                            <Badge
                                key={key}
                                onClick={() =>
                                    onChange({
                                        ...filters,
                                        type: filters.type === Number(key) ? undefined : Number(key),
                                    })
                                }
                                variant={filters.type === Number(key) ? 'default' : 'outline'}
                                className={cn(
                                    'cursor-pointer transition-colors',
                                    filters.type === Number(key) && 'bg-blue-600 hover:bg-blue-700',
                                )}
                            >
                                {label}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Filtro por país */}
                {countries.length > 0 && (
                    <select
                        value={filters.country_code ?? ''}
                        onChange={e => onChange({ ...filters, country_code: e.target.value || undefined })}
                        className="h-9 text-sm rounded-md border border-input bg-background px-3 py-1 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Todos os países</option>
                        {countries.map(c => (
                            <option key={c.code} value={c.code}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                )}

                {/* Limpar filtros */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-3.5 h-3.5" />
                        Limpar
                    </Button>
                )}
            </div>
        </div>
    );
}
