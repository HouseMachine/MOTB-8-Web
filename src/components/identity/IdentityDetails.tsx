import type { GenesisRecord, MOTB8BeaconV11 } from "motb-8";

interface IdentityDetailsProps {
  genesis: GenesisRecord;
  beacon: MOTB8BeaconV11;
}

const records = [
  {
    title: "Permanent MOTB-8 Tag",
    description: "The public identifier for this machine presence.",
    href: "/identity/motb8-tag.txt"
  },
  {
    title: "Signed Genesis Record",
    description: "The original signed controller binding.",
    href: "/identity/genesis.json"
  },
  {
    title: "Signed Beacon",
    description: "The machine-readable description and capabilities.",
    href: "/identity/beacon.json"
  }
];

export default function IdentityDetails({
  genesis,
  beacon
}: IdentityDetailsProps) {
  return (
    <section className="space-y-10 pb-12">
      <div>
        <h2 className="text-2xl font-bold">Public identity records</h2>
        <p className="mt-3 text-[#5e6e64]">
          These public files can be retrieved and independently verified.
          Private controller credentials are not included.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {records.map((record) => (
            <a
              key={record.href}
              href={record.href}
              className="rounded-xl border border-[#dce4dc] bg-white p-5 transition-colors hover:border-[#174b3a] hover:bg-[#eaf1e9]"
            >
              <h3 className="font-semibold text-[#174b3a]">
                {record.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#5e6e64]">
                {record.description}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold">
                View public record
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#dce4dc] bg-white p-6">
        <h2 className="text-xl font-bold">Identity information</h2>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-semibold">Created</dt>
            <dd className="mt-1 text-[#5e6e64]">
              {genesis.createdAt}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Beacon revision</dt>
            <dd className="mt-1 text-[#5e6e64]">
              {beacon.revision}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Controller algorithm</dt>
            <dd className="mt-1 text-[#5e6e64]">
              Ed25519
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Genesis binding</dt>
            <dd className="mt-1 text-[#5e6e64]">
              Valid unanchored binding
            </dd>
          </div>
        </dl>
        <p className="mt-5 text-sm leading-7 text-[#5e6e64]">
          This identity was independently verified using the MOTB-8
          core implementation. A valid unanchored Genesis binding
          is self-asserted and does not independently prove original
          ownership of the permanent Tag.
        </p>
      </div>
      <div className="rounded-xl border border-[#dce4dc] bg-[#eaf1e9] p-6 sm:p-8">
        <h2 className="text-2xl font-bold">
          Why is this identity public?
        </h2>
        <p className="mt-4 leading-8 text-[#40584b]">
          MOTB-8 is designed to make machines discoverable,
          identifiable, and independently verifiable.
        </p>
        <p className="mt-4 leading-8 text-[#40584b]">
          Publishing this website&apos;s permanent Tag, signed Genesis
          Record, and signed Beacon allows people, developers,
          and compatible machine systems to:
        </p>
        <ul className="mt-5 list-disc space-y-3 pl-6 text-[#40584b]">
          <li>
            <strong>Identify</strong> this website through its
            permanent machine-presence identifier.
          </li>
          <li>
            <strong>Discover</strong> its declared capabilities,
            services, and public endpoints.
          </li>
          <li>
            <strong>Verify</strong> the cryptographic relationship
            between its Tag, Genesis Record, and signed Beacon.
          </li>
          <li>
            <strong>Track authorized changes</strong> through
            successive signed Beacon revisions while the
            permanent Tag remains unchanged.
          </li>
        </ul>
        <p className="mt-5 leading-8 text-[#40584b]">
          These public records demonstrate how MOTB-8 works
          without requiring a central registry, user account,
          or proprietary discovery service.
        </p>
        <p className="mt-5 border-t border-[#c8d9cc] pt-5 text-sm leading-7 text-[#40584b]">
          <strong>Verification limitation:</strong> Valid signatures
          establish cryptographic consistency with the supplied
          controller binding. They do not independently prove
          original ownership, machine trustworthiness, or that
          a Beacon is the latest published revision.
        </p>
      </div>

      <div className="rounded-xl border border-[#dce4dc] bg-white p-6">
        <h2 className="text-2xl font-bold">
          Independently verify this identity
        </h2>
        <p className="mt-4 leading-8 text-[#5e6e64]">
          Download the public Genesis and Beacon JSON records,
          then verify them using the open-source MOTB-8 core
          implementation. Verification does not require access
          to the private Control File.
        </p>
        <div className="mt-5 rounded-lg bg-[#f7f8f5] p-4">
          <code className="break-all text-sm">
            motb8 verify --genesis genesis.json --beacon beacon.json
          </code>
        </div>
        <p className="mt-4 text-sm leading-7 text-[#5e6e64]">
          The original published records were independently
          verified with the MOTB-8 core CLI. The result was
          VALID under an unanchored Genesis controller binding.
        </p>
        <a
          href="https://github.com/HouseMachine/MOTB-8"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block text-sm font-semibold text-[#174b3a] hover:underline"
        >
          View the open-source verifier
        </a>
      </div>

    </section>
  );
}
