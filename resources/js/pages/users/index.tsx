import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserX,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { UserRoleBadge, UserStatusBadge } from '@/components/users/user-badges';
import { UserFormDialog } from '@/components/users/user-form-dialog';
import Heading from '@/components/heading';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useInitials } from '@/hooks/use-initials';
import { index } from '@/routes/users';
import type {
    ManagedUser,
    Option,
    Paginated,
    Role,
    UserFilters,
    UserStatus,
} from '@/types';

type UsersPageProps = {
    users: Paginated<ManagedUser>;
    filters: UserFilters;
    roles: Option<Role>[];
    statuses: Option<UserStatus>[];
    can: { create: boolean };
};

const ALL = 'all';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});

export default function UsersIndex({
    users,
    filters,
    roles,
    statuses,
    can,
}: UsersPageProps) {
    const getInitials = useInitials();
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<ManagedUser | undefined>();
    const [deleting, setDeleting] = useState<ManagedUser | null>(null);
    const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    /**
     * Filters live in the URL. Changing one reloads only the `users` and
     * `filters` props, keeps component state, and replaces the history entry
     * so Back leaves the page instead of stepping through every keystroke.
     */
    const applyFilters = (patch: Partial<UserFilters>) => {
        const next = { ...filters, ...patch };
        const query = Object.fromEntries(
            Object.entries(next).filter(([, value]) => value),
        );
        router.get(index().url, query, {
            only: ['users', 'filters'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const onSearch = (value: string) => {
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(
            () => applyFilters({ q: value.trim() || undefined }),
            300,
        );
    };

    const openForm = (user?: ManagedUser) => {
        setEditing(user);
        setFormOpen(true);
    };

    const hasFilters = Boolean(filters.q ?? filters.role ?? filters.status);
    const { meta, links } = users;

    return (
        <>
            <Head title="Users" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 [&>header]:mb-0">
                    <Heading
                        title="Users"
                        description="Manage who has access to your workspace."
                    />
                    {can.create && (
                        <Button onClick={() => openForm()}>
                            <Plus />
                            Add user
                        </Button>
                    )}
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div
                        role="search"
                        className="grid gap-3 border-b p-4 sm:grid-cols-[1fr_auto_auto]"
                    >
                        <div className="relative">
                            <Label htmlFor="user-search" className="sr-only">
                                Search users
                            </Label>
                            <Search
                                aria-hidden
                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                            />
                            <Input
                                id="user-search"
                                type="search"
                                placeholder="Search by name or email…"
                                defaultValue={filters.q ?? ''}
                                onChange={(event) =>
                                    onSearch(event.target.value)
                                }
                                className="pl-9"
                            />
                        </div>

                        <Select
                            value={filters.role ?? ALL}
                            onValueChange={(value) =>
                                applyFilters({
                                    role:
                                        value === ALL
                                            ? undefined
                                            : (value as Role),
                                })
                            }
                        >
                            <SelectTrigger
                                aria-label="Filter by role"
                                className="w-full sm:w-40"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>All roles</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem
                                        key={role.value}
                                        value={role.value}
                                    >
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.status ?? ALL}
                            onValueChange={(value) =>
                                applyFilters({
                                    status:
                                        value === ALL
                                            ? undefined
                                            : (value as UserStatus),
                                })
                            }
                        >
                            <SelectTrigger
                                aria-label="Filter by status"
                                className="w-full sm:w-40"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL}>
                                    All statuses
                                </SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {users.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <UserX
                                aria-hidden
                                className="size-8 text-muted-foreground"
                            />
                            <p className="font-semibold">No users found</p>
                            <p className="text-sm text-muted-foreground">
                                {hasFilters
                                    ? 'Try a different search or clear the filters.'
                                    : 'Add your first user to get started.'}
                            </p>
                        </div>
                    ) : (
                        // Scrollable regions must be reachable by keyboard.
                        <div
                            className="overflow-x-auto"
                            role="region"
                            aria-label="Users table"
                            tabIndex={0}
                        >
                            <table className="w-full text-left text-sm">
                                <thead className="text-xs tracking-wide text-muted-foreground uppercase">
                                    <tr className="border-b">
                                        <th
                                            scope="col"
                                            className="px-4 py-3 font-medium"
                                        >
                                            Name
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 font-medium"
                                        >
                                            Role
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 font-medium"
                                        >
                                            Status
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3 font-medium"
                                        >
                                            Joined
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0 hover:bg-muted/40"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8">
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(
                                                                user.name,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium">
                                                            {user.name}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <UserRoleBadge
                                                    role={user.role}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <UserStatusBadge
                                                    status={user.status}
                                                />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                                {user.created_at && (
                                                    <time
                                                        dateTime={
                                                            user.created_at
                                                        }
                                                    >
                                                        {dateFormatter.format(
                                                            new Date(
                                                                user.created_at,
                                                            ),
                                                        )}
                                                    </time>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {(user.can.update ||
                                                    user.can.delete) && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                aria-label={`Actions for ${user.name}`}
                                                            >
                                                                <MoreHorizontal />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {user.can
                                                                .update && (
                                                                <DropdownMenuItem
                                                                    onSelect={() =>
                                                                        openForm(
                                                                            user,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                            )}
                                                            {user.can
                                                                .delete && (
                                                                <DropdownMenuItem
                                                                    variant="destructive"
                                                                    onSelect={() =>
                                                                        setDeleting(
                                                                            user,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {meta.total > 0 && (
                        <nav
                            aria-label="Pagination"
                            className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-sm sm:flex-row"
                        >
                            <p
                                className="text-muted-foreground"
                                aria-live="polite"
                            >
                                Showing{' '}
                                <span className="font-medium text-foreground">
                                    {meta.from}
                                </span>
                                –
                                <span className="font-medium text-foreground">
                                    {meta.to}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium text-foreground">
                                    {meta.total}
                                </span>
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!links.prev}
                                    asChild={Boolean(links.prev)}
                                >
                                    {links.prev ? (
                                        <Link
                                            href={links.prev}
                                            preserveScroll
                                            preserveState
                                            only={['users']}
                                        >
                                            <ChevronLeft />
                                            Previous
                                        </Link>
                                    ) : (
                                        <>
                                            <ChevronLeft />
                                            Previous
                                        </>
                                    )}
                                </Button>
                                <span className="text-muted-foreground">
                                    Page {meta.current_page} of {meta.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={!links.next}
                                    asChild={Boolean(links.next)}
                                >
                                    {links.next ? (
                                        <Link
                                            href={links.next}
                                            preserveScroll
                                            preserveState
                                            only={['users']}
                                        >
                                            Next
                                            <ChevronRight />
                                        </Link>
                                    ) : (
                                        <>
                                            Next
                                            <ChevronRight />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </nav>
                    )}
                </div>
            </div>

            <UserFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                user={editing}
                roles={roles}
                statuses={statuses}
            />
            <DeleteUserDialog
                user={deleting}
                onOpenChange={(open) => !open && setDeleting(null)}
            />
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Users', href: index() }],
};
