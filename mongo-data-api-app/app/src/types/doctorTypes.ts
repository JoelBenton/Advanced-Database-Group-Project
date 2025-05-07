export type DoctorAppointments = {
    _id: number;
    first_name: string;
    last_name: string;
    appointment: {
      date: string; // e.g., "2025-05-08"
      time_slot: string; // e.g., "14:00 - 14:30"
      room: {
        name: string;
        equipment: string;
      };
      urgency: string;
      reason_for: string;
      doctor_id: number;
      status: string;
    };
    medical_record: {
      doctor_id: number;
      record_date: string; // e.g., "2021-04-05"
      diagnosis: string;
      treatment: string;
      prescriptions: {
        medication: string;
        dosage: string;
        duration: string;
        instructions: string;
      }[];
      notes: string;
    }[];
  };
  