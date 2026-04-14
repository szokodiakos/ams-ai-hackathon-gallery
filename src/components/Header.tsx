import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
          AMS AI Hackathon Gallery
        </Link>
      </div>
    </header>
  );
}
