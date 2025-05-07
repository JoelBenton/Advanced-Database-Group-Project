import ClientComponent from "../src/component/isConnect";
import mongo from "../src/mongoIndex";

export default async function Home() {
  const isConnected = await mongo.testDatabaseConnection();
  const patients = await mongo.getPatientsOrStatement({
    first_name: "Felicia",
  });
  // const patients = await mongo.getPatientById("100");
  // const patients = await mongo.retreieveAllPatients();

  console.log(patients);

  return (
    <>
      <ClientComponent isConnected={isConnected} patients={patients} />
    </>
  );
}
