import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getUser, login } from "./auth";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Redirect users who are already logged in.
  if (getUser()) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (busy) return;

    setError("");
    setBusy(true);

    try {
      await login(email.trim(), password);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Unable to sign in. Please try again.");
      setPassword("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="lg-page">
      {/* Left branding section */}
      <section className="lg-brand">
        <div className="lg-logo">✚ MediCare</div>

        <h1>Hospital management in one place</h1>

        <p>
          Patients, doctors, appointments and medical records.
          Sign in to continue.
        </p>
      </section>

      {/* Right login section */}
      <section className="lg-form-wrap">
        <form
          className="lg-form"
          onSubmit={handleSubmit}
          noValidate={false}
        >
          <h2>Sign in</h2>

          <label htmlFor="lg-email">
            Email
          </label>

          <input
            id="lg-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
          />

          <label htmlFor="lg-password">
            Password
          </label>

          <div className="lg-row">
            <input
              id="lg-password"
              name="password"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="lg-ghost"
              onClick={() => setShow((previous) => !previous)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          <p className="lg-error" role="alert" aria-live="polite">
            {error}
          </p>

          <button
            type="submit"
            className="lg-primary"
            disabled={busy}
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
