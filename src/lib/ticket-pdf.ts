import jsPDF from "jspdf";
import QRCode from "qrcode";

type TicketData = {
  bookingNumber: string;
  bookingId: string;
  title: string;
  category?: string;
  dateISO: string;
  location: string;
  city: string;
  seats: number;
  amount: number;
  attendee: string;
  email: string;
  phone: string;
  host?: string | null;
  slug?: string;
};

export async function generateTicketPDF(t: TicketData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const rose = [225, 96, 116] as const;
  const ink = [26, 20, 24] as const;
  const soft = [252, 233, 236] as const;
  const cream = [253, 249, 244] as const;

  // Background
  doc.setFillColor(...cream);
  doc.rect(0, 0, W, 297, "F");

  // Header band
  doc.setFillColor(...rose);
  doc.rect(0, 0, W, 42, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("AN OUT & ABOUT", 15, 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Events & Experiences", 15, 21);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("EVENT TICKET", 15, 34);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Booking #${t.bookingNumber}`, W - 15, 34, { align: "right" });

  // Title card
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(12, 52, W - 24, 42, 4, 4, "F");
  doc.setTextColor(...rose);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text((t.category ?? "EXPERIENCE").toUpperCase(), 18, 60);
  doc.setTextColor(...ink);
  doc.setFontSize(16);
  const title = doc.splitTextToSize(t.title, W - 40);
  doc.text(title, 18, 68);

  const when = new Date(t.dateISO).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`When   ${when}`, 18, 82);
  doc.text(`Where  ${t.location}, ${t.city}`, 18, 88);

  // Attendee + QR panel
  doc.setFillColor(...soft);
  doc.roundedRect(12, 100, W - 24, 90, 4, 4, "F");

  const qrDataUrl = await QRCode.toDataURL(
    JSON.stringify({ b: t.bookingId, n: t.bookingNumber, s: t.seats, a: t.attendee }),
    { width: 400, margin: 1, color: { dark: "#1a1418", light: "#ffffff" } },
  );
  doc.addImage(qrDataUrl, "PNG", W - 78, 108, 62, 62);

  doc.setTextColor(...ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ATTENDEE", 18, 110);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(t.attendee, 18, 117);
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text(t.email, 18, 123);
  doc.text(t.phone, 18, 128);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...ink);
  doc.text("TICKETS", 18, 142);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(`${t.seats}`, 18, 150);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("AMOUNT PAID", 60, 142);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(`INR ${t.amount.toLocaleString("en-IN")}`, 60, 150);

  if (t.host) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("HOST", 18, 166);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(t.host, 18, 173);
  }

  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text("Scan this QR at the venue for entry", W - 47, 176, { align: "center" });

  // Terms footer
  doc.setDrawColor(220, 220, 220);
  doc.line(12, 205, W - 12, 205);
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  const terms = [
    "• Please arrive 10 minutes before start time. Late entries may not be permitted.",
    "• This ticket is non-transferable and valid only for the attendee above.",
    "• Free cancellation up to 48 hours before the experience.",
    "• Present this ticket (printed or on your phone) at the venue.",
  ];
  terms.forEach((line, i) => doc.text(line, 15, 214 + i * 5));

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...rose);
  doc.text("anoutandabout.in", 15, 285);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`Issued ${new Date().toLocaleDateString("en-IN")}`, W - 15, 285, { align: "right" });

  doc.save(`AN-Ticket-${t.bookingNumber}.pdf`);
}
