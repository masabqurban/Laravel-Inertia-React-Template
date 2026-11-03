<?php

use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to sign in', function () {
    $this->get(route('users.index'))->assertRedirect(route('login'));
});

test('every signed-in user can browse the directory', function () {
    $viewer = User::factory()->create();
    User::factory()->count(3)->create();

    $this->actingAs($viewer)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 4)
            ->where('users.meta.total', 4)
            ->where('can.create', false)
            ->where('users.data.0.can.update', false),
        );
});

test('the list filters by search, role and status, keeping them in the URL', function () {
    $admin = User::factory()->admin()->create(['name' => 'Ada Admin']);
    User::factory()->editor()->create(['name' => 'Eddie Editor']);
    User::factory()->suspended()->create(['name' => 'Sam Suspended']);

    $this->actingAs($admin)
        ->get(route('users.index', ['q' => 'edd', 'role' => 'editor']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Eddie Editor')
            ->where('filters', ['q' => 'edd', 'role' => 'editor']),
        );

    $this->actingAs($admin)
        ->get(route('users.index', ['status' => 'suspended']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Sam Suspended'),
        );
});

test('invalid filters are rejected instead of reaching the query', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('users.index', ['role' => 'root']))
        ->assertSessionHasErrors('role');
});

test('the list is paginated', function () {
    $admin = User::factory()->admin()->create();
    User::factory()->count(14)->create();

    $this->actingAs($admin)
        ->get(route('users.index', ['page' => 2]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 5)
            ->where('users.meta.current_page', 2)
            ->where('users.meta.last_page', 2),
        );
});

test('admins can create users, who start as invited', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('users.store'), [
            'name' => 'Grace Hopper',
            'email' => 'grace@example.com',
            'role' => 'editor',
            'status' => 'invited',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    $user = User::query()->where('email', 'grace@example.com')->firstOrFail();
    expect($user->role)->toBe(Role::Editor)
        ->and($user->status)->toBe(UserStatus::Invited);
});

test('creating validates input and rejects duplicate emails', function () {
    $admin = User::factory()->admin()->create(['email' => 'taken@example.com']);

    $this->actingAs($admin)
        ->post(route('users.store'), ['name' => 'X', 'email' => 'taken@example.com', 'role' => 'root', 'status' => 'active'])
        ->assertSessionHasErrors([
            'name',
            'email' => 'Another account already uses this email.',
            'role',
        ]);
});

test('non-admins cannot create, update or delete users', function (Role $role) {
    $actor = User::factory()->create(['role' => $role]);
    $other = User::factory()->create();

    $this->actingAs($actor)->post(route('users.store'), [
        'name' => 'New Person', 'email' => 'new@example.com', 'role' => 'viewer', 'status' => 'active',
    ])->assertForbidden();
    $this->actingAs($actor)->patch(route('users.update', $other), ['name' => 'Renamed', 'email' => $other->email])->assertForbidden();
    $this->actingAs($actor)->delete(route('users.destroy', $other))->assertForbidden();

    expect(User::query()->where('email', 'new@example.com')->exists())->toBeFalse()
        ->and($other->fresh())->not->toBeNull();
})->with([Role::Editor, Role::Viewer]);

test('admins can update other users, including their access', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)
        ->patch(route('users.update', $user), [
            'name' => 'Renamed Person',
            'email' => $user->email,
            'role' => 'editor',
            'status' => 'suspended',
        ])
        ->assertSessionHasNoErrors();

    expect($user->fresh())
        ->name->toBe('Renamed Person')
        ->role->toBe(Role::Editor)
        ->status->toBe(UserStatus::Suspended);
});

test('admins cannot change their own role or status', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->patch(route('users.update', $admin), [
            'name' => $admin->name, 'email' => $admin->email, 'role' => 'viewer', 'status' => 'suspended',
        ])
        ->assertSessionHasErrors(['role', 'status']);

    expect($admin->fresh()->role)->toBe(Role::Admin);
});

test('admins can still edit their own name', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->patch(route('users.update', $admin), ['name' => 'New Name', 'email' => $admin->email])
        ->assertSessionHasNoErrors();

    expect($admin->fresh()->name)->toBe('New Name');
});

test('admins can delete other users but not themselves', function () {
    $admin = User::factory()->admin()->create();
    $user = User::factory()->create();

    $this->actingAs($admin)->delete(route('users.destroy', $user))->assertRedirect(route('users.index'));
    expect($user->fresh())->toBeNull();

    $this->actingAs($admin)->delete(route('users.destroy', $admin))->assertForbidden();
    expect($admin->fresh())->not->toBeNull();
});

test('the resource never exposes secrets', function () {
    $admin = User::factory()->admin()->withTwoFactor()->create();

    $this->actingAs($admin)
        ->get(route('users.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->missing('users.data.0.password')
            ->missing('users.data.0.two_factor_secret')
            ->missing('users.data.0.remember_token'),
        );
});
