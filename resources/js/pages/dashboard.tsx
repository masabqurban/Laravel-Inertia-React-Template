import { Deferred, Head, Link, usePage } from '@inertiajs/react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { UserStatusBadge } from '@/components/users/user-badges';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as usersIndex } from '@/routes/users';
import type { Auth, ManagedUser } from '@/types';

type Stat = { key: string; label: string; value: number; change: number };
type Signup = { month: string; count: number };

type DashboardProps = {
    // Deferred props: undefined until the follow-up request finishes.
    stats?: Stat[];
    signups?: Signup[];
    recentUsers?: { data: ManagedUser[] };
};

const numberFormatter = new Intl.NumberFormat();

function formatChange(ratio: number) {
    const percent = (ratio * 100).toFixed(1);
    return ratio > 0 ? `+${percent}%` : `${percent}%`;
}

function StatCards({ stats }: { stats: Stat[] }) {
    return (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                // For pending invites, going down is good.
                const good =
                    stat.key === 'pending'
                        ? stat.change <= 0
                        : stat.change >= 0;
                const Trend = stat.change >= 0 ? TrendingUp : TrendingDown;
                return (
                    <li key={stat.key}>
                        <Card className="h-full gap-2 py-5">
                            <CardContent className="grid gap-1">
                                <p className="text-sm text-muted-foreground">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-semibold tracking-tight">
                                    {numberFormatter.format(stat.value)}
                                </p>
                                <p
                                    className={cn(
                                        'flex items-center gap-1 text-xs font-medium',
                                        good
                                            ? 'text-emerald-700 dark:text-emerald-400'
                                            : 'text-red-700 dark:text-red-400',
                                    )}
                                >
                                    <Trend aria-hidden className="size-3.5" />
                                    {formatChange(stat.change)}
                                    <span className="font-normal text-muted-foreground">
                                        vs last 30 days
                                    </span>
                                </p>
                            </CardContent>
                        </Card>
                    </li>
                );
            })}
        </ul>
    );
}

/**
 * Dependency-free bar chart. The bars are hidden from assistive technology,
 * which reads the same numbers from a visually hidden table instead.
 */
function SignupsChart({ data }: { data: Signup[] }) {
    const max = Math.max(...data.map((point) => point.count), 1);
    return (
        <figure className="grid gap-3">
            <div
                aria-hidden
                className="flex h-52 items-end gap-3 border-b sm:gap-6"
            >
                {data.map((point) => (
                    <div
                        key={point.month}
                        className="flex h-full flex-1 flex-col justify-end gap-2"
                    >
                        <span className="text-center text-xs text-muted-foreground">
                            {point.count}
                        </span>
                        <div
                            className="rounded-t-md bg-primary"
                            style={{ height: `${(point.count / max) * 100}%` }}
                        />
                    </div>
                ))}
            </div>
            <div aria-hidden className="flex gap-3 sm:gap-6">
                {data.map((point) => (
                    <span
                        key={point.month}
                        className="flex-1 text-center text-xs text-muted-foreground"
                    >
                        {point.month}
                    </span>
                ))}
            </div>
            <figcaption className="sr-only">New sign-ups per month</figcaption>
            <table className="sr-only">
                <thead>
                    <tr>
                        <th scope="col">Month</th>
                        <th scope="col">Sign-ups</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((point) => (
                        <tr key={point.month}>
                            <td>{point.month}</td>
                            <td>{point.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}

export default function Dashboard({
    stats,
    signups,
    recentUsers,
}: DashboardProps) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const getInitials = useInitials();
    const firstName = auth.user.name.split(' ')[0];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Welcome back, {firstName}. Here&apos;s what&apos;s
                        happening.
                    </p>
                </div>

                <Deferred
                    data="stats"
                    fallback={
                        <div
                            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                            aria-label="Loading statistics"
                        >
                            {Array.from({ length: 4 }, (_, i) => (
                                <Skeleton key={i} className="h-28 rounded-xl" />
                            ))}
                        </div>
                    }
                >
                    <StatCards stats={stats ?? []} />
                </Deferred>

                <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>New sign-ups</CardTitle>
                            <CardDescription>Last six months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Deferred
                                data="signups"
                                fallback={<Skeleton className="h-60" />}
                            >
                                <SignupsChart data={signups ?? []} />
                            </Deferred>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Recent users</CardTitle>
                            <Link
                                href={usersIndex()}
                                className="text-sm font-medium text-primary hover:underline"
                                prefetch
                            >
                                View all
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <Deferred
                                data="recentUsers"
                                fallback={
                                    <div className="grid gap-4">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Skeleton key={i} className="h-9" />
                                        ))}
                                    </div>
                                }
                            >
                                <ul className="grid gap-4">
                                    {(recentUsers?.data ?? []).map((user) => (
                                        <li
                                            key={user.id}
                                            className="flex items-center gap-3"
                                        >
                                            <Avatar className="size-9">
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <UserStatusBadge
                                                status={user.status}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </Deferred>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
