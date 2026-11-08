
import { notFound } from "next/navigation";

const packages = {
  "pkg-kl-07": {
    id: "PKG-KL-07",
    name: "Kerala Backwater Escape",
    location: "Munnar · Thekkady · Alleppey",
    duration: "6 Days / 5 Nights",
    hotel: "4-Star Hotels",
    peakPrice: "₹32,500",
    monsoonPrice: "₹24,900",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600",
    description:
      "Discover the beauty of Kerala through its green hills, peaceful wildlife destinations and beautiful backwaters.",
    highlights: [
      "Explore the beautiful hills of Munnar",
      "Experience wildlife and nature in Thekkady",
      "Enjoy a relaxing Alleppey houseboat experience",
      "Comfortable 4-star hotel accommodation",
    ],
  },

  "pkg-si-12": {
    id: "PKG-SI-12",
    name: "South India Heritage Trail",
    location: "Madurai · Rameswaram · Kanyakumari",
    duration: "5 Days / 4 Nights",
    hotel: "3-Star Hotels",
    peakPrice: "₹18,750",
    monsoonPrice: null,
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600",
    description:
      "Explore the cultural heritage, historic temples and beautiful coastal destinations of South India.",
    highlights: [
      "Discover the heritage of Madurai",
      "Visit the sacred destination of Rameswaram",
      "Experience the coastal beauty of Kanyakumari",
      "Comfortable 3-star hotel accommodation",
    ],
  },
};

export default async function PackageDetails({ params }) {
  const { id } = await params;

  if (!Object.prototype.hasOwnProperty.call(packages, id)) {
    notFound();
  }

  const tour = packages[id];

  return (
    <main className="min-h-screen bg-[#101b16] text-[#f5f0e6]">
      <nav className="flex items-center justify-between px-6 py-6 md:px-12">
        <a href="/" className="text-2xl font-bold tracking-wider">
          TRAVEL<span className="text-[#c69b59]">MATE.</span>
        </a>

        <a
          href="/"
          className="rounded-full border border-white/20 px-5 py-2 text-sm text-gray-300 hover:border-[#c69b59]"
        >
          ← Back to Home
        </a>
      </nav>

      <section className="relative mx-4 overflow-hidden rounded-3xl md:mx-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg,rgba(8,20,14,0.9),rgba(8,20,14,0.35)),url('${tour.image}')`,
          }}
        />

        <div className="relative flex min-h-[420px] items-end px-8 py-12 md:px-16 md:py-16">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.25em] text-[#d5ae70]">
              {tour.id} · EXPLORE INDIA
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold md:text-6xl">
              {tour.name}
            </h1>

            <p className="mt-5 text-base text-gray-200 md:text-lg">
              {tour.location}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        <div className="md:col-span-2">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#c69b59]">
            ABOUT THIS JOURNEY
          </p>

          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Your journey, thoughtfully planned.
          </h2>

          <p className="mt-6 text-base leading-8 text-gray-300">
            {tour.description}
          </p>

          <h3 className="mt-12 text-2xl font-semibold">
            Tour Highlights
          </h3>

          <div className="mt-6 space-y-5">
            {tour.highlights.map((highlight) => (
              <div key={highlight} className="flex gap-4">
                <span className="text-xl text-[#c69b59]">✦</span>
                <p className="text-base text-gray-300">{highlight}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-[#19271f] p-7">
            <h3 className="text-2xl font-semibold">Trip Overview</h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="mt-2 text-lg">{tour.duration}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Accommodation</p>
                <p className="mt-2 text-lg">{tour.hotel}</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-[#19271f] p-7">
          <p className="text-sm tracking-wider text-gray-400">
            TOUR PRICE
          </p>

          <h3 className="mt-3 text-3xl font-semibold text-[#d5ae70]">
            {tour.peakPrice}
          </h3>

          <p className="mt-2 text-sm text-gray-400">
            Per person · Peak season (Oct–Mar)
          </p>

          {tour.monsoonPrice && (
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="text-sm text-gray-400">
                Monsoon season (Jun–Sep)
              </p>

              <p className="mt-2 text-2xl font-semibold text-[#d5ae70]">
                {tour.monsoonPrice}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Per person
              </p>
            </div>
          )}

          <div className="mt-7 border-t border-white/10 pt-6">
            <p className="text-sm leading-6 text-gray-400">
              Final quotation depends on travel dates, number of travellers
              and applicable inclusions.
            </p>

            <a
              href="/enquiry"
              className="mt-7 block rounded-full bg-[#c69b59] px-6 py-4 text-center font-semibold text-[#101b16] transition hover:bg-[#d5ae70]"
            >
              Enquire Now →
            </a>
          </div>
        </aside>
      </section>

      <footer className="border-t border-white/10 px-8 py-8 text-center text-sm text-gray-400">
        © 2026 TravelMate. All rights reserved.
      </footer>
    </main>
  );
}
