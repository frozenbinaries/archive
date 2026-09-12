<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $folders = Folder::where('user_id', auth()->id())
            ->with('children')
            ->get();

        $currentFolderId = $request->input('folder_id');
        $path = [];

        if ($currentFolderId) {
            $currentFolder = Folder::where('user_id', auth()->id())
                ->find($currentFolderId);

            if ($currentFolder) {
                $path = $this->getFolderPath($currentFolder);
            }
        }

        return Inertia::render('client/folders/index', [
            'folders' => $folders,
            'currentFolderId' => $currentFolderId,
            'path' => $path,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'exists:folders,id'],
            'color' => ['nullable', 'string', 'max:7'],
        ]);

        // Check if parent folder belongs to the user
        if ($validated['parent_id']) {
            $parent = Folder::where('user_id', auth()->id())
                ->find($validated['parent_id']);

            if (!$parent) {
                return response()->json(['error' => 'Parent folder not found'], 404);
            }
        }

        $folder = Folder::create([
            'name' => $validated['name'],
            'parent_id' => $validated['parent_id'] ?? null,
            'color' => $validated['color'] ?? null,
            'user_id' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Folder created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Folder $folder)
    {
        // Check if folder belongs to the user
        if ($folder->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('client/folders/show', [
            'folder' => $folder->load('children'),
            'path' => $this->getFolderPath($folder),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Folder $folder)
    {
        // Check if folder belongs to the user
        if ($folder->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'exists:folders,id'],
            'color' => ['nullable', 'string', 'max:7'],
        ]);

        // Check if parent folder belongs to the user
        if (isset($validated['parent_id']) && $validated['parent_id']) {
            $parent = Folder::where('user_id', auth()->id())
                ->find($validated['parent_id']);

            if (!$parent) {
                return response()->json(['error' => 'Parent folder not found'], 404);
            }

            // Prevent moving folder into itself or its descendants
            if ($this->isDescendant($validated['parent_id'], $folder->id)) {
                return response()->json(['error' => 'Cannot move folder into itself or its descendants'], 422);
            }
        }

        $folder->update($validated);

        return redirect()->back()->with('success', 'Folder updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        // Check if folder belongs to the user
        if ($folder->user_id !== auth()->id()) {
            abort(403);
        }

        // Delete all child folders recursively
        $this->deleteFolderTree($folder);

        return redirect()->back()->with('success', 'Folder deleted successfully.');
    }

    /**
     * Bulk delete multiple folders.
     */
    public function destroyMultiple(Request $request)
    {
        $validated = $request->validate([
            'folder_ids' => ['required', 'array'],
            'folder_ids.*' => ['exists:folders,id'],
        ]);

        $folderIds = $validated['folder_ids'];

        // Check if all folders belong to the user
        $folders = Folder::where('user_id', auth()->id())
            ->whereIn('id', $folderIds)
            ->get();

        if ($folders->count() !== count($folderIds)) {
            return response()->json(['error' => 'Some folders not found'], 404);
        }

        // Delete all folders and their children
        foreach ($folders as $folder) {
            $this->deleteFolderTree($folder);
        }

        return redirect()->back()->with('success', 'Folders deleted successfully.');
    }

    /**
     * Move multiple folders.
     */
    public function moveMultiple(Request $request)
    {
        $validated = $request->validate([
            'folder_ids' => ['required', 'array'],
            'folder_ids.*' => ['exists:folders,id'],
            'parent_id' => ['nullable', 'exists:folders,id'],
        ]);

        $folderIds = $validated['folder_ids'];
        $parentId = $validated['parent_id'] ?? null;

        // Check if all folders belong to the user
        $folders = Folder::where('user_id', auth()->id())
            ->whereIn('id', $folderIds)
            ->get();

        if ($folders->count() !== count($folderIds)) {
            return response()->json(['error' => 'Some folders not found'], 404);
        }

        // Check if parent folder belongs to the user
        if ($parentId) {
            $parent = Folder::where('user_id', auth()->id())
                ->find($parentId);

            if (!$parent) {
                return response()->json(['error' => 'Parent folder not found'], 404);
            }

            // Prevent moving folders into themselves or their descendants
            foreach ($folderIds as $folderId) {
                if ($this->isDescendant($parentId, $folderId)) {
                    return response()->json([
                        'error' => 'Cannot move folder into itself or its descendants'
                    ], 422);
                }
            }
        }

        // Move all folders
        Folder::whereIn('id', $folderIds)
            ->where('user_id', auth()->id())
            ->update(['parent_id' => $parentId]);

        return redirect()->back()->with('success', 'Folders moved successfully.');
    }

    /**
     * Search folders.
     */
    public function search(Request $request)
    {
        $query = $request->input('q');
        $parentId = $request->input('parent_id');

        $folders = Folder::where('user_id', auth()->id())
            ->where('name', 'LIKE', "%{$query}%");

        if ($parentId !== null) {
            $folders->where('parent_id', $parentId);
        }

        return response()->json([
            'folders' => $folders->get(),
        ]);
    }

    /**
     * Get folder path for breadcrumbs.
     */
    private function getFolderPath(Folder $folder): array
    {
        $path = [];
        $current = $folder;

        while ($current) {
            $path[] = $current;
            if ($current->parent_id) {
                $current = Folder::where('user_id', auth()->id())
                    ->find($current->parent_id);
            } else {
                $current = null;
            }
        }

        return array_reverse($path);
    }

    /**
     * Check if a folder is a descendant of another folder.
     */
    private function isDescendant(int $ancestorId, int $descendantId): bool
    {
        $current = Folder::where('user_id', auth()->id())
            ->find($descendantId);

        while ($current && $current->parent_id) {
            if ($current->parent_id === $ancestorId) {
                return true;
            }
            $current = Folder::where('user_id', auth()->id())
                ->find($current->parent_id);
        }

        return false;
    }

    /**
     * Delete a folder and all its children recursively.
     */
    private function deleteFolderTree(Folder $folder): void
    {
        // Get all child folders
        $children = Folder::where('parent_id', $folder->id)->get();

        // Delete children recursively
        foreach ($children as $child) {
            $this->deleteFolderTree($child);
        }

        // Delete the folder itself
        $folder->delete();
    }
}