import ClientComponent from "../src/component/indexClientComponent";
import mongo from "../src/mongoIndex";
import { retrieveOpenSlotsForDoctorOnDate } from "../src/utils";

export default async function Home() {
  const isConnected = await mongo.testDatabaseConnection();
  const patients = await mongo.retreieveAllPatients();
  const doctors = await mongo.listAllDocters();

  return (
    <div className="w-full h-full">
      <ClientComponent
        isConnected={isConnected}
        patients={patients}
        doctors={doctors}
      />
    </div>
  );
}
