import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import api from "./api";
import "./App.css";

import Patients from "./Patients";
import Doctors from "./Doctors";
import Appointments from "./Appointments";
import MedicalRecords from "./Medicals";
import Departments from "./Departments";
import HelpEnquiry from "./HelpEnquiry";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";


function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">✚ MediCare</div>

      <NavLink to="/dashboard" className="side-link">▦ Dashboard</NavLink>

      <button
        className={`side-parent ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        MAIN MENU <span className="arrow">›</span>
      </button>

      {open && (
        <div className="side-children">
          <NavLink to="/appointments" className="side-child">Appointments</NavLink>
          <NavLink to="/doctors" className="side-child">Doctors</NavLink>
          <NavLink to="/patients" className="side-child">Patients</NavLink>
          <NavLink to="/records" className="side-child">Medical Records</NavLink>
          <NavLink to="/departments" className="side-child">Departments</NavLink>
          <NavLink to="/help" className="side-child">HelpEnquiry</NavLink>
        </div>
      )}

      <div className="sidebar-bottom">
        <button
          className="sidebar-logout"
          onClick={() => navigate("/login")}
        >
          ↪ Logout
        </button>
      </div>
    </aside>
  );
}



// Dashboard page
function Dashboard() {
const [stats, setStats] = useState({
total_patients: 0,
available_doctors: 0,
appointments_today: 0,
recent: [],
});

useEffect(() => {
api
.get("dashboard/")
.then((res) => setStats(res.data))
.catch((err) => console.log("API error:", err));
}, []);

return (
<>
<header className="topbar">
<div>
<h1>Hospital Dashboard</h1>
<p>Welcome back! Here's your hospital overview.</p>
</div>
<button className="admin-button">Admin ▾</button>
</header>

  <section className="welcome-banner">
    <div>
      <p>HOSPITAL MANAGEMENT SYSTEM</p>
      <h2>Good morning, Admin!</h2>
      <span>Manage your hospital operations in one place.</span>
    </div>
    <div className="welcome-icon">✚</div>
  </section>

  <section className="stats-grid">
    <article className="stat-card">
      <div className="stat-icon blue">♧</div>
      <p>Total Patients</p>
      <h2>{stats.total_patients}</h2>
      <span>Registered patients</span>
    </article>

    <article className="stat-card">
      <div className="stat-icon green">♙</div>
      <p>Available Doctors</p>
      <h2>{stats.available_doctors}</h2>
      <span>Medical professionals</span>
    </article>

    <article className="stat-card">
      <div className="stat-icon purple">▣</div>
      <p>Appointments</p>
      <h2>{stats.appointments_today}</h2>
      <span>Scheduled today</span>
    </article>

    <article className="stat-card">
      <div className="stat-icon orange">▤</div>
      <p>Available Rooms</p>
      <h2>32</h2>
      <span>Rooms available</span>
    </article>
  </section>

  <section className="content-grid">
    <article className="panel">
      <div className="panel-heading">
        <div>
          <h2>Recent Appointments</h2>
          <p>Overview of today's appointments</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.map((a) => (
              <tr key={a.id}>
                <td>{a.patient_name}</td>
                <td>{a.doctor_name}</td>
                <td>
                  {new Date(a.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  <span className={`status ${a.status.toLowerCase()}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}

            {stats.recent.length === 0 && (
              <tr>
                <td colSpan="4">No recent appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <NavLink to="/appointments" className="text-button">
        View all appointments →
      </NavLink>
    </article>

    <article className="panel">
      <div className="panel-heading">
        <div>
          <h2>Hospital Departments</h2>
          <p>Browse medical services</p>
        </div>
      </div>

      <div className="department-item">
        <span className="department-icon">♡</span>
        <div>
          <strong>Cardiology</strong>
          <p>Heart care</p>
        </div>
        <span className="department-count">08</span>
      </div>

      <div className="department-item">
        <span className="department-icon">✚</span>
        <div>
          <strong>General Medicine</strong>
          <p>Primary care</p>
        </div>
        <span className="department-count">12</span>
      </div>

      <div className="department-item">
        <span className="department-icon">⚕</span>
        <div>
          <strong>Neurology</strong>
          <p>Nervous system</p>
        </div>
        <span className="department-count">06</span>
      </div>

      <div className="department-item">
        <span className="department-icon">♧</span>
        <div>
          <strong>Orthopedics</strong>
          <p>Bone and joint care</p>
        </div>
        <span className="department-count">07</span>
      </div>
    </article>
  </section>

  <footer>© 2026 MediCare Hospital Management System</footer>
</>

);
}

// Reusable layout for each management page
export function PageLayout({ title, subtitle, children }) {
return (
<>
<header className="topbar">
<div>
<h1>{title}</h1>
<p>{subtitle}</p>
</div>
<button className="admin-button">Admin ▾</button>
</header>

  <section className="page-content">{children}</section>

  <footer>© 2026 MediCare Hospital Management System</footer>
</>

);
}

function Settings() {
return (
<PageLayout
title="Settings"
subtitle="Manage your hospital application settings."
>
<article className="panel">
<h2>Application Settings</h2>
<p>Hospital: MediCare Hospital</p>
<p>Account: Admin User</p>
<p>Role: Administrator</p>
</article>
</PageLayout>
);
}

// Main application
// Sidebar + page area, shown only after login
function AppLayout() {
  return (
    <div className="hospital-app">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// Main application
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/patients"
            element={
              <PageLayout
                title="Patients"
                subtitle="Register and manage patient information."
              >
                <Patients />
              </PageLayout>
            }
          />

          <Route
            path="/doctors"
            element={
              <PageLayout
                title="Doctors"
                subtitle="Manage doctors and their availability."
              >
                <Doctors />
              </PageLayout>
            }
          />

          <Route
            path="/appointments"
            element={
              <PageLayout
                title="Appointments"
                subtitle="Book and manage hospital appointments."
              >
                <Appointments />
              </PageLayout>
            }
          />

          <Route
            path="/departments"
            element={
              <PageLayout
                title="Departments"
                subtitle="Browse departments and their doctors."
              >
                <Departments />
              </PageLayout>
            }
          />


          <Route
            path="/records"
            element={
              <PageLayout
                title="Medical Records"
                subtitle="Manage patient diagnoses and prescriptions."
              >
                <MedicalRecords />
              </PageLayout>
            }
          />

          <Route path="/help" element={<HelpEnquiry />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;