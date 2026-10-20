import { useEffect, useState } from "react";
import api from "./api";

function Patients() {
const [patients, setPatients] = useState([]);
const [form, setForm] = useState({
name: "",
age: "",
phone: "",
});

const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

// Load patients from the Django backend
const load = () => {
setLoading(true);
setError("");

api
  .get("patients/")
  .then((res) => {
    setPatients(Array.isArray(res.data) ? res.data : res.data.results || []);
  })
  .catch((err) => {
    console.error("API error:", err);
    setError("Unable to load patients. Please check your backend connection.");
  })
  .finally(() => setLoading(false));

};

useEffect(() => {
load();
}, []);

// Handle form input changes
const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
setError("");
setSuccess("");
};

// Register a new patient
const handleSubmit = (e) => {
e.preventDefault();
setError("");
setSuccess("");

if (!form.name.trim() || !form.age || !form.phone.trim()) {
  setError("Please fill in all patient details.");
  return;
}

if (Number(form.age) < 0) {
  setError("Age cannot be negative.");
  return;
}

setSaving(true);

api
  .post("patients/", {
    name: form.name.trim(),
    age: Number(form.age),
    phone: form.phone.trim(),
  })
  .then(() => {
    setForm({ name: "", age: "", phone: "" });
    setSuccess("Patient registered successfully.");
    load();
  })
  .catch((err) => {
    console.error("API error:", err);
    setError("Unable to add patient. Please check the details and try again.");
  })
  .finally(() => setSaving(false));

};

// Delete a patient
const handleDelete = (id) => {
const confirmed = window.confirm(
"Are you sure you want to delete this patient?"
);

if (!confirmed) return;

setError("");
setSuccess("");

api
  .delete(`patients/${id}/`)
  .then(() => {
    setPatients((current) => current.filter((p) => p.id !== id));
    setSuccess("Patient deleted successfully.");
  })
  .catch((err) => {
    console.error("API error:", err);
    setError("Unable to delete patient. Please try again.");
  });

};

// Filter the patient list
const filteredPatients = patients.filter((patient) => {
const query = search.toLowerCase().trim();

return (
  (patient.name || "").toLowerCase().includes(query) ||
  String(patient.phone || "").toLowerCase().includes(query)
);

});

return (
<div className="patients-page">
{/* Page heading */}
<section className="patients-heading">
<div>
<span className="patients-eyebrow">PATIENT MANAGEMENT</span>
<h2>Patients</h2>
<p>Register patients and manage their information.</p>
</div>

    <div className="patients-total">
      <span>Total Patients</span>
      <strong>{patients.length}</strong>
      <small>Registered patients</small>
    </div>
  </section>

  {/* Messages */}
  {error && (
    <div className="patients-message patients-error" role="alert">
      {error}
    </div>
  )}

  {success && (
    <div className="patients-message patients-success" role="status">
      {success}
    </div>
  )}

  {/* Registration form */}
  <section className="panel patients-form-panel">
    <div className="patients-section-heading">
      <div className="patients-section-icon">+</div>
      <div>
        <h3>Register New Patient</h3>
        <p>Enter the patient's details below.</p>
      </div>
    </div>

    <form className="patients-form" onSubmit={handleSubmit}>
      <div className="patients-field">
        <label htmlFor="patient-name">Full Name</label>
        <input
          id="patient-name"
          name="name"
          type="text"
          placeholder="Enter patient name"
          value={form.name}
          onChange={handleChange}
          maxLength={100}
          required
        />
      </div>

      <div className="patients-field">
        <label htmlFor="patient-age">Age</label>
        <input
          id="patient-age"
          name="age"
          type="number"
          placeholder="Enter age"
          min="0"
          max="150"
          value={form.age}
          onChange={handleChange}
          required
        />
      </div>

      <div className="patients-field">
        <label htmlFor="patient-phone">Phone Number</label>
        <input
          id="patient-phone"
          name="phone"
          type="tel"
          placeholder="Enter phone number"
          value={form.phone}
          onChange={handleChange}
          maxLength={20}
          required
        />
      </div>

      <button
        className="patients-submit-button"
        type="submit"
        disabled={saving}
      >
        {saving ? "Registering..." : "+ Add Patient"}
      </button>
    </form>
  </section>

  {/* Patient list */}
  <section className="panel patients-list-panel">
    <div className="patients-list-heading">
      <div>
        <h3>Patient Directory</h3>
        <p>View and manage registered patients.</p>
      </div>

      <div className="patients-search">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          aria-label="Search patients"
          placeholder="Search name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>

    <div className="table-wrap patients-table-wrap">
      <table className="patients-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Age</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="patients-empty">
                Loading patients...
              </td>
            </tr>
          ) : filteredPatients.length === 0 ? (
            <tr>
              <td colSpan="4" className="patients-empty">
                {search
                  ? "No patients match your search."
                  : "No patients registered yet."}
              </td>
            </tr>
          ) : (
            filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <div className="patients-name-cell">
                    <div className="patients-avatar">
                      {(patient.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <strong>{patient.name}</strong>
                  </div>
                </td>

                <td>{patient.age}</td>

                <td>{patient.phone}</td>

                <td>
                  <button
                    className="patients-delete-button"
                    type="button"
                    onClick={() => handleDelete(patient.id)}
                    aria-label={`Delete ${patient.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className="patients-table-footer">
      Showing {loading ? 0 : filteredPatients.length} of {patients.length}{" "}
      patients
    </div>
  </section>
</div>

);
}

export default Patients;