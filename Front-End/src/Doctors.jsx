import { useEffect, useState } from "react";
import api from "./api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ name: "", specialty: "" });

  const load = () => {
    api.get("doctors/")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.log("API error:", err));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("doctors/", { ...form, available: true })
      .then(() => {
        setForm({ name: "", specialty: "" });
        load();
      })
      .catch((err) => console.log("API error:", err));
  };

  const toggleAvailable = (d) => {
    api.patch(`doctors/${d.id}/`, { available: !d.available }).then(load);
  };

  const handleDelete = (id) => {
    api.delete(`doctors/${id}/`).then(load);
  };

  return (
    <article className="panel" id="doctors">
      <h2>Doctors</h2>

      <form onSubmit={handleSubmit} style={{ margin: "16px 0" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />{" "}
        <input name="specialty" placeholder="Specialty" value={form.specialty} onChange={handleChange} required />{" "}
        <button type="submit">Add doctor</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Available</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.specialty}</td>
              <td>
                <button onClick={() => toggleAvailable(d)}>
                  {d.available ? "Yes" : "No"}
                </button>
              </td>
              <td><button onClick={() => handleDelete(d.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

export default Doctors;