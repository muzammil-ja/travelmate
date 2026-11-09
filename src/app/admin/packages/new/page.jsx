
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function NewPackagePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name"
        ? {
            slug: value
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
          }
        : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== "ma7585401@gmail.com") {
      router.replace("/admin/login");
      return;
    }

    const { error } = await supabase.from("packages").insert([{
      ...form,
      peak_price: Number(form.peak_price),
      monsoon_price: form.monsoon_price
        ? Number(form.monsoon_price)
        : null,
      status: "draft",
    }]);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin/packages");
    router.refresh();
  }

  const fields = [
    ["package_code", "Package Code", "PKG-GO-01"],
    ["name", "Package Name", "Goa Beach Escape"],
    ["location", "Location", "Goa"],
    ["duration", "Duration", "5 Days / 4 Nights"],
    ["hotel_category", "Hotel Category", "4-Star Hotels"],
    ["peak_price", "Peak Season Price (₹)", "25000"],
    ["peak_season", "Peak Season", "October - March"],
    ["monsoon_price", "Monsoon Price (₹)", "18000"],
    ["monsoon_season", "Monsoon Season", "June - September"],
    ["image_url", "Image URL", "https://example.com/image.jpg"],
  ];

  return (
    <main className="min-h-screen bg-[#101b16] text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/admin/packages"
          className="text-[#d5ae70] hover:underline"
        >
          ← Back to Packages
        </Link>

        <h1 className="text-3xl font-bold mt-6">
          Add New Package
        </h1>

        <p className="text-gray-400 mt-2 mb-8">
          New packages will be saved as drafts.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {fields.map(([name, label, placeholder]) => (
            <div key={name}>
              <label className="block mb-2 text-sm text-gray-300">
                {label}
              </label>

              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                type={
                  name.includes("price") ? "number" : "text"
                }
                required={
                  !["monsoon_price", "monsoon_season", "image_url"]
                    .includes(name)
                }
                min={name.includes("price") ? "0" : undefined}
                className="w-full bg-[#19271f] border border-gray-700 rounded-lg p-3 outline-none focus:border-[#c69b59]"
              />
            </div>
          ))}

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Package Slug
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="w-full bg-[#19271f] border border-gray-700 rounded-lg p-3 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-[#19271f] border border-gray-700 rounded-lg p-3 outline-none"
              placeholder="Describe this travel package..."
            />
          </div>

          {error && (
            <p className="text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#c69b59] text-black font-semibold px-6 py-3 rounded-lg cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Package as Draft"}
          </button>

        </form>
      </div>
    </main>
  );
}
