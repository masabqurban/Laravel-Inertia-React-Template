# Agent instructions

- Read `README.md` (architecture, roles, security) and `CONTRIBUTING.md` (conventions) first.
- Laravel 13 + Inertia 3 + React 19 + TypeScript. Pages live in `resources/js/pages`, and controllers render them with `Inertia::render('users/index', ...)`.
- Import URLs from Wayfinder (`@/actions/App/Http/Controllers/...`, `@/routes/...`). These folders are generated: run `php artisan wayfinder:generate --with-form` if they are missing, and never edit them.
- Validation and authorisation go in `app/Http/Requests` and `app/Policies`. Response shapes go in `app/Http/Resources`.
- Keep migrations portable across SQLite, PostgreSQL and MySQL.
- Feature tests render the Blade shell, so run `npm run build` before `php artisan test` if the Vite manifest is missing.
- Run `composer ci:check` before considering work done.
