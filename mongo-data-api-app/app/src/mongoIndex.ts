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
  createMedicalRecord,
  updateMedicalRecord
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

  createMedicalRecord,
  updateMedicalRecord
};

export default mongoActions;