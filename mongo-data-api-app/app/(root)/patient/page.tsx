"use client";

import React from "react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  return (
    <div>
      <div>
        <button onClick={() => router.push("/patient/10")}>Button</button>
      </div>
      <div>Hello, Patient!</div>
    </div>
  );
}

export default page;
