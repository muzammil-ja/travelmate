import { abort } from "process";

export async function POST(request) {
  try {
    const { enquiry, packages } = await request.json();

    if (!enquiry || !Array.isArray(packages)) {
      return Response.json(
        { error: "Enquiry and packages are required." },
        { status: 400 }
      );
    }

    const destination = (enquiry.destination || "").toLowerCase();

    const matchedPackages = packages
      .map((pkg) => {
        const location = (pkg.location || "").toLowerCase();
        const name = (pkg.name || "").toLowerCase();

        let score = 0;

        if (destination && location.includes(destination)) score += 3;
        if (destination && name.includes(destination)) score += 3;

        const budget = Number(
          String(enquiry.budget || "").replace(/[^\d]/g, "")
        );

        const price = Number(pkg.peak_price || 0);

        if (budget && price && price <= budget) score += 1;

        return { ...pkg, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const recommendations = matchedPackages
      .map(
        (pkg, index) =>
          `${index + 1}. ${pkg.name}
Location: ${pkg.location}
Duration: ${pkg.duration}
Peak Season Price: ₹${pkg.peak_price}
Hotel Category: ${pkg.hotel_category}
Reason: ${pkg.score > 0 ? "Matches some of the customer's destination or budget preferences." : "Suggested as an alternative package for staff review."}`
      )
      .join("\n\n");

    const analysis = `
DEMO MODE — RULE-BASED RECOMMENDATIONS (NOT LIVE AI)

1. ENQUIRY SUMMARY

Customer: ${enquiry.name || "Not provided"}
Destination: ${enquiry.destination || "Not provided"}
Travel Date: ${enquiry.start_date || "Not provided"}
Travellers: ${enquiry.travellers || "Not provided"}
Duration: ${enquiry.nights || "Not provided"} nights
Budget: ${enquiry.budget || "Not provided"}

2. TOP PACKAGE RECOMMENDATIONS

${recommendations || "No matching published packages found. Staff should review manually."}

3. CUSTOMER REPLY DRAFT

Dear ${enquiry.name || "Customer"},

Thank you for contacting TravelMate!

We have received your enquiry for ${enquiry.destination || "your preferred destination"}.

Our team will review your travel requirements and suitable package options and get back to you shortly with further details.

We look forward to helping you plan your trip!

Best regards,
TravelMate Team

4. STAFF NOTES

- Verify travel dates and package availability.
- Confirm hotel availability and final pricing.
- Check whether the package fits the customer's total budget.
- Confirm any special requirements directly with the customer.
- Review and approve the reply before sending.

This is an automatically generated demo draft. No message has been sent.
`;

    return Response.json({
      success: true,
      mode: "demo",
      analysis,
    });

  } catch (error) {
    console.error("Demo AI Assistant error:", error);

    return Response.json(
      { error: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
