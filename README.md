# Laravel + Inertia + React Template

A production-ready **Laravel 13 + Inertia 3 + React 19 + TypeScript** starter. Built on the official Laravel React starter kit, it adds role-based user management, a dashboard with deferred data, typed routes end to end, hardened security headers, a Docker image, and CI across **SQLite, PostgreSQL and MySQL**. It runs with **zero setup**: SQLite by default, no Docker required.

![PHP](https://img.shields.io/badge/PHP-8.3%2B-777bb4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-13-ff2d20?logo=laravel&logoColor=white)
![Inertia](https://img.shields.io/badge/Inertia-3-9553e9)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)
![PHPStan](https://img.shields.io/badge/PHPStan-level_8-2a5ea7)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

> All data in this repository (users, names, emails) is generated placeholder data. Every email address uses the reserved `example.com` domain.
> See also the [Next.js Template](https://github.com/masabqurban/Next.js-Template), [React.js Template](https://github.com/masabqurban/React.js-Template), [Node.js Template](https://github.com/masabqurban/Node.js-Template) and [React Native Template](https://github.com/masabqurban/React-Native-Template).

## Contents

- [Highlights](#highlights)
- [Use this template](#use-this-template)
- [Getting started](#getting-started)
- [Choosing a database](#choosing-a-database)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [Users and roles](#users-and-roles)
- [Security](#security)
- [Testing and quality](#testing-and-quality)
- [Docker](#docker)
- [Deployment](#deployment)
- [Customising the template](#customising-the-template)

## Highlights

| Area               | What's included                                                                                                                          |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Stack**          | Laravel 13, Inertia 3, React 19 with the React Compiler, TypeScript, Tailwind CSS 4, shadcn/ui (Radix), Vite+                            |
| **Typed routes**   | [Wayfinder](https://github.com/laravel/wayfinder) generates TypeScript functions for every controller action: no hard-coded URLs         |
| **Auth**           | Fortify: sign-in, registration, email verification, password reset, **passkeys** and **two-factor authentication**                       |
| **Users module**   | Search, filters and pagination kept in the URL; create, edit and delete in dialogs; policies, form requests and API resources            |
| **Roles & status** | `Admin` / `Editor` / `Viewer` roles and `Active` / `Invited` / `Suspended` statuses as PHP enums; suspended users are signed out at once |
| **Dashboard**      | Stats, a six-month sign-up chart and recent users, loaded as **deferred props** so the page renders immediately                          |
| **Security**       | Nonce-based Content Security Policy, HSTS, frame and MIME protections, strict Eloquent models in development, HTTPS URL enforcement      |
| **Database**       | Portable schema: SQLite out of the box, PostgreSQL or MySQL by changing `.env`. CI runs the full suite on all three                      |
| **Quality**        | Pest (64 tests, architecture rules), PHPStan level 8 (Larastan), Pint, Oxlint + Oxfmt via Vite+, `tsc`, GitHub Actions, Dependabot       |
| **Operations**     | Multi-stage Docker image on FrankenPHP running as non-root, health check, `compose.yaml` with PostgreSQL, MySQL and Mailpit              |

## Use this template

**1. Create your repository.** Click **Use this template → Create a new repository** at the top of this page. Your new repository gets a clean history and no link back to this one. Or use the GitHub CLI:

```bash
gh repo create my-app --template masabqurban/Laravel-Inertia-React-Template --private --clone
cd my-app
```

Prefer no Git history at all? Run `npx degit masabqurban/Laravel-Inertia-React-Template my-app`.

**2. Install and run it.**

```bash
composer setup    # dependencies, .env, app key, migrations, demo data, asset build
composer dev      # http://localhost:8000, demo@example.com / password
```

Or with Docker: `php artisan key:generate`, then `docker compose up --build` (http://localhost:8080).

**3. Make it yours.**

- `composer.json`: change `"name"` from `masabqurban/laravel-inertia-react-template`, and update the description and keywords.
- `APP_NAME` in `.env.example` (default "Acme Console"), the logo in `resources/js/components/app-logo-icon.tsx`, and the colours in `resources/css/app.css`.
- The repository links in `resources/js/components/app-sidebar.tsx` and `resources/js/pages/welcome.tsx`.
- Pick your database. See [Choosing a database](#choosing-a-database).
- Replace the copyright holder in `LICENSE` (or choose another license), and rewrite this README for your project.

**4. Remove what you don't need.** The demo is there to show the patterns end to end. Keep the parts you'll build on and delete the rest:

- **Users module:** to drop it, delete `UserController`, `app/Http/Requests/Users/`, `UserResource`, `UserPolicy`, `resources/js/pages/users/`, `resources/js/components/users/`, `tests/Feature/Users/`, the `users` route and its sidebar item. Keep the `Role` and `UserStatus` enums if you still want roles.
- **Demo data:** the 47 placeholder users come from `database/seeders/DatabaseSeeder.php`. Trim it to the accounts you need for development.
- **Welcome page:** `resources/js/pages/welcome.tsx` describes this template. Replace it with your own landing page, or redirect `/` to the dashboard in `routes/web.php`.

**5. Turn on the repository settings.** In **Settings → Code security**, enable Dependabot alerts and private vulnerability reporting (`SECURITY.md` points reporters there). CI in `.github/workflows/` runs on your first push with no secrets required. Add branch protection on `main` that requires it to pass.

## Getting started

Requirements: **PHP 8.3+** (8.5 recommended), **Composer 2**, **Node.js 22+**.

```bash
composer setup   # install, create .env, generate key, migrate, seed demo data, build assets
composer dev     # Laravel server, queue worker, logs and Vite, together
```

Open <http://localhost:8000> and sign in with the demo account:

| Email              | Password   | Role  |
| ------------------ | ---------- | ----- |
| `demo@example.com` | `password` | Admin |

The seeder adds 47 more placeholder users with mixed roles and statuses, spread over the last six months so the dashboard has data. Reset everything with `php artisan migrate:fresh --seed`.

> **Prefer Docker?** `docker compose up --build` starts the app on <http://localhost:8080> with PostgreSQL and the same demo data. See [Docker](#docker).

## Choosing a database

The template is **database-agnostic**. Migrations use only portable column types (roles and statuses are strings validated by PHP enums, not native DB enums), and CI runs every test against SQLite, PostgreSQL and MySQL.

| Database             | Setup                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SQLite** (default) | Nothing to do. The file is `database/database.sqlite`.                                                                                           |
| **PostgreSQL**       | `docker compose up -d pgsql`, then set `DB_CONNECTION=pgsql`, `DB_PORT=5432`, `DB_DATABASE=laravel`, `DB_USERNAME=laravel`, `DB_PASSWORD=secret` |
| **MySQL / MariaDB**  | `docker compose --profile mysql up -d mysql`, then set `DB_CONNECTION=mysql`, `DB_PORT=3306` and the same credentials                            |

Uncomment `DB_HOST` in `.env` as well, then run `php artisan migrate --seed`. Any database Laravel supports works the same way.

## Scripts

| Command               | What it does                                                                          |
| --------------------- | ------------------------------------------------------------------------------------- |
| `composer setup`      | First-time setup: dependencies, `.env`, key, migrations, demo data and an asset build |
| `composer dev`        | Development server, queue worker, log tail and Vite with hot reload                   |
| `composer test`       | Pint, PHPStan and the Pest suite                                                      |
| `composer ci:check`   | Everything CI checks: the above plus Vite+ lint/format and `tsc`                      |
| `composer lint`       | Format PHP with Pint                                                                  |
| `npm run check:fix`   | Lint and format TypeScript, CSS and JSON with Vite+ (Oxlint + Oxfmt)                  |
| `npm run types:check` | Type check the frontend                                                               |
| `npm run build`       | Production asset build (also regenerates Wayfinder routes)                            |

## Project structure

```text
app/
├── Enums/                  Role, UserStatus: string-backed, with labels and rules
├── Http/
│   ├── Controllers/        Thin controllers: authorise, validate, query, render
│   ├── Middleware/         SecurityHeaders (CSP), EnsureUserIsActive, Inertia shared props
│   ├── Requests/           Form requests: validation and authorisation per action
│   └── Resources/          UserResource: the only shape the frontend sees
├── Models/User.php         Enum casts, query scope for filters, model attributes
├── Policies/UserPolicy.php Who can create, update, delete and change access
└── Providers/              Strict models, HTTPS URLs, Fortify sign-in rules
database/
├── factories/UserFactory.php  States: admin(), editor(), invited(), suspended(), …
└── seeders/DatabaseSeeder.php Placeholder data only, idempotent
resources/js/
├── pages/                  Inertia pages: dashboard, users/index, auth/*, settings/*
├── components/             App shell, users/* dialogs and badges, ui/* (shadcn)
├── layouts/                App, auth and settings layouts
├── types/                  Shared TypeScript types (auth, users, pagination)
├── actions/ routes/        Generated by Wayfinder (git-ignored)
└── app.tsx                 Inertia entry point
tests/
├── Feature/                HTTP tests: users, dashboard, account status, headers, auth
└── ArchTest.php            Architecture rules enforced on every run
docker/                     Entrypoint and PHP production settings
```

## Architecture

**Inertia instead of an API.** Controllers return pages with props, like a server-rendered app, and React renders them, like an SPA. There is no separate API layer, client-side router, or state library to keep in sync. Validation errors, redirects and flash messages flow through Inertia.

**One place per concern.**

| Concern       | Lives in                                          |
| ------------- | ------------------------------------------------- |
| Who may act   | `UserPolicy`, checked by form requests and `Gate` |
| What is valid | Form requests (`StoreUserRequest`, …)             |
| What is sent  | `UserResource`, including per-row `can` flags     |
| Query filters | The `filter` scope on `User`                      |

**Typed from server to screen.** Wayfinder turns `UserController::update` into an import:

```tsx
import UserController from '@/actions/App/Http/Controllers/UserController';

<Form {...UserController.update.form(user)}>…</Form>;
```

Rename a route or change a parameter and `tsc` fails, instead of a link breaking in production.

**Deferred props.** The dashboard's aggregates are wrapped in `Inertia::defer()`. The first response carries the page shell, and the browser fetches the expensive data right after, showing skeletons meanwhile.

**URL as state.** The users list keeps its search, filters and page in the query string. Results are shareable and survive a refresh, and the back button works. Partial reloads (`only: ['users', 'filters']`) fetch just the table.

## Users and roles

| Action                        | Admin | Editor | Viewer |
| ----------------------------- | :---: | :----: | :----: |
| View dashboard and users      |   ✓   |   ✓    |   ✓    |
| Create, edit and delete users |   ✓   |        |        |
| Change a user's role/status   |   ✓   |        |        |

- Admins can't change their own role or status, or delete themselves, so a workspace can't lock itself out.
- New registrations get the least privileged role (`Viewer`).
- `Invited` and `Suspended` users can't sign in. Suspending someone ends their current session on their next request.
- The UI hides actions the user can't take, using `can` flags from the server. The server enforces every rule regardless.

## Security

- **Content Security Policy** with a fresh nonce per request (`SecurityHeaders` middleware). Inline scripts carry the nonce through `Vite::useCspNonce()`. The policy is enforced outside the `local` environment, so Vite's dev server keeps working.
- `Strict-Transport-Security` on HTTPS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`.
- Passwords are hashed with bcrypt, sign-in and two-factor attempts are rate limited (Fortify), and sessions are regenerated on login.
- Mass assignment is limited by `#[Fillable]`. `UserResource` whitelists output, so secrets like `password` and `two_factor_secret` never reach the browser (covered by a test).
- `Model::shouldBeStrict()` outside production catches lazy loading and unknown attributes early. Destructive database commands are blocked in production.
- Architecture tests forbid `dd()`/`dump()`, `env()` outside config, and insecure functions such as `eval` and `md5`.

Behind a load balancer, add `$middleware->trustProxies(at: [...])` in `bootstrap/app.php` so HTTPS and client IPs are detected correctly.

## Testing and quality

```bash
composer test        # Pint + PHPStan + Pest
composer ci:check    # + Vite+ lint/format and tsc
```

Feature tests run against an in-memory SQLite database by default. To run them against another database, override the connection:

```bash
DB_CONNECTION=pgsql DB_HOST=127.0.0.1 DB_DATABASE=testing DB_USERNAME=laravel DB_PASSWORD=secret php artisan test
```

GitHub Actions (`.github/workflows/ci.yml`) runs:

1. **Lint & static analysis:** Pint, PHPStan level 8, Vite+ (Oxlint, Oxfmt), `tsc`, `composer audit`, `npm audit`
2. **Tests:** the Pest suite in parallel on **SQLite, PostgreSQL 18 and MySQL 8.4**
3. **Docker:** builds the production image and smoke-tests `/up`

Dependabot keeps Composer, npm, Docker and Actions dependencies current, grouping minor and patch updates.

## Docker

```bash
docker compose up --build            # app :8080, PostgreSQL :5432, Mailpit :8025
```

- `APP_KEY` is read from your `.env`. Run `php artisan key:generate` first if you haven't.
- On start, the container caches config, routes and views, runs migrations, and seeds demo data once (`SEED_DEMO_DATA=true` in `compose.yaml`).
- Ports are configurable: `APP_PORT`, `FORWARD_DB_PORT`, `FORWARD_MAILPIT_PORT`, `FORWARD_MAILPIT_DASHBOARD_PORT`.

The `Dockerfile` is multi-stage:

1. **build:** Composer and npm dependencies, Wayfinder generation and the Vite build. Layers are cached by lock file.
2. **app:** [FrankenPHP](https://frankenphp.dev) serving `public/` with production `php.ini` and OPcache. It runs as `www-data` on port 8080 and includes a health check.

`docker build .` produces a production image without dev dependencies. Compose builds with `COMPOSER_DEV=true` so the demo seeder can use Faker.

## Deployment

1. Set the environment: `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY`, `APP_URL` (use `https://`), and the `DB_*`, `MAIL_*`, `SESSION_*` and `CACHE_*` values.
2. Run migrations with `php artisan migrate --force`, or set `RUN_MIGRATIONS=true` on the container.
3. Run a queue worker (`php artisan queue:work`) and the scheduler (`php artisan schedule:work`) as separate processes from the same image.
4. Don't run the seeder in production unless you want the demo data.

The image runs anywhere containers do (Fly.io, Railway, Render, ECS, Kubernetes). Laravel Cloud and Forge can deploy the repository directly.

## Customising the template

1. **Rename** `APP_NAME` in `.env` (default "Acme Console") and replace `resources/js/components/app-logo-icon.tsx`.
2. **Add a resource:** model and migration (`php artisan make:model Project -mfs --policy`), a controller with form requests and an API resource, a page in `resources/js/pages/`, and a nav item in `app-sidebar.tsx`. Wayfinder generates the routes on the next `npm run dev`.
3. **Add a role or status:** add a case to the enum. Validation, filters and the UI read from the enum.
4. **Remove demo features:** delete the users module (controller, requests, resource, policy, pages, tests) and the seeder's placeholder users.

## License

[MIT](./LICENSE)
