import Link from "next/link";

const workflows = [
  {
    title: "1. Create your identity",
    text: "Describe your machine, acknowledge Good-Faith participation, review your information, and generate your permanent Tag and signed records.",
    href: "/create",
    action: "Create a machine"
  },
  {
    title: "2. Protect your controller",
    text: "Save the encrypted Control File and its passphrase securely. Losing either may prevent future authorized Beacon updates.",
    href: "#backup",
    action: "Backup guidance"
  },
  {
    title: "3. Publish your presence",
    text: "Make your Tag, signed Genesis Record, and Beacon publicly accessible. Never publish private controller credentials.",
    href: "#publishing",
    action: "Publishing guidance"
  },
  {
    title: "4. Manage your Beacon",
    text: "Import your saved records, unlock your controller, review changes, sign the next revision, and download the updated Beacon.",
    href: "/manage",
    action: "Manage a machine"
  }
];

export default function OperatorGuide() {
  return (
    <section className="mt-20 border-t border-[#dce4dc] pt-12">
      <h2 className="text-3xl font-bold">Create, protect, publish, and manage.</h2>
      <p className="mt-4 max-w-3xl leading-8 text-[#5e6e64]">
        MOTB-8 identities are created locally. Publication is a separate
        operator-controlled step, and signed Beacon revisions must be
        published separately after generation.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {workflows.map((item) => (
          <article key={item.title}
            className="rounded-xl border border-[#dce4dc] bg-white p-6">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#5e6e64]">
              {item.text}
            </p>
            <Link href={item.href}
              className="mt-5 inline-block text-sm font-semibold text-[#174b3a] hover:underline">
              {item.action}
            </Link>
          </article>
        ))}
      </div>
      <div id="backup" className="mt-16 scroll-mt-8 rounded-xl border border-[#dce4dc] bg-white p-6">
        <h3 className="text-2xl font-bold">Protect your Control File</h3>
        <p className="mt-4 leading-8 text-[#5e6e64]">
          Keep secure backups of your signed Genesis Record, every Beacon
          revision, and encrypted Control File. Protect the Control File
          passphrase separately. Never publish private controller credentials.
        </p>
        <p className="mt-3 text-sm leading-7 text-[#5e6e64]">
          MOTB-8 v0.1 does not provide automatic controller recovery or
          rotation. Losing the encrypted Control File or its usable passphrase
          may prevent future authorized updates to the original identity.
        </p>
      </div>

      <div id="publishing" className="mt-6 scroll-mt-8 rounded-xl border border-[#dce4dc] bg-white p-6">
        <h3 className="text-2xl font-bold">Publish your machine presence</h3>
        <p className="mt-4 leading-8 text-[#5e6e64]">
          Publish your permanent Tag, signed Genesis Record, and current
          signed Beacon on a publicly accessible website or machine profile.
          Stable HTTPS links to the public JSON records are recommended.
        </p>
        <p className="mt-3 text-sm leading-7 text-[#5e6e64]">
          Generating a Tag or signing a new Beacon revision does not
          automatically publish it. Update your public Beacon links when
          publishing a new revision, and preserve previous signed revisions.
        </p>
        <p className="mt-3 text-sm leading-7 text-[#5e6e64]">
          No central registry, mandatory blockchain, or prescribed
          publication directory is required.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-[#dce4dc] bg-white p-6">
        <h3 className="text-2xl font-bold">Understand verification</h3>
        <p className="mt-4 leading-8 text-[#5e6e64]">
          Cryptographic verification can establish the validity of supplied
          signatures, controller relationships, and Beacon revision continuity.
          It does not independently establish original ownership of a
          publicly copyable Tag.
        </p>
        <p className="mt-3 text-sm leading-7 text-[#5e6e64]">
          A valid unanchored Genesis binding is self-asserted. Verification
          does not certify that a machine is trustworthy, safe, or lawful,
          or prove that a supplied Beacon is the latest published revision.
          Good-Faith acknowledgment is not an independent endorsement.
        </p>
      </div>

    </section>
  );
}
