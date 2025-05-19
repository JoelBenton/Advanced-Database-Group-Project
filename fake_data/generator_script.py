import json
import random
from faker import Faker
from datetime import datetime, timedelta

# Initialize Faker instance
fake = Faker()

# Define the number of records for each collection
num_medical_staff = 10  # 10 doctors
num_patients = 100      # 100 patients
num_users = num_medical_staff + num_patients  # Total users

# Sample list of diagnoses and treatments
diagnoses_treatments = {
    "Flu": "Rest, hydration, and antiviral medication",
    "Cold": "Rest, hydration, and over-the-counter medication",
    "High Blood Pressure": "Blood pressure medications, lifestyle changes",
    "Diabetes": "Insulin therapy, blood sugar monitoring",
    "Asthma": "Inhalers, avoidance of triggers",
    "Migraine": "Pain relief, anti-nausea medication",
    "Infection": "Antibiotics and rest",
    "Sprain": "Rest, ice, compression, and elevation (R.I.C.E.)",
    "Anxiety": "Cognitive-behavioral therapy, medications",
    "Depression": "Antidepressants, therapy"
}

# Sample list of reasons for appointments and corresponding equipment
appointment_reasons = [
    "Routine Checkup", "Emergency", "Consultation", "Follow-up", "Diagnostic Test"
]
appointment_equipment = {
    "Routine Checkup": "Stethoscope",
    "Emergency": "Defibrillator",
    "Consultation": "Computer/Tablet",
    "Follow-up": "Blood Pressure Monitor",
    "Diagnostic Test": "X-Ray Machine"
}

# Sample list of medical specialisations
medical_specialisations = [
    "General Practitioner", "Cardiologist", "Neurologist", "Orthopedic Surgeon",
    "Pediatrician", "Psychiatrist", "Dermatologist", "Endocrinologist", 
    "Oncologist", "Gastroenterologist", "Ophthalmologist", "ENT Specialist"
]

# Generate Users
def generate_users(num_records):
    users = []
    for i in range(num_records):
        users.append({
            "_id": i + 1,
            "username": fake.user_name(),
            "password_hash": fake.password(),
            "role": "User",  # Default role, doctors and patients will have role overridden later
        })
    return users

# Generate Medical Staff (Doctors)
def generate_medical_staff(num_records, user_ids):
    medical_staff = []
    for i in range(num_records):
        # Generate a random start time between 08:00 AM and 12:00 PM
        start_hour = random.randint(8, 11)
        start_minute = random.choice([0, 30])
        start_time = datetime.strptime(f"{start_hour}:{start_minute:02d}", "%H:%M")
        
        # Generate a random end time
        end_time = start_time + timedelta(hours=8)

        medical_staff.append({
            "_id": i + 1,
            "user_id": user_ids[i],  # Assign user_id
            "first_name": fake.first_name(),
            "second_name": fake.last_name(),
            "specialisation": random.choice(medical_specialisations),
            "contact_number": fake.phone_number(),
            "email": fake.email(),
            "availability_start_time": start_time.strftime("%H:%M"),
            "availability_end_time": end_time.strftime("%H:%M"),
            "role": "Doctor",
        })
    
    return medical_staff

# Generate Patients
def generate_patients(num_records, user_ids):
    medications = ["Paracetamol", "Ibuprofen", "Aspirin", "Amoxicillin", "Metformin", "Lisinopril", "Citalopram", "Prednisolone"]
    dosage_formats = ["500mg", "200mg", "100mg", "1g", "2mg", "25mg"]
    instructions = [
        "Take with food", 
        "Do not drink alcohol", 
        "Take one tablet every 6 hours", 
        "Take two tablets before bed", 
        "Take one tablet in the morning", 
        "Do not exceed the recommended dose"
    ]
    
    patients = []
    for i in range(num_records):
        patient = {
            "_id": i + 1,
            "user_id": user_ids[i],  # Assign user_id
            "first_name": fake.first_name(),
            "last_name": fake.last_name(),
            "date_of_birth": fake.date_of_birth(minimum_age=18, maximum_age=80).strftime("%Y-%m-%d"),
            "contact_number": fake.phone_number(),
            "email": fake.email(),
            "address": {
                "postcode": fake.zipcode(),
                "house_number": fake.building_number(),
                "address": fake.address().replace("\n", ", "),
            },
            "emergency_contact": {
                "name": fake.first_name(),
                "surname": fake.last_name(),
                "email": fake.email(),
                "phone_number": fake.phone_number(),
                "relationship": random.choice(['Parent', 'Friend', 'Sibling', 'Spouse']),
            },
            "medical_records": [],
            "appointments": [],
        }
        
        # Generate medical records and prescriptions for each patient
        num_medical_records = random.randint(0, 2)
        for _ in range(num_medical_records):
            diagnosis, treatment = random.choice(list(diagnoses_treatments.items()))
            patient["medical_records"].append({
                "doctor_id": random.randint(1, num_medical_staff),
                "record_date": fake.date_this_decade().strftime("%Y-%m-%d"),
                "diagnosis": diagnosis,
                "treatment": treatment,
                "prescriptions": [
                    {
                        "medication": random.choice(medications),
                        "dosage": random.choice(dosage_formats),
                        "duration": f"{random.randint(1, 14)} Days",
                        "instructions": random.choice(instructions),
                    }
                ],
                "notes": fake.sentence(),
            })
        
        # Generate appointments
        num_appointments = random.randint(0, 2)
        for _ in range(num_appointments):
            # Random date within the next 30 days
            appointment_date = datetime.today() + timedelta(days=random.randint(0, 30))
            
            hour = random.randint(8, 16)
            minute = random.choice([0, 30])
            start_datetime = appointment_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
            end_datetime = start_datetime + timedelta(minutes=30)

            reason = random.choice(appointment_reasons)
            equipment = appointment_equipment[reason]

            patient["appointments"].append({
                "date": start_datetime.strftime("%Y-%m-%d"),
                "time_slot": f"{start_datetime.strftime('%H:%M')} - {end_datetime.strftime('%H:%M')}",
                "room": {
                    "name": f"Room {random.randint(1, 10)}",
                    "equipment": equipment,
                },
                "urgency": random.choice(['Low', 'Medium', 'High']),
                "reason_for": reason,
                "doctor_id": random.randint(1, num_medical_staff),
                "status": random.choice(['Confirmed', 'Pending', 'Cancelled', 'Rescheduled']),
            })
        
        patients.append(patient)
    
    return patients

# Generate the data
users = generate_users(num_users)

# Assign user IDs
medical_staff_user_ids = [user["_id"] for user in users[:num_medical_staff]]
patient_user_ids = [user["_id"] for user in users[num_medical_staff:]]

medical_staff = generate_medical_staff(num_medical_staff, medical_staff_user_ids)
patients = generate_patients(num_patients, patient_user_ids)

# Update roles for medical staff in users list
for user_id in medical_staff_user_ids:
    users[user_id - 1]["role"] = "Doctor"

# Update roles for patients in users list
for user_id in patient_user_ids:
    users[user_id - 1]["role"] = "Patient"

# Save to JSON files
with open('users.json', 'w') as file:
    json.dump(users, file, indent=2)

with open('medicalStaff.json', 'w') as file:
    json.dump(medical_staff, file, indent=2)

with open('patients.json', 'w') as file:
    json.dump(patients, file, indent=2)

print("Data has been generated and saved to JSON files.")