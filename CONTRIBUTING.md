# Contributing

Thanks for helping improve this template.

## Development workflow

1. Fork the repository and create a branch from `main`, e.g. `feat/projects-module`.
2. Run `composer setup` once, then `composer dev`.
3. Make your change, then run:

    ```bash
    composer lint && npm run check:fix   # format PHP and TypeScript
    composer ci:check                    # Pint, PHPStan, Pest, Vite+ and tsc
    ```

4. Open a pull request using the template.

## Conventions

- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- **Controllers stay thin.** Validation and authorisation belong in form requests and policies, and response shapes in API resources.
- **Authorise on the server, hint on the client.** Every action is checked by a policy. Send `can` flags to the frontend to hide what the user can't do.
- **No hard-coded URLs.** Import routes and actions from Wayfinder (`@/actions/...`, `@/routes/...`).
- **Keep the schema portable.** Avoid database-specific column types and raw SQL, so SQLite, PostgreSQL and MySQL all keep passing.
- **Enums over strings.** Add roles, statuses and similar sets as backed enums in `app/Enums`.
- **New PHP files declare `strict_types`.** Architecture tests enforce this for enums, policies, requests and resources.
- **Test through HTTP.** Feature tests call routes and assert on Inertia props with `assertInertia`.
- **Placeholder data only.** Seeders and factories use generated names and `@example.com` addresses.
