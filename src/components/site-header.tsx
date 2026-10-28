import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-8">
      <Link href="/" className="text-2xl font-bold uppercase tracking-tight">
        AutoCycle
      </Link>
      <nav className="flex gap-8 text-sm font-medium uppercase">
        <Link href="/">Home</Link>
        <Link href="/#how-it-works">Solution</Link>
        <Link href="/#faq">FAQ</Link>
      </nav>
    </header>
  );
}
