
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PackagePreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPackage() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.email !== "ma7585401@gmail.com") {
        router.push("/admin/login");
        return;
      }

      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        router.push("/admin/packages");
        return;
      }

      setPkg(data);
      setLoading(false);
    }

    if (id) loadPackage();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101b16] p-10 text-white">
        Loading preview...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101b16] px-5 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/packages"
          className="text-[#d5ae70]"
        >
          ← Back to Packages
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Package Preview</h1>
          <span className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm text-yellow-300">
            {pkg.status.toUpperCase()}
          </span>
        </div>

        {pkg.image_url && (
          <img
            src={pkg.image_url}
            alt={pkg.name}
            className="mt-8 h-80 w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="space-y-5 md:col-span-2">
            <p className="text-sm text-[#d5ae70]">
              {pkg.package_code}
            </p>

            <h2 className="text-4xl font-bold">{pkg.name}</h2>

            <p className="text-gray-300">{pkg.location}</p>

            <p className="leading-7 text-gray-300">
              {pkg.description || "No description added yet."}
            </p>

            <div className="rounded-xl border border-white/10 bg-[#19271f] p-5">
              <h3 className="text-xl font-semibold">Package Details</h3>
              <p className="mt-3 text-gray-300">Duration: {pkg.duration}</p>
              <p className="mt-2 text-gray-300">Hotels: {pkg.hotel_category}</p>
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-white/10 bg-[#19271f] p-6">
            <h3 className="text-xl font-semibold">Seasonal Pricing</h3>

            <p className="mt-5 text-sm text-gray-400">
              {pkg.peak_season}
            </p>
            <p className="text-2xl font-bold text-[#d5ae70]">
              ₹{Number(pkg.peak_price).toLocaleString("en-IN")}
            </p>

            {pkg.monsoon_price && (
              <>
                <p className="mt-5 text-sm text-gray-400">
                  {pkg.monsoon_season}
                </p>
                <p className="text-2xl font-bold text-[#d5ae70]">
                  ₹{Number(pkg.monsoon_price).toLocaleString("en-IN")}
                </p>
              </>
            )}

            <p className="mt-5 text-xs text-gray-400">
              {pkg.price_basis}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              {pkg.gst_note}
            </p>

            <Link
              href={`/admin/packages/${id}/edit`}
              className="mt-6 block rounded-lg bg-[#c69b59] px-4 py-3 text-center font-semibold text-[#101b16]"
            >
              Edit Package
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
