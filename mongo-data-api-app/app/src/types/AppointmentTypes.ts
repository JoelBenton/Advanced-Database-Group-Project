export type createAppointment = {
    doctor_id: string;
    time_slot: string;
    date: string; // ISO date format, e.g., "2025-05-02"
    room: {
        name: string;
        equipment: string;
    };
    urgency: string; // e.g., "High", "Medium", "Low"
    reason_for: string; // e.g., "Routine Check-up", "Follow-up", "Emergency"
    status: string; // e.g., "Pending", "Confirmed", "Cancelled"
}

export type updateAppointment = {
    doctor_id?: string;
    time_slot?: string;
    date?: string; // ISO date format, e.g., "2025-05-02"
    room?: {
        name: string;
        equipment: string;
    };
    urgency?: string; // e.g., "High", "Medium", "Low" // Added optional modifier
    reason_for?: string; // e.g., "Routine Check-up", "Follow-up", "Emergency" // Added optional modifier
    status?: string; // e.g., "Pending", "Confirmed", "Cancelled" // Added optional modifier    
}