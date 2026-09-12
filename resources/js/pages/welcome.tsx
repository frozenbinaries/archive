import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const CATALOG = [
    {
        code: '01.CAT',
        title: 'Categorize',
        description: 'Sort files into categories and color-coded labels you define. Nested folders keep large archives easy to browse.',
    },
    {
        code: '02.VER',
        title: 'Version',
        description: 'Every save creates a new version. Compare changes side by side or restore any version in one click.',
    },
    {
        code: '03.SRC',
        title: 'Search',
        description: 'Search by name, content, category, or custom fields. Results return in under a second, even in large archives.',
    },
    {
        code: '04.SEC',
        title: 'Secure',
        description: 'Files stay encrypted at rest and in transit. Set role-based permissions down to the folder.',
    },
    {
        code: '05.LOG',
        title: 'Track',
        description: 'See who viewed, edited, or downloaded a file, and when. Export the full log whenever you need it.',
    },
    {
        code: '06.SHR',
        title: 'Share',
        description: 'Share a file or folder with a link, a password, or an expiration date. No extra accounts required.',
    },
];

const LEDGER = [
    { number: '50,000+', label: 'Documents filed' },
    { number: '10,000+', label: 'Active teams' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support desk' },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="ArchivePro — Every file, properly filed">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="font-[Inter] bg-[#E6E2D6] text-[#151A21] dark:bg-[#12151A] dark:text-[#ECE7DA]">
                {/* Navigation */}
                <nav
                    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                        scrolled
                            ? 'bg-[#E6E2D6]/95 backdrop-blur-md border-b border-[#D6D0BF] dark:bg-[#12151A]/95 dark:border-[#2C313A]'
                            : 'bg-transparent border-b border-transparent'
                    }`}
                >
                    <div className="mx-auto max-w-6xl px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#151A21] font-[IBM_Plex_Mono] text-sm font-semibold text-[#E6E2D6] dark:bg-[#ECE7DA] dark:text-[#12151A]">
                                    A
                                </div>
                                <span className="font-[Fraunces] text-lg font-semibold tracking-tight">ArchivePro</span>
                            </div>
                            <div className="flex items-center gap-6">
                                {/* Dark/Light mode toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="rounded-lg p-2 text-[#6E6A5C] transition hover:bg-[#F1EDE1]/50 dark:text-[#A39D8C] dark:hover:bg-[#1B1F26]/50"
                                    aria-label="Toggle theme"
                                >
                                    {isDarkMode ? (
                                        <Sun className="h-5 w-5" />
                                    ) : (
                                        <Moon className="h-5 w-5" />
                                    )}
                                </button>

                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded bg-[#A6392C] px-4 py-2 text-sm font-medium text-[#F1EDE1] transition hover:bg-[#8A2E23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6392C]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-sm font-medium text-[#151A21] transition hover:text-[#A6392C] dark:text-[#ECE7DA] dark:hover:text-[#C97A6C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6392C]"
                                        >
                                            Sign in
                                        </Link>
                                        <Link
                                            href={register()}
                                            className="rounded bg-[#A6392C] px-4 py-2 text-sm font-medium text-[#F1EDE1] transition hover:bg-[#8A2E23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6392C]"
                                        >
                                            Create account
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative overflow-hidden pt-32 pb-24">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(transparent, transparent 27px, #D6D0BF 28px)',
                        }}
                    />
                    <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
                        {/* Left */}
                        <div className="space-y-7">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6D0BF] bg-[#F1EDE1] px-3 py-1 font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#6E6A5C] dark:border-[#2C313A] dark:bg-[#1B1F26] dark:text-[#A39D8C]">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A6392C] opacity-75" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A6392C]" />
                                </span>
                                System operational
                            </div>

                            <h1 className="font-[Fraunces] text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                                Every file,
                                <span className="block text-[#A6392C]">properly filed.</span>
                            </h1>

                            <p className="max-w-md text-lg leading-relaxed text-[#6E6A5C] dark:text-[#A39D8C]">
                                Store, version, and search your documents in one place. Every
                                change is stamped, dated, and easy to roll back.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-1">
                                <Link
                                    href={register()}
                                    className="group inline-flex items-center gap-2 rounded bg-[#A6392C] px-6 py-3 font-medium text-[#F1EDE1] transition hover:bg-[#8A2E23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6392C]"
                                >
                                    Start filing — it's free
                                    <svg
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <Link
                                    href={login()}
                                    className="inline-flex items-center rounded border border-[#151A21]/20 px-6 py-3 font-medium text-[#151A21] transition hover:border-[#151A21]/40 dark:border-[#ECE7DA]/25 dark:text-[#ECE7DA] dark:hover:border-[#ECE7DA]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A6392C]"
                                >
                                    Sign in
                                </Link>
                            </div>

                            <div className="flex items-center gap-3 border-t border-[#D6D0BF] pt-6 font-[IBM_Plex_Mono] text-xs text-[#6E6A5C] dark:border-[#2C313A] dark:text-[#A39D8C]">
                                <span className="text-[#A6392C]">RATING 4.9 / 5.0</span>
                                <span className="h-1 w-1 rounded-full bg-[#D6D0BF] dark:bg-[#2C313A]" />
                                <span>10,000+ teams filing daily</span>
                            </div>
                        </div>

                        {/* Right — index card stack */}
                        <div className="relative mx-auto h-80 w-full max-w-sm sm:h-96">
                            <div className="absolute inset-0 -rotate-6 translate-x-3 translate-y-4 rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] shadow-sm dark:border-[#2C313A] dark:bg-[#1B1F26]" />
                            <div className="absolute inset-0 rotate-3 -translate-x-2 translate-y-2 rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] shadow-sm dark:border-[#2C313A] dark:bg-[#1B1F26]" />
                            <div className="animate-stamp-in absolute inset-0 rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] p-6 shadow-lg dark:border-[#2C313A] dark:bg-[#1B1F26]">
                                <div className="flex items-start justify-between font-[IBM_Plex_Mono] text-[11px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                    <span>Call No.</span>
                                    <span>ARC-2026-0803</span>
                                </div>
                                <div className="mt-6">
                                    <div className="font-[IBM_Plex_Mono] text-[11px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                        Title
                                    </div>
                                    <div className="mt-1 font-[Fraunces] text-xl font-semibold">
                                        Q3 Board Minutes
                                    </div>
                                </div>
                                <div className="mt-5 grid grid-cols-2 gap-4 font-[IBM_Plex_Mono] text-[11px] text-[#6E6A5C] dark:text-[#A39D8C]">
                                    <div>
                                        <div className="uppercase tracking-wider">Category</div>
                                        <div className="mt-1 text-[#151A21] dark:text-[#ECE7DA]">Governance</div>
                                    </div>
                                    <div>
                                        <div className="uppercase tracking-wider">Version</div>
                                        <div className="mt-1 text-[#151A21] dark:text-[#ECE7DA]">v4</div>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <div className="rotate-[-8deg] rounded-sm border-2 border-[#A6392C] px-3 py-1 font-[IBM_Plex_Mono] text-sm font-semibold uppercase tracking-widest text-[#A6392C]">
                                        Filed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Catalog / Features */}
                <section className="border-t border-[#D6D0BF] bg-[#F1EDE1] py-24 dark:border-[#2C313A] dark:bg-[#0F1216]">
                    <div className="mx-auto max-w-6xl px-6 lg:px-8">
                        <div className="max-w-xl">
                            <div className="font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#A6392C]">
                                The catalog
                            </div>
                            <h2 className="mt-3 font-[Fraunces] text-3xl font-semibold tracking-tight sm:text-4xl">
                                Six ways to keep an archive in order
                            </h2>
                        </div>

                        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-[#D6D0BF] bg-[#D6D0BF] sm:grid-cols-2 lg:grid-cols-3 dark:border-[#2C313A] dark:bg-[#2C313A]">
                            {CATALOG.map((item) => (
                                <div
                                    key={item.code}
                                    className="group relative bg-[#F1EDE1] p-6 transition-colors hover:bg-[#E6E2D6] dark:bg-[#1B1F26] dark:hover:bg-[#1F242C]"
                                >
                                    <div className="absolute left-0 top-0 h-1 w-10 bg-[#AD8B52] opacity-0 transition-opacity group-hover:opacity-100" />
                                    <div className="font-[IBM_Plex_Mono] text-xs tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                        {item.code}
                                    </div>
                                    <h3 className="mt-3 font-[Fraunces] text-lg font-semibold">{item.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#6E6A5C] dark:text-[#A39D8C]">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Ledger / Stats */}
                <section className="bg-[#151A21] py-16 text-[#E6E2D6]">
                    <div className="mx-auto max-w-6xl divide-y divide-[#2C313A] px-6 sm:grid sm:grid-cols-4 sm:divide-x sm:divide-y-0 lg:px-8">
                        {LEDGER.map((stat) => (
                            <div key={stat.label} className="py-6 text-center sm:py-0">
                                <div className="font-[Fraunces] text-3xl font-semibold text-[#C97A6C]">
                                    {stat.number}
                                </div>
                                <div className="mt-1 font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#A39D8C]">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="relative overflow-hidden bg-[#A6392C] py-20">
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-10 -top-10 rotate-[-12deg] select-none font-[IBM_Plex_Mono] text-[160px] font-bold text-[#8A2E23]/40"
                    >
                        FILED
                    </span>
                    <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
                        <h2 className="font-[Fraunces] text-3xl font-semibold text-[#F1EDE1] sm:text-4xl">
                            Your files, finally in order.
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-[#F1EDE1]/85">
                            Start free. No credit card, no setup fees.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link
                                href={register()}
                                className="rounded bg-[#F1EDE1] px-8 py-3 font-medium text-[#A6392C] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                Create free account
                            </Link>
                            <Link
                                href={login()}
                                className="rounded border border-[#F1EDE1]/60 px-8 py-3 font-medium text-[#F1EDE1] transition hover:bg-[#F1EDE1]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                Sign in
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#12151A] text-[#A39D8C]">
                    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded bg-[#ECE7DA] font-[IBM_Plex_Mono] text-sm font-semibold text-[#12151A]">
                                        A
                                    </div>
                                    <span className="font-[Fraunces] text-lg font-semibold text-[#ECE7DA]">
                                        ArchivePro
                                    </span>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed">
                                    Secure document management for teams that can't afford to lose a file.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#6E6A5C]">
                                    Product
                                </h3>
                                <ul className="mt-4 space-y-2 text-sm">
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Features</Link></li>
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Pricing</Link></li>
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Integrations</Link></li>
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Changelog</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#6E6A5C]">
                                    Company
                                </h3>
                                <ul className="mt-4 space-y-2 text-sm">
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">About</Link></li>
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Blog</Link></li>
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Careers</Link></li>
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Contact</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#6E6A5C]">
                                    Legal
                                </h3>
                                <ul className="mt-4 space-y-2 text-sm">
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Privacy policy</Link></li>
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Terms of service</Link></li>
                                    <li><Link href="#" className="transition hover:text-[#C97A6C]">Cookie policy</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-10 border-t border-[#2C313A] pt-8 text-center text-xs">
                            &copy; {new Date().getFullYear()} ArchivePro. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>

            <style jsx>{`
                @keyframes stamp-in {
                    0% {
                        opacity: 0;
                        transform: scale(1.08) rotate(-2deg);
                    }
                    60% {
                        opacity: 1;
                        transform: scale(0.98) rotate(0.5deg);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }
                .animate-stamp-in {
                    animation: stamp-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-stamp-in,
                    .animate-ping {
                        animation: none !important;
                    }
                }
            `}</style>
        </>
    );
}