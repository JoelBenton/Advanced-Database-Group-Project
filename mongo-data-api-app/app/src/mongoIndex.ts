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
  updateMedicalRecord,
  retrieveAppointmentsForDoctorOnDateRange,
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
  updateMedicalRecord,

  retrieveAppointmentsForDoctorOnDateRange,
};

export default mongoActions;