import ClientLayout from '@/layouts/client-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { Folder, Upload, Users, Plus, ChevronRight } from 'lucide-react';

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
    user: {
        id: number;
        name: string;
        email: string;
    };
    folders: FolderType[];
};

const STATS = [
    { number: '1,284', label: 'Documents filed' },
    { number: '38.4 GB', label: 'Storage used' },
    { number: '12', label: 'Team members' },
    { number: '3', label: 'Pending reviews' },
];

const RECENT = [
    { code: 'ARC-2026-0803', title: 'Q3 Board Minutes', category: 'Governance', filed: 'Aug 3, 2026', status: 'Filed' },
    { code: 'ARC-2026-0801', title: 'Vendor Agreement — Northwind', category: 'Contracts', filed: 'Aug 1, 2026', status: 'In review' },
    { code: 'ARC-2026-0729', title: 'Employee Handbook v6', category: 'HR', filed: 'Jul 29, 2026', status: 'Filed' },
    { code: 'ARC-2026-0725', title: 'Facilities Lease Renewal', category: 'Operations', filed: 'Jul 25, 2026', status: 'Filed' },
];

export default function Dashboard({ user, folders }: Props) {
    // Get root folders (top-level folders)
    const rootFolders = folders.filter(f => f.parent_id === null);

    // Get recently created folders (last 3)
    const recentFolders = [...folders]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3);

    return (
        <ClientLayout
            title="Dashboard"
            breadcrumbs={['Archive', 'Dashboard']}
            folders={folders}
        >
            <div className="space-y-8">
                {/* Welcome section */}
                <section className="flex flex-col gap-1">
                    <div className="font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#A6392C]">Overview</div>
                    <h1 className="font-[Fraunces] text-3xl font-semibold tracking-tight">
                        Welcome back, {user.name}
                    </h1>
                    <p className="text-sm text-[#6E6A5C] dark:text-[#A39D8C]">
                        You have {folders.length} folder{folders.length !== 1 ? 's' : ''} in your archive.
                        {rootFolders.length > 0 && ` ${rootFolders.length} root folder${rootFolders.length !== 1 ? 's' : ''}.`}
                    </p>
                </section>

                {/* Ledger stats */}
                <section className="grid gap-px overflow-hidden rounded-lg border border-[#D6D0BF] bg-[#D6D0BF] sm:grid-cols-2 lg:grid-cols-4 dark:border-[#2C313A] dark:bg-[#2C313A]">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="bg-[#F1EDE1] px-5 py-5 dark:bg-[#1B1F26]">
                            <div className="font-[Fraunces] text-2xl font-semibold">{stat.number}</div>
                            <div className="mt-1 font-[IBM_Plex_Mono] text-[11px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left column - Recent folders and files */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Recent folders */}
                        {recentFolders.length > 0 && (
                            <section className="rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] dark:border-[#2C313A] dark:bg-[#1B1F26]">
                                <div className="flex items-center justify-between border-b border-[#D6D0BF] px-5 py-4 dark:border-[#2C313A]">
                                    <h2 className="font-[Fraunces] text-lg font-semibold">Recent folders</h2>
                                    <Link
                                        href="/client/folders"
                                        className="font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#A6392C] hover:text-[#8A2E23]"
                                    >
                                        View all
                                    </Link>
                                </div>
                                <ul className="divide-y divide-[#D6D0BF] dark:divide-[#2C313A]">
                                    {recentFolders.map((folder) => (
                                        <li key={folder.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#E6E2D6]/50 dark:hover:bg-[#2C313A]/50">
                                            <div
                                                className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: folder.color ? `${folder.color}20` : '#AD8B5220' }}
                                            >
                                                <Folder size={20} style={{ color: folder.color || '#AD8B52' }} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <Link
                                                    href={`/client/folders?folder_id=${folder.id}`}
                                                    className="truncate font-medium hover:text-[#A6392C] dark:hover:text-[#C97A6C]"
                                                >
                                                    {folder.name}
                                                </Link>
                                                <div className="text-xs text-[#6E6A5C] dark:text-[#A39D8C]">
                                                    {folder.children?.length || 0} items · Created {new Date(folder.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-[#6E6A5C] dark:text-[#A39D8C]" />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {/* Recently filed */}
                        <section className="rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] dark:border-[#2C313A] dark:bg-[#1B1F26]">
                            <div className="flex items-center justify-between border-b border-[#D6D0BF] px-5 py-4 dark:border-[#2C313A]">
                                <h2 className="font-[Fraunces] text-lg font-semibold">Recently filed</h2>
                                <a
                                    href="#"
                                    className="font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#A6392C] hover:text-[#8A2E23]"
                                >
                                    View all
                                </a>
                            </div>
                            <ul className="divide-y divide-[#D6D0BF] dark:divide-[#2C313A]">
                                {RECENT.map((doc) => (
                                    <li key={doc.code} className="flex items-center gap-4 px-5 py-4 hover:bg-[#E6E2D6]/50 dark:hover:bg-[#2C313A]/50">
                                        <span className="font-[IBM_Plex_Mono] text-[11px] text-[#6E6A5C] dark:text-[#A39D8C]">
                                            {doc.code}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate font-medium">{doc.title}</div>
                                            <div className="text-xs text-[#6E6A5C] dark:text-[#A39D8C]">
                                                {doc.category} · Filed {doc.filed}
                                            </div>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-2.5 py-1 font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wider ${
                                                doc.status === 'Filed'
                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-[#AD8B52]/15 text-[#8A6F3F] dark:text-[#D8C08A]'
                                            }`}
                                        >
                                            {doc.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Right column - Quick actions and folder stats */}
                    <div className="space-y-6">
                        {/* Quick actions */}
                        <section className="rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] p-5 dark:border-[#2C313A] dark:bg-[#1B1F26]">
                            <h2 className="font-[Fraunces] text-lg font-semibold">Quick actions</h2>
                            <div className="mt-4 flex flex-col gap-3">
                                <Link
                                    href="/client/folders"
                                    className="flex w-full items-center justify-start gap-2 rounded bg-[#A6392C] px-4 py-2.5 text-sm font-medium text-[#F1EDE1] transition hover:bg-[#8A2E23]"
                                >
                                    <Folder size={18} />
                                    Browse Archive
                                </Link>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2 border-[#D6D0BF] dark:border-[#2C313A]"
                                >
                                    <Upload size={18} />
                                    Upload document
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2 border-[#D6D0BF] dark:border-[#2C313A]"
                                >
                                    <Plus size={18} />
                                    New folder
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-2 border-[#D6D0BF] dark:border-[#2C313A]"
                                >
                                    <Users size={18} />
                                    Invite teammate
                                </Button>
                            </div>
                        </section>

                        {/* Folder stats */}
                        <section className="rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] p-5 dark:border-[#2C313A] dark:bg-[#1B1F26]">
                            <h2 className="font-[Fraunces] text-lg font-semibold">Archive stats</h2>
                            <div className="mt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#6E6A5C] dark:text-[#A39D8C]">Total folders</span>
                                    <span className="font-semibold">{folders.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#6E6A5C] dark:text-[#A39D8C]">Root folders</span>
                                    <span className="font-semibold">{rootFolders.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#6E6A5C] dark:text-[#A39D8C]">Nested folders</span>
                                    <span className="font-semibold">{folders.length - rootFolders.length}</span>
                                </div>
                                {rootFolders.length > 0 && (
                                    <div className="pt-3 border-t border-[#D6D0BF] dark:border-[#2C313A]">
                                        <p className="text-xs text-[#6E6A5C] dark:text-[#A39D8C]">Top-level folders:</p>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {rootFolders.slice(0, 5).map(folder => (
                                                <span
                                                    key={folder.id}
                                                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
                                                    style={{
                                                        backgroundColor: folder.color ? `${folder.color}20` : '#AD8B5220',
                                                        color: folder.color || '#AD8B52'
                                                    }}
                                                >
                                                    <div
                                                        className="h-1.5 w-1.5 rounded-full"
                                                        style={{ backgroundColor: folder.color || '#AD8B52' }}
                                                    />
                                                    {folder.name}
                                                </span>
                                            ))}
                                            {rootFolders.length > 5 && (
                                                <span className="text-xs text-[#6E6A5C] dark:text-[#A39D8C]">
                                                    +{rootFolders.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </ClientLayout>
    );
}