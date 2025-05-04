"use server";

import client from "@/lib/mongodb";
import { deleteOne, findDocuments, insertOne } from "./mongoHelpers";
import { patientOrFilter } from "./queries/patient";
import { IDFilter } from "./queries/shared";
import { PatientQueryConditions } from "./types/patientQueries";
import { MedicalStaffCreate, MedicalStaffSpecialisationSearch } from "./types/medicalStaffQueries";

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
  return data;
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