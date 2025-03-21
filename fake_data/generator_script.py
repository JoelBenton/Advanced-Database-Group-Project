import json
import random
from faker import Faker
from datetime import datetime, timedelta

# Initialize Faker instance
fake = Faker()

# Define the number of records for each collection
num_users = 10         # 10 users
num_medical_staff = 10  # 10 doctors
num_patients = 100     # 100 patients

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
            "role": random.choice(['Admin', 'User']),
        })
    return users

# Generate Medical Staff (Doctors)
def generate_medical_staff(num_records):
    medical_staff = []
    for i in range(num_records):
        # Generate a random start time between 08:00 AM and 12:00 PM
        start_hour = random.randint(8, 11)
        start_minute = random.choice([0, 30])
        start_time = datetime.strptime(f"{start_hour}:{start_minute:02d}", "%H:%M")
        
        # Generate a random end time between 1 hour and 6 hours after the start time
        end_time = start_time + timedelta(hours=8)
        
        medical_staff.append({
            "_id": i + 1,
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
def generate_patients(num_records):
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
        num_medical_records = random.randint(0, 2)  # Random number of records (1 to 3)
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
                        "duration": f"{random.randint(1, 14)} Days",  # Random duration between 1 and 14 days
                        "instructions": random.choice(instructions),
                    }
                ],
                "notes": fake.sentence(),
            })
        
        # Generate appointments with 30-minute time slots
        num_appointments = random.randint(0, 2)  # Random number of appointments (0 to 2)
        for _ in range(num_appointments):
            hour = random.randint(8, 16)  # Appointments between 08:00 and 16:00
            minute = random.choice([0, 30])  # 30-minute slots only (on the hour or half-past)
            start_time = datetime.strptime(f"{hour}:{minute:02d}", "%H:%M")
            end_time = start_time + timedelta(minutes=30)
            
            # Randomly choose reason for appointment and corresponding equipment
            reason = random.choice(appointment_reasons)
            equipment = appointment_equipment[reason]
            
            patient["appointments"].append({
                "time_slot": f"{start_time.strftime('%H:%M')} - {end_time.strftime('%H:%M')}",
                "room": {
                    "name": f"Room {random.randint(1, 10)}",
                    "equipment": equipment,
                },
                "urgency": random.choice(['Low', 'Medium', 'High']),
                "reason_for": reason,
                "doctor_id": random.randint(1, num_medical_staff),
                "status": random.choice(['Confirmed', 'Pending', 'Cancelled']),
            })
        
        patients.append(patient)
    
    return patients

# Generate the data
users = generate_users(num_users)
medical_staff = generate_medical_staff(num_medical_staff)
patients = generate_patients(num_patients)

# Save to JSON files
with open('users.json', 'w') as file:
    json.dump(users, file, indent=2)

with open('medicalStaff.json', 'w') as file:
    json.dump(medical_staff, file, indent=2)

with open('patients.json', 'w') as file:
    json.dump(patients, file, indent=2)

print("Data has been generated and saved to JSON files.")