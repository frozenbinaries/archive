<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\ClientDashboardController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    // Client Dashboard
    Route::get('/client/dashboard', [ClientDashboardController::class, 'index'] )->name('client.dashboard');



    Route::resource('/client/folders', FolderController::class);

    Route::get('/client/my-archive', [FolderController::class, 'index'])->name('my-archive');
    Route::post('/client/folders', [FolderController::class, 'store']);
    Route::patch('/client/folders/{folder}', [FolderController::class, 'update']);
    Route::delete('/client/folders/{folder}', [FolderController::class, 'destroy']);
});

require __DIR__ . '/settings.php';
