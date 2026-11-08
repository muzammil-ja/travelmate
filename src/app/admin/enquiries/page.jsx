
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EnquiriesPage() {
  const router = useRouter();

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEnquiries() {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError || !user || user.email !== "ma7585401@gmail.com") {
        router.replace("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setEnquiries(data || []);
      }

      setLoading(false);
    }

    fetchEnquiries();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#101b16] p-6 md:p-10 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Enquiry Inbox</h1>
          <p className="mt-2 text-gray-400">
            Manage customer travel enquiries.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-[#c69b59] px-5 py-3 font-semibold text-[#101b16] cursor-pointer"
        >
          Logout
        </button>
      </div>

      {loading && <p className="mt-8">Loading enquiries...</p>}

      {error && (
        <p className="mt-8 text-red-400">Error: {error}</p>
      )}

      {!loading && !error && enquiries.length === 0 && (
        <p className="mt-8 text-gray-400">No enquiries found.</p>
      )}

      <div className="mt-8 grid gap-5">
        {enquiries.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-[#34463a] bg-[#19271f] p-6"
          >
            <h2 className="text-xl font-semibold text-[#d5ae70]">
              {item.name}
            </h2>

            <div className="mt-4 grid gap-2 text-sm text-gray-300 md:grid-cols-2">
              <p>Email: {item.email}</p>
              <p>Phone: {item.phone || "Not provided"}</p>
              <p>Destination: {item.destination || "Not provided"}</p>
              <p>Start Date: {item.start_date || "Not provided"}</p>
              <p>Travellers: {item.travellers || "Not provided"}</p>
              <p>Nights: {item.nights || "Not provided"}</p>
              <p>Budget: {item.budget || "Not provided"}</p>
            </div>

            <p className="mt-4 text-gray-300">
              Message: {item.message || "No message"}
            </p>

            <p className="mt-4 text-xs text-gray-500">
              Submitted: {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
