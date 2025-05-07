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
  listAllDoctersWithAllData,
  listAvailableDoctors,
  listAvailableDoctorsBySpeciality,
  createMedicalRecord,
  updateMedicalRecord,
  retrieveAppointmentsForDoctorOnDateRange,
  getDoctorAvailityById,
  retrieveAppointmentSlotsForDoctorOnDateRange,

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
  listAllDoctersWithAllData,
  listAvailableDoctors,
  listAvailableDoctorsBySpeciality,

  createMedicalRecord,
  updateMedicalRecord,

  retrieveAppointmentsForDoctorOnDateRange,
  getDoctorAvailityById,
  retrieveAppointmentSlotsForDoctorOnDateRange,
};

export default mongoActions;