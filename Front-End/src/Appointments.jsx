import { useState } from "react";

// TODO: replace these with your real data (from api.js or your existing state)
const PATIENTS = ["Select patient", "Anita Rao", "Rahul Verma", "Meera Shah"];
const DOCTORS = ["Select doctor", "Dr. Iyer", "Dr. Khan", "Dr. Mehta"];
const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

function formatSlot(value) {
  const d = new Date(value);
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    time: "",
    status: "Pending",
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const book = (e) => {
    e.preventDefault();
    setAppointments([{ id: Date.now(), ...form }, ...appointments]);
    setForm({ patient: "", doctor: "", time: "", status: "Pending" });
  };

  const setStatus = (id, status) =>
    setAppointments(appointments.map((a) => (a.id === id ? { ...a, status } : a)));

  const count = (s) => appointments.filter((a) => a.status === s).length;

  return (
      <div className="appt">
        <p className="appt-summary">
          <strong>{appointments.length}</strong> booked today &nbsp;·&nbsp;
          {count("Pending")} waiting for confirmation &nbsp;·&nbsp;
          {count("Confirmed")} confirmed &nbsp;·&nbsp;
          {count("Completed")} completed
        </p>

        <div className="appt-layout">
          {/* ---------- Booking form ---------- */}
          <form className="appt-form" onSubmit={book}>
            <h2>Book a visit</h2>

            <label className="appt-label">Patient</label>
            <select
              className="appt-field"
              value={form.patient}
              onChange={update("patient")}
              required
            >
              {PATIENTS.map((p, i) => (
                <option key={p} value={i === 0 ? "" : p} disabled={i === 0}>
                  {p}
                </option>
              ))}
            </select>

            <label className="appt-label">Doctor</label>
            <select
              className="appt-field"
              value={form.doctor}
              onChange={update("doctor")}
              required
            >
              {DOCTORS.map((d, i) => (
                <option key={d} value={i === 0 ? "" : d} disabled={i === 0}>
                  {d}
                </option>
              ))}
            </select>

            <label className="appt-label">Date and time</label>
            <input
              className="appt-field"
              type="datetime-local"
              value={form.time}
              onChange={update("time")}
              required
            />

            <label className="appt-label">Status</label>
            <select
              className="appt-field"
              value={form.status}
              onChange={update("status")}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <button className="appt-btn" type="submit">
              Book appointment
            </button>
          </form>

          {/* ---------- Schedule ---------- */}
          <section className="appt-schedule">
            <h2>Schedule</h2>

            {appointments.length === 0 ? (
              <div className="appt-empty">
                <p>No appointments yet.</p>
                <span>Book the first visit using the form.</span>
              </div>
            ) : (
              <ul className="appt-list">
                {appointments.map((a) => {
                  const slot = formatSlot(a.time);
                  return (
                    <li key={a.id} className="appt-row">
                      <div className="appt-slot">
                        <b>{slot.time}</b>
                        <span>{slot.day}</span>
                      </div>
                      <div className="appt-who">
                        <strong>{a.patient}</strong>
                        <span>with {a.doctor}</span>
                      </div>
                      <select
                        className={`appt-status appt-${a.status.toLowerCase()}`}
                        value={a.status}
                        onChange={(e) => setStatus(a.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
  );
}

export default Appointments;