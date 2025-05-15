"use client";

import Link from "next/link";
import { FiSettings } from "react-icons/fi";

export default function SettingsButton() {
  return (
    <Link
      href="/settings"
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-colors"
      title="Settings"
    >
      <FiSettings className="w-6 h-6 text-gray-800" />
    </Link>
  );
}
