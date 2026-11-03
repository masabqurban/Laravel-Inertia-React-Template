<?php

use App\Http\Controllers\DashboardController;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('the dashboard defers its aggregates and loads them on request', function () {
    $this->travelTo(now()->setDate(2026, 6, 15));
    $user = User::factory()->create();
    User::factory()->create(['created_at' => now()->subDays(40)]);
    User::factory()->invited()->create(['created_at' => now()->subDays(70)]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            // Not in the first response: the page shell renders immediately.
            ->missing('stats')
            ->loadDeferredProps(fn (Assert $reload) => $reload
                ->where('stats.0', ['key' => 'users', 'label' => 'Total users', 'value' => 3, 'change' => 0.5])
                ->where('stats.3.value', 1)
                ->has('signups', 6)
                ->where('signups.5', ['month' => 'Jun', 'count' => 1])
                ->has('recentUsers.data', 3),
            ),
        );
});

test('change ratios handle growth, decline and an empty baseline', function () {
    expect(DashboardController::change(12, 10))->toBe(0.2)
        ->and(DashboardController::change(9, 10))->toBe(-0.1)
        ->and(DashboardController::change(0, 0))->toBe(0.0)
        ->and(DashboardController::change(5, 0))->toBe(1.0);
});
