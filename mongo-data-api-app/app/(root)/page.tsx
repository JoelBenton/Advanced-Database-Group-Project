import Image from "next/image";
import { testDatabaseConnection, getPatientsOrStatement } from "../src/actions";
import Link from "next/link";

export default async function Home() {
  const isConnected = await testDatabaseConnection();
  const patients = await getPatientsOrStatement({ first_name: "Felicia" });
  console.log("Patients: ", patients);

  return (
    <div>
      {isConnected ? (
        <h2 className="text-lg text-green-500">
          You are connected to MongoDB!
        </h2>
      ) : (
        <h2 className="text-lg text-red-500">
          You are NOT connected to MongoDB. Check the <code>README.md</code> for
          instructions.
        </h2>
      )}
    </div>
  );
}
