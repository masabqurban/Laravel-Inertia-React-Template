export type Role = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'invited' | 'suspended';

export type Option<T extends string> = { value: T; label: string };

/** Mirrors App\Http\Resources\UserResource. */
export type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: Role;
    status: UserStatus;
    created_at: string | null;
    last_active_at: string | null;
    can: { update: boolean; delete: boolean; change_access: boolean };
};

/** A Laravel paginator wrapped in an API resource collection. */
export type Paginated<T> = {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        per_page: number;
        total: number;
    };
};

export type UserFilters = {
    q?: string;
    role?: Role;
    status?: UserStatus;
};
