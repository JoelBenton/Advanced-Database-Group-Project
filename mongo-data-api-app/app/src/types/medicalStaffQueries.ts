export type MedicalStaffCreate = {
    user_id: number,
    first_name: string,
    second_name: string,
    specialisation: string,
    contact_number: string,
    email: string,
    availability_start_time: string,
    availability_end_time: string,
    role: string,
}

export type MedicalStaff = {
    _id: number,
    user_id: number,
    first_name: string,
    second_name: string,
    specialisation: string,
    contact_number: string,
    email: string,
    availability_start_time: string,
    availability_end_time: string,
    role: string,
}

export type MedicalStaffSpecialisationSearch = {
    role: string,
    specialisation: string,
}

export type MedicalStaffAvailabilitySearch = {
    role: string,
    availability_start_time: string,
    availability_end_time: string,
}

export type MedicalStaffAvailabilitySearchWithSpecialisation = {
    role: string,
    specialisation: string,
    availability_start_time: string,
    availability_end_time: string,
}