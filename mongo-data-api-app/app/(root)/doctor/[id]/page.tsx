import React, { Suspense } from "react";
import DoctorClientComponent from "../../../src/component/DoctorClientComponent";
import mongo from "../../../src/mongoIndex";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const doctor = await mongo.getMedicalStaffById((await params).id);
  return (
    <div className="bg-gradient-to-br from-green-100 to-blue-100 min-h-screen p-6 relative">
      {/* Top-right badge */}
      <div className="absolute top-6 right-6 bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
        <span className="text-lg font-semibold text-gray-700">
          👩‍⚕️ Dr. {doctor.first_name} {doctor.second_name}
        </span>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto mt-32">
        <Suspense fallback={<div>Loading...</div>}>
          <DoctorClientComponent id={(await params).id} doctor={doctor} />
        </Suspense>
      </div>
    </div>
  );
}
