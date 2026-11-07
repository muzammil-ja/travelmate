
const packages = [
  {
    id: "PKG-KL-07",
    name: "Kerala Backwater Escape",
    location: "Munnar · Thekkady · Alleppey",
    duration: "6 Days / 5 Nights",
    peakPrice: "₹32,500",
    monsoonPrice: "₹24,900",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200",
    tag: "MOST POPULAR",
  },
  {
    id: "PKG-SI-12",
    name: "South India Heritage Trail",
    location: "Madurai · Rameswaram · Kanyakumari",
    duration: "5 Days / 4 Nights",
    peakPrice: "₹18,750",
    monsoonPrice: null,
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200",
    tag: "CULTURAL JOURNEY",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#101b16] text-[#f5f0e6]">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <a href="/" className="text-2xl font-bold tracking-wider">
          TRAVEL<span className="text-[#c69b59]">MATE.</span>
        </a>

        <div className="hidden gap-9 text-base text-gray-300 md:flex">
          <a href="/">Home</a>
          <a href="#packages">Packages</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <a
          href="/enquiry"
          className="rounded-full bg-[#c69b59] px-7 py-3 text-base font-semibold text-[#101b16]"
        >
          Plan Your Trip
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-4 overflow-hidden rounded-3xl md:mx-8">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgba(8,20,14,0.9),rgba(8,20,14,0.35)),url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1800')",
          }}
        />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-10 py-20 md:px-16">
          <div className="max-w-2xl">
            <p className="mb-6 text-sm font-semibold tracking-[0.3em] text-[#d5ae70]">
              DISCOVER INDIA · TRAVEL DIFFERENTLY
            </p>

            <h1 className="text-5xl font-semibold leading-tight md:text-7xl">
              Journeys that stay with{" "}
              <span className="font-serif italic text-[#d5ae70]">
                you.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-gray-200 md:text-lg">
              Discover beautiful destinations, thoughtfully planned
              experiences and unforgettable journeys across India.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#packages"
                className="rounded-full bg-[#c69b59] px-8 py-4 text-base font-semibold text-[#101b16]"
              >
                Explore Packages →
              </a>

              <a
                href="/enquiry"
                className="rounded-full border border-white/50 px-8 py-4 text-base"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-8 py-20"
      >
        <p className="text-sm font-semibold tracking-[0.25em] text-[#c69b59]">
          TRAVEL WITH PURPOSE
        </p>

        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          Every destination has a story. Let's discover yours.
        </h2>

        <p className="mt-5 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">
          From peaceful backwaters to timeless heritage, explore carefully
          planned experiences made for memorable travel.
        </p>
      </section>

      {/* Packages Section */}
      <section
        id="packages"
        className="mx-auto max-w-7xl px-8 pb-20"
      >
        <div className="mb-10">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#c69b59]">
            HANDPICKED EXPERIENCES
          </p>

          <h2 className="mt-3 text-4xl font-semibold md:text-5xl">
            Our Tour Packages
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {packages.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-[#19271f]"
            >
              <div className="relative h-64">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />

                <span className="absolute left-5 top-5 rounded-full bg-[#c69b59] px-4 py-2 text-sm font-bold text-[#101b16]">
                  {item.tag}
                </span>
              </div>

              <div className="p-7">
                <p className="text-sm text-[#c69b59]">{item.id}</p>

                <h3 className="mt-3 text-2xl font-semibold">
                  {item.name}
                </h3>

                <p className="mt-2 text-base text-gray-400">
                  {item.location}
                </p>

                <div className="mt-7 flex flex-wrap justify-between gap-5 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="mt-2 text-base">{item.duration}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">
                      Peak season · Oct–Mar
                    </p>

                    <p className="mt-2 text-2xl font-semibold text-[#d5ae70]">
                      {item.peakPrice}
                    </p>

                    <p className="text-sm text-gray-400">Per person</p>
                  </div>
                </div>

                {item.monsoonPrice && (
                  <p className="mt-4 text-base text-gray-300">
                    Monsoon · Jun–Sep:{" "}
                    <span className="font-semibold text-[#d5ae70]">
                      {item.monsoonPrice}
                    </span>
                    <span className="text-sm text-gray-400">
                      {" "}/ person
                    </span>
                  </p>
                )}

                <a
                  href={`/packages/${item.id.toLowerCase()}`}
                  className="mt-7 block rounded-full border border-[#c69b59] px-6 py-3.5 text-center text-base font-semibold text-[#d5ae70] transition hover:bg-[#c69b59] hover:text-[#101b16]"
                >
                  View Package →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="mx-4 mb-8 rounded-3xl bg-[#263b2e] px-8 py-16 text-center"
      >
        <p className="text-sm tracking-[0.25em] text-[#d5ae70]">
          YOUR NEXT JOURNEY STARTS HERE
        </p>

        <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
          Let's plan something unforgettable.
        </h2>

        <a
          href="/enquiry"
          className="mt-7 inline-block rounded-full bg-[#c69b59] px-8 py-4 text-base font-semibold text-[#101b16]"
        >
          Send an Enquiry →
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-8 text-center text-sm text-gray-400">
        © 2026 TravelMate. All rights reserved.
      </footer>
    </main>
  );
}
