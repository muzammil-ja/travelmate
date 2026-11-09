
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (!error) {
        setBlog(data);
      }

      setLoading(false);
    }

    if (slug) fetchBlog();
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#101b16] text-[#f5f0e6]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold">
          TRAVEL<span className="text-[#c69b59]">MATE.</span>
        </Link>
        <Link href="/blogs" className="text-[#d5ae70]">
          ← All Blogs
        </Link>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-12">
        {loading ? (
          <p className="text-gray-400">Loading blog...</p>
        ) : !blog ? (
          <div className="rounded-2xl border border-white/10 bg-[#19271f] p-10 text-center">
            <h1 className="text-3xl font-semibold">Blog not found</h1>
            <p className="mt-3 text-gray-400">
              This blog may not be published yet.
            </p>
            <Link
              href="/blogs"
              className="mt-6 inline-block text-[#d5ae70]"
            >
              Back to Blogs →
            </Link>
          </div>
        ) : (
          <>
            {blog.image_url && (
              <img
                src={blog.image_url}
                alt={blog.title}
                className="mb-10 h-72 w-full rounded-3xl object-cover md:h-96"
              />
            )}

            <p className="text-sm tracking-widest text-[#c69b59]">
              TRAVELMATE STORIES
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              {blog.title}
            </h1>

            <p className="mt-5 text-gray-400">
              {blog.excerpt}
            </p>

            <article className="mt-10 whitespace-pre-wrap text-base leading-8 text-gray-300">
              {blog.content}
            </article>

            <Link
              href="/blogs"
              className="mt-12 inline-block rounded-full bg-[#c69b59] px-7 py-3 font-semibold text-[#101b16]"
            >
              ← Back to Blogs
            </Link>
          </>
        )}
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-400">
        © 2026 TravelMate. All rights reserved.
      </footer>
    </main>
  );
}
