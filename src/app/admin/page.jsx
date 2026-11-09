
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const modules = [
  {
    title: "Packages CMS",
    description: "Manage travel packages and pricing.",
    link: "/admin/packages",
  },
  {
    title: "Enquiry Inbox",
    description: "View customer enquiries.",
    link: "/admin/enquiries",
  },
  {
    title: "AI Assistant",
    description: "Review enquiry summaries and reply drafts.",
    link: "/admin/ai-assistant",
  },
  {
    title: "Quote Builder",
    description: "Prepare customer quotations.",
    link: "/admin/quotes",
  },
  {
    title: "Blog CMS",
    description: "Create and manage travel blogs.",
    link: "/admin/blogs",
  },
];

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const { data } = await supabase.auth.getUser();

      if (!data.user || data.user.email !== "ma7585401@gmail.com") {
        router.push("/admin/login");
      }
    }

    checkAdmin();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#101b16] p-6 text-[#f5f0e6] md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm tracking-widest text-[#c69b59]">
              TRAVELMATE MANAGEMENT
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-400">
              Manage your travel business from one place.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-red-500 px-5 py-2 text-red-400"
          >
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((item) => (
            <Link
              href={item.link}
              key={item.link}
              className="rounded-xl border border-[#34483b] bg-[#19271f] p-6 transition hover:border-[#c69b59]"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm text-gray-400">
                {item.description}
              </p>
              <p className="mt-6 text-sm font-semibold text-[#d5ae70]">
                Open Module →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/" className="text-[#d5ae70]">
            ← Visit Public Website
          </Link>
        </div>
      </div>
    </main>
  );
}
