"use client";

import React, { useState, useCallback, useTransition } from "react";
import { PatientData } from "@/app/src/types/patientQueries";
import { useRouter } from "next/navigation";
import { MedicalStaff } from "../types/medicalStaffQueries";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, set } from "date-fns";
import { retrieveOpenSlotsForDoctorOnDate } from "../utils";

interface Props {
  patient: PatientData;
  doctors: MedicalStaff[];
}

const tabs = [
  { label: "Personal Info", key: "info" },
  { label: "Emergency Contact", key: "emergency" },
  { label: "Medical Records", key: "records" },
  { label: "Appointments", key: "appointments" },
] as const;

type ViewKey = (typeof tabs)[number]["key"];

export default function PatientDetailClient({ patient, doctors }: Props) {
  const router = useRouter();
  const [view, setView] = useState<ViewKey>("info");
  const [editingInfo, setEditingInfo] = useState(false);
  const [editingEmergency, setEditingEmergency] = useState(false);
  const [expandedPrescriptions, setExpandedPrescriptions] = useState<
    Record<string, boolean>
  >({});
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [isAvailableSlotsPending, startAvailableSlotsTransition] =
    useTransition();
  const [isCreateAppointmentPending, startCreateAppointmentTransition] =
    useTransition();
  const [openSlots, setOpenSlots] = useState<string[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy/MM/dd")
  );
  const [selectedDoctor, setSelectedDoctor] = useState<MedicalStaff | null>(
    null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedUrgency, setSelectedUrgency] = useState<string>("Low");
  const [selectedReason, setSelectedReason] =
    useState<keyof typeof appointment_equipment>("Routine Checkup");

  const togglePrescription = (key: string) => {
    setExpandedPrescriptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const appointment_reasons = [
    "Routine Checkup",
    "Emergency",
    "Consultation",
    "Follow-up",
    "Diagnostic Test",
  ];
  const appointment_equipment = {
    "Routine Checkup": "Stethoscope",
    Emergency: "Defibrillator",
    Consultation: "Computer/Tablet",
    "Follow-up": "Blood Pressure Monitor",
    "Diagnostic Test": "X-Ray Machine",
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

  const handleSelectDoctor = async (doctor_id: string) => {
    console.log("Selected doctor ID:", doctor_id);

    const selected = doctors.find((doc) => doc._id === Number(doctor_id));
    if (!selected) {
      return;
    }

    // Set the selected doctor state
    setSelectedDoctor(selected);

    // Fetch and update available slots
    startAvailableSlotsTransition(async () => {
      try {
        const availableSlots = await retrieveOpenSlotsForDoctorOnDate(
          selected,
          selectedDate
        );
        setOpenSlots(availableSlots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
      }
    });
  };

  function createAppointment() {
    if (
      !selectedDoctor ||
      !selectedTimeSlot ||
      !selectedDate ||
      !selectedUrgency ||
      !selectedReason
    ) {
      console.error("Missing required fields for appointment creation");
      return;
    }
    const randomNumber = Math.floor(Math.random() * 10); // Between 1 and 10
    const randomCharacter = String.fromCharCode(65 + randomNumber); // A to J
    const appointment = {
      date: selectedDate.replaceAll("/", "-"),
      time_slot: selectedTimeSlot,
      room: {
        name: `Room ${randomNumber}${randomCharacter}`,
        equipment: appointment_equipment[selectedReason] || "Unknown Equipment",
      },
      urgency: selectedUrgency,
      reason_for: selectedReason,
      doctor_id: selectedDoctor._id,
      status: "Pending",
    };

    console.log("Creating appointment:", appointment);

    setShowAppointmentModal(false);

    setSelectedDoctor(null);
    setSelectedTimeSlot(null);
    setSelectedDate(format(new Date(), "yyyy/MM/dd"));
    setSelectedUrgency("Low");
    setSelectedReason("Routine Checkup");
    setOpenSlots([]);
  }

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
                  <strong>Doctor:</strong>{" "}
                  {
                    doctors.find((doc) => doc._id === record.doctor_id)
                      ?.first_name
                  }{" "}
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

        {view === "appointments" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Appointments
              </h3>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                + New Appointment
              </button>
            </div>

            {showAppointmentModal && (
              <div className="bg-gray-50 p-4 rounded-lg border shadow-sm mb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="mb-6">
                    <label className="mr-2 font-medium block mb-1">
                      📅 Select Date:
                    </label>
                    <DatePicker
                      selected={parse(selectedDate, "yyyy/MM/dd", new Date())}
                      onChange={(date: Date | null) => {
                        const formatted = date
                          ? format(date, "yyyy/MM/dd")
                          : "";
                        setSelectedDate(formatted);
                        if (selectedDoctor && !isAvailableSlotsPending) {
                          startAvailableSlotsTransition(async () => {
                            try {
                              const availableSlots =
                                await retrieveOpenSlotsForDoctorOnDate(
                                  selectedDoctor,
                                  formatted
                                );
                              setOpenSlots(availableSlots);
                            } catch (error) {
                              console.error(
                                "Error fetching available slots:",
                                error
                              );
                            }
                          });
                        }
                      }}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="YYYY/MM/DD"
                      className="border border-gray-400 p-2 rounded w-full"
                    />
                  </div>

                  {/* Step 2: Doctor (after date) */}
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Doctor
                      </label>
                      <select
                        onChange={(e) => handleSelectDoctor(e.target.value)}
                        value={selectedDoctor?._id ?? ""}
                        className="input p-3 text-lg border rounded-md shadow-md w-full"
                      >
                        <option value="">Select a doctor</option>
                        {doctors.map((doc) => (
                          <option key={doc._id} value={doc._id}>
                            {doc.first_name} {doc.second_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Step 3: Time Slot (after doctor) */}
                  {isAvailableSlotsPending && (
                    <div className="text-gray-500">
                      Loading available slots...
                    </div>
                  )}

                  {selectedDate &&
                  selectedDoctor &&
                  !isAvailableSlotsPending ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Slot
                      </label>
                      <select
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        value={selectedTimeSlot ?? ""}
                        className="input p-3 text-lg border rounded-md shadow-md w-full"
                      >
                        <option value="">Select a time slot</option>
                        {openSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {slot}
                          </option>
                        ))}
                        {openSlots.length === 0 && (
                          <option value="No available slots">
                            No available slots
                          </option>
                        )}
                      </select>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {/* Step 4: Urgency and Reason (after time_slot) */}
                  {selectedTimeSlot && (
                    <>
                      {
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Urgency
                          </label>
                          <select
                            onChange={(e) => setSelectedUrgency(e.target.value)}
                            value={selectedUrgency ?? ""}
                            className="input p-3 text-lg border rounded-md shadow-md w-full"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>
                      }
                      {
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason
                          </label>
                          <select
                            onChange={(e) => setSelectedReason(e.target.value)}
                            value={selectedReason ?? ""}
                            className="input p-3 text-lg border rounded-md shadow-md w-full"
                          >
                            <option value="">Select a reason</option>
                            {appointment_reasons.map((slot, index) => (
                              <option key={index} value={slot}>
                                {slot}
                              </option>
                            ))}
                            {openSlots.length === 0 && (
                              <option value="No available slots">
                                No available slots
                              </option>
                            )}
                          </select>
                        </div>
                      }
                    </>
                  )}
                </div>

                {/* Step 5: Save and Cancel */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAppointmentModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createAppointment}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save Appointment
                  </button>
                </div>
              </div>
            )}

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
