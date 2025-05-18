import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { hasEmptyFields } from "../utils";
import mongo from "../mongoIndex";
import { PatientData } from "../types/patientQueries";

interface CreatePatientPageProps {
  onClose: () => void;
  addPatient: (patient: PatientData) => void;
}

const defaultForm = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
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
};

const CreatePatientPage = ({ onClose, addPatient }: CreatePatientPageProps) => {
  const [_, startMaxIdsTransition] = useTransition();
  const [isCreatePatientLoading, startCreatePatient] = useTransition();
  const [maxPatientId, setMaxPatientId] = useState<number | null>(null);
  const [maxUserId, setMaxUserId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);

  const Relationships = [
    "Parent",
    "Sibling",
    "Spouse",
    "Child",
    "Friend",
    "Other",
    "Colleague",
  ];

  useEffect(() => {
    startMaxIdsTransition(async () => {
      const maxPatientId = await mongo.getLargestPatientId();
      const maxUserId = await mongo.getLargestUserId();
      setMaxPatientId(maxPatientId);
      setMaxUserId(maxUserId);
    });
  }, []);

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
      toast.error("Please fill in all fields.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!/^[0-9]{10,}$/.test(form.contact_number)) {
      toast.error("Contact number must be at least 10 digits long.");
      return;
    }

    createPatient();
  };

  const createPatient = () => {
    startCreatePatient(async () => {
      const createToast = toast.loading("Creating patient...");
      const { username, password, ...formWithoutCreds } = form;

      const newPatient: PatientData = {
        _id: maxPatientId ? maxPatientId + 1 : 1,
        user_id: maxUserId ? maxUserId + 1 : 1,
        ...formWithoutCreds,
      };

      const userResult = await mongo.createUser({
        _id: maxUserId ? maxUserId + 1 : 1,
        username: username,
        password_hash: password,
        role: "patient",
      });

      if (userResult.acknowledged) {
        toast.success("User created successfully");
        const patientResult = await mongo.createPatient(newPatient);
        if (patientResult.acknowledged) {
          toast.success("Patient created successfully");
          addPatient(newPatient);
          onClose();
        } else {
          toast.error("Failed to create patient");
        }
      } else {
        toast.error("Failed to create user");
      }

      toast.dismiss(createToast);
    });
  };

  return (
    <div className="p-6 bg-green-50 rounded-xl border-2 border-dashed border-green-300 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-700 mb-2">
        Patient Registration Form
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Please complete all fields before confirming.
      </p>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <section className="bg-gray-50 p-5 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Account Credentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
          </div>
        </section>

        <section className="bg-gray-50 p-5 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Personal Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="date_of_birth"
              placeholder="Date of Birth"
              type="date"
              value={form.date_of_birth}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="contact_number"
              placeholder="Contact Number"
              value={form.contact_number}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
          </div>
        </section>

        <section className="bg-gray-50 p-5 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Residential Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="address_address"
              placeholder="Street Address"
              value={form.address.address}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="address_house_number"
              placeholder="House Number"
              value={form.address.house_number}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="address_postcode"
              placeholder="Postcode"
              value={form.address.postcode}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
          </div>
        </section>

        <section className="bg-gray-50 p-5 rounded-lg shadow-sm border mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="emergency_contact_name"
              placeholder="First Name"
              value={form.emergency_contact.name}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="emergency_contact_surname"
              placeholder="Surname"
              value={form.emergency_contact.surname}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="emergency_contact_phone_number"
              placeholder="Phone Number"
              value={form.emergency_contact.phone_number}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <input
              name="emergency_contact_email"
              placeholder="Email"
              type="email"
              value={form.emergency_contact.email}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            />
            <select
              name="emergency_contact_relationship"
              value={form.emergency_contact.relationship}
              onChange={handleChange}
              className="border px-3 py-2 rounded-lg"
            >
              <option value="">Select relationship</option>
              {Relationships.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4 border-t mt-4">
          <button
            type="button"
            onClick={() => onClose()}
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleCreateConfirm}
            disabled={isCreatePatientLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isCreatePatientLoading ? "Creating..." : "Confirm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePatientPage;
