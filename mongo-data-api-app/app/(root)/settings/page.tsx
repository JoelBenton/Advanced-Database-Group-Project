"use client";

import {
  useToastSettings,
  ToastPosition,
} from "@/app/src/context/ToastSettingsContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const positions: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export default function SettingsPage() {
  const { position, setPosition } = useToastSettings();

  const showTestToast = () => {
    toast("This is a test toast!", { duration: 1000 });
  };

  const router = useRouter();

  return (
    <main className="w-full p-6 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 hover:bg-gray-100 transition"
      >
        <span className="text-lg font-semibold text-gray-700">Close</span>
      </button>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl p-6 border border-gray-200 dark:border-zinc-700">
        <h2 className="text-xl font-semibold mb-2">Toast Position</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Choose where toast notifications will appear:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setPosition(pos)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
                pos === position
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700"
              }`}
            >
              {(pos ?? "").replace("-", " ")}
            </button>
          ))}
        </div>

        <button
          onClick={showTestToast}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
        >
          Show Test Toast
        </button>
      </section>
    </main>
  );
}
