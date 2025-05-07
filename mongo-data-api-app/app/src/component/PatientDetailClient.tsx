"use client";

import React, { useState, useCallback } from "react";
import { PatientData } from "@/app/src/types/patientQueries";
import { useRouter } from "next/navigation";

interface Props {
  patient: PatientData;
}

const tabs = [
  { label: "Personal Info", key: "info" },
  { label: "Emergency Contact", key: "emergency" },
  { label: "Medical Records", key: "records" },
  { label: "Appointments", key: "appointments" },
] as const;

type ViewKey = (typeof tabs)[number]["key"];

export default function PatientDetailClient({ patient }: Props) {
  const router = useRouter();
  const [view, setView] = useState<ViewKey>("info");
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingEmergency, setEditingEmergency] = useState(false);
  const [expandedPrescriptions, setExpandedPrescriptions] = useState<
    Record<string, boolean>
  >({});

  const togglePrescription = (key: string) => {
    setExpandedPrescriptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [infoForm, setInfoForm] = useState({
    date_of_birth: patient.date_of_birth,
    contact_number: patient.contact_number,
    email: patient.email,
    address: { ...patient.address },
  });

  const [emergencyForm, setEmergencyForm] = useState({
    ...patient.emergency_contact,
  });

  const handleInfoChange = useCallback(
    (
      field: keyof typeof infoForm | keyof (typeof infoForm)["address"],
      value: string
    ) => {
      if (field in infoForm.address) {
        setInfoForm((prev) => ({
          ...prev,
          address: { ...prev.address, [field]: value },
        }));
      } else {
        setInfoForm((prev) => ({ ...prev, [field]: value }));
      }
    },
    [infoForm]
  );

  const handleEmergencyChange = useCallback(
    (field: keyof typeof emergencyForm, value: string) => {
      setEmergencyForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const renderInput = (
    id: string,
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        className="input p-3 text-lg border rounded-md shadow-md w-full"
        value={value}
        onChange={onChange}
        placeholder={label}
      />
    </div>
  );

  return (
    <>
      {/* Top-left "Switch User" button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 hover:bg-gray-100 transition"
      >
        <span className="text-lg font-semibold text-gray-700">Switch User</span>
      </button>
      <div className="bg-white rounded-xl shadow-xl p-6 space-y-6 relative">
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4">
          {tabs.map(({ label, key }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                view === key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Personal Info */}
        {view === "info" && (
          <div className="relative">
            {/* <h2 className="text-xl font-semibold mb-4">Personal Information</h2> */}
            <button
              onClick={() => setEditingInfo((prev) => !prev)}
              className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
              title="Edit"
            >
              ✏️
            </button>

            {!editingInfo ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                  <strong>DOB:</strong> {patient.date_of_birth}
                </p>
                <p>
                  <strong>Phone:</strong> {patient.contact_number}
                </p>
                <p>
                  <strong>Email:</strong> {patient.email}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {`${patient.address.house_number} ${patient.address.address}, ${patient.address.postcode}`}
                </p>
              </div>
            ) : (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Edit Personal Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput(
                    "dob",
                    "Date of Birth",
                    infoForm.date_of_birth,
                    (e) => handleInfoChange("date_of_birth", e.target.value)
                  )}
                  {renderInput("phone", "Phone", infoForm.contact_number, (e) =>
                    handleInfoChange("contact_number", e.target.value)
                  )}
                  {renderInput("email", "Email", infoForm.email, (e) =>
                    handleInfoChange("email", e.target.value)
                  )}
                  {renderInput(
                    "house",
                    "House Number",
                    infoForm.address.house_number,
                    (e) => handleInfoChange("house_number", e.target.value)
                  )}
                  {renderInput(
                    "street",
                    "Street Address",
                    infoForm.address.address,
                    (e) => handleInfoChange("address", e.target.value)
                  )}
                  {renderInput(
                    "postcode",
                    "Postcode",
                    infoForm.address.postcode,
                    (e) => handleInfoChange("postcode", e.target.value)
                  )}
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => setEditingInfo(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Emergency Contact */}
        {view === "emergency" && (
          <div className="relative">
            {/* <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2> */}
            <button
              onClick={() => setEditingEmergency((prev) => !prev)}
              className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
              title="Edit"
            >
              ✏️
            </button>

            {!editingEmergency ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                  <strong>Name:</strong> {patient.emergency_contact.name}{" "}
                  {patient.emergency_contact.surname}
                </p>
                <p>
                  <strong>Email:</strong> {patient.emergency_contact.email}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {patient.emergency_contact.phone_number}
                </p>
                <p>
                  <strong>Relationship:</strong>{" "}
                  {patient.emergency_contact.relationship}
                </p>
              </div>
            ) : (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">
                  Edit Emergency Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput(
                    "emergency-name",
                    "First Name",
                    emergencyForm.name,
                    (e) => handleEmergencyChange("name", e.target.value)
                  )}
                  {renderInput(
                    "emergency-surname",
                    "Surname",
                    emergencyForm.surname,
                    (e) => handleEmergencyChange("surname", e.target.value)
                  )}
                  {renderInput(
                    "emergency-email",
                    "Email",
                    emergencyForm.email,
                    (e) => handleEmergencyChange("email", e.target.value)
                  )}
                  {renderInput(
                    "emergency-phone",
                    "Phone",
                    emergencyForm.phone_number,
                    (e) => handleEmergencyChange("phone_number", e.target.value)
                  )}
                  {renderInput(
                    "emergency-relationship",
                    "Relationship",
                    emergencyForm.relationship,
                    (e) => handleEmergencyChange("relationship", e.target.value)
                  )}
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                  </button>
                  <button
                    className="bg-gray-300 px-4 py-2 rounded"
                    onClick={() => setEditingEmergency(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Medical Records */}
        {view === "records" && (
          <div className="space-y-8">
            {/* <h2 className="text-2xl font-semibold text-gray-800">
              Medical Records
            </h2> */}
            {patient.medical_records.map((record, i) => (
              <div
                key={i}
                className="bg-white shadow-sm rounded-lg p-6 border-l-4 border-blue-500 hover:bg-gray-50 transition-colors"
              >
                <p className="text-lg font-medium text-gray-700">
                  <strong>Doctor ID:</strong> {record.doctor_id}
                </p>
                <p className="text-lg font-medium text-gray-700">
                  <strong>Date:</strong> {record.record_date}
                </p>
                <p className="text-lg font-medium text-gray-700">
                  <strong>Diagnosis:</strong> {record.diagnosis}
                </p>
                <p className="text-lg font-medium text-gray-700">
                  <strong>Treatment:</strong> {record.treatment}
                </p>

                <div className="mt-4">
                  <p className="font-semibold text-gray-800 mb-2">
                    Prescriptions:
                  </p>
                  {record.prescriptions.length > 0 ? (
                    <div className="space-y-4">
                      {record.prescriptions.map((prescription, j) => {
                        const key = `${i}-${j}`;
                        const isExpanded = expandedPrescriptions[key] || false;

                        return (
                          <div
                            key={key}
                            className="bg-white border shadow rounded-lg overflow-hidden transition"
                          >
                            <button
                              className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
                              onClick={() => togglePrescription(key)}
                            >
                              <span className="font-medium text-gray-800">
                                {prescription.medication}
                              </span>
                              <span className="text-sm text-gray-600">
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </button>
                            {isExpanded && (
                              <div className="p-4 space-y-2 border-t bg-gray-50">
                                <p className="text-gray-700">
                                  <strong>Dosage:</strong> {prescription.dosage}
                                </p>
                                <p className="text-gray-700">
                                  <strong>Duration:</strong>{" "}
                                  {prescription.duration}
                                </p>
                                <p className="text-gray-700">
                                  <strong>Instructions:</strong>{" "}
                                  {prescription.instructions}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <p className="text-gray-700">
                        <strong>Notes:</strong> {record.notes}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No prescriptions available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appointments */}
        {view === "appointments" && (
          <div>
            {/* <h2 className="text-xl font-semibold mb-4">Appointments</h2> */}
            {patient.appointments.map((appt, i) => (
              <div key={i} className="mb-6 border-l-4 border-green-400 pl-4">
                <p>
                  <strong>Date:</strong> {appt.date}
                </p>
                <p>
                  <strong>Time:</strong> {appt.time_slot}
                </p>
                <p>
                  <strong>Reason:</strong> {appt.reason_for}
                </p>
                <p>
                  <strong>Room:</strong> {appt.room.name} ({appt.room.equipment}
                  )
                </p>
                <p>
                  <strong>Urgency:</strong> {appt.urgency}
                </p>
                <p>
                  <strong>Doctor ID:</strong> {appt.doctor_id}
                </p>
                <p>
                  <strong>Status:</strong> {appt.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
