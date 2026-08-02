import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/term")({
  component: Terms,
});

function Terms() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold">
        Terms & Conditions
      </h1>

      <p className="mt-6 text-muted-foreground">
        Last Updated: August 2026
      </p>

      <div className="mt-10 space-y-8 leading-8 text-muted-foreground">

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            1. Acceptance
          </h2>

          <p>
            By using this website, you agree to these Terms &
            Conditions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            2. Bookings
          </h2>

          <ul className="list-disc ml-6">
            <li>Bookings are confirmed only after successful payment.</li>
            <li>Each ticket is valid for one attendee unless otherwise stated.</li>
            <li>Participants must arrive on time.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            3. Cancellation & Refund
          </h2>

          <ul className="list-disc ml-6">
            <li>
              If AN Out & About cancels an event, a full refund will be issued.
            </li>
            <li>
              Customer cancellations may not be refundable unless specifically
              mentioned on the event page.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            4. Participant Responsibilities
          </h2>

          <ul className="list-disc ml-6">
            <li>Respect fellow participants.</li>
            <li>Follow instructions from event hosts.</li>
            <li>Any misconduct may result in removal without refund.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            5. Intellectual Property
          </h2>

          <p>
            All website content including logos, images, branding, and text are
            the property of AN Out & About Events & Experiences unless otherwise
            stated.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            6. Limitation of Liability
          </h2>

          <p>
            We are not responsible for losses resulting from circumstances
            beyond our reasonable control including weather, venue issues,
            government restrictions, or force majeure events.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground">
            7. Contact
          </h2>

          <p>
            AN Out & About Events & Experiences
            <br />
            Delhi, India
            <br />
            Email: jainanshika14022gmail.com
            <br />
            Phone: +91 7042095024
          </p>
        </section>

      </div>
    </div>
  );
}