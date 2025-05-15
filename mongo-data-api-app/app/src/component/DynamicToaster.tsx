"use client";

import { useToastSettings } from "../context/ToastSettingsContext";
import { Toaster } from "react-hot-toast";

export default function DynamicToaster() {
  const { position } = useToastSettings();

  return <Toaster position={position} reverseOrder={false} />;
}
