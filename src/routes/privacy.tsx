import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-primary"
          >
            OutandAbout
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className="transition hover:text-primary"
            >
              Home
            </Link>

            <Link
              to="/experiences"
              className="transition hover:text-primary"
            >
              Experiences
            </Link>

            <Link
              to="/contact"
              className="transition hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b bg-cream py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-4 text-muted-foreground">
            Your privacy matters to us. This policy explains how
            OutandAbout collects, uses, and protects your personal
            information when you use our website and book experiences.
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            Last Updated: August 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-5xl space-y-12 px-6 py-16 leading-8">

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            1. Introduction
          </h2>

          <p className="text-muted-foreground">
            Welcome to <strong>OutandAbout</strong>. We are committed to
            protecting your privacy and ensuring that your personal
            information is handled securely and responsibly.
            This Privacy Policy explains what information we collect,
            why we collect it, and how it is used when you browse or
            book experiences through our platform.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            2. Information We Collect
          </h2>

          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Booking Details</li>
            <li>Communication preferences</li>
            <li>Basic payment confirmation details</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            3. How We Use Your Information
          </h2>

          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>To confirm your bookings.</li>
            <li>To communicate important event updates.</li>
            <li>To provide customer support.</li>
            <li>To improve our website and user experience.</li>
            <li>To notify you about upcoming experiences (only when appropriate).</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            4. Payments
          </h2>

          <p className="text-muted-foreground">
            We currently accept payments through secure UPI payment
            methods. We do not store your bank account details,
            UPI PIN, debit card information, or any confidential
            financial credentials on our website.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            5. Cookies
          </h2>

          <p className="text-muted-foreground">
            Our website may use cookies and similar technologies
            to enhance your browsing experience, remember your
            preferences, and improve website performance.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            6. Information Sharing
          </h2>

          <p className="text-muted-foreground">
            We respect your privacy. We never sell or rent your
            personal information to third parties. Information may
            only be shared when required by law or when necessary
            to provide our services.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            7. Data Security
          </h2>

          <p className="text-muted-foreground">
            We use appropriate technical and organizational
            measures to protect your information from unauthorized
            access, misuse, or disclosure. However, no online
            transmission method can guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            8. Your Rights
          </h2>

          <p className="text-muted-foreground">
            You may contact us at any time to request correction,
            update, or deletion of your personal information,
            subject to applicable laws.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            9. Contact Us
          </h2>

          <div className="rounded-xl border bg-muted/30 p-6">
            <p className="font-semibold">
              OutandAbout
            </p>

            <p className="mt-2 text-muted-foreground">
              Delhi, India
            </p>

            <p className="mt-1 text-muted-foreground">
              Email:
              <a
                href="mailto:jainanshika1404@gmail.com"
                className="ml-2 text-primary hover:underline"
              >
                jainanshika1404@gmail.com
              </a>
            </p>

            <p className="mt-1 text-muted-foreground">
              Phone:
              <a
                href="tel:+917042095024"
                className="ml-2 text-primary hover:underline"
              >
                +91 7042095024
              </a>
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          © 2026 OutandAbout. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}