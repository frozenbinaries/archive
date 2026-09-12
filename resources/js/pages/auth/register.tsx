import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { useState, useEffect } from 'react';
import { ArrowLeft, Home } from 'lucide-react';

type Props = {
    passwordRules: string;
};

const FILES = [
    {
        id: 'ARC-2026-0803',
        title: 'Q3 Board Minutes',
        category: 'Governance',
        version: 'v4',
        date: '2026-08-03'
    },
    {
        id: 'ARC-2026-0712',
        title: 'Product Roadmap 2027',
        category: 'Strategy',
        version: 'v3',
        date: '2026-07-12'
    },
    {
        id: 'ARC-2026-0628',
        title: 'Annual Security Audit',
        category: 'Compliance',
        version: 'v2',
        date: '2026-06-28'
    },
    {
        id: 'ARC-2026-0515',
        title: 'Q2 Financial Report',
        category: 'Finance',
        version: 'v5',
        date: '2026-05-15'
    }
];

export default function Register({ passwordRules }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFlipping(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % FILES.length);
                setIsFlipping(false);
            }, 600);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const currentFile = FILES[currentIndex];
    const nextIndex = (currentIndex + 1) % FILES.length;
    const nextFile = FILES[nextIndex];

    return (
        <>
            <Head title="Register" />

            <div className="fixed inset-0 z-0 flex overflow-y-auto bg-[#E6E2D6] font-[Inter] text-[#151A21] dark:bg-[#12151A] dark:text-[#ECE7DA]">
                {/* Left Pane — Form */}
                <div className="flex w-1/2 flex-col items-center justify-center bg-[#F1EDE1] px-8 py-12 shadow-xl dark:bg-[#1B1F26] lg:px-16">
                    <div className="w-full max-w-md">
                        {/* Brand with navigation */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#151A21] font-[IBM_Plex_Mono] text-sm font-semibold text-[#E6E2D6] dark:bg-[#ECE7DA] dark:text-[#12151A]">
                                    A
                                </div>
                                <span className="font-[Fraunces] text-2xl font-semibold tracking-tight">ArchivePro</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/"
                                    className="rounded p-2 text-[#6E6A5C] transition hover:bg-[#E6E2D6] hover:text-[#A6392C] dark:text-[#A39D8C] dark:hover:bg-[#2C313A] dark:hover:text-[#C97A6C]"
                                    aria-label="Go back to home"
                                >
                                    <Home className="h-5 w-5" />
                                </Link>
                                <button
                                    onClick={() => window.history.back()}
                                    className="rounded p-2 text-[#6E6A5C] transition hover:bg-[#E6E2D6] hover:text-[#A6392C] dark:text-[#A39D8C] dark:hover:bg-[#2C313A] dark:hover:text-[#C97A6C]"
                                    aria-label="Go back"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Eyebrow */}
                            <div className="flex items-center gap-2 font-[IBM_Plex_Mono] text-[11px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A6392C] opacity-75" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A6392C]" />
                                </span>
                                Create your archive
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={['password', 'password_confirmation']}
                                disableWhileProcessing
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        {/* Record fields — indexed against a binder spine */}
                                        <div className="relative flex flex-col gap-5 border-l-2 border-dashed border-[#D6D0BF] pl-6 dark:border-[#2C313A]">
                                            <div className="relative grid gap-2">
                                                <span className="absolute -left-[29px] top-[3px] h-2 w-2 rounded-full bg-[#AD8B52]" />
                                                <Label htmlFor="name" className="flex items-baseline gap-2">
                                                    <span className="font-[IBM_Plex_Mono] text-[10px] text-[#6E6A5C] dark:text-[#A39D8C]">01</span>
                                                    Full name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="name"
                                                    name="name"
                                                    placeholder="Full name"
                                                    className="border-[#D6D0BF] bg-[#E6E2D6] focus-visible:ring-[#A6392C] dark:border-[#2C313A] dark:bg-[#0F1216] dark:text-[#ECE7DA]"
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div className="relative grid gap-2">
                                                <span className="absolute -left-[29px] top-[3px] h-2 w-2 rounded-full bg-[#AD8B52]" />
                                                <Label htmlFor="email" className="flex items-baseline gap-2">
                                                    <span className="font-[IBM_Plex_Mono] text-[10px] text-[#6E6A5C] dark:text-[#A39D8C]">02</span>
                                                    Email address
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    name="email"
                                                    placeholder="email@example.com"
                                                    className="border-[#D6D0BF] bg-[#E6E2D6] focus-visible:ring-[#A6392C] dark:border-[#2C313A] dark:bg-[#0F1216] dark:text-[#ECE7DA]"
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="relative grid gap-2">
                                                <span className="absolute -left-[29px] top-[3px] h-2 w-2 rounded-full bg-[#AD8B52]" />
                                                <Label htmlFor="password" className="flex items-baseline gap-2">
                                                    <span className="font-[IBM_Plex_Mono] text-[10px] text-[#6E6A5C] dark:text-[#A39D8C]">03</span>
                                                    Password
                                                </Label>
                                                <PasswordInput
                                                    id="password"
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    placeholder="Password"
                                                    passwordrules={passwordRules}
                                                    className="border-[#D6D0BF] bg-[#E6E2D6] focus-visible:ring-[#A6392C] dark:border-[#2C313A] dark:bg-[#0F1216] dark:text-[#ECE7DA]"
                                                />
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="relative grid gap-2">
                                                <span className="absolute -left-[29px] top-[3px] h-2 w-2 rounded-full bg-[#AD8B52]" />
                                                <Label htmlFor="password_confirmation" className="flex items-baseline gap-2">
                                                    <span className="font-[IBM_Plex_Mono] text-[10px] text-[#6E6A5C] dark:text-[#A39D8C]">04</span>
                                                    Confirm password
                                                </Label>
                                                <PasswordInput
                                                    id="password_confirmation"
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    name="password_confirmation"
                                                    placeholder="Confirm password"
                                                    passwordrules={passwordRules}
                                                    className="border-[#D6D0BF] bg-[#E6E2D6] focus-visible:ring-[#A6392C] dark:border-[#2C313A] dark:bg-[#0F1216] dark:text-[#ECE7DA]"
                                                />
                                                <InputError message={errors.password_confirmation} />
                                            </div>
                                        </div>

                                        {/* Actions — separated from the record fields */}
                                        <div className="flex flex-col gap-5 border-t border-[#D6D0BF] pt-5 dark:border-[#2C313A]">
                                            <Button
                                                type="submit"
                                                className="group w-full gap-2 bg-[#A6392C] text-[#F1EDE1] hover:bg-[#8A2E23]"
                                                tabIndex={5}
                                                data-test="register-user-button"
                                            >
                                                {processing ? (
                                                    <Spinner />
                                                ) : (
                                                    <svg
                                                        className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                )}
                                                Create account
                                            </Button>
                                        </div>

                                        {/* Ticket-stub footer */}
                                        <div className="relative border-t-2 border-dashed border-[#D6D0BF] pt-6 text-center text-sm text-[#6E6A5C] dark:border-[#2C313A] dark:text-[#A39D8C]">
                                            <span className="absolute -top-[7px] left-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[#F1EDE1] dark:bg-[#1B1F26]" />
                                            <span className="absolute -top-[7px] right-0 h-3 w-3 translate-x-1/2 rounded-full bg-[#F1EDE1] dark:bg-[#1B1F26]" />
                                            Already have an account?{' '}
                                            <TextLink
                                                href={login()}
                                                tabIndex={6}
                                                className="text-[#A6392C] hover:text-[#8A2E23]"
                                            >
                                                Log in
                                            </TextLink>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>

                {/* Right Pane — Visual */}
                <div className="flex w-1/2 flex-col items-center justify-between bg-[#E6E2D6] p-12 dark:bg-[#12151A] lg:p-16">
                    {/* Header */}
                    <div className="w-full text-right">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#D6D0BF] bg-[#F1EDE1] px-3 py-1 font-[IBM_Plex_Mono] text-xs uppercase tracking-wider text-[#6E6A5C] dark:border-[#2C313A] dark:bg-[#1B1F26] dark:text-[#A39D8C]">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A6392C] opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A6392C]" />
                            </span>
                            Start archiving today
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8">
                        <div className="space-y-4 text-center">
                            <h1 className="font-[Fraunces] text-4xl font-semibold leading-[1.05] tracking-tight lg:text-5xl">
                                Start your
                                <span className="block text-[#A6392C]">digital archive.</span>
                            </h1>
                            <p className="text-base leading-relaxed text-[#6E6A5C] dark:text-[#A39D8C] lg:text-lg">
                                Join 10,000+ teams who never lose a file again.
                            </p>
                        </div>

                        {/* Index card stack with smooth flip effect */}
                        <div className="relative h-72 w-full max-w-sm lg:h-80">
                            {/* Bottom card - gentle shadow */}
                            <div className="absolute inset-0 -rotate-6 translate-x-3 translate-y-4 rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] shadow-sm dark:border-[#2C313A] dark:bg-[#1B1F26]" />

                            {/* Middle card - subtle rotation */}
                            <div className="absolute inset-0 rotate-3 -translate-x-2 translate-y-2 rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] shadow-sm dark:border-[#2C313A] dark:bg-[#1B1F26]" />

                            {/* Top card with smooth 3D flip */}
                            <div className="relative h-full w-full [perspective:1200px]">
                                <div
                                    className={`relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] ${
                                        isFlipping ? '[transform:rotateY(180deg)]' : ''
                                    }`}
                                >
                                    {/* Front face */}
                                    <div
                                        className={`absolute inset-0 [backface-visibility:hidden] rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] p-6 shadow-lg transition-opacity duration-300 dark:border-[#2C313A] dark:bg-[#1B1F26] ${
                                            isFlipping ? 'opacity-0' : 'opacity-100'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between font-[IBM_Plex_Mono] text-[11px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                            <span>Call No.</span>
                                            <span>{currentFile.id}</span>
                                        </div>
                                        <div className="mt-6">
                                            <div className="font-[IBM_Plex_Mono] text-[11px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                                Title
                                            </div>
                                            <div className="mt-1 font-[Fraunces] text-xl font-semibold">
                                                {currentFile.title}
                                            </div>
                                        </div>
                                        <div className="mt-5 grid grid-cols-2 gap-4 font-[IBM_Plex_Mono] text-[11px] text-[#6E6A5C] dark:text-[#A39D8C]">
                                            <div>
                                                <div className="uppercase tracking-wider">Category</div>
                                                <div className="mt-1 text-[#151A21] dark:text-[#ECE7DA]">{currentFile.category}</div>
                                            </div>
                                            <div>
                                                <div className="uppercase tracking-wider">Version</div>
                                                <div className="mt-1 text-[#151A21] dark:text-[#ECE7DA]">{currentFile.version}</div>
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <div className="rotate-[-8deg] rounded-sm border-2 border-[#A6392C] px-3 py-1 font-[IBM_Plex_Mono] text-sm font-semibold uppercase tracking-widest text-[#A6392C]">
                                                Filed
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back face */}
                                    <div
                                        className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg border border-[#D6D0BF] bg-[#F1EDE1] p-6 shadow-lg transition-opacity duration-300 dark:border-[#2C313A] dark:bg-[#1B1F26] ${
                                            isFlipping ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between font-[IBM_Plex_Mono] text-[11px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                            <span>Call No.</span>
                                            <span>{nextFile.id}</span>
                                        </div>
                                        <div className="mt-6">
                                            <div className="font-[IBM_Plex_Mono] text-[11px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                                Title
                                            </div>
                                            <div className="mt-1 font-[Fraunces] text-xl font-semibold">
                                                {nextFile.title}
                                            </div>
                                        </div>
                                        <div className="mt-5 grid grid-cols-2 gap-4 font-[IBM_Plex_Mono] text-[11px] text-[#6E6A5C] dark:text-[#A39D8C]">
                                            <div>
                                                <div className="uppercase tracking-wider">Category</div>
                                                <div className="mt-1 text-[#151A21] dark:text-[#ECE7DA]">{nextFile.category}</div>
                                            </div>
                                            <div>
                                                <div className="uppercase tracking-wider">Version</div>
                                                <div className="mt-1 text-[#151A21] dark:text-[#ECE7DA]">{nextFile.version}</div>
                                            </div>
                                        </div>
                                        <div className="mt-8 flex justify-end">
                                            <div className="rounded-sm bg-[#A6392C] px-3 py-1 font-[IBM_Plex_Mono] text-sm font-semibold uppercase tracking-widest text-[#F1EDE1]">
                                                Loading...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pagination dots - smooth hover */}
                            <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                                {FILES.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setIsFlipping(true);
                                            setTimeout(() => {
                                                setCurrentIndex(index);
                                                setIsFlipping(false);
                                            }, 600);
                                        }}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            index === currentIndex
                                                ? 'w-6 bg-[#A6392C]'
                                                : 'w-2 bg-[#D6D0BF] hover:bg-[#AD8B52] hover:scale-125 dark:bg-[#2C313A]'
                                        }`}
                                        aria-label={`Go to file ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid w-full max-w-sm grid-cols-2 gap-6 border-t border-[#D6D0BF] pt-6 dark:border-[#2C313A]">
                            <div className="text-center">
                                <div className="font-[Fraunces] text-2xl font-semibold text-[#A6392C]">10,000+</div>
                                <div className="font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                    Active teams
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-[Fraunces] text-2xl font-semibold text-[#A6392C]">24/7</div>
                                <div className="font-[IBM_Plex_Mono] text-[10px] uppercase tracking-wider text-[#6E6A5C] dark:text-[#A39D8C]">
                                    Support
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex w-full justify-center gap-6 text-xs text-[#6E6A5C] dark:text-[#A39D8C]">
                        <span className="font-[IBM_Plex_Mono] uppercase tracking-wider">Free forever plan</span>
                        <span className="h-4 w-px bg-[#D6D0BF] dark:bg-[#2C313A]" />
                        <span className="font-[IBM_Plex_Mono] uppercase tracking-wider">No credit card</span>
                    </div>
                </div>
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

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};