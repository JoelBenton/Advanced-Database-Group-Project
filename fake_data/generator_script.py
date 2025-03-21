import json
import random
from faker import Faker

# Initialize Faker instance
fake = Faker()

# Define the number of records for each collection
num_users = 10         # 10 users
num_medical_staff = 10  # 10 doctors
num_patients = 100     # 100 patients

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
        medical_staff.append({
            "_id": i + 1,
            "first_name": fake.first_name(),
            "second_name": fake.last_name(),
            "specialisation": fake.job(),
            "contact_number": fake.phone_number(),
            "email": fake.email(),
            "availability_start_time": fake.time(),
            "availability_end_time": fake.time(),
            "role": "Doctor",
        })
    return medical_staff

# Generate Patients
def generate_patients(num_records):
    patients = []
    for i in range(num_records):
        patients.append({
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
            "medical_records": [
                {
                    "doctor_id": random.randint(1, num_medical_staff),
                    "record_date": fake.date_this_decade().strftime("%Y-%m-%d"),
                    "diagnosis": fake.word(),
                    "treatment": fake.word(),
                    "prescriptions": [
                        {
                            "medication": fake.word(),
                            "dosage": fake.word(),
                            "duration": f"{random.randint(1, 7)} Day",
                            "instructions": fake.sentence(),
                        }
                    ],
                    "notes": fake.sentence(),
                }
            ],
            "appointments": [
                {
                    "time_slot": f"{random.randint(1, 12)}:{random.randint(0, 59):02d} - {random.randint(1, 12)}:{random.randint(0, 59):02d}",
                    "room": {
                        "name": f"Room {random.randint(1, 10)}",
                        "equipment": fake.word(),
                    },
                    "urgency": random.choice(['Low', 'Medium', 'High']),
                    "reason_for": fake.word(),
                    "doctor_id": random.randint(1, num_medical_staff),
                    "status": random.choice(['Confirmed', 'Pending', 'Cancelled']),
                }
            ],
        })
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