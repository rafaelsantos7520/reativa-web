import api from './api';

export interface TeamMemberPerformance {
    id: number;
    user_id: number;
    type: number;
    graduation: number;
    parent_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    revenue: number | null;
    sales: number;
    total_reengagements: number;
    conversion: number;
    xp: number;
    level: string;
    type_label: string;
    graduation_label: string;
    user: {
        id: number;
        name: string;
        login: string;
    };
}

export interface ManagerAttendant {
    id: number;
    user_id: number;
    type: number;
    graduation: number;
    parent_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    revenue: string | number | null;
    sales: number;
    total_reengagements: number;
    conversion: number;
    xp: number;
    level: string;
    type_label: string;
    graduation_label: string;
    user: {
        id: number;
        name: string;
        login: string;
        personal_data: {
            avatar: string;
            id: string;
            user_id: string;
        };
    };
  
}

export interface ManagerSupervisor {
    id: number;
    user_id: number;
    type: number;
    graduation: number;
    parent_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    revenue: number | null;
    sales: number;
    total_reengagements: number;
    conversion: number;
    xp: number;
    level: string;
    type_label: string;
    graduation_label: string;
    user: {
        id: number;
        name: string;
        login: string;
    };
    attendants: ManagerAttendant[];
}

export interface ManagerPerformanceResponse {
    summary: {
        total_revenue: number;
        total_sales: number;
        total_reengagements: number;
        total_conversion: number;
    };
    supervisors: ManagerSupervisor[];
}

export interface AttendantsFilters {
    search?: string;
    type?: number;
    country_code?: string;
    page?: number;
}

export interface AttendantsPaginationLinks {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
}

export interface AttendantsResponse {
    attendants: {
        data: ManagerAttendant[];
        links: AttendantsPaginationLinks;
        meta?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    types: Record<string, string>;
    administrators: ManagerAttendant[];
    graduates: Record<string, string>;
    countries: { code: string; name: string }[];
}

export const teamService = {
    /** Desempenho da equipe do supervisor logado */
    getSupervisorPerformance: async (): Promise<TeamMemberPerformance[]> => {
        const response = await api.get<TeamMemberPerformance[]>('/api/supervisor/performance');
        console.log('Supervisor Performance Response:', response);
        return response.data;
    },

    /** Desempenho completo da equipe do gestor logado */
    getManagerPerformance: async (): Promise<ManagerPerformanceResponse> => {
        const response = await api.get<ManagerPerformanceResponse>('/api/manager/performance');
        return response.data;
    },

    /** Cria um novo atendente */

    /** Lista atendentes com filtros e paginação */
    getAttendants: async (filters?: AttendantsFilters): Promise<AttendantsResponse> => {
        const response = await api.get<{ success: boolean; data: AttendantsResponse }>('/api/attendants', {
            params: filters,
        });
        return response.data.data;
    },

    /** Cria um novo atendente */
    createAttendant: async (data: { name: string; login: string; password: string }) => {
        const response = await api.post('/api/attendants/create', data);
        return response.data;
    }
};
