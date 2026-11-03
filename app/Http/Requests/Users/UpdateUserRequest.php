<?php

declare(strict_types=1);

namespace App\Http\Requests\Users;

use App\Enums\Role;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->target()) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $target = $this->target();
        // Admins can't change their own role or status (see UserPolicy::changeAccess).
        $access = $this->user()?->can('changeAccess', $target) ?? false;

        return [
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:254', Rule::unique(User::class)->ignore($target)],
            'role' => $access ? ['required', Rule::enum(Role::class)] : ['prohibited'],
            'status' => $access ? ['required', Rule::enum(UserStatus::class)] : ['prohibited'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'Another account already uses this email.',
            'role.prohibited' => "You can't change your own role.",
            'status.prohibited' => "You can't change your own status.",
        ];
    }

    private function target(): User
    {
        /** @var User $user */
        $user = $this->route('user');

        return $user;
    }
}
