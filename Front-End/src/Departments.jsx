import { useState } from "react";

// ---- Sample data (replace with your API / database later) ----
const DEPARTMENTS = [
  { id: "cardiology", name: "Cardiology", tagline: "Heart care" },
  { id: "neurology", name: "Neurology", tagline: "Brain & nerves" },
  { id: "orthopedics", name: "Orthopedics", tagline: "Bones & joints" },
  { id: "pediatrics", name: "Pediatrics", tagline: "Child care" },
  { id: "dermatology", name: "Dermatology", tagline: "Skin care" },
  { id: "gynecology", name: "Gynecology", tagline: "Women's health" },
];

const DOCTORS = [
  { id: 1, name: "Dr Raj", age: 45, department: "cardiology", experience: "20 years" },
  { id: 2, name: "Dr Meera", age: 38, department: "cardiology", experience: "12 years" },
  { id: 3, name: "Dr Arjun", age: 41, department: "cardiology", experience: "15 years" },
  { id: 4, name: "Dr Kavya", age: 36, department: "neurology", experience: "10 years" },
  { id: 5, name: "Dr Suresh", age: 50, department: "neurology", experience: "25 years" },
  { id: 6, name: "Dr Anand", age: 44, department: "orthopedics", experience: "18 years" },
  { id: 7, name: "Dr Priya", age: 39, department: "pediatrics", experience: "13 years" },
  { id: 8, name: "Dr Nisha", age: 35, department: "dermatology", experience: "9 years" },
  { id: 9, name: "Dr Lakshmi", age: 47, department: "gynecology", experience: "21 years" },
];

export default function Departments() {
  const [openDept, setOpenDept] = useState(null);     // expanded department
  const [openDoctor, setOpenDoctor] = useState(null); // expanded doctor

  const toggleDept = (id) => {
    setOpenDept(openDept === id ? null : id);
    setOpenDoctor(null); // collapse doctor data when department changes
  };

  return (
    <div className="dept-page">
      {/* Layer 1: Departments */}
      <div className="dept-outer">
        <h2 className="dept-outer-title">Departments</h2>

        {DEPARTMENTS.map((dep) => {
          const isOpen = openDept === dep.id;
          const doctors = DOCTORS.filter((d) => d.department === dep.id);

          return (
            // Layer 2: department box
            <div key={dep.id} className="dept-box">
              <button
                className={`dept-header ${isOpen ? "open" : ""}`}
                onClick={() => toggleDept(dep.id)}
              >
                <div>
                  <strong>{dep.name}</strong>
                  <div className="dept-sub">
                    {dep.tagline} · {doctors.length} doctor{doctors.length !== 1 && "s"}
                  </div>
                </div>
                <span className={`dept-arrow ${isOpen ? "open" : ""}`}>▶</span>
              </button>

              {/* Layer 3: Doctors inside the department */}
              {isOpen && (
                <div className="doctors-layer">
                  <div className="doctors-label">DOCTORS</div>
                  {doctors.length === 0 && <p className="dept-empty">No doctors yet.</p>}

                  {doctors.map((doc) => {
                    const docOpen = openDoctor === doc.id;
                    return (
                      <div key={doc.id} className="doctor-box">
                        <button
                          className={`dept-header ${docOpen ? "open" : ""}`}
                          onClick={() => setOpenDoctor(docOpen ? null : doc.id)}
                        >
                          <strong>{doc.name}</strong>
                          <span className={`dept-arrow ${docOpen ? "open" : ""}`}>▶</span>
                        </button>

                        {/* Layer 4: Doctor data inside the doctor */}
                        {docOpen && (
                          <div className="data-layer">
                            <div className="data-row"><span>Name</span><strong>{doc.name}</strong></div>
                            <div className="data-row"><span>Age</span><strong>{doc.age}</strong></div>
                            <div className="data-row"><span>Department</span><strong>{dep.name}</strong></div>
                            <div className="data-row"><span>Experience</span><strong>{doc.experience}</strong></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
