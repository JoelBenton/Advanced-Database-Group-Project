import React, { Suspense } from "react";
import DoctorClientComponent from "../../../src/component/DoctorClientComponent";

interface Props {
  params: { id: string };
}

export default async function Page({ params }: Props) {
  return (
    <div>
      <DoctorClientComponent id={(await params).id} />
    </div>
  );
}
