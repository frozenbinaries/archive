<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Folder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'parent_id',
        'user_id',
        'color',
    ];

    protected $casts = [
        'parent_id' => 'integer',
        'user_id' => 'integer',
        'color' => 'string',
    ];

    /**
     * The user who owns this folder.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The parent folder, if any. Root folders have parent_id = null.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    /**
     * Direct child folders (one level down).
     */
    public function children(): HasMany
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }

    /**
     * Child folders with the full subtree eager-loaded recursively.
     * Use sparingly on deep trees — this issues one query per level.
     *
     * Example: Folder::root()->with('childrenRecursive')->get();
     */
    public function childrenRecursive(): HasMany
    {
        return $this->children()->with('childrenRecursive');
    }

    /**
     * Scope: only root-level folders (no parent).
     */
    public function scopeRoot(Builder $query): Builder
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Scope: only folders belonging to the given user.
     */
    public function scopeOwnedBy(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Whether this folder sits at the top of its tree.
     */
    public function isRoot(): bool
    {
        return is_null($this->parent_id);
    }

    /**
     * Ancestor folders from the immediate parent up to the root,
     * ordered nearest-first. Walks up via individual queries, so it's
     * fine for breadcrumbs but not for bulk operations.
     *
     * @return array<int, Folder>
     */
    public function ancestors(): array
    {
        $ancestors = [];
        $folder = $this->parent;

        while ($folder !== null) {
            $ancestors[] = $folder;
            $folder = $folder->parent;
        }

        return $ancestors;
    }
}