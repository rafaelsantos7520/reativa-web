// ============================================================
// MOCK DATA — Dados simulados para o sistema Reativa
// ============================================================

export type UserRole = 'gerente' | 'supervisor' | 'atendente';

export interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    supervisorId?: number;
    managerId?: number;
    salesCount: number;
    salesValue: number;
    activeClients: number;
    conversionRate: number;
    phone: string;
    // gamification
    xp: number;
    level: number;
    streak: number;      // dias consecutivos vendendo
    rankDelta: number;   // +N subiu, -N caiu vs mês anterior
}

export interface InactiveClient {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: 'nunca_comprou' | 'inativo_90';
    lastPurchase: string | null;
    totalSpent: number;
    assignedTo: number | null;
    city: string;
    state: string;
}

export interface SaleNotification {
    id: number;
    sellerId: number;
    sellerName: string;
    clientName: string;
    value: number;
    product: string;
    time: string;
    type: 'venda' | 'reativacao' | 'primeiro_pedido';
}

// ----------------------------
// Equipe
// ----------------------------
export const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: 'Carlos Eduardo',
        email: 'carlos@reativa.com',
        role: 'gerente',
        avatar: 'CE',
        salesCount: 0,
        salesValue: 0,
        activeClients: 0,
        conversionRate: 0,
        phone: '(11) 99999-0001',
        xp: 0, level: 0, streak: 0, rankDelta: 0,
    },
    {
        id: 2,
        name: 'Fernanda Lima',
        email: 'fernanda@reativa.com',
        role: 'supervisor',
        avatar: 'FL',
        managerId: 1,
        salesCount: 18,
        salesValue: 12400,
        activeClients: 42,
        conversionRate: 68,
        phone: '(11) 99999-0002',
        xp: 1800, level: 3, streak: 5, rankDelta: 0,
    },
    {
        id: 3,
        name: 'Ricardo Souza',
        email: 'ricardo@reativa.com',
        role: 'supervisor',
        avatar: 'RS',
        managerId: 1,
        salesCount: 14,
        salesValue: 9800,
        activeClients: 35,
        conversionRate: 61,
        phone: '(11) 99999-0003',
        xp: 1200, level: 2, streak: 3, rankDelta: 0,
    },
    {
        id: 4,
        name: 'Ana Paula',
        email: 'ana@reativa.com',
        role: 'atendente',
        avatar: 'AP',
        supervisorId: 2,
        managerId: 1,
        salesCount: 42,
        salesValue: 28600,
        activeClients: 18,
        conversionRate: 74,
        phone: '(11) 99999-0004',
        xp: 4200, level: 5, streak: 12, rankDelta: 2,
    },
    {
        id: 5,
        name: 'Lucas Martins',
        email: 'lucas@reativa.com',
        role: 'atendente',
        avatar: 'LM',
        supervisorId: 2,
        managerId: 1,
        salesCount: 38,
        salesValue: 24200,
        activeClients: 15,
        conversionRate: 69,
        phone: '(11) 99999-0005',
        xp: 3400, level: 4, streak: 8, rankDelta: 0,
    },
    {
        id: 6,
        name: 'Beatriz Alves',
        email: 'beatriz@reativa.com',
        role: 'atendente',
        avatar: 'BA',
        supervisorId: 2,
        managerId: 1,
        salesCount: 35,
        salesValue: 21800,
        activeClients: 20,
        conversionRate: 65,
        phone: '(11) 99999-0006',
        xp: 2800, level: 3, streak: 6, rankDelta: -1,
    },
    {
        id: 7,
        name: 'Thiago Costa',
        email: 'thiago@reativa.com',
        role: 'atendente',
        avatar: 'TC',
        supervisorId: 3,
        managerId: 1,
        salesCount: 31,
        salesValue: 18900,
        activeClients: 22,
        conversionRate: 58,
        phone: '(11) 99999-0007',
        xp: 2100, level: 3, streak: 4, rankDelta: 1,
    },
    {
        id: 8,
        name: 'Mariana Félix',
        email: 'mariana@reativa.com',
        role: 'atendente',
        avatar: 'MF',
        supervisorId: 3,
        managerId: 1,
        salesCount: 27,
        salesValue: 15400,
        activeClients: 17,
        conversionRate: 55,
        phone: '(11) 99999-0008',
        xp: 1600, level: 2, streak: 2, rankDelta: -1,
    },
    {
        id: 9,
        name: 'Diego Nunes',
        email: 'diego@reativa.com',
        role: 'atendente',
        avatar: 'DN',
        supervisorId: 3,
        managerId: 1,
        salesCount: 22,
        salesValue: 12100,
        activeClients: 13,
        conversionRate: 49,
        phone: '(11) 99999-0009',
        xp: 900, level: 1, streak: 1, rankDelta: -1,
    },
];

// ----------------------------
// Clientes Inativos
// ----------------------------
export const inactiveClients: InactiveClient[] = [
    { id: 101, name: 'José Ferreira', email: 'jose@gmail.com', phone: '(21) 98888-1001', status: 'inativo_90', lastPurchase: '2024-11-15', totalSpent: 1240, assignedTo: 4, city: 'Rio de Janeiro', state: 'RJ' },
    { id: 102, name: 'Maria Oliveira', email: 'maria.o@gmail.com', phone: '(11) 97777-2002', status: 'nunca_comprou', lastPurchase: null, totalSpent: 0, assignedTo: 5, city: 'São Paulo', state: 'SP' },
    { id: 103, name: 'Paulo Santana', email: 'paulo.s@hotmail.com', phone: '(31) 96666-3003', status: 'inativo_90', lastPurchase: '2024-10-03', totalSpent: 3680, assignedTo: null, city: 'Belo Horizonte', state: 'MG' },
    { id: 104, name: 'Cláudia Rocha', email: 'claudia.r@gmail.com', phone: '(41) 95555-4004', status: 'nunca_comprou', lastPurchase: null, totalSpent: 0, assignedTo: 6, city: 'Curitiba', state: 'PR' },
    { id: 105, name: 'Anderson Lima', email: 'anderson@outlook.com', phone: '(51) 94444-5005', status: 'inativo_90', lastPurchase: '2024-09-20', totalSpent: 890, assignedTo: null, city: 'Porto Alegre', state: 'RS' },
    { id: 106, name: 'Juliana Torres', email: 'ju.torres@gmail.com', phone: '(85) 93333-6006', status: 'nunca_comprou', lastPurchase: null, totalSpent: 0, assignedTo: 7, city: 'Fortaleza', state: 'CE' },
    { id: 107, name: 'Roberto Dias', email: 'roberto.d@gmail.com', phone: '(71) 92222-7007', status: 'inativo_90', lastPurchase: '2024-11-01', totalSpent: 4200, assignedTo: 4, city: 'Salvador', state: 'BA' },
    { id: 108, name: 'Camila Pires', email: 'camila.p@gmail.com', phone: '(61) 91111-8008', status: 'nunca_comprou', lastPurchase: null, totalSpent: 0, assignedTo: null, city: 'Brasília', state: 'DF' },
    { id: 109, name: 'Marcos Vieira', email: 'marcos.v@gmail.com', phone: '(92) 90000-9009', status: 'inativo_90', lastPurchase: '2024-08-14', totalSpent: 6750, assignedTo: 8, city: 'Manaus', state: 'AM' },
    { id: 110, name: 'Letícia Gomes', email: 'leticia.g@gmail.com', phone: '(11) 89999-0010', status: 'nunca_comprou', lastPurchase: null, totalSpent: 0, assignedTo: 5, city: 'Campinas', state: 'SP' },
    { id: 111, name: 'Fábio Monteiro', email: 'fabio.m@gmail.com', phone: '(21) 88888-1011', status: 'inativo_90', lastPurchase: '2024-10-22', totalSpent: 2100, assignedTo: null, city: 'Niterói', state: 'RJ' },
    { id: 112, name: 'Simone Castro', email: 'simone.c@gmail.com', phone: '(31) 87777-2012', status: 'nunca_comprou', lastPurchase: null, totalSpent: 0, assignedTo: 9, city: 'Contagem', state: 'MG' },
];

// ----------------------------
// Notificações de vendas
// ----------------------------
export const saleNotifications: SaleNotification[] = [
    { id: 1, sellerId: 4, sellerName: 'Ana Paula', clientName: 'Roberto Dias', value: 840, product: 'Plano Premium', time: '2 min atrás', type: 'reativacao' },
    { id: 2, sellerId: 5, sellerName: 'Lucas Martins', clientName: 'Novo Cliente — Reginaldo K.', value: 420, product: 'Plano Básico', time: '14 min atrás', type: 'primeiro_pedido' },
    { id: 3, sellerId: 4, sellerName: 'Ana Paula', clientName: 'Marcos Sena', value: 680, product: 'Plano Plus', time: '32 min atrás', type: 'venda' },
    { id: 4, sellerId: 6, sellerName: 'Beatriz Alves', clientName: 'Sandra Moura', value: 1200, product: 'Plano Anual', time: '1h atrás', type: 'reativacao' },
    { id: 5, sellerId: 7, sellerName: 'Thiago Costa', clientName: 'Felipe Braga', value: 390, product: 'Plano Básico', time: '1h 20min atrás', type: 'primeiro_pedido' },
    { id: 6, sellerId: 5, sellerName: 'Lucas Martins', clientName: 'Patricia Viana', value: 760, product: 'Plano Premium', time: '2h atrás', type: 'venda' },
    { id: 7, sellerId: 8, sellerName: 'Mariana Félix', clientName: 'Eduardo Fonseca', value: 540, product: 'Plano Plus', time: '3h atrás', type: 'venda' },
    { id: 8, sellerId: 9, sellerName: 'Diego Nunes', clientName: 'Rosana Pinheiro', value: 420, product: 'Plano Básico', time: '4h atrás', type: 'reativacao' },
    { id: 9, sellerId: 4, sellerName: 'Ana Paula', clientName: 'Gustavo Almeida', value: 980, product: 'Plano Anual', time: '5h atrás', type: 'primeiro_pedido' },
    { id: 10, sellerId: 6, sellerName: 'Beatriz Alves', clientName: 'Tatiane Ribeiro', value: 680, product: 'Plano Plus', time: 'ontem', type: 'venda' },
];

// ----------------------------
// Dashboard summary
// ----------------------------
export const dashboardStats = {
    totalInactive: inactiveClients.length,
    neverBought: inactiveClients.filter(c => c.status === 'nunca_comprou').length,
    inactive90: inactiveClients.filter(c => c.status === 'inativo_90').length,
    assigned: inactiveClients.filter(c => c.assignedTo !== null).length,
    totalSalesMonth: teamMembers.reduce((sum, m) => sum + m.salesValue, 0),
    totalSalesCount: teamMembers.reduce((sum, m) => sum + m.salesCount, 0),
    totalAttendants: teamMembers.filter(m => m.role === 'atendente').length,
    conversionRate: Math.round(teamMembers.filter(m => m.role === 'atendente').reduce((sum, m) => sum + m.conversionRate, 0) / teamMembers.filter(m => m.role === 'atendente').length),
};
