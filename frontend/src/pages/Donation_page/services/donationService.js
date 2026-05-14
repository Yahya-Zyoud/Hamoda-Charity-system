// services/donationService.js
// API layer for the Donations page.
// Home.jsx calls submitDonation() and doesn't care how it works internally.
//
// RIGHT NOW: uses a fake 1.8s delay (so the app works without a backend).
// TO CONNECT BACKEND: delete the fake block and uncomment the real fetch block.

export async function submitDonation(donationData) {

  // ── FAKE (delete this whole block when backend is ready) ──────────────────
  console.log("📦 Sending to backend:", donationData);
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return { success: true, message: "تم استلام تبرعك بنجاح!" };
  // ─────────────────────────────────────────────────────────────────────────

  // ── REAL BACKEND (uncomment this when ready) ──────────────────────────────
  // const response = await fetch("http://localhost:5000/api/donations", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(donationData),
  // });
  // if (!response.ok) throw new Error("فشل الاتصال بالخادم");
  // return await response.json();
  // ─────────────────────────────────────────────────────────────────────────
}
