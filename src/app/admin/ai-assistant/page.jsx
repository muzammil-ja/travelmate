
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AIAssistantPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email !== "ma7585401@gmail.com") {
        router.replace("/admin/login");
        return;
      }

      const { data: enquiryData, error: enquiryError } =
        await supabase
          .from("enquiries")
          .select("*")
          .order("created_at", { ascending: false });

      const { data: packageData, error: packageError } =
        await supabase
          .from("packages")
          .select("*")
          .eq("status", "published");

      if (enquiryError || packageError) {
        setError(
          enquiryError?.message || packageError?.message
        );
      } else {
        setEnquiries(enquiryData || []);
        setPackages(packageData || []);

        if (enquiryData?.length > 0) {
          setSelectedId(enquiryData[0].id);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [router]);

  async function generateAnalysis() {
    const selectedEnquiry = enquiries.find(
      (item) => item.id === selectedId
    );

    if (!selectedEnquiry) {
      setError("Please select an enquiry.");
      return;
    }

    if (packages.length === 0) {
      setError("No published packages available.");
      return;
    }

    setGenerating(true);
    setError("");
    setAnalysis("");

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enquiry: selectedEnquiry,
          packages: packages,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "AI request failed.");
      }

      setAnalysis(result.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#101b16] p-6 md:p-10 text-white">
      <div className="max-w-5xl mx-auto">

        <Link
          href="/admin/enquiries"
          className="text-[#d5ae70] hover:underline"
        >
          ← Back to Enquiries
        </Link>

        <h1 className="text-3xl font-bold mt-8">
          AI Enquiry Assistant
        </h1>

        <p className="text-gray-400 mt-2">
          Analyze customer enquiries and discover matching travel packages.
        </p>

        {loading ? (
          <p className="mt-10">Loading enquiries...</p>
        ) : (
          <div className="mt-8 rounded-2xl border border-gray-700 bg-[#19271f] p-6">

            <label className="block text-sm text-gray-300 mb-3">
              Select Customer Enquiry
            </label>

            <select
              value={selectedId}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setAnalysis("");
                setError("");
              }}
              className="w-full rounded-lg border border-gray-600 bg-[#101b16] p-3 text-white"
            >
              <option value="">Choose an enquiry</option>

              {enquiries.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.destination}
                </option>
              ))}
            </select>

            {enquiries.length === 0 && (
              <p className="mt-4 text-yellow-300">
                No customer enquiries found. Submit an enquiry first.
              </p>
            )}

            {selectedId && (
              <div className="mt-5 rounded-xl border border-gray-700 p-4">
                {enquiries
                  .filter((item) => item.id === selectedId)
                  .map((item) => (
                    <div key={item.id} className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Customer:</span> {item.name}</p>
                      <p><span className="text-gray-400">Destination:</span> {item.destination}</p>
                      <p><span className="text-gray-400">Travellers:</span> {item.travellers}</p>
                      <p><span className="text-gray-400">Duration:</span> {item.nights} nights</p>
                      <p><span className="text-gray-400">Budget:</span> {item.budget || "Not provided"}</p>
                      <p><span className="text-gray-400">Message:</span> {item.message || "No message"}</p>
                    </div>
                  ))}
              </div>
            )}

            <button
              onClick={generateAnalysis}
              disabled={!selectedId || generating || packages.length === 0}
              className="mt-6 rounded-lg bg-[#c69b59] px-6 py-3 font-semibold text-[#101b16] disabled:opacity-50"
            >
              {generating ? "AI is analysing..." : "Generate AI Recommendations"}
            </button>

            {error && (
              <p className="mt-5 text-red-400">{error}</p>
            )}

            {analysis && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-[#d5ae70]">
                  AI Analysis & Reply Draft
                </h2>

                <div className="mt-4 whitespace-pre-wrap rounded-xl border border-gray-700 bg-[#101b16] p-5 text-sm leading-7 text-gray-200">
                  {analysis}
                </div>

                <p className="mt-4 text-sm text-yellow-300">
                  Staff approval required. This draft has not been sent to the customer.
                </p>

                <button
                  onClick={() => navigator.clipboard.writeText(analysis)}
                  className="mt-4 rounded-lg border border-[#c69b59] px-5 py-2 text-[#d5ae70]"
                >
                  Copy AI Draft
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}
