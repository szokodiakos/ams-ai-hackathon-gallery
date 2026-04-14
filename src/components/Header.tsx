import Link from "next/link";

export default function Header() {
  return (
    <header
      className="relative z-10 border-b"
      style={{
        backgroundColor: "var(--color-header-bg)",
        borderColor: "var(--color-header-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="group block">
          <h1
            className="font-pixel text-glow-1 text-center text-lg tracking-wider sm:text-xl"
            style={{ color: "var(--color-accent1)" }}
          >
            AMS AI HACKATHON
          </h1>
          <p
            className="text-glow-2 mt-2 text-center font-pixel text-[10px] tracking-widest"
            style={{ color: "var(--color-accent2)" }}
          >
            GALLERY
          </p>
        </Link>
      </div>
    </header>
  );
}
