import Link from "next/link";
import OperatorGuide from "@/components/docs/OperatorGuide";

const concepts = [
  {
    title: "MOTB-8 Tag",
    description:
      "A permanent identifier for an independently discoverable machine presence.",
  },
  {
    title: "Genesis Record",
    description:
      "A signed record binding the Tag to its original cryptographic controller.",
  },
  {
    title: "Beacon",
    description:
      "Signed, updateable information describing a machine presence, its capabilities, and reachability.",
  },
  {
    title: "Control File",
    description:
      "Encrypted controller material retained locally for authorized management.",
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#172a22]">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dce4dc] pb-6">
          <Link href="/" className="text-xl font-bold">
            MOTB-8
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/">Home</Link>
            <Link href="/create">Create</Link>
            <Link href="/manage">Manage</Link>
          </nav>
        </header>

        <section className="max-w-3xl py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#40735a]">
            Open-source documentation
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Understand the mark.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5e6e64]">
            MOTB-8 is an open-source standard for permanent machine
            identifiers and signed, updateable machine-presence information.
            Explore its core concepts and reference implementation.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {concepts.map((concept) => (
            <article
              key={concept.title}
              className="rounded-xl border border-[#dce4dc] bg-white p-6"
            >
              <h2 className="text-xl font-semibold">{concept.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#5e6e64]">
                {concept.description}
              </p>
            </article>
          ))}
        </section>

        <OperatorGuide />

        <section className="mt-10 rounded-2xl bg-[#eaf1e9] p-6 sm:p-10">
          <h2 className="text-2xl font-bold">
            Built in the open.
          </h2>

          <p className="mt-4 max-w-2xl leading-8 text-[#5e6e64]">
            The MOTB-8 core software, schemas, developer guides, and
            reference implementation are publicly available under
            the MIT License.
          </p>

          <a
            href="https://github.com/HouseMachine/MOTB-8"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-lg bg-[#174b3a] px-6 py-3 font-semibold text-white hover:bg-[#103729]"
          >
            View core documentation ↗
          </a>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a
              href="https://github.com/HouseMachine/MOTB-8-Web/blob/main/docs/MOTB8-OPERATOR-PUBLISHING-GUIDE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#174b3a] hover:underline"
            >
              Operator publishing guide
            </a>
            <a
              href="https://github.com/HouseMachine/MOTB-8-Web"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#174b3a] hover:underline"
            >
              Website source code
            </a>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-xl font-semibold">
            Independent by design
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-[#5e6e64]">
            MOTB-8 does not require a central registry, payment network,
            hosted account, or proprietary discovery provider. Developers
            can implement compatible tools and services independently.
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5e6e64]">
            A valid identifier or cryptographic signature does not, by
            itself, establish that a machine is trustworthy, safe, or lawful.
          </p>
        </section>

        <footer className="border-t border-[#dce4dc] py-8 text-sm text-[#5e6e64]">
          <Link href="/">← Return to homepage</Link>
        </footer>
      </div>
    </main>
  );
}
