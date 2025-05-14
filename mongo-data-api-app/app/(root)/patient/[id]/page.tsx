import React, { Suspense } from "react";
import mongo from "../../../src/mongoIndex";
import PatientDetailClient from "@/app/src/component/PatientDetailClient";
import { Toaster } from "react-hot-toast";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const patient = await mongo.getPatientById((await params).id);
  const doctors = await mongo.listAllDoctersWithAllData();

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Patient not found.
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-100 to-blue-100 min-h-screen p-6 relative">
      {/* Top-right badge */}
      <div className="absolute top-6 right-6 bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
        <span className="text-lg font-semibold text-gray-700">
          👤 {patient.first_name} {patient.last_name}
        </span>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto mt-32">
        <Suspense fallback={<div>Loading...</div>}>
          <Toaster position="top-center" reverseOrder={false} />
          <PatientDetailClient patient={patient} doctors={doctors} />
        </Suspense>
      </div>
    </div>
  );
}
