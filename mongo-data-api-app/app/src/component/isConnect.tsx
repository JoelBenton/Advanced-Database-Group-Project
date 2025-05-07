"use client";

import { useRouter } from "next/navigation";

interface ClientComponentProps {
  isConnected: boolean;
  patients: any;
}

export default function ClientComponent({
  isConnected,
  patients,
}: ClientComponentProps) {
  const router = useRouter();

  return (
    <div>
      <h1>DB Connection: {isConnected ? "Connected" : "Disconnected"}</h1>
      <ul>
        {patients.map((patient: any) => (
          <li key={patient._id}>{patient.first_name}</li>
        ))}
      </ul>
      <button onClick={() => router.push(`/patient/${patients[0]._id}`)}>
        Button
      </button>
    </div>
  );
}
