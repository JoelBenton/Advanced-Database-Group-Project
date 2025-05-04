import Image from "next/image";
import mongo from "../src/mongoIndex";
import Link from "next/link";

export default async function Home() {
  const isConnected = await mongo.testDatabaseConnection();

  // const patients = await mongo.getPatientsOrStatement({ first_name: "Felicia" });
  const patients = await mongo.getPatientById("100");
  // const patients = await mongo.retreieveAllPatients();

  console.log(patients);

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
