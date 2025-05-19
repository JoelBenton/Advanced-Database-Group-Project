import mongo from './mongoIndex';
import { MedicalStaff } from './types/medicalStaffQueries';

/**
 * Returns a list of available 30-minute appointment slots for a given doctor on a specified date.
 * 
 * @param doctor - A MedicalStaff object that includes the doctor's availability times.
 * @param date - The date to check for open slots (format: YYYY-MM-DD).
 * @returns An array of available time slot strings, or a message if none are available.
 */
export async function retrieveOpenSlotsForDoctorOnDate(
    doctor: MedicalStaff,
    date: string, // YYYY-MM-DD format
) {
    // Replace slashes with dashes to ensure the date is in correct YYYY-MM-DD format
    date = date.replaceAll("/", "-");

    // Retrieve existing appointment time-slots for the doctor on the specified date
    const scheduledAppointments = await mongo.retrieveAppointmentSlotsForDoctorOnDateRange(
        String(doctor._id),
        date,
        date
    );

    // Extract the booked time slots into an array of strings like "13:00 - 13:30"
    const scheduledTimeSlots = scheduledAppointments.map(
      (appointment: { time_slot: string }) => appointment.time_slot
    );

    // Convert availability start and end times into Date objects for comparison
    const startTime = new Date(`${date}T${doctor.availability_start_time}`);
    const endTime = new Date(`${date}T${doctor.availability_end_time}`);

    const allSlots: string[] = [];
    const slotDurationMinutes = 30;

    // Generate all possible 30-minute time slots within the doctor's availability window
    let current = new Date(startTime);
    while (current < endTime) {
        const next = new Date(current.getTime() + slotDurationMinutes * 60000);
        if (next > endTime) break;

        const format = (d: Date) => d.toTimeString().slice(0, 5); // HH:MM
        allSlots.push(`${format(current)} - ${format(next)}`);
        current = next;
    }

    // Filter out the time slots that are already booked
    const openSlots = allSlots.filter(slot => !scheduledTimeSlots.includes(slot));

    // Return a message if no open slots are found
    if (openSlots.length === 0) {
        return ["No available slots"];
    }

    // Else return the list of available slots
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