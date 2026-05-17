/**
 * Generates a PDF donation receipt and streams it to the HTTP response.
 *
 * Kept intentionally simple (no Arabic-shaping library) — labels stay in
 * English so PDFKit's default Helvetica renders correctly across all
 * platforms. If you later want Arabic, swap to a library like pdfmake or
 * embed a TTF font that includes Arabic glyphs.
 */
const PDFDocument = require("pdfkit");

function streamReceipt(res, donation, project) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="receipt-${donation._id}.pdf"`);
  doc.pipe(res);

  // Header
  doc.fillColor("#1856FF").fontSize(22).text("Hamoda Charity", { align: "left" });
  doc.fillColor("#64748b").fontSize(10).text("Donation Receipt", { align: "left" });
  doc.moveDown(1.5);

  // Receipt details box
  doc.fillColor("#0f172a").fontSize(12);
  const line = (label, value) => {
    doc.font("Helvetica-Bold").text(`${label}: `, { continued: true });
    doc.font("Helvetica").text(String(value));
  };

  line("Receipt #", donation._id);
  line("Date", new Date(donation.createdAt || Date.now()).toLocaleString("en-US"));
  line("Donor", donation.donorName);
  line("Email", donation.donorEmail);
  if (donation.donorPhone) line("Phone", donation.donorPhone);
  doc.moveDown(0.5);
  line("Type", donation.donationType);
  if (project?.title) line("Project", project.title);
  line("Payment", donation.paymentMethod);
  line("Status", donation.status);

  // Amount — big and centered
  doc.moveDown(1.2);
  doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.7);
  doc.fontSize(11).fillColor("#64748b").font("Helvetica").text("Amount donated:", { align: "center" });
  doc.fontSize(34).fillColor("#16A34A").font("Helvetica-Bold")
     .text(`$${Number(donation.amount).toLocaleString()}`, { align: "center" });

  // Footer
  doc.moveDown(2);
  doc.fontSize(10).fillColor("#94a3b8").font("Helvetica")
     .text("Thank you for your generous contribution.", { align: "center" });
  doc.fontSize(9).fillColor("#cbd5e1")
     .text("Hamoda Charity — A non-profit charity platform.", { align: "center" });

  doc.end();
}

module.exports = { streamReceipt };
