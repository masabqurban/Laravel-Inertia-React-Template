import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Role, UserStatus } from '@/types';

const statusStyles: Record<UserStatus, string> = {
    active: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    invited:
        'border-transparent bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
    suspended:
        'border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
    return (
        <Badge
            variant="outline"
            className={cn('gap-1.5 capitalize', statusStyles[status])}
        >
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            {status}
        </Badge>
    );
}

export function UserRoleBadge({ role }: { role: Role }) {
    return (
        <Badge
            variant={role === 'admin' ? 'default' : 'secondary'}
            className="capitalize"
        >
            {role}
        </Badge>
    );
}
