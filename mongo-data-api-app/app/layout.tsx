import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ToastSettingsProvider } from "./src/context/ToastSettingsContext";
import DynamicToaster from "./src/component/DynamicToaster";
import SettingsButton from "./src/component/SettingsButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Health Clinic Appointment Management System (HCAMS)",
  description:
    "A web-based platform for managing patient appointments, doctor schedules, and medical records using MongoDB. Built to streamline clinic operations and enhance patient care.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastSettingsProvider>
          <DynamicToaster />
          <SettingsButton />
          {children}
        </ToastSettingsProvider>
      </body>
    </html>
  );
}
