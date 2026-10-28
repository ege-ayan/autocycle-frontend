import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-3xl flex-col items-start justify-center px-4">
      <h1 className="text-4xl font-extrabold uppercase">Page not found</h1>
      <Link href="/" className="mt-6 underline">
        Back home
      </Link>
    </main>
  );
}
