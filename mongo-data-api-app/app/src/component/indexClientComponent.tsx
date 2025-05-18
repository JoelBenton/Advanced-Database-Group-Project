"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import CreatePatient from "./CreatePatient";
import CreateDoctor from "./CreateDoctor";
import Modal from "./Modal";

interface ClientComponentProps {
  isConnected: boolean;
  patients: any[];
  doctors: any[];
}

export default function ClientComponent({
  isConnected,
  patients,
  doctors,
}: ClientComponentProps) {
  const router = useRouter();
  const [role, setRole] = useState<"patient" | "doctor" | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [patientsState, setPatientsState] = useState(patients);
  const [doctorsState, setDoctorsState] = useState(doctors);

  const list = role === "patient" ? patientsState : doctorsState;

  const handleConfirm = () => {
    if (selectedId) router.push(`/${role}/${selectedId}`);
  };

  function handleRoleChange(newRole: "patient" | "doctor") {
    setRole(newRole);
    setSelectedId("");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4 font-comic">
      {/* Database Status */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
        <span className="text-sm font-medium text-gray-700">Database:</span>
        <span
          className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"
            }`}
        />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-xl text-center space-y-8 border-4 border-blue-200">
        <img
          src="https://delandgibson.com/wp-content/uploads/2016/02/green-health-care-plus.png"
          alt="HCAMS logo"
          className="w-24 h-24 mx-auto mb-4"
        />

        <div>
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2">
            Welcome to HCAMS
          </h1>
          <p className="text-gray-600 text-lg">
            Please select your role to begin your journey.
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex justify-center gap-10">
          {["patient", "doctor"].map((r) => (
            <label
              key={r}
              className="flex items-center gap-2 cursor-pointer text-xl text-gray-700"
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => handleRoleChange(r as "patient" | "doctor")}
                className="w-6 h-6 accent-blue-500"
              />
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </label>
          ))}
        </div>

        {/* Dropdown and Confirm */}
        {role && (
          <div>
            <div className="space-y-4">
              <Command className="w-full border-2 border-blue-200 rounded-md shadow-sm">
                <CommandInput placeholder={`Search for a ${role}...`} />
                <CommandList className="max-h-60 overflow-y-auto">
                  <CommandGroup>
                    {[...list]
                      .sort((a, b) => {
                        const nameA = `${a.first_name} ${role === "doctor"
                          ? a.second_name ?? ""
                          : a.last_name ?? ""
                          }`.toLowerCase();
                        const nameB = `${b.first_name} ${role === "doctor"
                          ? b.second_name ?? ""
                          : b.last_name ?? ""
                          }`.toLowerCase();
                        return nameA.localeCompare(nameB);
                      })
                      .map((person) => (
                        <CommandItem
                          key={person._id}
                          value={person._id}
                          onSelect={() => setSelectedId(person._id)}
                          className={`cursor-pointer ${selectedId === person._id ? "bg-blue-100" : ""
                            }`}
                        >
                          {person.first_name}{" "}
                          {role === "doctor"
                            ? person.second_name ?? ""
                            : person.last_name ?? ""}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>

              <button
                onClick={handleConfirm}
                disabled={!selectedId}
                className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                View Dashboard
              </button>
              {/* Create Button */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full bg-green-500 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-600 transition"
              >
                {role.charAt(0).toUpperCase() + role.slice(1)} Registration
              </button>
            </div>
            <div>
              {/* Show correct create component */}
              <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)}>
                {role === "patient" ? (
                  <CreatePatient
                    onClose={() => setShowCreateForm(false)}
                    addPatient={(newPatient) =>
                      setPatientsState((prev) => [...prev, newPatient])
                    }
                  />
                ) : (
                  <CreateDoctor
                    onClose={() => setShowCreateForm(false)}
                    addDoctor={(newDoctor) =>
                      setDoctorsState((prev) => [...prev, newDoctor])
                    }
                  />
                )}
              </Modal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
