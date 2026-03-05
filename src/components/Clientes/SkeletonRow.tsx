import { TableRow, TableCell } from '@/components/ui/table';

export function SkeletonRow() {
    return (
        <TableRow className="border-border">
            <TableCell className="py-3">
                <div className="h-3.5 w-10 rounded bg-muted animate-pulse" />
            </TableCell>
            <TableCell className="py-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="space-y-1.5">
                        <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                        <div className="h-3 w-40 rounded bg-muted animate-pulse" />
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-3">
                <div className="h-3.5 w-32 rounded bg-muted animate-pulse" />
            </TableCell>
            <TableCell className="py-3 text-center">
                <div className="h-5 w-24 rounded-full bg-muted animate-pulse mx-auto" />
            </TableCell>
            <TableCell className="py-3 text-center">
                <div className="h-3.5 w-20 rounded bg-muted animate-pulse mx-auto" />
            </TableCell>
            <TableCell className="py-3 text-right">
                <div className="h-7 w-14 rounded-lg bg-muted animate-pulse ml-auto" />
            </TableCell>
        </TableRow>
    );
}
