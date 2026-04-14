import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1
        className="text-glow-1 font-pixel text-6xl"
        style={{ color: "var(--color-accent1)" }}
      >
        404
      </h1>
      <p
        className="mt-4 font-pixel text-sm"
        style={{ color: "var(--color-accent2)" }}
      >
        GAME NOT FOUND
      </p>
      <p
        className="mt-2 font-mono text-sm"
        style={{ color: "var(--color-text-dim)" }}
      >
        The game you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md border-2 px-6 py-3 font-pixel text-xs transition-all"
        style={{
          borderColor: "var(--color-accent1)",
          color: "var(--color-accent1)",
        }}
      >
        BACK TO GALLERY
      </Link>
    </div>
  );
}
