
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EditPackagePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    package_code: "",
    name: "",
    slug: "",
    location: "",
    duration: "",
    hotel_category: "",
    description: "",
    image_url: "",
    peak_price: "",
    peak_season: "",
    monsoon_price: "",
    monsoon_season: "",
  });

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

      setForm({
        package_code: data.package_code || "",
        name: data.name || "",
        slug: data.slug || "",
        location: data.location || "",
        duration: data.duration || "",
        hotel_category: data.hotel_category || "",
        description: data.description || "",
        image_url: data.image_url || "",
        peak_price: data.peak_price ?? "",
        peak_season: data.peak_season || "",
        monsoon_price: data.monsoon_price ?? "",
        monsoon_season: data.monsoon_season || "",
      });

      setLoading(false);
    }

    if (id) loadPackage();
  }, [id, router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    console.log("Saving package:", id, form);

    try {
      // Fetch previous package data
      const { data: oldPackage, error: fetchError } = await supabase
        .from("packages")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        alert("Could not fetch package: " + fetchError.message);
        return;
      }

      // Get admin user
      const { data: { user }, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("User error:", userError);
        alert(userError.message);
        return;
      }

      // Save old version in history
      const { error: historyError } = await supabase
        .from("package_versions")
        .insert([{
          package_id: id,
          package_snapshot: oldPackage,
          changed_by: user?.email || "Admin",
        }]);

      if (historyError) {
        console.error("History error:", historyError);
        alert("History error: " + historyError.message);
        return;
      }

      // Update package
      const { error: updateError } = await supabase
        .from("packages")
        .update({
          ...form,
          peak_price: Number(form.peak_price),
          monsoon_price: form.monsoon_price
            ? Number(form.monsoon_price)
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      console.log("Update response:", updateError);

      if (updateError) {
        console.error("Update error:", updateError);
        alert("Update failed: " + updateError.message);
        return;
      }

      alert("Package updated! Previous version saved successfully.");
      router.push("/admin/packages");

    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    ["package_code", "Package Code"],
    ["name", "Package Name"],
    ["slug", "Package Slug"],
    ["location", "Location"],
    ["duration", "Duration"],
    ["hotel_category", "Hotel Category"],
    ["image_url", "Image URL"],
    ["peak_price", "Peak Season Price"],
    ["peak_season", "Peak Season"],
    ["monsoon_price", "Monsoon Price"],
    ["monsoon_season", "Monsoon Season"],
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101b16] p-10 text-white">
        Loading package...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101b16] px-5 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/packages"
          className="text-sm text-[#d5ae70]"
        >
          ← Back to Packages
        </Link>

        <h1 className="mt-6 text-3xl font-bold">
          Edit Package
        </h1>

        <p className="mt-2 text-gray-400">
          Update package information below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-[#19271f] p-6"
        >
          {fields.map(([name, label]) => (
            <div key={name}>
              <label className="mb-2 block text-sm text-gray-300">
                {label}
              </label>

              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                required={
                  name === "package_code" ||
                  name === "name" ||
                  name === "slug" ||
                  name === "peak_price"
                }
                type={
                  name === "peak_price" || name === "monsoon_price"
                    ? "number"
                    : "text"
                }
                className="w-full rounded-lg border border-white/10 bg-[#101b16] px-4 py-3 text-white outline-none focus:border-[#c69b59]"
              />
            </div>
          ))}

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-white/10 bg-[#101b16] px-4 py-3 text-white outline-none focus:border-[#c69b59]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-[#c69b59] px-5 py-3 font-semibold text-[#101b16] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
