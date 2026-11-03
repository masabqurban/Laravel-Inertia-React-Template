<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Enums\UserStatus;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Search, filters and page live in the query string (`/users?q=ava&role=admin`),
     * so every view of the list can be bookmarked, shared and restored with Back.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', User::class);

        $request->validate([
            'q' => ['nullable', 'string', 'max:100'],
            'role' => ['nullable', Rule::enum(Role::class)],
            'status' => ['nullable', Rule::enum(UserStatus::class)],
        ]);

        // Typed accessors: validated values come back as a string and real enums.
        $search = $request->string('q')->trim()->value();
        $role = $request->enum('role', Role::class);
        $status = $request->enum('status', UserStatus::class);

        $users = User::query()
            ->filter(['q' => $search, 'role' => $role, 'status' => $status])
            ->latest()
            ->latest('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users' => UserResource::collection($users),
            'filters' => (object) array_filter(['q' => $search, 'role' => $role?->value, 'status' => $status?->value]),
            'roles' => array_map(fn (Role $role) => ['value' => $role->value, 'label' => $role->label()], Role::cases()),
            'statuses' => array_map(fn (UserStatus $status) => ['value' => $status->value, 'label' => $status->label()], UserStatus::cases()),
            'can' => ['create' => $request->user()?->can('create', User::class) ?? false],
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            ...$request->validated(),
            // Invited users get an unusable random password until they reset it.
            'password' => Str::password(32),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __(':name was added.', ['name' => $user->name])]);

        return back();
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Changes saved.')]);

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __(':name was deleted.', ['name' => $user->name])]);

        return to_route('users.index');
    }
}
