import React from "react";
import DoctorClientComponent from "../../../src/component/DoctorClientComponent";
import mongo from "../../../src/mongoIndex";
import { Toaster } from "react-hot-toast";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  const doctor = await mongo.getMedicalStaffById((await params).id);
  return (
    <div>
      <Toaster position="top-center" reverseOrder={true} />
      <DoctorClientComponent id={(await params).id} doctor={doctor} />
    </div>
  );
}
