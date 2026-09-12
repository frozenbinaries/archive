import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import ClientLayout from '@/layouts/client-layout';
import { Folder, Plus, ChevronRight, ChevronDown, MoreVertical, Trash2, Edit2, X, Search, Home, FolderPlus, Upload, FolderUp, ArrowLeft, ChevronLeft } from 'lucide-react';

type FolderType = {
    id: number;
    parent_id: number | null;
    name: string;
    color: string | null;
    user_id: number;
    created_at: string;
    updated_at: string;
    children?: FolderType[];
};

type Props = {
    folders: FolderType[];
    currentFolderId?: number | null;
    path?: FolderType[];
};

const COLORS = [
    '#A6392C', // Burgundy
    '#AD8B52', // Gold
    '#2D6A4F', // Forest
    '#1E3A5F', // Navy
    '#7B4B3A', // Brown
    '#5C6B73', // Slate
    '#9C6B7C', // Mauve
    '#4A6D7C', // Teal
];

export default function MyArchive({ folders: initialFolders, currentFolderId, path = [] }: Props) {
    const { auth } = usePage().props;
    const [folders, setFolders] = useState<FolderType[]>(initialFolders);
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(currentFolderId || null);
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [newFolderColor, setNewFolderColor] = useState(COLORS[0]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number; folderId: number | null } | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
    const [dragOverFolderId, setDragOverFolderId] = useState<number | null>(null);
    const [draggedFolderId, setDraggedFolderId] = useState<number | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [navigationHistory, setNavigationHistory] = useState<Array<number | null>>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const createInputRef = useRef<HTMLInputElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Get current folder's children
    const currentFolders = folders.filter(f => f.parent_id === selectedFolderId);
    const parentFolder = selectedFolderId ? folders.find(f => f.id === selectedFolderId) : null;

    // Get parent chain for breadcrumb
    const getFolderPath = (folderId: number | null): FolderType[] => {
        if (!folderId) return [];
        const folder = folders.find(f => f.id === folderId);
        if (!folder) return [];
        return [...getFolderPath(folder.parent_id), folder];
    };

    const folderPath = getFolderPath(selectedFolderId);

    // Search functionality
    const filteredFolders = searchQuery
        ? folders.filter(f =>
            f.parent_id === selectedFolderId &&
            f.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : currentFolders;

    // Navigation functions
    const navigateToFolder = (folderId: number | null) => {
        // Add to history
        const newHistory = navigationHistory.slice(0, historyIndex + 1);
        newHistory.push(folderId);
        setNavigationHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);

        setSelectedFolderId(folderId);
        setSelectedItems(new Set());
        setSearchQuery('');
    };

    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setSelectedFolderId(navigationHistory[newIndex]);
            setSelectedItems(new Set());
            setSearchQuery('');
        }
    };

    const goForward = () => {
        if (historyIndex < navigationHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setSelectedFolderId(navigationHistory[newIndex]);
            setSelectedItems(new Set());
            setSearchQuery('');
        }
    };

    // Initialize navigation history
    useEffect(() => {
        if (navigationHistory.length === 0 && historyIndex === -1) {
            setNavigationHistory([null]);
            setHistoryIndex(0);
        }
    }, []);

    // Create folder
    const createFolder = () => {
        if (!newFolderName.trim()) return;

        router.post('/client/folders', {
            name: newFolderName,
            parent_id: selectedFolderId,
            color: newFolderColor,
        }, {
            onSuccess: () => {
                setNewFolderName('');
                setIsCreating(false);
                setShowColorPicker(false);
                router.reload();
            }
        });
    };

    // Update folder
    const updateFolder = (id: number, data: { name?: string; color?: string; parent_id?: number | null }) => {
        router.patch(`/client/folders/${id}`, data, {
            onSuccess: () => {
                setEditingFolderId(null);
                setShowContextMenu(null);
                router.reload();
            }
        });
    };

    // Delete folder
    const deleteFolder = (id: number) => {
        if (!confirm('Are you sure you want to delete this folder and all its contents?')) return;

        router.delete(`/client/folders/${id}`, {
            onSuccess: () => {
                setShowContextMenu(null);
                router.reload();
            }
        });
    };

    // Handle drag and drop
    const handleDragStart = (e: React.DragEvent, folderId: number) => {
        setDraggedFolderId(folderId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(folderId));

        // Select the dragged item if not already selected
        if (!selectedItems.has(folderId)) {
            setSelectedItems(new Set([folderId]));
        }
    };

    const handleDragOver = (e: React.DragEvent, folderId: number | null) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverFolderId(folderId);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOverFolderId(null);
    };

    const handleDrop = (e: React.DragEvent, targetFolderId: number | null) => {
        e.preventDefault();
        setDragOverFolderId(null);

        const sourceId = parseInt(e.dataTransfer.getData('text/plain'));

        if (sourceId === targetFolderId) return;

        // Check if trying to drop a folder into its own child
        const isChild = (parentId: number | null, childId: number): boolean => {
            if (!parentId) return false;
            const folder = folders.find(f => f.id === parentId);
            if (!folder) return false;
            if (folder.parent_id === childId) return true;
            return isChild(folder.parent_id, childId);
        };

        if (targetFolderId && isChild(targetFolderId, sourceId)) {
            alert('Cannot move a folder into its own subfolder');
            return;
        }

        // Move multiple selected folders
        const itemsToMove = selectedItems.has(sourceId) ? Array.from(selectedItems) : [sourceId];
        itemsToMove.forEach(id => {
            if (id !== targetFolderId) {
                updateFolder(id, { parent_id: targetFolderId });
            }
        });

        setDraggedFolderId(null);
        setSelectedItems(new Set());
    };

    // Context menu handlers
    const handleContextMenu = (e: React.MouseEvent, folderId: number | null) => {
        e.preventDefault();
        e.stopPropagation();
        setShowContextMenu({ x: e.clientX, y: e.clientY, folderId });
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + N - New folder
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                setIsCreating(true);
                setTimeout(() => createInputRef.current?.focus(), 100);
            }

            // Ctrl/Cmd + F - Focus search
            if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }

            // Escape - Cancel actions
            if (e.key === 'Escape') {
                setIsCreating(false);
                setEditingFolderId(null);
                setShowContextMenu(null);
                setSearchQuery('');
                setSelectedItems(new Set());
                searchInputRef.current?.blur();
            }

            // Delete/Backspace - Delete selected items
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItems.size > 0) {
                e.preventDefault();
                if (confirm(`Delete ${selectedItems.size} folder${selectedItems.size > 1 ? 's' : ''}?`)) {
                    selectedItems.forEach(id => deleteFolder(id));
                }
            }

            // Ctrl/Cmd + A - Select all
            if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                e.preventDefault();
                if (filteredFolders.length > 0) {
                    setSelectedItems(new Set(filteredFolders.map(f => f.id)));
                }
            }

            // Alt/Option + Left - Go back
            if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                goBack();
            }

            // Alt/Option + Right - Go forward
            if (e.altKey && e.key === 'ArrowRight') {
                e.preventDefault();
                goForward();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedItems, filteredFolders, navigationHistory, historyIndex]);

    // Focus inputs
    useEffect(() => {
        if (isCreating) createInputRef.current?.focus();
        if (editingFolderId) editInputRef.current?.focus();
    }, [isCreating, editingFolderId]);

    // Click outside for context menu
    useEffect(() => {
        const handleClickOutside = () => setShowContextMenu(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Toggle folder expansion
    const toggleFolder = (folderId: number) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    };

    // Handle item click (single click = select, double click = open)
    const handleItemClick = (e: React.MouseEvent, folderId: number) => {
        e.preventDefault();

        const folder = filteredFolders.find(f => f.id === folderId);
        if (!folder) return;

        if (e.ctrlKey || e.metaKey) {
            // Toggle selection
            setSelectedItems(prev => {
                const newSet = new Set(prev);
                if (newSet.has(folderId)) {
                    newSet.delete(folderId);
                } else {
                    newSet.add(folderId);
                }
                return newSet;
            });
        } else if (e.shiftKey) {
            // Range selection
            const currentIndex = filteredFolders.findIndex(f => f.id === folderId);
            const lastSelected = Array.from(selectedItems).pop();
            if (lastSelected) {
                const lastIndex = filteredFolders.findIndex(f => f.id === lastSelected);
                const start = Math.min(currentIndex, lastIndex);
                const end = Math.max(currentIndex, lastIndex);
                const range = filteredFolders.slice(start, end + 1);
                setSelectedItems(new Set(range.map(f => f.id)));
            } else {
                setSelectedItems(new Set([folderId]));
            }
        } else {
            // Single selection - just select, don't navigate
            setSelectedItems(new Set([folderId]));
        }
    };

    const handleItemDoubleClick = (folderId: number) => {
        // Navigate into the folder
        navigateToFolder(folderId);
    };

    // Render folder tree recursively
    const renderFolderTree = (folder: FolderType, level: number = 0) => {
        const children = folders.filter(f => f.parent_id === folder.id);
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;

        return (
            <div key={folder.id} className="select-none">
                <div
                    className={`group flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-[#E6E2D6]/50 dark:hover:bg-[#2C313A]/50 ${
                        isSelected ? 'bg-[#A6392C]/10 dark:bg-[#A6392C]/20' : ''
                    }`}
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                    onClick={() => {
                        // Single click on sidebar item selects and navigates
                        navigateToFolder(folder.id);
                    }}
                    onContextMenu={(e) => handleContextMenu(e, folder.id)}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFolder(folder.id);
                        }}
                        className="flex h-5 w-5 items-center justify-center rounded hover:bg-[#D6D0BF]/50 dark:hover:bg-[#2C313A]"
                    >
                        {children.length > 0 ? (
                            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        ) : (
                            <span className="w-[14px]" />
                        )}
                    </button>

                    <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: folder.color || '#AD8B52' }}
                    />

                    <span className="flex-1 truncate text-sm font-medium">
                        {folder.name}
                    </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setEditingFolderId(folder.id);
                            setEditName(folder.name);
                            setShowContextMenu(null);
                        }}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                        <Edit2 size={14} className="text-[#6E6A5C] dark:text-[#A39D8C]" />
                    </button>
                </div>

                {isExpanded && children.length > 0 && (
                    <div>
                        {children.map(child => renderFolderTree(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Get the folder path for breadcrumbs
    const getBreadcrumbPath = (): Array<{ name: string; onClick?: () => void }> => {
        const path = [{ name: 'Archive', onClick: () => navigateToFolder(null) }];
        folderPath.forEach(f => {
            path.push({
                name: f.name,
                onClick: () => navigateToFolder(f.id)
            });
        });
        return path;
    };

    return (
        <ClientLayout
            title={parentFolder ? `${parentFolder.name} - My Archive` : 'My Archive'}
            breadcrumbs={getBreadcrumbPath().map(item => item.name)}
            folders={folders}
            onBreadcrumbClick={(index) => {
                const path = getBreadcrumbPath();
                if (path[index]?.onClick) {
                    path[index].onClick();
                }
            }}
        >
            <div className="space-y-6">
                {/* Navigation Bar */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={goBack}
                        disabled={historyIndex <= 0}
                        className={`rounded p-2 transition ${
                            historyIndex > 0
                                ? 'hover:bg-[#E6E2D6] dark:hover:bg-[#2C313A] text-[#151A21] dark:text-[#ECE7DA]'
                                : 'text-[#D6D0BF] dark:text-[#2C313A] cursor-not-allowed'
                        }`}
                        title="Go back (Alt+←)"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <button
                        onClick={goForward}
                        disabled={historyIndex >= navigationHistory.length - 1}
                        className={`rounded p-2 transition ${
                            historyIndex < navigationHistory.length - 1
                                ? 'hover:bg-[#E6E2D6] dark:hover:bg-[#2C313A] text-[#151A21] dark:text-[#ECE7DA]'
                                : 'text-[#D6D0BF] dark:text-[#2C313A] cursor-not-allowed'
                        }`}
                        title="Go forward (Alt+→)"
                    >
                        <ChevronRight size={18} />
                    </button>

                    <div className="flex-1" />

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1 text-sm">
                        <button
                            onClick={() => navigateToFolder(null)}
                            className="flex items-center gap-1 text-[#6E6A5C] hover:text-[#A6392C] dark:text-[#A39D8C] dark:hover:text-[#C97A6C]"
                        >
                            <Home size={14} />
                            <span className="hidden sm:inline">All</span>
                        </button>
                        {folderPath.map((folder, index) => (
                            <div key={folder.id} className="flex items-center gap-1">
                                <ChevronRight size={12} className="text-[#6E6A5C] dark:text-[#A39D8C]" />
                                <button
                                    onClick={() => navigateToFolder(folder.id)}
                                    className="hover:text-[#A6392C] dark:hover:text-[#C97A6C]"
                                >
                                    {folder.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Header with actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div
                                className="h-10 w-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: parentFolder?.color ? `${parentFolder.color}20` : '#AD8B5220' }}
                            >
                                <Folder
                                    size={24}
                                    style={{ color: parentFolder?.color || '#AD8B52' }}
                                />
                            </div>
                            <div>
                                <h1 className="font-[Fraunces] text-2xl font-semibold">
                                    {parentFolder ? parentFolder.name : 'All Folders'}
                                </h1>
                                <p className="text-sm text-[#6E6A5C] dark:text-[#A39D8C]">
                                    {filteredFolders.length} folder{filteredFolders.length !== 1 ? 's' : ''}
                                    {selectedItems.size > 0 && ` · ${selectedItems.size} selected`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                setIsCreating(true);
                                setTimeout(() => createInputRef.current?.focus(), 100);
                            }}
                            className="flex items-center gap-2 rounded bg-[#A6392C] px-4 py-2 text-sm font-medium text-[#F1EDE1] transition hover:bg-[#8A2E23]"
                        >
                            <FolderPlus size={16} />
                            <span className="hidden sm:inline">New Folder</span>
                            <kbd className="hidden rounded bg-[#F1EDE1]/20 px-1.5 py-0.5 font-mono text-[10px] text-[#F1EDE1] sm:inline">
                                ⌘N
                            </kbd>
                        </button>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="hidden rounded border border-[#D6D0BF] px-4 py-2 text-sm transition hover:bg-[#F1EDE1] dark:border-[#2C313A] dark:hover:bg-[#1B1F26] sm:flex items-center gap-2"
                        >
                            <Upload size={16} />
                            Upload
                        </button>
                    </div>
                </div>

                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6A5C] dark:text-[#A39D8C]" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search folders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-[#A6392C] focus:ring-2 focus:ring-[#A6392C]/20 dark:border-[#2C313A] dark:bg-[#1B1F26] dark:text-[#ECE7DA]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-[#D6D0BF]/50 dark:hover:bg-[#2C313A]"
                        >
                            <X size={14} className="text-[#6E6A5C] dark:text-[#A39D8C]" />
                        </button>
                    )}
                    <kbd className="absolute right-10 top-1/2 -translate-y-1/2 hidden rounded border border-[#D6D0BF] px-1.5 py-0.5 font-mono text-[10px] text-[#6E6A5C] dark:border-[#2C313A] dark:text-[#A39D8C] sm:block">
                        ⌘F
                    </kbd>
                </div>

                {/* Create folder input */}
                {isCreating && (
                    <div className="rounded-lg border-2 border-dashed border-[#A6392C] bg-[#F1EDE1]/50 p-4 dark:bg-[#1B1F26]/50">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] dark:border-[#2C313A] dark:bg-[#1B1F26]">
                                    <Folder size={20} />
                                </div>
                                <input
                                    ref={createInputRef}
                                    type="text"
                                    placeholder="Folder name"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && createFolder()}
                                    className="flex-1 rounded border border-[#D6D0BF] bg-[#F1EDE1] px-3 py-2 text-sm outline-none transition focus:border-[#A6392C] focus:ring-1 focus:ring-[#A6392C] dark:border-[#2C313A] dark:bg-[#0F1216] dark:text-[#ECE7DA]"
                                    placeholder="Enter folder name..."
                                />
                                <button
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                    className="rounded border border-[#D6D0BF] px-2 py-2 text-sm transition hover:bg-[#E6E2D6] dark:border-[#2C313A] dark:hover:bg-[#2C313A]"
                                >
                                    <div
                                        className="h-5 w-5 rounded"
                                        style={{ backgroundColor: newFolderColor }}
                                    />
                                </button>
                                <button
                                    onClick={createFolder}
                                    className="rounded bg-[#A6392C] px-4 py-2 text-sm font-medium text-[#F1EDE1] transition hover:bg-[#8A2E23]"
                                >
                                    Create
                                </button>
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setShowColorPicker(false);
                                    }}
                                    className="rounded px-3 py-2 text-sm transition hover:bg-[#E6E2D6] dark:hover:bg-[#2C313A]"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            {showColorPicker && (
                                <div className="flex flex-wrap gap-2">
                                    {COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setNewFolderColor(color)}
                                            className={`h-8 w-8 rounded-full border-2 transition ${
                                                color === newFolderColor ? 'border-[#151A21] dark:border-[#ECE7DA]' : 'border-transparent'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Folder grid */}
                <div
                    className="min-h-[300px] rounded-lg bg-[#F1EDE1]/30 p-4 dark:bg-[#1B1F26]/30"
                    onDragOver={(e) => handleDragOver(e, selectedFolderId)}
                    onDrop={(e) => handleDrop(e, selectedFolderId)}
                    onContextMenu={(e) => handleContextMenu(e, selectedFolderId)}
                >
                    {filteredFolders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Folder size={48} className="mb-4 text-[#D6D0BF] dark:text-[#2C313A]" />
                            <h3 className="font-[Fraunces] text-lg font-semibold">Empty folder</h3>
                            <p className="text-sm text-[#6E6A5C] dark:text-[#A39D8C]">
                                {searchQuery ? 'No folders match your search' : 'Create a new folder to get started'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => {
                                        setIsCreating(true);
                                        setTimeout(() => createInputRef.current?.focus(), 100);
                                    }}
                                    className="mt-4 rounded bg-[#A6392C] px-4 py-2 text-sm font-medium text-[#F1EDE1] transition hover:bg-[#8A2E23]"
                                >
                                    <FolderPlus size={16} className="mr-2 inline" />
                                    New Folder
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filteredFolders.map(folder => (
                                <div
                                    key={folder.id}
                                    className={`group relative rounded-lg border transition-all hover:shadow-md ${
                                        selectedItems.has(folder.id)
                                            ? 'border-[#A6392C] bg-[#A6392C]/5 ring-2 ring-[#A6392C] dark:bg-[#A6392C]/10'
                                            : 'border-[#D6D0BF] bg-[#F1EDE1] hover:bg-[#E6E2D6] dark:border-[#2C313A] dark:bg-[#1B1F26] dark:hover:bg-[#2C313A]'
                                    } ${dragOverFolderId === folder.id ? 'ring-2 ring-[#A6392C]' : ''}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, folder.id)}
                                    onDragOver={(e) => handleDragOver(e, folder.id)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, folder.id)}
                                    onContextMenu={(e) => handleContextMenu(e, folder.id)}
                                    onClick={(e) => handleItemClick(e, folder.id)}
                                    onDoubleClick={() => handleItemDoubleClick(folder.id)}
                                >
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div
                                                    className="mb-3 h-12 w-12 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: folder.color ? `${folder.color}20` : '#AD8B5220' }}
                                                >
                                                    <Folder size={24} style={{ color: folder.color || '#AD8B52' }} />
                                                </div>
                                                {editingFolderId === folder.id ? (
                                                    <input
                                                        ref={editInputRef}
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                updateFolder(folder.id, { name: editName });
                                                            }
                                                            if (e.key === 'Escape') {
                                                                setEditingFolderId(null);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            if (editName.trim()) {
                                                                updateFolder(folder.id, { name: editName });
                                                            } else {
                                                                setEditingFolderId(null);
                                                            }
                                                        }}
                                                        className="w-full rounded border border-[#A6392C] bg-[#F1EDE1] px-2 py-1 text-sm font-medium outline-none dark:bg-[#0F1216] dark:text-[#ECE7DA]"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <h3 className="truncate text-sm font-medium">{folder.name}</h3>
                                                )}
                                                <p className="mt-1 text-xs text-[#6E6A5C] dark:text-[#A39D8C]">
                                                    {folders.filter(f => f.parent_id === folder.id).length} items
                                                </p>
                                            </div>
                                            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingFolderId(folder.id);
                                                        setEditName(folder.name);
                                                    }}
                                                    className="rounded p-1 hover:bg-[#D6D0BF]/50 dark:hover:bg-[#2C313A]"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteFolder(folder.id);
                                                    }}
                                                    className="rounded p-1 hover:bg-[#D6D0BF]/50 dark:hover:bg-[#2C313A]"
                                                >
                                                    <Trash2 size={14} className="text-[#A6392C]" />
                                                </button>
                                            </div>
                                        </div>
                                        {selectedItems.has(folder.id) && (
                                            <div className="mt-2 flex items-center gap-1 text-xs text-[#A6392C]">
                                                <div className="h-1.5 w-1.5 rounded-full bg-[#A6392C]" />
                                                Selected
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Context Menu */}
                {showContextMenu && (
                    <div
                        className="fixed z-50 min-w-[200px] rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] py-1 shadow-lg dark:border-[#2C313A] dark:bg-[#1B1F26]"
                        style={{ top: showContextMenu.y, left: showContextMenu.x }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-[#E6E2D6] dark:hover:bg-[#2C313A]"
                            onClick={() => {
                                setIsCreating(true);
                                setShowContextMenu(null);
                                setTimeout(() => createInputRef.current?.focus(), 100);
                            }}
                        >
                            <FolderPlus size={14} />
                            New Folder
                        </button>
                        {showContextMenu.folderId && (
                            <>
                                <hr className="my-1 border-[#D6D0BF] dark:border-[#2C313A]" />
                                <button
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-[#E6E2D6] dark:hover:bg-[#2C313A]"
                                    onClick={() => {
                                        const folder = folders.find(f => f.id === showContextMenu.folderId);
                                        if (folder) {
                                            setEditingFolderId(folder.id);
                                            setEditName(folder.name);
                                            setShowContextMenu(null);
                                        }
                                    }}
                                >
                                    <Edit2 size={14} />
                                    Rename
                                </button>
                                <button
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#A6392C] hover:bg-[#E6E2D6] dark:hover:bg-[#2C313A]"
                                    onClick={() => {
                                        if (showContextMenu.folderId) {
                                            deleteFolder(showContextMenu.folderId);
                                        }
                                    }}
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                                <button
                                    className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-[#E6E2D6] dark:hover:bg-[#2C313A]"
                                    onClick={() => {
                                        if (showContextMenu.folderId) {
                                            const folder = folders.find(f => f.id === showContextMenu.folderId);
                                            if (folder) {
                                                // Copy folder name to clipboard
                                                navigator.clipboard?.writeText(folder.name);
                                                setShowContextMenu(null);
                                            }
                                        }
                                    }}
                                >
                                    Copy name
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Hidden file input for uploads */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                            // TODO: Implement file upload
                            console.log('Files to upload:', files);
                            alert(`Upload ${files.length} file${files.length > 1 ? 's' : ''} to ${parentFolder?.name || 'All Folders'}`);
                        }
                        e.target.value = '';
                    }}
                />

                {/* Keyboard shortcuts help */}
                <div className="flex flex-wrap items-center justify-center gap-3 rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] px-4 py-2 text-xs text-[#6E6A5C] dark:border-[#2C313A] dark:bg-[#1B1F26] dark:text-[#A39D8C]">
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-[#D6D0BF] px-1.5 py-0.5 font-mono dark:border-[#2C313A]">⌘N</kbd>
                        <span>New folder</span>
                    </span>
                    <span className="h-4 w-px bg-[#D6D0BF] dark:bg-[#2C313A]" />
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-[#D6D0BF] px-1.5 py-0.5 font-mono dark:border-[#2C313A]">⌘F</kbd>
                        <span>Search</span>
                    </span>
                    <span className="h-4 w-px bg-[#D6D0BF] dark:bg-[#2C313A]" />
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-[#D6D0BF] px-1.5 py-0.5 font-mono dark:border-[#2C313A]">⌘A</kbd>
                        <span>Select all</span>
                    </span>
                    <span className="h-4 w-px bg-[#D6D0BF] dark:bg-[#2C313A]" />
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-[#D6D0BF] px-1.5 py-0.5 font-mono dark:border-[#2C313A]">Delete</kbd>
                        <span>Delete selected</span>
                    </span>
                    <span className="h-4 w-px bg-[#D6D0BF] dark:bg-[#2C313A]" />
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-[#D6D0BF] px-1.5 py-0.5 font-mono dark:border-[#2C313A]">Alt+←</kbd>
                        <span>Back</span>
                    </span>
                    <span className="h-4 w-px bg-[#D6D0BF] dark:bg-[#2C313A]" />
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-[#D6D0BF] px-1.5 py-0.5 font-mono dark:border-[#2C313A]">Alt+→</kbd>
                        <span>Forward</span>
                    </span>
                    <span className="h-4 w-px bg-[#D6D0BF] dark:bg-[#2C313A]" />
                    <span className="flex items-center gap-1">
                        <kbd className="rounded border border-[#D6D0BF] px-1.5 py-0.5 font-mono dark:border-[#2C313A]">Esc</kbd>
                        <span>Cancel</span>
                    </span>
                </div>
            </div>
        </ClientLayout>
    );
}