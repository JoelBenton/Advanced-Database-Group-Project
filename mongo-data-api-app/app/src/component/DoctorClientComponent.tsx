"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";

const mockAppointments = [
  {
    id: 1,
    date: "2025-05-08",
    time: "10:00",
    patientName: "John Doe",
    reason: "Headache",
    room: "101",
    urgency: "High",
    status: "Pending",
  },
  {
    id: 2,
    date: "2025-05-08",
    time: "12:00",
    patientName: "Alice Smith",
    reason: "Fever",
    room: "102",
    urgency: "Medium",
    status: "Pending",
  },
];

export default function DoctorClientComponent({ id }: { id: string }) {
  console.log(id);
  const [doctorName] = useState("Dr. Jane Watson");
  const [showDoctorMenu, setShowDoctorMenu] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy/MM/dd")
  );
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null
  );
  const [showReschedulePicker, setShowReschedulePicker] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | null>(null);

  const [medicalRecord, setMedicalRecord] = useState({
    date: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionInput, setPrescriptionInput] = useState({
    medication: "",
    dosage: "",
    duration: "",
    instructions: "",
  });
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  const appointments = mockAppointments.filter(
    (a) => a.date === selectedDate.replaceAll("/", "-")
  );

  const handleRecordChange = (e: any) => {
    const { name, value } = e.target;
    setMedicalRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionInputChange = (e: any) => {
    const { name, value } = e.target;
    setPrescriptionInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPrescription = () => {
    if (prescriptionInput.medication.trim() !== "") {
      setPrescriptions((prev) => [...prev, prescriptionInput]);
      setPrescriptionInput({
        medication: "",
        dosage: "",
        duration: "",
        instructions: "",
      });
      setShowPrescriptionForm(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-100 to-blue-100 min-h-screen p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Appointments Dashboard</h1>

        {/* Doctor Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDoctorMenu((prev) => !prev)}
            className="text-lg font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-[20px] shadow bg-white hover:bg-[rgb(59,130,246)] hover:text-white transition duration-150"
          >
            👩‍⚕️ {doctorName}
          </button>

          {showDoctorMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-[20px] shadow-md z-10">
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full text-left px-4 py-2 rounded-[20px] transition duration-150 hover:bg-[rgb(59,130,246)] hover:text-white"
              >
                🔄 Switch User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Date Selector + Appointment List */}
      <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 p-6 mb-10">
        <div className="mb-6">
          <label className="mr-2 font-medium block mb-1">📅 Select Date:</label>
          <DatePicker
            selected={parse(selectedDate, "yyyy/MM/dd", new Date())}
            onChange={(date: Date | null) => {
              const formatted = date ? format(date, "yyyy/MM/dd") : "";
              setSelectedAppointment(null);
              setSelectedDate(formatted);
            }}
            dateFormat="yyyy/MM/dd"
            placeholderText="YYYY/MM/DD"
            className="border border-gray-400 p-2 rounded w-full"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.length === 0 ? (
            <p>No appointments for this date.</p>
          ) : (
            appointments.map((app) => (
              <div
                key={app.id}
                className={`p-4 rounded-lg border-2 shadow-sm cursor-pointer transition ${
                  selectedAppointment?.id === app.id
                    ? "bg-[rgb(59,130,246)] bg-opacity-20 border-[rgb(59,130,246)]"
                    : "bg-white border-gray-300 hover:bg-[rgb(59,130,246)] hover:bg-opacity-20 hover:border-[rgb(59,130,246)]"
                }`}
                onClick={() => setSelectedAppointment(app)}
              >
                <h2 className="font-semibold text-lg">
                  {app.time} - {app.patientName}
                </h2>
                <p className="text-sm text-gray-600">{app.reason}</p>
                <p className="text-sm text-gray-500">
                  Room: {app.room} | Urgency: {app.urgency}
                </p>
                <span className="text-sm font-medium text-gray-700">
                  Status: {app.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appointment Details */}
      {selectedAppointment && (
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300">
          <h2 className="text-2xl font-semibold mb-4">Appointment Details</h2>
          <div className="grid gap-2 text-sm mb-4">
            <p>
              <strong>Patient:</strong> {selectedAppointment.patientName}
            </p>
            <p>
              <strong>Reason:</strong> {selectedAppointment.reason}
            </p>
            <p>
              <strong>Room:</strong> {selectedAppointment.room}
            </p>
            <p>
              <strong>Urgency:</strong> {selectedAppointment.urgency}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Date:</strong> {selectedAppointment.date}
            </p>
          </div>

          {/* Status Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() =>
                setSelectedAppointment((prev: any) =>
                  prev ? { ...prev, status: "Completed" } : null
                )
              }
              className="bg-green-500 bg-opacity-30 hover:bg-opacity-100 text-green-800 px-4 py-2 rounded flex items-center gap-2"
            >
              ✅ Complete
            </button>

            <button
              onClick={() => setShowReschedulePicker((prev) => !prev)}
              className="bg-yellow-400 bg-opacity-30 hover:bg-opacity-100 text-yellow-900 px-4 py-2 rounded flex items-center gap-2"
            >
              📅 Reschedule
            </button>

            <button
              onClick={() =>
                setSelectedAppointment((prev: any) =>
                  prev ? { ...prev, status: "Confirmed" } : null
                )
              }
              className="bg-blue-500 bg-opacity-30 hover:bg-opacity-100 text-blue-900 px-4 py-2 rounded flex items-center gap-2"
            >
              ✔️ Confirm
            </button>

            <button
              onClick={() =>
                setSelectedAppointment((prev: any) =>
                  prev ? { ...prev, status: "Cancelled" } : null
                )
              }
              className="bg-red-500 bg-opacity-30 hover:bg-opacity-100 text-red-900 px-4 py-2 rounded flex items-center gap-2"
            >
              ❌ Cancel
            </button>
          </div>

          {/* Reschedule Picker */}
          {showReschedulePicker && (
            <div className="mb-4">
              <DatePicker
                selected={rescheduleDate}
                onChange={(date) => {
                  setRescheduleDate(date);
                  if (date) {
                    const newDate = format(date, "yyyy/MM/dd");
                    setSelectedAppointment((prev: any) =>
                      prev
                        ? { ...prev, date: newDate, status: "Rescheduled" }
                        : null
                    );
                    setShowReschedulePicker(false);
                  }
                }}
                dateFormat="yyyy/MM/dd"
                placeholderText="Pick a new date"
                className="border border-yellow-400 p-2 rounded"
              />
            </div>
          )}

          {/* Medical Record */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Add Medical Record</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <DatePicker
                selected={
                  medicalRecord.date
                    ? parse(medicalRecord.date, "yyyy/MM/dd", new Date())
                    : null
                }
                onChange={(date: Date | null) => {
                  const formatted = date ? format(date, "yyyy/MM/dd") : "";
                  setMedicalRecord((prev) => ({ ...prev, date: formatted }));
                }}
                dateFormat="yyyy/MM/dd"
                placeholderText="YYYY/MM/DD"
                className="border border-gray-400 p-2 rounded w-full"
              />
              <input
                type="text"
                name="diagnosis"
                placeholder="Diagnosis"
                value={medicalRecord.diagnosis}
                onChange={handleRecordChange}
                className="border border-gray-400 p-2 rounded"
              />
              <input
                type="text"
                name="treatment"
                placeholder="Treatment"
                value={medicalRecord.treatment}
                onChange={handleRecordChange}
                className="border border-gray-400 p-2 rounded"
              />
              <textarea
                name="notes"
                placeholder="Notes"
                value={medicalRecord.notes}
                onChange={handleRecordChange}
                className="border border-gray-400 p-2 rounded col-span-full"
              />
            </div>

            {/* Prescription Section */}
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Prescriptions</h4>

              {prescriptions.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-4">
                  {prescriptions.map((p, index) => (
                    <div
                      key={index}
                      className="relative p-4 rounded bg-green-100 border border-green-300 text-sm w-64 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold">{p.medication}</div>
                        <div>
                          {p.dosage} — {p.duration}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setPrescriptions((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                        className="ml-2 text-black hover:text-red-600 transition-colors"
                        aria-label="Remove Prescription"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {showPrescriptionForm ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    type="text"
                    name="medication"
                    placeholder="Medication"
                    value={prescriptionInput.medication}
                    onChange={handlePrescriptionInputChange}
                    className="border border-gray-400 p-2 rounded"
                  />
                  <input
                    type="text"
                    name="dosage"
                    placeholder="Dosage"
                    value={prescriptionInput.dosage}
                    onChange={handlePrescriptionInputChange}
                    className="border border-gray-400 p-2 rounded"
                  />
                  <input
                    type="text"
                    name="duration"
                    placeholder="Duration"
                    value={prescriptionInput.duration}
                    onChange={handlePrescriptionInputChange}
                    className="border border-gray-400 p-2 rounded"
                  />
                  <input
                    type="text"
                    name="instructions"
                    placeholder="Instructions"
                    value={prescriptionInput.instructions}
                    onChange={handlePrescriptionInputChange}
                    className="border border-gray-400 p-2 rounded"
                  />

                  <button
                    onClick={handleAddPrescription}
                    className="mt-2 md:col-span-2 bg-[rgb(59,130,246)] text-white px-4 py-2 rounded bg-opacity-60 hover:bg-opacity-100"
                  >
                    ➕ Add Prescription
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowPrescriptionForm(true)}
                  className="bg-[rgb(59,130,246)] text-white px-4 py-2 rounded bg-opacity-60 hover:bg-opacity-100"
                >
                  ➕ Add Prescription
                </button>
              )}
            </div>

            <button
              onClick={() => {
                alert("Medical Record Saved");
                setMedicalRecord({
                  date: "",
                  diagnosis: "",
                  treatment: "",
                  notes: "",
                });
                setPrescriptions([]);
                setShowPrescriptionForm(false);
              }}
              className="mt-6 bg-[rgb(59,130,246)] text-white px-4 py-2 rounded bg-opacity-60 hover:bg-opacity-100"
            >
              📀 Save Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
