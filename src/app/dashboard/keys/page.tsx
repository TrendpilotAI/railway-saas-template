"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string | null;
  createdAt: string;
}

export default function KeysPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/keys").then((r) => r.json()).then(setKeys);
  }, [session]);

  if (!session) {
    router.push("/api/auth/signin");
    return null;
  }

  const createKey = async () => {
    const res = await fetch("/api/keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName || "Default" }),
    });
    const data = await res.json();
    setNewKey(data.key);
    setNewKeyName("");
    fetch("/api/keys").then((r) => r.json()).then(setKeys);
  };

  const deleteKey = async (id: string) => {
    await fetch("/api/keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setKeys(keys.filter((k) => k.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold">🚀 SaaS Starter</Link>
          <Link href="/dashboard" className="text-gray-400 hover:text-white">← Back to Dashboard</Link>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">API Keys</h1>

        {newKey && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-4 mb-6">
            <p className="text-sm text-green-400 mb-2">New key created! Copy it now — you won&apos;t see it again.</p>
            <code className="bg-gray-900 px-3 py-2 rounded block font-mono text-sm break-all">{newKey}</code>
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <input
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. Production)"
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 flex-1"
          />
          <button onClick={createKey} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-medium transition">
            Create Key
          </button>
        </div>

        <div className="space-y-3">
          {keys.map((key) => (
            <div key={key.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{key.name}</div>
                <code className="text-sm text-gray-400">{key.key}</code>
                <div className="text-xs text-gray-500 mt-1">
                  Created {new Date(key.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button onClick={() => deleteKey(key.id)} className="text-red-400 hover:text-red-300 text-sm">
                Revoke
              </button>
            </div>
          ))}
          {keys.length === 0 && <p className="text-gray-500 text-center py-8">No API keys yet. Create one above.</p>}
        </div>
      </div>
    </div>
  );
}
