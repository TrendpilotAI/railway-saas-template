"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">500</h1>
        <p className="text-gray-400 text-lg mb-4">Something went wrong</p>
        <button onClick={reset} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg transition">
          Try again
        </button>
      </div>
    </div>
  );
}
