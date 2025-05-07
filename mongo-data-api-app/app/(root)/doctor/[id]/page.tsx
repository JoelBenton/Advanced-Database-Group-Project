import React, { Suspense } from "react";
import DoctorClientComponent from "../../../src/component/DoctorClientComponent";
import mongo from "../../../src/mongoIndex"

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const doctor = await mongo.getMedicalStaffById((await params).id);
  return (
    <div>
      <DoctorClientComponent id={(await params).id} doctor={doctor} />
    </div>
  );
}
