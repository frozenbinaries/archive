<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Illuminate\Http\Request;

class CustomLoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        // Redirect based on user_type
        return match ($user->role) {
            'admin', 'super_admin' => redirect()->intended('/admin/dashboard'),
            'client' => redirect()->intended('/client/dashboard'),
            default => redirect()->intended('/client/dashboard'),
        };
    }
}
