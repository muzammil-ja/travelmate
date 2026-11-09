
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PackagesAdminPage() {
  const router = useRouter();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPackages() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== "ma7585401@gmail.com") {
      router.replace("/admin/login");
      return;
    }

    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setPackages(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPackages();
  }, []);

  async function changeStatus(item) {
    const newStatus =
      item.status === "published" ? "draft" : "published";

    const { error } = await supabase
      .from("packages")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    loadPackages();
  }

  async function duplicatePackage(item) {
    const { id, created_at, updated_at, ...packageData } = item;
    const uniqueId = Date.now().toString();

    const { error } = await supabase
      .from("packages")
      .insert([{
        ...packageData,
        package_code: `${item.package_code}-C${uniqueId.slice(-5)}`,
        slug: `${item.slug}-copy-${uniqueId}`,
        name: `${item.name} (Copy)`,
        status: "draft",
        updated_at: new Date().toISOString(),
      }]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Package duplicated successfully!");
    loadPackages();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#101b16] p-6 md:p-10 text-white">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Package CMS</h1>
            <p className="text-gray-400 mt-2">
              Manage your travel packages
            </p>
          </div>

          <button
            onClick={logout}
            className="border border-gray-600 px-4 py-2 rounded-lg cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            All Packages ({packages.length})
          </h2>

          <Link
            href="/admin/packages/new"
            className="bg-[#c69b59] text-black px-5 py-3 rounded-lg font-semibold"
          >
            + Add Package
          </Link>
        </div>

        {loading && <p>Loading packages...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && packages.map((item) => (
          <div
            key={item.id}
            className="bg-[#19271f] border border-gray-700 rounded-xl p-5 mb-4"
          >
            <div className="flex flex-col md:flex-row justify-between gap-5">

              <div>
                <p className="text-[#d5ae70] text-sm">
                  {item.package_code}
                </p>

                <h3 className="text-xl font-semibold mt-1">
                  {item.name}
                </h3>

                <p className="text-gray-400 mt-2">
                  {item.location}
                </p>

                <p className="mt-2">
                  ₹{Number(item.peak_price).toLocaleString("en-IN")}
                  {" / person"}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Status: {item.status}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">

                <Link
                  href={`/admin/packages/${item.id}/preview`}
                  className="border border-green-500 text-green-300 px-4 py-2 rounded-lg hover:bg-green-900/30"
                >
                  Preview
                </Link>

                <Link
                  href={`/admin/packages/${item.id}/history`}
                  className="border border-purple-400 text-purple-300 px-4 py-2 rounded-lg hover:bg-purple-900/30"
                >
                  History
                </Link>

                <button
                  onClick={() => duplicatePackage(item)}
                  className="border border-blue-400 text-blue-300 px-4 py-2 rounded-lg cursor-pointer"
                >
                  Duplicate
                </button>

                <button
                  onClick={() => changeStatus(item)}
                  className="border border-[#c69b59] text-[#d5ae70] px-4 py-2 rounded-lg cursor-pointer"
                >
                  {item.status === "published" ? "Unpublish" : "Publish"}
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>
    </main>
  );
}
