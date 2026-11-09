
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PackageHistoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email !== "ma7585401@gmail.com") {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("package_versions")
        .select("*")
        .eq("package_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
      } else {
        setVersions(data || []);
      }

      setLoading(false);
    }

    if (id) loadHistory();
  }, [id, router]);

  return (
    <main className="min-h-screen bg-[#101b16] px-5 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/packages" className="text-[#d5ae70]">
          ← Back to Packages
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Package Version History
        </h1>

        <p className="mt-2 text-gray-400">
          Previous saved versions of this package.
        </p>

        {loading && <p className="mt-8">Loading history...</p>}

        {!loading && versions.length === 0 && (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#19271f] p-6 text-gray-300">
            No previous versions yet. Edit and save this package to create
            its first history record.
          </div>
        )}

        <div className="mt-8 space-y-5">
          {versions.map((version, index) => {
            const snapshot = version.package_snapshot;

            return (
              <div
                key={version.id}
                className="rounded-xl border border-white/10 bg-[#19271f] p-6"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <h2 className="text-xl font-semibold">
                    Previous Version {versions.length - index}
                  </h2>

                  <span className="text-sm text-gray-400">
                    {new Date(version.created_at).toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  Saved by: {version.changed_by || "Admin"}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <p>Package: {snapshot.name}</p>
                  <p>Code: {snapshot.package_code}</p>
                  <p>Location: {snapshot.location}</p>
                  <p>Duration: {snapshot.duration}</p>
                  <p>Peak Price: ₹{snapshot.peak_price}</p>
                  <p>
                    Monsoon Price:{" "}
                    {snapshot.monsoon_price
                      ? `₹${snapshot.monsoon_price}`
                      : "Not set"}
                  </p>
                  <p>Status: {snapshot.status}</p>
                </div>

                <p className="mt-4 text-sm text-gray-300">
                  {snapshot.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
