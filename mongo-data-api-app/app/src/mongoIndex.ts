import {
  testDatabaseConnection,
  getPatientsOrStatement,
  retreieveAllPatients,
  getPatientById,
  deletePatientById,
} from "./mongoActions";

const mongoActions = {
  testDatabaseConnection,
  getPatientsOrStatement,
  retreieveAllPatients,
  getPatientById,
  deletePatientById,
};

export default mongoActions;