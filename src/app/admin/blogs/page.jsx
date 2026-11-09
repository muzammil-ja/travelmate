
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BlogsPage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
  });

  async function loadBlogs() {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setBlogs(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    async function checkAdmin() {
      const { data } = await supabase.auth.getUser();

      if (!data.user || data.user.email !== "ma7585401@gmail.com") {
        router.push("/admin/login");
        return;
      }

      loadBlogs();
    }

    checkAdmin();
  }, [router]);

  function handleTitleChange(value) {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setForm({ ...form, title: value, slug });
  }

  async function addBlog(e) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("blogs").insert([
      {
        ...form,
        status: "draft",
      },
    ]);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Blog created successfully!");

    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
    });

    loadBlogs();
  }

  async function deleteBlog(id) {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      loadBlogs();
    }
  }

  return (
    <main className="min-h-screen bg-[#101b16] p-6 text-[#f5f0e6] md:p-10">
      <div className="mx-auto max-w-6xl">

        <Link href="/admin" className="text-[#d5ae70]">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold">Blog CMS</h1>

        <p className="mt-2 text-gray-400">
          Create and manage your travel blogs.
        </p>

        <form
          onSubmit={addBlog}
          className="mt-8 space-y-4 rounded-xl border border-[#34483b] bg-[#19271f] p-6"
        >
          <h2 className="text-xl font-semibold">Create New Blog</h2>

          <input
            required
            placeholder="Blog Title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full rounded-lg bg-[#101b16] p-3 outline-none"
          />

          <input
            required
            placeholder="Blog Slug"
            value={form.slug}
            onChange={(e) =>
              setForm({ ...form, slug: e.target.value })
            }
            className="w-full rounded-lg bg-[#101b16] p-3 outline-none"
          />

          <textarea
            placeholder="Short Excerpt"
            value={form.excerpt}
            onChange={(e) =>
              setForm({ ...form, excerpt: e.target.value })
            }
            className="w-full rounded-lg bg-[#101b16] p-3 outline-none"
            rows={2}
          />

          <textarea
            required
            placeholder="Full Blog Content"
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            className="w-full rounded-lg bg-[#101b16] p-3 outline-none"
            rows={6}
          />

          <input
            placeholder="Image URL"
            value={form.image_url}
            onChange={(e) =>
              setForm({ ...form, image_url: e.target.value })
            }
            className="w-full rounded-lg bg-[#101b16] p-3 outline-none"
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#c69b59] px-6 py-3 font-semibold text-black disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create Blog"}
          </button>
        </form>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold">
            All Blogs ({blogs.length})
          </h2>

          {loading ? (
            <p>Loading blogs...</p>
          ) : blogs.length === 0 ? (
            <p className="text-gray-400">No blogs created yet.</p>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-[#34483b] bg-[#19271f] p-5 md:flex-row md:items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold">
                      {blog.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-400">
                      /{blog.slug}
                    </p>

                    <p className="mt-2 text-sm">
                      Status: DRAFT
                    </p>
                  </div>

                  <button
                    onClick={() => deleteBlog(blog.id)}
                    className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-400"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
