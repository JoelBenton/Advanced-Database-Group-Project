"use client";

import { useState } from "react";

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

export default function DoctorPage() {
  const [doctorName] = useState("Dr. Jane Watson");
  const [selectedDate, setSelectedDate] = useState("2025-05-08");
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null
  );
  const [medicalRecord, setMedicalRecord] = useState({
    date: "",
    diagnosis: "",
    treatment: "",
    prescription: {
      medication: "",
      dosage: "",
      duration: "",
      instructions: "",
    },
    notes: "",
  });

  const appointments = mockAppointments.filter((a) => a.date === selectedDate);

  const handleMarkComplete = () => {
    if (selectedAppointment) {
      setSelectedAppointment({ ...selectedAppointment, status: "Completed" });
    }
  };

  const handleRecordChange = (e: any) => {
    const { name, value } = e.target;
    if (name in medicalRecord.prescription) {
      setMedicalRecord({
        ...medicalRecord,
        prescription: { ...medicalRecord.prescription, [name]: value },
      });
    } else {
      setMedicalRecord({ ...medicalRecord, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Appointments Dashboard</h1>
        <span className="text-lg font-medium text-gray-700">
          👩‍⚕️ {doctorName}
        </span>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <label className="mr-2 font-medium">📅 Select Date:</label>
        <select
          value={selectedDate}
          onChange={(e) => {
            setSelectedAppointment(null);
            setSelectedDate(e.target.value);
          }}
          className="border rounded px-3 py-2 bg-white"
        >
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const iso = date.toISOString().split("T")[0];
            return (
              <option key={iso} value={iso}>
                {iso}
              </option>
            );
          })}
        </select>
      </div>

      {/* Appointment List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointments.length === 0 ? (
          <p>No appointments for this date.</p>
        ) : (
          appointments.map((app) => (
            <div
              key={app.id}
              className={`p-4 rounded shadow border cursor-pointer ${
                selectedAppointment?.id === app.id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white hover:bg-blue-50"
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

      {/* Appointment Detail & Form */}
      {selectedAppointment && (
        <div className="mt-10 bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Appointment Details</h2>
          <div className="grid gap-2 text-sm">
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
          </div>

          <button
            onClick={handleMarkComplete}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            ✅ Mark as Complete
          </button>

          {/* Medical Record Form */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Add Medical Record</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="date"
                name="date"
                value={medicalRecord.date}
                onChange={handleRecordChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="diagnosis"
                placeholder="Diagnosis"
                value={medicalRecord.diagnosis}
                onChange={handleRecordChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="treatment"
                placeholder="Treatment"
                value={medicalRecord.treatment}
                onChange={handleRecordChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="medication"
                placeholder="Medication"
                value={medicalRecord.prescription.medication}
                onChange={handleRecordChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="dosage"
                placeholder="Dosage"
                value={medicalRecord.prescription.dosage}
                onChange={handleRecordChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="duration"
                placeholder="Duration"
                value={medicalRecord.prescription.duration}
                onChange={handleRecordChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="instructions"
                placeholder="Instructions"
                value={medicalRecord.prescription.instructions}
                onChange={handleRecordChange}
                className="border p-2 rounded"
              />
              <textarea
                name="notes"
                placeholder="Notes"
                value={medicalRecord.notes}
                onChange={handleRecordChange}
                className="border p-2 rounded col-span-full"
              />
            </div>
            <button
              onClick={() =>
                alert("Record Saved (not yet connected to backend)")
              }
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              💾 Save Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
