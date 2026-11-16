const exampleTag =
  "([[!MOTB-8:1:53XC4K4CXHYJCX6CGMDWY34HJ9KVNGRN:2D]])";

const components = [
  {
    symbol: "Parentheses ( )",
    purpose:
      "Form the outer discovery envelope, helping compatible software recognize the boundaries of a published Tag.",
  },
  {
    symbol: "Square brackets [ ]",
    purpose:
      "Form the nested inner envelope, contributing to the distinctive opening and closing patterns.",
  },
  {
    symbol: "Bang / Exclamation Mark (!)",
    purpose:
      "Known in computing as a bang, the exclamation mark serves as the prefix to the !MOTB-8 protocol sentinel. It contributes to the distinctive recognition pattern that compatible crawlers and parsers can identify.",
  },
  {
    symbol: "MOTB-8",
    purpose:
      "Identifies the open protocol and distinguishes its Tags from other identifier formats.",
  },
  {
    symbol: "Colons :",
    purpose:
      "Separate the identifier fields so compatible software can parse them deterministically.",
  },
  {
    symbol: "Version 1",
    purpose:
      "Identifies the Tag grammar version, independently of the software release version.",
  },
  {
    symbol: "Identity payload",
    purpose:
      "A permanent 160-bit cryptographically random identity represented by exactly 32 Crockford Base32 characters. No central issuing authority is required.",
  },
  {
    symbol: "Checksum",
    purpose:
      "Two Crockford Base32 characters derived from the first 10 bits of SHA-256, helping detect accidental transcription errors.",
  },
];

export default function TagAnatomy() {
  return (
    <section
      id="anatomy-of-the-mark"
      className="scroll-mt-8 border-b border-[#dce4dc] py-16"
      aria-labelledby="tag-anatomy-heading"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#40735a]">
        Understanding the permanent identifier
      </p>

      <h2
        id="tag-anatomy-heading"
        className="mt-4 text-3xl font-bold tracking-tight"
      >
        Anatomy of the Mark
      </h2>

      <div className="mt-6 max-w-3xl space-y-4 leading-8 text-[#5e6e64]">
        <p>
          Every machine presence needs a way to be recognized,
          distinguished, and referenced across an increasingly
          interconnected digital environment.
        </p>
        <p>
          MOTB-8 introduces a permanent, open-format identifier
          designed to make independently operated machine presences
          recognizable to people, software applications, automated
          discovery systems, and compatible AI agents.
        </p>
        <p>
          Its distinctive arrangement of parentheses, brackets,
          punctuation, version information, randomized identity
          characters, and checksum is intentional. Each component
          contributes to recognizable discovery boundaries,
          deterministic parsing, protocol identification,
          compatibility, independent identity generation, or
          transcription-error detection.
        </p>
        <p>
          Together, these elements form a portable identifier that
          can be published across websites, software repositories,
          documentation, and machine-readable resources without
          requiring a central registration authority.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-[#dce4dc] bg-white p-6 sm:p-8">
        <h3 className="text-xl font-semibold">
          An example of a permanent MOTB-8 Tag
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#5e6e64]">
          The official MOTB-8 website is one example of a machine
          presence. Agents, robots, gateways, software services,
          IoT systems, and other independently discoverable
          presences can generate their own permanent Tags.
        </p>
        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#40735a]">
          Official MOTB-8 Website ? Example Presence
        </p>
        <code className="mt-3 block break-all rounded-lg bg-[#f1f5ef] p-4 text-sm font-semibold leading-7 text-[#174b3a]">
          {exampleTag}
        </code>
        <p className="mt-3 text-sm leading-7 text-[#5e6e64]">
          The Tag shown here is the real permanent identifier
          for this website&apos;s published machine presence.
          It is not a website-specific identifier format.
        </p>
      </div>

      <h3 className="mt-12 text-2xl font-semibold">
        The symbols, their purposes, and their benefits
      </h3>
      <p className="mt-4 max-w-3xl leading-8 text-[#5e6e64]">
        Each component has a defined role within the canonical
        MOTB-8 Tag structure.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-[#dce4dc] bg-white">
        {components.map((component) => (
          <div
            key={component.symbol}
            className="grid gap-2 border-b border-[#e4eae3] p-5 last:border-b-0 sm:grid-cols-[190px_1fr] sm:gap-6"
          >
            <strong className="text-sm text-[#174b3a]">
              {component.symbol}
            </strong>
            <p className="text-sm leading-7 text-[#5e6e64]">
              {component.purpose}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-[#dce4dc] bg-white p-6">
          <h3 className="text-xl font-semibold">
            Why Crockford Base32?
          </h3>
          <p className="mt-4 text-sm leading-7 text-[#5e6e64]">
            The identity payload is generated using cryptographically
            secure randomness and encoded using the canonical
            Crockford Base32 alphabet:
          </p>
          <code className="mt-4 block break-all rounded-lg bg-[#f1f5ef] p-3 text-sm text-[#174b3a]">
            0123456789ABCDEFGHJKMNPQRSTVWXYZ
          </code>
          <p className="mt-4 text-sm leading-7 text-[#5e6e64]">
            This alphabet excludes easily confused letters I, L,
            O, and U. A 160-bit payload offers approximately
            1.46 ? 10?? possible identities, making accidental
            duplication extraordinarily unlikely when secure
            randomness is used.
          </p>
        </article>

        <article className="rounded-xl border border-[#dce4dc] bg-white p-6">
          <h3 className="text-xl font-semibold">
            Why a checksum?
          </h3>
          <p className="mt-4 text-sm leading-7 text-[#5e6e64]">
            MOTB-8 calculates SHA-256 over the canonical ASCII
            identifier core, beginning with MOTB-8:1: and
            followed by the 32-character identity payload.
          </p>
          <p className="mt-4 text-sm leading-7 text-[#5e6e64]">
            The first 10 digest bits are encoded as two Crockford
            Base32 characters. This helps detect transcription
            errors but does not authenticate a machine or
            establish controller authority.
          </p>
        </article>
      </div>

      <div className="mt-10 rounded-xl bg-[#eaf1e9] p-6 sm:p-8">
        <h3 className="text-xl font-semibold">
          One permanent Tag. An evolving Beacon.
        </h3>
        <p className="mt-4 leading-8 text-[#40584b]">
          A machine presence may change its capabilities, public
          description, reachability, or associated resources.
          Its permanent Tag remains unchanged. Updated information
          belongs in the signed Beacon.
        </p>
        <p className="mt-4 leading-8 text-[#40584b]">
          The Beacon also includes a deterministic discovery
          summary derived from its name, presence scope, presence
          type, and description, helping compatible systems
          understand what a discovered presence represents.
        </p>
      </div>

      <div className="mt-10 max-w-3xl">
        <h3 className="text-xl font-semibold">
          Recognition is not authentication
        </h3>
        <p className="mt-4 leading-8 text-[#5e6e64]">
          The Tag provides a recognizable identifier format,
          but its syntax does not guarantee indexing by search
          engines, discovery by AI systems, or preferential ranking.
          The Tag is randomly generated and encoded, not encrypted.
        </p>
        <p className="mt-4 leading-8 text-[#5e6e64]">
          A valid checksum establishes error-detection consistency,
          not ownership or authenticity. Controller binding and
          signed Beacon verification are separate cryptographic
          processes. A self-signed Genesis Record alone does not
          prove original ownership of a publicly copyable Tag.
        </p>
      </div>

      <p className="mt-10 border-l-4 border-[#174b3a] pl-5 text-lg font-semibold leading-8 text-[#174b3a]">
        Mark the machine. Describe the presence. Reference the mark
        wherever that machine participates.
      </p>
    </section>
  );
}
