import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-gray-400 text-lg">Page not found</p>
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
