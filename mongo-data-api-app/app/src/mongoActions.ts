"use server";

import client from "@/lib/mongodb";
import { deleteOne, findDocuments, insertOne, updateOne } from "./mongoHelpers";
import { patientOrFilter } from "./queries/patient";
import { IDFilter } from "./queries/shared";
import { PatientData, PatientQueryConditions } from "./types/patientQueries";
import { MedicalStaffCreate, MedicalStaffSpecialisationSearch, MedicalStaffAvailabilitySearch, MedicalStaffAvailabilitySearchWithSpecialisation } from "./types/medicalStaffQueries";
import { MedicalRecordCreate, MedicalRecordUpdate } from "./types/medicalRecordQueries";

export async function testDatabaseConnection() {
  let isConnected = false;
  try {
    const mongoClient = await client.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    ); // because this is a server action, the console.log will be outputted to your terminal not in the browser
    return !isConnected;
  } catch (e) {
    console.error(e);
    return isConnected;
  }
}

/*
  The following functions are used to query the database for patients.
*/

export async function getPatientsOrStatement(Conditions: PatientQueryConditions = {}) {
  const data = await findDocuments("patient", patientOrFilter(Conditions));
  return data;
}

export async function getPatientById(id: string) {
  const data = await findDocuments("patient", IDFilter(id));
  return data[0] as unknown as PatientData;
}

export async function retreieveAllPatients() {
  const data = await findDocuments("patient", {});
  return data;
}

export async function deletePatientById(id: string) {
  const data = await deleteOne("patient", IDFilter(id));
  return data;
}

/*
  The following functions are used to query the database for Medical Staff.
*/

export async function createMedicalStaff(Data: MedicalStaffCreate) {
  const data = await insertOne("medical_staff", Data);
  return data;
}

export async function getMedicalStaffById(id: string) {
  const data = await findDocuments("medical_staff", IDFilter(id));
  return data;
}

export async function listDoctersBySpeciality(Data: MedicalStaffSpecialisationSearch) {
  const data = await findDocuments("medical_staff", { Data });
  return data;
}

export async function listAllDocters() {
  const data = await findDocuments("medical_staff", { role: "Doctor" }, { first_name: 1, second_name: 1, specialisation: 1, _id: 0 });
  return data;
}

export async function listAvailableDoctors(Data: MedicalStaffAvailabilitySearch) {
  const data = await findDocuments("medical_staff", Data);
  return data;
}

export async function listAvailableDoctorsBySpeciality(Data: MedicalStaffAvailabilitySearchWithSpecialisation) {
  const data = await findDocuments("medical_staff", {
    role: Data.role,
    specialisation: { $regex: "/" + Data.specialisation + "/i" },
    availability_start_time: { $lte: Data.availability_start_time },
    availability_end_time: { $gte: Data.availability_end_time }
  });
  return data;
}

/* Medical Records Queries */

export async function createMedicalRecord(Data: MedicalRecordCreate) {
  const data = await updateOne(
    "patient",
    IDFilter(Data.patient_id),
    {
      $push: {
        medical_records: {
          doctor_id: Data.doctor_id,
          record_date: Data.record_date,
          diagnosis: Data.diagnosis,
          treatment: Data.treatment,
          prescriptions: [],
          notes: Data.notes
        }
      }
    }
  );
  return data;
}

export async function updateMedicalRecord(Data: MedicalRecordUpdate) {
  const data = await updateOne(
    "patient",
    {
      _id: Data.patient_id,
      "medical_records.record_date": Data.record_date,
      "medical_records.diagnosis": Data.diagnosis
    },
    {
      $set: {
        "medical_records.$.diagnosis": Data.diagnosis,
        "medical_records.$.treatment": Data.treatment,
        "medical_records.$.notes": Data.notes
      }
    }
  );
  return data;
}