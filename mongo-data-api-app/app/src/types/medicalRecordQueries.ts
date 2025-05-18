export type Prescription = {
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
};

export type MedicalRecordCreate = {
  patient_id: string;
  doctor_id: number;
  record_date: string; // YYYY-MM-DD format (string)
  diagnosis: string;
  treatment: string;
  notes: string;
  prescriptions: Prescription[];
};

export type MedicalRecordUpdate = {
    patient_id: string;
    record_date: string; // YYYY-MM-DD format (string)
    diagnosis: string;
    treatment: string;
    notes: string;
}