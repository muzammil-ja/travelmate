
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setBlogs(data || []);
      }

      setLoading(false);
    }

    fetchBlogs();
  }, []);

  return (
    <main className="min-h-screen bg-[#101b16] text-[#f5f0e6]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold tracking-wider">
          TRAVEL<span className="text-[#c69b59]">MATE.</span>
        </Link>

        <div className="flex gap-5 text-sm text-gray-300">
          <Link href="/" className="hover:text-[#d5ae70]">Home</Link>
          <Link href="/enquiry" className="hover:text-[#d5ae70]">Contact</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm font-semibold tracking-[0.25em] text-[#c69b59]">
          TRAVEL STORIES & INSPIRATION
        </p>

        <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
          Explore Our Blogs
        </h1>

        <p className="mt-5 max-w-2xl leading-8 text-gray-400">
          Discover travel guides, destination ideas and inspiration
          for your next unforgettable journey.
        </p>

        {loading && (
          <p className="mt-12 text-gray-400">Loading blogs...</p>
        )}

        {error && (
          <p className="mt-12 text-red-400">
            Unable to load blogs: {error}
          </p>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-[#19271f] p-10 text-center">
            <h2 className="text-2xl font-semibold">
              No published blogs yet
            </h2>
            <p className="mt-3 text-gray-400">
              Our travel stories will appear here soon.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-[#c69b59] px-7 py-3 font-semibold text-[#101b16]"
            >
              Back to Home
            </Link>
          </div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#19271f]"
              >
                {blog.image_url && (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <h2 className="text-2xl font-semibold">
                    {blog.title}
                  </h2>

                  <p className="mt-3 leading-7 text-gray-400">
                    {blog.excerpt || blog.content?.slice(0, 150)}
                  </p>

                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="mt-6 inline-block font-semibold text-[#d5ae70] hover:text-[#c69b59]"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-400">
        © 2026 TravelMate. All rights reserved.
      </footer>
    </main>
  );
}
