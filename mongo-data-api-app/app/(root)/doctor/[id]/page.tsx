"use client";

import React from "react";
import { useParams } from "next/navigation";

function page() {
  const { id } = useParams();

  return (
    <div>
      <div>
        <h1>Doctor ID: {id}</h1>
      </div>
      <div>
        <p>Doctor details will be displayed here.</p>
      </div>
    </div>
  );
}

export default page;
