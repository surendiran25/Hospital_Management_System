import { useEffect, useState } from "react";
import api from "./api";

const today = () => new Date().toISOString().slice(0, 10);

export default function MedicalRecords() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    api.get("patients/").then((res) => setPatients(res.data)).catch((err) => console.log("API error:", err));
    api.get("doctors/").then((res) => setDoctors(res.data)).catch((err) => console.log("API error:", err));
    api.get("records/").then((res) => setRecords(res.data)).catch((err) => console.log("API error:", err));
  }, []);
  const emptyForm = { patient: "", doctor: "", diagnosis: "", prescription: "", date: today() };
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.patient || !form.doctor) {
      return setError("Please select a patient and a doctor.");
    }
    if (!form.diagnosis.trim()) {
      return setError("Diagnosis is required.");
    }
    if (!form.date) {
      return setError("Please choose a date.");
    }
    setRecords([
      ...records,
      {
        id: Date.now(),
        ...form,
        diagnosis: form.diagnosis.trim(),
        prescription: form.prescription.trim(),
      },
    ]);
    setForm(emptyForm);
    setError("");
  };

  const deleteRecord = (id) => setRecords(records.filter((r) => r.id !== id));

  const visible = records
    .filter((r) => !filter || r.patient === filter)
    .filter((r) => {
      const q = search.trim().toLowerCase();
      return (
        !q ||
        (r.diagnosis || "").toLowerCase().includes(q) ||
        (r.prescription || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="appointments-page">
      <section className="card">
        <h2>Medical Records</h2>

        <form className="appt-form" onSubmit={handleAdd}>
          <select name="patient" value={form.patient} onChange={handleChange}>
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          <select name="doctor" value={form.doctor} onChange={handleChange}>
            <option value="">Select doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <input type="date" name="date" max={today()} value={form.date} onChange={handleChange} />
          <input name="diagnosis" placeholder="Diagnosis" value={form.diagnosis} onChange={handleChange} />
          <input name="prescription" placeholder="Prescription" value={form.prescription} onChange={handleChange} />

          <button type="submit">Add record</button>
        </form>

        {error && <p className="form-error">{error}</p>}

        <div className="appt-form">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All patients</option>
            {patients.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          <input
            placeholder="Search diagnosis / prescription"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="appt-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr><td colSpan="6">No records found.</td></tr>
            )}
            {visible.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.patient}</td>
                <td>{r.doctor}</td>
                <td>{r.diagnosis}</td>
                <td>{r.prescription || "-"}</td>
                <td>
                  <button type="button" onClick={() => deleteRecord(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}