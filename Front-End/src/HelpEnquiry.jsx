import { useState } from "react";
import {PageLayout }from "./App";
export function HelpEnquiry() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageLayout
      title="Help / Enquiry"
      subtitle="Contact us for assistance."
    >
      <article className="panel">
        <h2>How can we help you?</h2>

        {submitted ? (
          <p>Your enquiry form was submitted in this demo.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <label>Your Name</label>
            <input
              name="name"
              placeholder="Enter your name"
              required
            />

            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />

            <label>Your Enquiry</label>
            <textarea
              name="message"
              placeholder="Enter your question"
              rows="5"
              required
            />

            <button type="submit">Submit Enquiry</button>
          </form>
        )}
      </article>
    </PageLayout>
  );
}

export default HelpEnquiry;