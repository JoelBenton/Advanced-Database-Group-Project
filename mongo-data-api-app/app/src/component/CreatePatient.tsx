import { useState } from "react";
import { hasEmptyFields } from "../utils";

interface CreatePatientProps {
  onClose: () => void;
}

const CreatePatient = ({ onClose }: CreatePatientProps) => {
  const Relationships = [
    "Parent",
    "Sibling",
    "Spouse",
    "Child",
    "Friend",
    "Other",
    "Colleague",
  ];

  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    date_of_birth: "",
    contact_number: "",
    email: "",
    address: {
      postcode: "",
      house_number: "",
      address: "",
    },
    emergency_contact: {
      name: "",
      surname: "",
      phone_number: "",
      email: "",
      relationship: "",
    },
    medical_records: [],
    appointments: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("emergency_contact_")) {
      const field = name.replace("emergency_contact_", "");
      setForm((prev) => ({
        ...prev,
        emergency_contact: {
          ...prev.emergency_contact,
          [field]: value,
        },
      }));
      return;
    }

    if (name.startsWith("address_")) {
      const field = name.replace("address_", "");
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateConfirm = () => {
    if (hasEmptyFields(form)) {
      alert("Please fill in all fields");
      return;
    }
    onClose();
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-4 border-t pt-6">
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const InputField = ({
    label,
    name,
    value,
    type = "text",
  }: {
    label: string;
    name: string;
    value: string;
    type?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Create Patient</h2>

      <Section title="Account Details">
        <InputField label="Username" name="username" value={form.username} />
        <InputField
          label="Password"
          name="password"
          value={form.password}
          type="password"
        />
      </Section>

      <Section title="Personal Information">
        <InputField
          label="First Name"
          name="firstName"
          value={form.firstName}
        />
        <InputField label="Last Name" name="lastName" value={form.lastName} />
        <InputField
          label="Date of Birth"
          name="date_of_birth"
          value={form.date_of_birth}
          type="date"
        />
        <InputField
          label="Contact Number"
          name="contact_number"
          value={form.contact_number}
        />
        <InputField
          label="Email"
          name="email"
          value={form.email}
          type="email"
        />
      </Section>

      <Section title="Address">
        <InputField
          label="Street Address"
          name="address_address"
          value={form.address.address}
        />
        <InputField
          label="House Number"
          name="address_house_number"
          value={form.address.house_number}
        />
        <InputField
          label="Postcode"
          name="address_postcode"
          value={form.address.postcode}
        />
      </Section>

      <Section title="Emergency Contact">
        <InputField
          label="First Name"
          name="emergency_contact_name"
          value={form.emergency_contact.name}
        />
        <InputField
          label="Surname"
          name="emergency_contact_surname"
          value={form.emergency_contact.surname}
        />
        <InputField
          label="Phone Number"
          name="emergency_contact_phone_number"
          value={form.emergency_contact.phone_number}
        />
        <InputField
          label="Email"
          name="emergency_contact_email"
          value={form.emergency_contact.email}
          type="email"
        />
        <div>
          <label className="block text-sm font-medium mb-1">Relationship</label>
          <select
            name="emergency_contact_relationship"
            value={form.emergency_contact.relationship}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select a relationship</option>
            {Relationships.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <div className="flex justify-between pt-6 border-t mt-6">
        <button
          onClick={onClose}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateConfirm}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CreatePatient;
