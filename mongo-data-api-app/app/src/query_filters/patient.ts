import { PatientQueryConditions } from "../types/patientQueries";

export function patientOrFilter (
  conditions: PatientQueryConditions = {}) {
  return {
    $or: [
      { first_name: conditions.first_name || ""},
      { last_name: conditions.last_name || ""},
      { contact_number: conditions.contact_number || ""},
      { email: conditions.email || ""}
    ].filter(condition => Object.values(condition)[0] !== undefined)
  };
}