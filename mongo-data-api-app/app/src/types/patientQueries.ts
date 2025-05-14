export type PatientQueryConditions = {
    first_name?: string;
    last_name?: string;
    contact_number?: string;
    email?: string;
}

export type UpdatePatientDetails = {
    date_of_birth?: string; // ISO date format, e.g., "1948-01-09"
    contact_number?: string;
    email?: string;
    address?: {
        postcode?: string;
        house_number?: string;
        address?: string;
    };
}

export type UpdateEmergencyContact = {
  name: string;
  surname: string;
  email: string;
  phone_number: string;
  relationship: string;
}

export type PatientData = {
  _id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO date format, e.g., "1948-01-09"
  contact_number: string;
  email: string;

  address: {
    postcode: string;
    house_number: string;
    address: string;
  };

  emergency_contact: {
    name: string;
    surname: string;
    email: string;
    phone_number: string;
    relationship: string;
  };

  medical_records: {
    doctor_id: number;
    record_date: string; // ISO date format, e.g., "2023-01-09"
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

  appointments: {
    date: string; // ISO date format, e.g., "2025-05-02"
    time_slot: string; // e.g., "09:00-10:00"
    room: {
      name: string;
      equipment: string;
    };
    urgency: string;
    reason_for: string;
    doctor_id: string;
    status: string;
  }[];
};