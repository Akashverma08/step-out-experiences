import { FaWhatsapp } from "react-icons/fa";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/917042095024?text=Hi!%20I'm%20interested%20in%20your%20events."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-[9999] flex items-center"
    >
      <span className="mr-3 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-lg opacity-0 transition-all duration-300 group-hover:opacity-100">
        Chat with us
      </span>

      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
        <FaWhatsapp size={34} />
      </div>
    </a>
  );
}