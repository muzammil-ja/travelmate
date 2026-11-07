
"use client";

import { useState } from "react";

export default function EnquiryPage() {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    startDate: "",
    travellers: "2",
    nights: "5",
    budget: "",
    message: "",
    privacyConsent: false,
    whatsappConsent: false,
  });

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  }

 function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!form.privacyConsent) {
    alert("Please accept the privacy consent to continue.");
    return;
  }

  const existingEnquiries = JSON.parse(
    localStorage.getItem("travelmate-enquiries") || "[]"
  );

  const newEnquiry = {
    ...form,
    id: Date.now().toString(),
    createdAt: new Date().toLocaleString(),
  };

  localStorage.setItem(
    "travelmate-enquiries",
    JSON.stringify([...existingEnquiries, newEnquiry])
  );

  setSubmitted(true);
}

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101b16] px-6 text-center text-[#f5f0e6]">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-[#19271f] p-10">
          <p className="text-4xl text-[#d5ae70]">✓</p>
          <h1 className="mt-5 text-3xl font-semibold">
            Enquiry Submitted!
          </h1>
          <p className="mt-4 leading-7 text-gray-300">
            Thank you for sharing your travel plans. Our team will review
            your request.
          </p>
          <a
            href="/"
            className="mt-8 inline-block rounded-full bg-[#c69b59] px-8 py-3 font-semibold text-[#101b16]"
          >
            Back to Home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101b16] px-5 py-8 text-[#f5f0e6] md:px-10">
      <nav className="mx-auto flex max-w-4xl items-center justify-between">
        <a href="/" className="text-2xl font-bold tracking-wider">
          TRAVEL<span className="text-[#c69b59]">MATE.</span>
        </a>
        <a href="/" className="text-sm text-gray-300 hover:text-[#d5ae70]">
          ← Back to Home
        </a>
      </nav>

      <section className="mx-auto mt-12 max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.25em] text-[#c69b59]">
          LET'S PLAN YOUR JOURNEY
        </p>

        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
          Tell us about your trip.
        </h1>

        <p className="mt-5 leading-7 text-gray-400">
          Share a few details and our travel team can help plan your
          experience.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8 rounded-3xl border border-white/10 bg-[#19271f] p-6 md:p-10"
        >
          <div>
            <h2 className="text-xl font-semibold">Your Details</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Full Name">
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={inputStyle}
                />
              </Field>

              <Field label="Email Address">
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputStyle}
                />
              </Field>

              <Field label="Phone Number">
                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={inputStyle}
                />
              </Field>

              <Field label="Destination">
                <select
                  required
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select destination</option>
                  <option value="Kerala">Kerala</option>
                  <option value="South India">South India</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-xl font-semibold">Trip Details</h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Travel Start Date">
                <input
                  required
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </Field>

              <Field label="Number of Travellers">
                <input
                  required
                  min="1"
                  type="number"
                  name="travellers"
                  value={form.travellers}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </Field>

              <Field label="Number of Nights">
                <input
                  required
                  min="1"
                  type="number"
                  name="nights"
                  value={form.nights}
                  onChange={handleChange}
                  className={inputStyle}
                />
              </Field>

              <Field label="Total Budget">
                <select
                  required
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="">Select your budget</option>
                  <option value="Below ₹50,000">Below ₹50,000</option>
                  <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                  <option value="₹1,00,000 – ₹1,50,000">₹1,00,000 – ₹1,50,000</option>
                  <option value="Above ₹1,50,000">Above ₹1,50,000</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-xl font-semibold">Additional Requirements</h2>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about your preferences, hotel requirements or special requests..."
              className={`${inputStyle} mt-5 resize-y`}
            />
          </div>

          <div className="space-y-4 border-t border-white/10 pt-8 text-sm leading-6 text-gray-300">
            <label className="flex items-start gap-3">
              <input
                required
                type="checkbox"
                name="privacyConsent"
                checked={form.privacyConsent}
                onChange={handleChange}
                className="mt-1 accent-[#c69b59]"
              />
              <span>
                I agree to the collection and use of my information for
                handling this travel enquiry.
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="whatsappConsent"
                checked={form.whatsappConsent}
                onChange={handleChange}
                className="mt-1 accent-[#c69b59]"
              />
              <span>
                I agree to receive follow-up communication through WhatsApp.
                (Optional)
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-[#c69b59] px-8 py-4 font-semibold text-[#101b16] transition hover:bg-[#d5ae70]"
          >
            Submit Enquiry →
          </button>
        </form>
      </section>
    </main>
  );
}

const inputStyle =
  "w-full rounded-xl border border-white/10 bg-[#101b16] px-4 py-3.5 text-base text-white outline-none placeholder:text-gray-500 focus:border-[#c69b59]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-gray-300">{label}</span>
      {children}
    </label>
  );
}
