import { useState } from "react";

interface CreateDoctorProps {
  onClose: () => void;
}

const CreateDoctor = ({ onClose }: CreateDoctorProps) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    secondName: "",
    specialisation: "",
    contactNumber: "",
    email: "",
    availabilityStart: "09:00",
    availabilityEnd: "17:00",
  });

  const allTimes = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours}:${minutes}`;
  });

  const endTimeOptions = allTimes.filter(
    (time) => time > form.availabilityStart
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "availabilityStart" && value >= form.availabilityEnd) {
      const nextValid = allTimes.find((t) => t > value);
      if (nextValid) {
        setForm((prev) => ({ ...prev, availabilityEnd: nextValid }));
      }
    }
  };

  function handleCreateConfirm() {
    if (
      !form.username ||
      !form.password ||
      !form.firstName ||
      !form.secondName ||
      !form.specialisation ||
      !form.contactNumber ||
      !form.email ||
      !form.availabilityStart ||
      !form.availabilityEnd
    ) {
      alert("Please fill in all fields");
      return;
    }
    onClose();
  }

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
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Second Name</label>
          <input
            type="text"
            name="secondName"
            value={form.secondName}
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
            name="contactNumber"
            value={form.contactNumber}
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
            value={form.availabilityStart}
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
            value={form.availabilityEnd}
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
          onClick={handleCreateConfirm}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CreateDoctor;
