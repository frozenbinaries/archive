import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { type ReactNode, useRef, useState, useEffect } from 'react';
import { ChevronRight, Moon, Sun } from 'lucide-react';

type NavHref = string | ReturnType<typeof dashboard>;
type IconComponent = (props: { className?: string }) => JSX.Element;

type NavItem = {
    code: string;
    label: string;
    href: NavHref;
    icon: IconComponent;
};

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

// Convert database folders to folder tree nodes
function buildFolderTree(folders: FolderType[]): FolderNode[] {
    const map = new Map<number, FolderNode>();
    const roots: FolderNode[] = [];

    // First pass: create all nodes
    folders.forEach(folder => {
        map.set(folder.id, {
            id: folder.id.toString(),
            name: folder.name,
            href: `/client/folders?folder_id=${folder.id}`,
            children: []
        });
    });

    // Second pass: build parent-child relationships
    folders.forEach(folder => {
        const node = map.get(folder.id);
        if (node) {
            if (folder.parent_id && map.has(folder.parent_id)) {
                const parent = map.get(folder.parent_id);
                if (parent) {
                    if (!parent.children) parent.children = [];
                    parent.children.push(node);
                }
            } else {
                roots.push(node);
            }
        }
    });

    return roots;
}

function IconDashboard({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="2.5" y="2.5" width="6" height="6" rx="1" />
            <rect x="11.5" y="2.5" width="6" height="6" rx="1" />
            <rect x="2.5" y="11.5" width="6" height="6" rx="1" />
            <rect x="11.5" y="11.5" width="6" height="6" rx="1" />
        </svg>
    );
}

function IconDocuments({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 2.5h5.5L15 6v11.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-14a1 1 0 011-1z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 2.5V6H15" />
        </svg>
    );
}

function IconCategories({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2.5H4a1 1 0 00-1 1v5.5l8.6 8.6a1 1 0 001.4 0l5.1-5.1a1 1 0 000-1.4L9.5 2.5z" />
            <circle cx="6.5" cy="6.5" r="1.1" />
        </svg>
    );
}

function IconShared({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="15" cy="4.5" r="2" />
            <circle cx="5" cy="10" r="2" />
            <circle cx="15" cy="15.5" r="2" />
            <path strokeLinecap="round" d="M6.7 9L13.3 5.6M6.7 11L13.3 14.4" />
        </svg>
    );
}

function IconActivity({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="10" cy="10" r="7.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 5.5V10l3 2" />
        </svg>
    );
}

function IconSettings({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="10" cy="10" r="2.5" />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.1 4.9l-1.4 1.4M6.3 13.7l-1.4 1.4M15.1 15.1l-1.4-1.4M6.3 6.3L4.9 4.9"
            />
        </svg>
    );
}

function IconChevron({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4.5l6 5.5-6 5.5" />
        </svg>
    );
}

function IconFolder({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.5 5.5a1 1 0 011-1H8l1.5 2h7a1 1 0 011 1v7a1 1 0 01-1 1h-13a1 1 0 01-1-1v-9z"
            />
        </svg>
    );
}

function IconFolderOpen({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.5 6.5a1 1 0 011-1H8l1.5 2h6.7a1 1 0 01.96 1.28l-1.4 5A1 1 0 0114.85 15H4.3a1 1 0 01-.97-.75L1.8 8.1a1 1 0 01.97-1.25"
            />
        </svg>
    );
}

function IconFolderPlus({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.5 5.5a1 1 0 011-1H8l1.5 2h7a1 1 0 011 1v7a1 1 0 01-1 1h-13a1 1 0 01-1-1v-9z"
            />
            <path strokeLinecap="round" d="M10 9.5v4M8 11.5h4" />
        </svg>
    );
}

function IconPlus({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M10 4v12M4 10h12" />
        </svg>
    );
}

function IconSun({ className }: { className?: string }) {
    return <Sun className={className} />;
}

function IconMoon({ className }: { className?: string }) {
    return <Moon className={className} />;
}

const NAV_ITEMS: NavItem[] = [
    { code: '01', label: 'Dashboard', href: '/client/dashboard', icon: IconDashboard },
    { code: '02', label: 'Documents', href: '/client/documents', icon: IconDocuments },
    { code: '03', label: 'My Archive', href: '/client/folders', icon: IconCategories },
    { code: '04', label: 'Shared', href: '/client/shared', icon: IconShared },
    { code: '05', label: 'Activity', href: '/client/activity', icon: IconActivity },
    { code: '06', label: 'Settings', href: '/client/settings/profile', icon: IconSettings },
];

// Define the folder node type for the tree
type FolderNode = {
    id: string;
    name: string;
    href: string;
    children?: FolderNode[];
    color?: string | null;
};

function FolderRow({
    node,
    depth,
    expanded,
    onToggle,
    currentUrl,
    onLinkClick,
}: {
    node: FolderNode;
    depth: number;
    expanded: Set<string>;
    onToggle: (id: string) => void;
    currentUrl: string;
    onLinkClick: () => void;
}) {
    const hasChildren = !!(node.children && node.children.length > 0);
    const isOpen = expanded.has(node.id);
    const active = currentUrl === node.href || currentUrl.startsWith(node.href + '&');

    return (
        <div>
            <div
                className={`group flex items-center gap-1 rounded-md py-1.5 pr-2 text-sm transition-colors ${
                    active
                        ? 'bg-[#A6392C]/10 text-[#A6392C] dark:bg-[#A6392C]/15'
                        : 'text-[#6E6A5C] hover:bg-[#E6E2D6] hover:text-[#151A21] dark:text-[#A39D8C] dark:hover:bg-[#12151A] dark:hover:text-[#ECE7DA]'
                }`}
                style={{ paddingLeft: 8 + depth * 16 }}
            >
                {hasChildren ? (
                    <button
                        type="button"
                        onClick={() => onToggle(node.id)}
                        aria-label={isOpen ? `Collapse ${node.name}` : `Expand ${node.name}`}
                        className="shrink-0 rounded p-0.5 text-[#6E6A5C] hover:text-[#151A21] dark:text-[#A39D8C] dark:hover:text-[#ECE7DA]"
                    >
                        <IconChevron className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                    </button>
                ) : (
                    <span className="w-4 shrink-0" />
                )}
                <Link href={node.href} onClick={onLinkClick} className="flex flex-1 items-center gap-2 truncate">
                    {isOpen && hasChildren ? (
                        <IconFolderOpen className="h-4 w-4 shrink-0" />
                    ) : (
                        <IconFolder className="h-4 w-4 shrink-0" />
                    )}
                    <span className="truncate">{node.name}</span>
                </Link>
            </div>
            {hasChildren && isOpen && (
                <div>
                    {node.children!.map((child) => (
                        <FolderRow
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            expanded={expanded}
                            onToggle={onToggle}
                            currentUrl={currentUrl}
                            onLinkClick={onLinkClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

type ClientLayoutProps = {
    children: ReactNode;
    title?: string;
    breadcrumbs?: string[] | Array<{ name: string; onClick?: () => void }>;
    folders?: FolderType[];
    onBreadcrumbClick?: (index: number) => void;
};

export default function ClientLayout({
    children,
    title,
    breadcrumbs = [],
    folders = [],
    onBreadcrumbClick
}: ClientLayoutProps) {
    const { auth } = usePage().props as { auth?: { user?: { name?: string; email?: string } } };
    const currentUrl = usePage().url;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    // Check for saved theme preference or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Build folder tree from database folders
    const folderTree = buildFolderTree(folders);

    // Auto-expand folders that are on the current path
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const folderId = params.get('folder_id');
        if (folderId) {
            // Find the folder path and expand all ancestors
            const expandPath = (tree: FolderNode[], targetId: string): boolean => {
                for (const node of tree) {
                    if (node.id === targetId) {
                        return true;
                    }
                    if (node.children) {
                        const found = expandPath(node.children, targetId);
                        if (found) {
                            setExpandedFolders(prev => new Set(prev).add(node.id));
                            return true;
                        }
                    }
                }
                return false;
            };
            expandPath(folderTree, folderId);
        }
    }, [folderTree]);

    function toggleFolder(id: string) {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function handleCreateFolder(event: React.FormEvent) {
        event.preventDefault();
        if (!newFolderName.trim()) {
            setCreatingFolder(false);
            return;
        }
        // TODO: wire up to your backend
        // router.post('/client/folders', { name: newFolderName }, { onSuccess: () => setCreatingFolder(false) });
        setCreatingFolder(false);
        setNewFolderName('');
    }

    // Convert breadcrumbs to array of strings if they're objects
    const breadcrumbLabels = Array.isArray(breadcrumbs)
        ? breadcrumbs.map(c => typeof c === 'string' ? c : c.name)
        : [];

    return (
        <div className="flex min-h-screen bg-[#E6E2D6] text-[#151A21] dark:bg-[#12151A] dark:text-[#ECE7DA]">
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#D6D0BF] bg-[#F1EDE1] transition-transform duration-200 dark:border-[#2C313A] dark:bg-[#1B1F26] lg:static lg:translate-x-0 ${
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center gap-3 border-b border-[#D6D0BF] px-5 dark:border-[#2C313A]">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#151A21] font-[IBM_Plex_Mono] text-sm font-semibold text-[#E6E2D6] dark:bg-[#ECE7DA] dark:text-[#12151A]">
                        A
                    </div>
                    <span className="font-[Fraunces] text-lg font-semibold tracking-tight">ArchivePro</span>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    <div className="space-y-1">
                        {NAV_ITEMS.map((item) => {
                            const target = typeof item.href === 'string' ? item.href : item.href.url;
                            const active = currentUrl === target || currentUrl.startsWith(`${target}/`);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                                        active
                                            ? 'bg-[#A6392C]/10 text-[#A6392C] dark:bg-[#A6392C]/15'
                                            : 'text-[#6E6A5C] hover:bg-[#E6E2D6] hover:text-[#151A21] dark:text-[#A39D8C] dark:hover:bg-[#12151A] dark:hover:text-[#ECE7DA]'
                                    }`}
                                >
                                    <span
                                        className={`h-4 w-1 rounded-full transition-colors ${
                                            active ? 'bg-[#A6392C]' : 'bg-transparent group-hover:bg-[#D6D0BF] dark:group-hover:bg-[#2C313A]'
                                        }`}
                                    />
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="flex-1 font-medium">{item.label}</span>
                                    <span className="font-[IBM_Plex_Mono] text-[10px] text-[#6E6A5C]/70 dark:text-[#A39D8C]/70">
                                        {item.code}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Folder tree with real folders */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between px-3 pb-2">
                            <span className="font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wider text-[#6E6A5C]/70 dark:text-[#A39D8C]/70">
                                Folders
                            </span>
                            <button
                                type="button"
                                onClick={() => setCreatingFolder(true)}
                                aria-label="New folder"
                                className="rounded p-1 text-[#6E6A5C] hover:bg-[#E6E2D6] hover:text-[#A6392C] dark:text-[#A39D8C] dark:hover:bg-[#12151A]"
                            >
                                <IconPlus className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        {creatingFolder && (
                            <form onSubmit={handleCreateFolder} className="mb-1 flex items-center gap-2 px-3">
                                <IconFolder className="h-4 w-4 shrink-0 text-[#6E6A5C] dark:text-[#A39D8C]" />
                                <input
                                    autoFocus
                                    value={newFolderName}
                                    onChange={(event) => setNewFolderName(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Escape') {
                                            setCreatingFolder(false);
                                            setNewFolderName('');
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!newFolderName.trim()) setCreatingFolder(false);
                                    }}
                                    placeholder="Folder name"
                                    className="w-full rounded border border-[#D6D0BF] bg-[#E6E2D6] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#A6392C]/40 dark:border-[#2C313A] dark:bg-[#12151A]"
                                />
                            </form>
                        )}

                        {folderTree.length > 0 ? (
                            <div className="space-y-0.5">
                                {folderTree.map((node) => (
                                    <FolderRow
                                        key={node.id}
                                        node={node}
                                        depth={0}
                                        expanded={expandedFolders}
                                        onToggle={toggleFolder}
                                        currentUrl={currentUrl}
                                        onLinkClick={() => setMobileOpen(false)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="px-3 py-4 text-center text-xs text-[#6E6A5C] dark:text-[#A39D8C]">
                                No folders yet. Create one!
                            </div>
                        )}
                    </div>
                </nav>

                <div className="border-t border-[#D6D0BF] p-4 dark:border-[#2C313A]">
                    <div className="flex items-center gap-3 rounded-md px-2 py-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#AD8B52]/20 font-[IBM_Plex_Mono] text-xs font-semibold text-[#8A6F3F] dark:text-[#D8C08A]">
                            {auth?.user?.name?.slice(0, 2).toUpperCase() ?? '—'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{auth?.user?.name ?? 'Guest'}</div>
                            <div className="truncate text-xs text-[#6E6A5C] dark:text-[#A39D8C]">
                                {auth?.user?.email ?? ''}
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="shrink-0 text-xs font-medium text-[#6E6A5C] transition hover:text-[#A6392C] dark:text-[#A39D8C]"
                        >
                            Log out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Hidden inputs for file uploads */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => {
                    console.log('files selected', event.target.files);
                    event.target.value = '';
                }}
            />
            <input
                ref={folderInputRef}
                type="file"
                // @ts-expect-error non-standard attribute, supported by Chromium-based browsers for folder selection
                webkitdirectory=""
                multiple
                className="hidden"
                onChange={(event) => {
                    console.log('folder selected', event.target.files);
                    event.target.value = '';
                }}
            />

            {/* Main column */}
            <div className="flex min-h-screen flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#D6D0BF] bg-[#E6E2D6]/95 px-4 backdrop-blur dark:border-[#2C313A] dark:bg-[#12151A]/95 sm:px-6">
                    <button
                        type="button"
                        aria-label="Open menu"
                        onClick={() => setMobileOpen(true)}
                        className="rounded p-2 text-[#6E6A5C] hover:bg-[#F1EDE1] dark:text-[#A39D8C] dark:hover:bg-[#1B1F26] lg:hidden"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path strokeLinecap="round" d="M3 5h14M3 10h14M3 15h14" />
                        </svg>
                    </button>

                    {/* Clickable Breadcrumbs */}
                    {breadcrumbLabels.length > 0 && (
                        <div className="hidden font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C] sm:flex items-center gap-1">
                            {breadcrumbLabels.map((crumb, index) => {
                                const isLast = index === breadcrumbLabels.length - 1;
                                const breadcrumbData = Array.isArray(breadcrumbs) ? breadcrumbs[index] : null;
                                const hasOnClick = typeof breadcrumbData === 'object' && breadcrumbData !== null && 'onClick' in breadcrumbData;

                                return (
                                    <div key={index} className="flex items-center gap-1">
                                        {index > 0 && <ChevronRight size={12} className="text-[#6E6A5C] dark:text-[#A39D8C]" />}
                                        {hasOnClick && (breadcrumbData as any).onClick ? (
                                            <button
                                                onClick={(breadcrumbData as any).onClick}
                                                className={`hover:text-[#A6392C] dark:hover:text-[#C97A6C] transition-colors ${
                                                    isLast ? 'text-[#151A21] dark:text-[#ECE7DA]' : 'text-[#6E6A5C] dark:text-[#A39D8C]'
                                                }`}
                                            >
                                                {crumb}
                                            </button>
                                        ) : onBreadcrumbClick ? (
                                            <button
                                                onClick={() => onBreadcrumbClick(index)}
                                                className={`hover:text-[#A6392C] dark:hover:text-[#C97A6C] transition-colors ${
                                                    isLast ? 'text-[#151A21] dark:text-[#ECE7DA]' : 'text-[#6E6A5C] dark:text-[#A39D8C]'
                                                }`}
                                            >
                                                {crumb}
                                            </button>
                                        ) : (
                                            <span className={isLast ? 'text-[#151A21] dark:text-[#ECE7DA]' : 'text-[#6E6A5C] dark:text-[#A39D8C]'}>
                                                {crumb}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="ml-auto flex items-center gap-3">
                        {/* Dark/Light mode toggle */}
                        <button
                            onClick={toggleTheme}
                            className="rounded-lg p-2 text-[#6E6A5C] transition hover:bg-[#F1EDE1] dark:text-[#A39D8C] dark:hover:bg-[#1B1F26]"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                        </button>

                        <div className="relative hidden sm:block">
                            <svg
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6A5C] dark:text-[#A39D8C]"
                                viewBox="0 0 20 20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                            >
                                <circle cx="9" cy="9" r="6" />
                                <path strokeLinecap="round" d="M17 17l-3.5-3.5" />
                            </svg>
                            <input
                                type="search"
                                placeholder="Search the archive…"
                                className="w-56 rounded-md border border-[#D6D0BF] bg-[#F1EDE1] py-2 pl-9 pr-3 font-[IBM_Plex_Mono] text-xs text-[#151A21] placeholder:text-[#6E6A5C] focus:outline-none focus:ring-2 focus:ring-[#A6392C]/40 dark:border-[#2C313A] dark:bg-[#1B1F26] dark:text-[#ECE7DA] dark:placeholder:text-[#A39D8C]"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
                    <div className="mx-auto max-w-6xl">{children}</div>
                </main>
            </div>
        </div>
    );
}