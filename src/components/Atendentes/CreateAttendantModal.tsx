import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { teamService, type Administrator } from '@/services/team.service';

interface CreateAttendantModalProps {
    open: boolean;
    onClose: () => void;
    administrators: Administrator[];
    types: Record<string, string>;
    graduates: Record<string, string>;
    onCreated?: () => void;
}

export function CreateAttendantModal({
    open,
    onClose,
    administrators,
    types,
    graduates,
    onCreated,
}: CreateAttendantModalProps) {
    const [userId, setUserId] = useState('');
    const [type, setType] = useState('');
    const [graduation, setGraduation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function resetForm() {
        setUserId('');
        setType('');
        setGraduation('');
        setError(null);
    }

    function handleClose() {
        if (!loading) {
            resetForm();
            onClose();
        }
    }

    async function handleSubmit() {
        if (!userId || !type || !graduation) {
            setError('Preencha todos os campos.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await teamService.createAttendant({
                user_id: Number(userId),
                type: Number(type),
                graduation: Number(graduation),
            });
            onCreated?.();
            resetForm();
            onClose();
        } catch {
            setError('Erro ao criar atendente. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Novo Atendente</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Administrador */}
                    <div className="space-y-1.5">
                        <Label>Administrador</Label>
                        <Select value={userId} onValueChange={setUserId} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um administrador" />
                            </SelectTrigger>
                            <SelectContent>
                                {administrators.map(admin => (
                                    <SelectItem key={admin.id} value={String(admin.id)}>
                                        {admin.name} — @{admin.login}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tipo / Cargo */}
                    <div className="space-y-1.5">
                        <Label>Cargo</Label>
                        <Select value={type} onValueChange={setType} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(types).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Graduação */}
                    <div className="space-y-1.5">
                        <Label>Graduação</Label>
                        <Select value={graduation} onValueChange={setGraduation} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a graduação" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(graduates).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <DialogFooter>
                    <Button variant="destructive" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Criando...' : 'Criar Atendente'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
