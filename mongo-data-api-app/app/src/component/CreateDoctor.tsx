import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { hasEmptyFields } from "../utils";
import mongo from "../mongoIndex";
import { MedicalStaff } from "../types/medicalStaffQueries";

interface CreateDoctorPageProps {
  onClose: () => void;
}

const defaultForm = {
  username: "",
  password: "",
  first_name: "",
  second_name: "",
  specialisation: "",
  contact_number: "",
  email: "",
  availability_start_time: "09:00",
  availability_end_time: "17:00",
};

const CreateDoctorPage = ({ onClose }: CreateDoctorPageProps) => {
  const [_, startMaxIdsTransition] = useTransition();
  const [isCreateDoctorLoading, startCreateDoctor] = useTransition();
  const [maxMedStaffId, setMaxMedStaffId] = useState<number | null>(null);
  const [maxUserId, setMaxUserId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);

  const allTimes = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours}:${minutes}`;
  });

  const endTimeOptions = allTimes.filter(
    (time) => time > form.availability_start_time
  );

  useEffect(() => {
    startMaxIdsTransition(async () => {
      const maxMedStaffId = await mongo.getLargestMedicalStaffId();
      const maxUserId = await mongo.getLargestUserId();
      setMaxMedStaffId(maxMedStaffId);
      setMaxUserId(maxUserId);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      name === "availability_start_time" &&
      value >= form.availability_end_time
    ) {
      const nextValid = allTimes.find((t) => t > value);
      if (nextValid) {
        setForm((prev) => ({ ...prev, availabilityEnd: nextValid }));
      }
    }
  };

  const handleCreateConfirm = () => {
    if (hasEmptyFields(form)) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (form.availability_start_time >= form.availability_end_time) {
      toast.error("End time must be after start time.");
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
    if (!/^[0-9]{10}$/.test(form.contact_number)) {
      toast.error("Contact number must be 10 digits long.");
      return;
    }

    createDoctor();
  };

  const createDoctor = () => {
    startCreateDoctor(async () => {
      const createToast = toast.loading("Creating doctor...");
      const { username, password, ...formWithoutCreds } = form;

      const newDoctor: MedicalStaff = {
        _id: maxMedStaffId ? maxMedStaffId + 1 : 1,
        user_id: maxUserId ? maxUserId + 1 : 1,
        ...formWithoutCreds,
        role: "Doctor",
      };

      const userResult = await mongo.createUser({
        _id: maxUserId ? maxUserId + 1 : 1,
        username: username,
        password_hash: password,
        role: "Doctor",
      });

      if (userResult.acknowledged) {
        toast.success("User created successfully");
        const doctorResult = await mongo.createMedicalStaff(newDoctor);
        if (doctorResult.acknowledged) {
          toast.success("Doctor created successfully");
          toast.custom("Reload page to see changes", {
            icon: "🔄",
          });
          onClose();
        } else {
          toast.error("Failed to create doctor");
        }
      } else {
        toast.error("Failed to create user");
      }

      toast.dismiss(createToast);
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Create Doctor</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Second Name</label>
          <input
            type="text"
            name="second_name"
            value={form.second_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Specialisation
          </label>
          <input
            type="text"
            name="specialisation"
            value={form.specialisation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Contact Number
          </label>
          <input
            type="text"
            name="contact_number"
            value={form.contact_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Availability Start
          </label>
          <select
            name="availabilityStart"
            value={form.availability_start_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            {allTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Availability End
          </label>
          <select
            name="availabilityEnd"
            value={form.availability_end_time}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            {endTimeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onClose}
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          onClick={handleCreateConfirm}
          disabled={isCreateDoctorLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {isCreateDoctorLoading ? "Creating..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default CreateDoctorPage;
