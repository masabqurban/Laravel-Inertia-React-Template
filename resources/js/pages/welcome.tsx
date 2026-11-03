import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Database,
    KeyRound,
    LayoutDashboard,
    Route,
    ShieldCheck,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

const repositoryUrl =
    'https://github.com/masabqurban/Laravel-Inertia-React-Template';

const features: { icon: LucideIcon; title: string; description: string }[] = [
    {
        icon: Users,
        title: 'User management',
        description:
            'Search, filters and pagination kept in the URL. Create, edit and delete in dialogs.',
    },
    {
        icon: ShieldCheck,
        title: 'Roles & policies',
        description:
            'Admin, Editor and Viewer roles enforced by policies, with permission flags sent to the UI.',
    },
    {
        icon: KeyRound,
        title: 'Modern auth',
        description:
            'Passkeys, two-factor authentication, email verification and password reset.',
    },
    {
        icon: LayoutDashboard,
        title: 'Deferred dashboard',
        description:
            'The page renders instantly while stats and charts load right after.',
    },
    {
        icon: Route,
        title: 'Typed routes',
        description:
            'Wayfinder turns every controller action into a typed TypeScript import.',
    },
    {
        icon: Database,
        title: 'Any database',
        description:
            'SQLite out of the box. PostgreSQL and MySQL are tested in CI on every push.',
    },
];

const stack = [
    'Laravel 13',
    'Inertia 3',
    'React 19',
    'TypeScript',
    'Tailwind CSS 4',
    'shadcn/ui',
    'Pest',
    'PHPStan',
];

export default function Welcome() {
    const { auth, name } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-svh flex-col bg-background text-foreground">
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between p-6">
                    <div className="flex items-center gap-2 font-semibold">
                        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <AppLogoIcon className="size-5 fill-current" />
                        </span>
                        {name}
                    </div>
                    <nav className="flex items-center gap-2">
                        {auth.user ? (
                            <Button asChild>
                                <Link href={dashboard()}>Dashboard</Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" asChild>
                                    <Link href={login()}>Log in</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={register()}>Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 pt-10 pb-20 lg:pt-20">
                    <section className="flex max-w-3xl flex-col gap-6">
                        <p className="w-fit rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
                            Laravel + Inertia + React template
                        </p>
                        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                            A production-ready starting point for your next
                            Laravel app.
                        </h1>
                        <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
                            Server-side routing and controllers, a React and
                            TypeScript frontend, and none of the API glue in
                            between. Authentication, roles, security headers,
                            Docker and CI are already in place.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Button size="lg" asChild>
                                <Link href={auth.user ? dashboard() : login()}>
                                    {auth.user
                                        ? 'Open the dashboard'
                                        : 'Try the demo'}
                                    <ArrowRight />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <a
                                    href={repositoryUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    View on GitHub
                                </a>
                            </Button>
                        </div>
                        {!auth.user && (
                            <p className="text-sm text-muted-foreground">
                                Demo account:{' '}
                                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                    demo@example.com
                                </code>{' '}
                                /{' '}
                                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                                    password
                                </code>
                            </p>
                        )}
                    </section>

                    <section aria-labelledby="features-heading">
                        <h2 id="features-heading" className="sr-only">
                            Features
                        </h2>
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map(
                                ({ icon: Icon, title, description }) => (
                                    <li
                                        key={title}
                                        className="flex flex-col gap-3 rounded-xl border p-6"
                                    >
                                        <Icon
                                            className="size-5 text-muted-foreground"
                                            aria-hidden
                                        />
                                        <h3 className="font-medium">{title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {description}
                                        </p>
                                    </li>
                                ),
                            )}
                        </ul>
                    </section>
                </main>

                <footer className="border-t">
                    <ul
                        className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 p-6 text-sm text-muted-foreground"
                        aria-label="Built with"
                    >
                        {stack.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </footer>
            </div>
        </>
    );
}
