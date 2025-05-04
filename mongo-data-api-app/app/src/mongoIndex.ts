import {
  testDatabaseConnection,
  getPatientsOrStatement,
  retreieveAllPatients,
  getPatientById,
  deletePatientById,
  createMedicalStaff,
  getMedicalStaffById,
  listDoctersBySpeciality,
  listAllDocters,
  listAvailableDoctors,
  listAvailableDoctorsBySpeciality,
} from "./mongoActions";

const mongoActions = {
  testDatabaseConnection,
  getPatientsOrStatement,
  retreieveAllPatients,
  getPatientById,
  deletePatientById,
  createMedicalStaff,

  getMedicalStaffById,
  listDoctersBySpeciality,
  listAllDocters,
  listAvailableDoctors,
  listAvailableDoctorsBySpeciality,
};

export default mongoActions;