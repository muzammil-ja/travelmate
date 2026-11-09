
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function QuotesPage() {
  const router = useRouter();

  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [travellers, setTravellers] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    async function loadPackages() {
      const { data: authData } = await supabase.auth.getUser();

      if (authData.user?.email !== "ma7585401@gmail.com") {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("status", "published");

      if (error) {
        alert("Could not load packages: " + error.message);
      } else {
        setPackages(data || []);
      }

      setLoading(false);
    }

    loadPackages();
  }, [router]);

  const selected = packages.find(
    (item) => item.id === selectedPackage
  );

  const price = Number(selected?.peak_price || 0);
  const total = price * Number(travellers || 0);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#101b16] p-10 text-white">
        Loading Quote Builder...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#101b16] p-6 md:p-10 text-[#f5f0e6]">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/admin/packages"
          className="text-[#d5ae70] text-sm"
        >
          ← Back to Packages
        </Link>

        <h1 className="text-3xl font-bold mt-6">
          Quote Builder
        </h1>

        <p className="text-gray-400 mt-2">
          Create a quotation for your customer.
        </p>

        <div className="bg-[#19271f] border border-[#35463a] rounded-xl p-6 mt-8">
          <h2 className="text-xl font-semibold mb-5">
            Customer Details
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-sm">Customer Name</label>
              <input
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  setGenerated(false);
                }}
                className="w-full p-3 rounded-lg bg-[#101b16] border border-[#35463a]"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Customer Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  setGenerated(false);
                }}
                className="w-full p-3 rounded-lg bg-[#101b16] border border-[#35463a]"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Travel Date</label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => {
                  setTravelDate(e.target.value);
                  setGenerated(false);
                }}
                className="w-full p-3 rounded-lg bg-[#101b16] border border-[#35463a]"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Number of Travellers</label>
              <input
                type="number"
                min="1"
                value={travellers}
                onChange={(e) => {
                  setTravellers(Math.max(1, Number(e.target.value)));
                  setGenerated(false);
                }}
                className="w-full p-3 rounded-lg bg-[#101b16] border border-[#35463a]"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#19271f] border border-[#35463a] rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold mb-5">
            Select Travel Package
          </h2>

          <select
            value={selectedPackage}
            onChange={(e) => {
              setSelectedPackage(e.target.value);
              setGenerated(false);
            }}
            className="w-full p-3 rounded-lg bg-[#101b16] border border-[#35463a]"
          >
            <option value="">Choose a published package</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — ₹{Number(pkg.peak_price || 0).toLocaleString("en-IN")}
              </option>
            ))}
          </select>

          {selected && (
            <div className="mt-5 rounded-lg bg-[#101b16] p-5">
              <h3 className="text-lg font-semibold text-[#d5ae70]">
                {selected.name}
              </h3>
              <p className="text-gray-400 mt-1">{selected.location}</p>
              <p className="mt-3">Duration: {selected.duration}</p>
              <p>Hotels: {selected.hotel_category}</p>
              <p className="mt-2">
                Price per person: ₹{price.toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>

        <div className="bg-[#19271f] border border-[#35463a] rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold mb-5">
            Quotation
          </h2>

          <div className="flex justify-between py-3 border-b border-[#35463a]">
            <span>Price per person</span>
            <span>₹{price.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between py-3 border-b border-[#35463a]">
            <span>Number of travellers</span>
            <span>{travellers}</span>
          </div>

          <div className="flex justify-between py-4 text-xl font-bold">
            <span>Estimated Total</span>
            <span className="text-[#d5ae70]">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="text-sm text-gray-400">
            Per-person pricing on twin-sharing basis. GST extra, as applicable.
            Final price and availability must be confirmed by staff.
          </p>

          <button
            onClick={() => setGenerated(true)}
            disabled={!selected || !customerName.trim() || travellers < 1}
            className="mt-6 w-full bg-[#c69b59] text-[#101b16] font-bold p-3 rounded-lg disabled:opacity-40"
          >
            Generate Quotation
          </button>

          {generated && (
            <div className="mt-6 border border-[#c69b59] rounded-lg p-5">
              <p className="text-[#d5ae70] font-bold text-xl">
                TRAVELMATE — QUOTATION
              </p>
              <p className="mt-4">Customer: {customerName}</p>
              <p>Email: {customerEmail || "Not provided"}</p>
              <p>Travel date: {travelDate || "To be confirmed"}</p>
              <p>Package: {selected.name}</p>
              <p>Travellers: {travellers}</p>
              <p className="text-xl font-bold mt-4">
                Total: ₹{total.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-gray-400 mt-3">
                GST extra, as applicable. Subject to availability and final confirmation.
              </p>

              <button
                onClick={() => window.print()}
                className="mt-5 bg-[#c69b59] text-[#101b16] px-6 py-3 rounded-lg font-bold"
              >
                Print / Save as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
