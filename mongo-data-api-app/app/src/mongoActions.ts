"use server";

import client from "@/lib/mongodb";
import { aggregateDocuments, deleteOne, findDocuments, insertOne, updateOne } from "./mongoHelpers";
import { patientOrFilter } from "./queries/patient";
import { IDFilter } from "./queries/shared";
import { PatientData, PatientQueryConditions, UpdateEmergencyContact, UpdatePatientDetails } from "./types/patientQueries";
import { MedicalStaffCreate, MedicalStaffSpecialisationSearch, MedicalStaffAvailabilitySearch, MedicalStaffAvailabilitySearchWithSpecialisation, MedicalStaff } from "./types/medicalStaffQueries";
import { MedicalRecordCreate, MedicalRecordUpdate } from "./types/medicalRecordQueries";
import { DoctorAppointments } from "./types/doctorTypes";
import { createAppointment } from "./types/AppointmentTypes";

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


export async function getLargestPatientId() {
  const data = await findDocuments("patient", {}, { sort: { _id: -1 }, projection: { _id: 1 } }, 1 );
  return data[0]._id as unknown as number;
}

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

export async function updatePatientDetails(id: string, Data: UpdatePatientDetails) {
  const result = await updateOne("patient", IDFilter(id), {
    $set: {
      date_of_birth: Data.date_of_birth,
      contact_number: Data.contact_number,
      email: Data.email,
      address: {
        postcode: Data.address?.postcode,
        house_number: Data.address?.house_number,
        address: Data.address?.address
      }
    }
  });
  return result;
}

export async function updateEmergencyContact(id: string, Data: UpdateEmergencyContact) {
  const result = await updateOne("patient", IDFilter(id), {
    $set: {
      "emergency_contact.name": Data.name,
      "emergency_contact.surname": Data.surname,
      "emergency_contact.email": Data.email,
      "emergency_contact.phone_number": Data.phone_number,
      "emergency_contact.relationship": Data.relationship
    }
  });
  return result;
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
  return data[0] as unknown as MedicalStaff;
}

export async function listDoctersBySpeciality(Data: MedicalStaffSpecialisationSearch) {
  const data = await findDocuments("medical_staff", { Data });
  return data;
}

export async function listAllDocters() {
  const data = await findDocuments("medical_staff", { role: "Doctor" }, { first_name: 1, second_name: 1, specialisation: 1, _id: 1 });
  return data;
}

export async function listAllDoctersWithAllData() {
  const data = await findDocuments("medical_staff", { role: "Doctor" });
  return data as unknown as MedicalStaff[];
}

export async function listAvailableDoctors(Data: MedicalStaffAvailabilitySearch) {
  const data = await findDocuments("medical_staff", {
    role: Data.role,
    availability_start_time: { $lte: Data.availability_start_time },
    availability_end_time: { $gte: Data.availability_end_time }
  });
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

export async function getDoctorAvailityById(id: string) {
  const data = await findDocuments("medical_staff", IDFilter(id), { _id: 0, availability_start_time: 1, availability_end_time: 1 });
  return data as unknown as { availability_start_time: string, availability_end_time: string };
}

/* Appointmnet Queries */

export async function retrieveAppointmentsForDoctorOnDateRange(
  doctor_id: number,
  start_date: string,
  end_date: string
) { 
  console.log(start_date, end_date);
  const data = await aggregateDocuments("patient", [
    {
      $unwind: {
        path: "$appointments",
      }
    },
    {
      $match: {
        "appointments.doctor_id": doctor_id,
        "appointments.date": {
          $gte: start_date,
          $lte: end_date
        }
      }
    },
    {
      $project: {
        _id: "$_id",
        first_name: "$first_name",
        last_name: "$last_name",
        appointment: "$appointments",
        medical_record: "$medical_records" 
      }
    }
  ]);
  
  return data as unknown as DoctorAppointments[];
}

export async function retrieveAppointmentSlotsForDoctorOnDateRange(
  doctor_id: string,
  start_date: string,
  end_date: string
) { 
  const data = await aggregateDocuments("patient", [
    {
      $unwind: {
        path: "$appointments",
      }
    },
    {
      $match: {
        "appointments.doctor_id": Number(doctor_id),
        "appointments.date": {
          $gte: start_date,
          $lte: end_date
        }
      }
    },
    {
      $project: {
        _id: 0,
        time_slot: "$appointments.time_slot",
      }
    }
  ]);
  
  return data as unknown as [{ time_slot: string }];
}

export async function createAppointmentForPatient(
  id: string,
  Data: createAppointment
) {
  const result = await updateOne(
    "patient",
    IDFilter(id),
    {
      $push: {
        appointments: {
          time_slot: Data.time_slot,
          date: Data.date,
          room: {
            name: Data.room.name,
            equipment: Data.room.equipment
          },
          urgency: Data.urgency,
          reason_for: Data.reason_for,
          doctor_id: Data.doctor_id,
          status: Data.status
        }
      }
    }
  );
  return result;
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