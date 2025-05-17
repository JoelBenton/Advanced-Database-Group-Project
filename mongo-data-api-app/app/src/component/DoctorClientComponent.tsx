"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { MedicalStaff } from "../types/medicalStaffQueries";
import mongo from "../mongoIndex";
import { DoctorAppointments } from "../types/doctorTypes";
import toast from "react-hot-toast";
import { updateAppointment } from "../types/AppointmentTypes";
import { MedicalRecordCreate } from "../types/medicalRecordQueries";

export default function DoctorClientComponent({
  id,
  doctor,
}: {
  id: string;
  doctor: MedicalStaff;
}) {
  const router = useRouter();
  const [doctorName] = useState(doctor.first_name + " " + doctor.second_name);
  const [showDoctorMenu, setShowDoctorMenu] = useState(false);

  const [isLoadingAppointments, startLoadingAppointments] = useTransition();
  const [isUpdatingAppointmentStatusLoading, startUpdatingAppointmentStatus] =
    useTransition();

  const [appointments, setAppointments] = useState<DoctorAppointments[]>([]);

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy/MM/dd")
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<DoctorAppointments | null>(null);
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

  useEffect(() => {
    // Automatically fetch appointments for today on first render
    const today = format(new Date(), "yyyy/MM/dd");
    changeSelectedDate(today);
  }, []);

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

  function changeSelectedDate(date: string) {
    setSelectedDate(date);
    const formatted = date ? format(new Date(date), "yyyy/MM/dd") : "";
    setSelectedAppointment(null);
    setSelectedDate(formatted);

    const string_date = formatted.replaceAll("/", "-");

    startLoadingAppointments(async () => {
      console.log("Loading appointments for date: " + formatted);
      const allAppointments =
        await mongo.retrieveAppointmentsForDoctorOnDateRange(
          doctor._id,
          string_date,
          string_date
        );
      console.log(allAppointments);
      setAppointments(allAppointments);
    });
  }

  async function createMedicalRecord(Data: MedicalRecordCreate) {
    try {
      const result = await mongo.createMedicalRecord(Data);
      toast.success("Medical record created successfully.");
      return result;
    } catch (error) {
      console.error("Error creating medical record:", error);
      toast.error("An error occurred while creating the medical record.");
    }
  }

  function updateAppointment(Data: updateAppointment) {
    if (!selectedAppointment) return;

    try {
      startUpdatingAppointmentStatus(async () => {
        const updatingToast = toast.loading("Updating appointment...");

        const originalDate = selectedAppointment.appointment.date as
          | string
          | null;

        // Prepare fields to update: base + new data
        const updateFields = {
          doctor_id: Number(selectedAppointment.appointment.doctor_id),
          time_slot: selectedAppointment.appointment.time_slot,
          date: selectedAppointment.appointment.date,
          room: selectedAppointment.appointment.room,
          urgency: selectedAppointment.appointment.urgency,
          reason_for: selectedAppointment.appointment.reason_for,
          status: selectedAppointment.appointment.status,
          ...Data, // 🧠 Data overrides any of the fields above
        };

        const result = await mongo.updateAppointmentForPatient(
          String(selectedAppointment._id),
          updateFields,
          originalDate
        );

        toast.dismiss(updatingToast);

        if (result.modifiedCount === 0) {
          toast.error("No changes were made to the appointment.");
          return;
        }

        toast.success("Appointment updated successfully.");
        setRescheduleDate(null);

        // If date changed, remove from the current list and clear selection
        if (Data.date && Data.date !== originalDate) {
          setSelectedAppointment(null);
          setAppointments((prev) =>
            prev.filter((app) => app._id !== selectedAppointment._id)
          );
        } else {
          // Otherwise, update appointment locally
          setSelectedAppointment((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              appointment: {
                ...prev.appointment,
                ...Data,
                doctor_id: Number(prev.appointment.doctor_id), // Ensure doctor_id is a number
              },
            };
          });

          setAppointments((prev) =>
            prev.map((app) => {
              if (app._id === selectedAppointment._id) {
                return {
                  ...app,
                  appointment: {
                    ...app.appointment,
                    ...Data,
                    doctor_id: Data.doctor_id
                      ? Number(Data.doctor_id)
                      : app.appointment.doctor_id, // ensure correct type
                  },
                };
              }
              return app;
            })
          );
        }
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("An error occurred while updating the appointment.");
    }
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

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Appointments Dashboard</h1>
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
                changeSelectedDate(formatted);
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
                  key={app._id}
                  className={`p-4 rounded-lg border-2 shadow-sm cursor-pointer transition ${
                    selectedAppointment?._id === app._id
                      ? "bg-[rgb(59,130,246)] bg-opacity-20 border-[rgb(59,130,246)]"
                      : "bg-white border-gray-300 hover:bg-[rgb(59,130,246)] hover:bg-opacity-20 hover:border-[rgb(59,130,246)]"
                  }`}
                  onClick={() => setSelectedAppointment(app)}
                >
                  <h2 className="font-semibold text-lg">
                    {app.appointment.time_slot.split("-")[0].trimStart()} -{" "}
                    {app.first_name} {app.last_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {app.appointment.reason_for}
                  </p>
                  <p className="text-sm text-gray-500">
                    Room: {app.appointment.room.name} | Urgency:{" "}
                    {app.appointment.urgency}
                  </p>
                  <span className="text-sm font-medium text-gray-700">
                    Status: {app.appointment.status}
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
                <strong>Patient:</strong> {selectedAppointment.first_name}{" "}
                {selectedAppointment.last_name}
              </p>
              <p>
                <strong>Reason:</strong>{" "}
                {selectedAppointment.appointment.reason_for}
              </p>
              <p>
                <strong>Room:</strong> {selectedAppointment.appointment.room.name}
              </p>
              <p>
                <strong>Urgency:</strong>{" "}
                {selectedAppointment.appointment.urgency}
              </p>
              <p>
                <strong>Status:</strong> {selectedAppointment.appointment.status}
              </p>
              <p>
                <strong>Date:</strong> {selectedAppointment.appointment.date}
              </p>
            </div>

            {/* Status Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => {
                  updateAppointment({ status: "Completed" });
                }}
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
                onClick={() => {
                  updateAppointment({ status: "Confirmed" });
                }}
                className="bg-blue-500 bg-opacity-30 hover:bg-opacity-100 text-blue-900 px-4 py-2 rounded flex items-center gap-2"
              >
                ✔️ Confirm
              </button>

              <button
                onClick={() => {
                  updateAppointment({ status: "Cancelled" });
                }}
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
                      updateAppointment({
                        status: "Rescheduled",
                        date: newDate.replaceAll("/", "-"),
                      });
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
                onClick={async () => {
                  if (!selectedAppointment) return;

                  const recordDateFormatted = medicalRecord.date.replaceAll(
                    "/",
                    "-"
                  );

                  const newRecord: MedicalRecordCreate = {
                    patient_id: selectedAppointment._id.toString(),
                    doctor_id: doctor._id,
                    record_date: recordDateFormatted,
                    diagnosis: medicalRecord.diagnosis,
                    treatment: medicalRecord.treatment,
                    notes: medicalRecord.notes,
                  };

                  await createMedicalRecord(newRecord); // ✅ CALL the function here

                  // Optionally reset the form
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
    </>
  );
}
