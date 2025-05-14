import mongo from './mongoIndex';
import { MedicalStaff } from './types/medicalStaffQueries';

export async function retrieveOpenSlotsForDoctorOnDate(
    doctor: MedicalStaff,
    date: string, // YYYY-MM-DD format
) {
    date = date.replaceAll("/", "-");

    const scheduledAppointments = await mongo.retrieveAppointmentSlotsForDoctorOnDateRange(
        String(doctor._id),
        date,
        date
    ); // Array of strings like "13:00 - 13:30" { time_slot: string }

    // Extract time slots from the scheduled appointments
    const scheduledTimeSlots = scheduledAppointments.map((appointment: { time_slot: string }) => appointment.time_slot);

    

    const startTime = new Date(`${date}T${doctor.availability_start_time}`);
    const endTime = new Date(`${date}T${doctor.availability_end_time}`);

    const allSlots: string[] = [];
    const slotDurationMinutes = 30;

    let current = new Date(startTime);
    while (current < endTime) {
        const next = new Date(current.getTime() + slotDurationMinutes * 60000);
        if (next > endTime) break;

        const format = (d: Date) => d.toTimeString().slice(0, 5); // HH:MM
        allSlots.push(`${format(current)} - ${format(next)}`);
        current = next;
    }

    const openSlots = allSlots.filter(slot => !scheduledTimeSlots.includes(slot));

    if (openSlots.length === 0) {
        return ["No available slots"];
    }

    return openSlots;
}

export function hasEmptyFields(obj: any): boolean {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      if (obj[key].trim() === "") return true;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      if (hasEmptyFields(obj[key])) return true;
    }
  }
  return false;
}