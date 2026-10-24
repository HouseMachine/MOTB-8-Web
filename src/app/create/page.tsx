import Link from "next/link";

const stages = [
  "Create",
  "Fill Beacon",
  "Discoverability Bar",
  "Generate MOTB-8",
  "Your Machine Is Marked",
  "Save Your Control Key",
];

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#172a22]">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dce4dc] pb-6">
          <Link href="/" className="text-xl font-bold">
            MOTB-8
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/">Home</Link>
            <Link href="/manage">Manage</Link>
            <Link href="/docs">Docs</Link>
          </nav>
        </header>

        <section className="max-w-3xl py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#40735a]">
            Create a machine presence
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Give your machine its mark.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#5e6e64]">
            Create a permanent MOTB-8 identifier and signed Beacon
            for your AI agent, software service, or autonomous system.
            No account required.
          </p>
        </section>

        <section className="rounded-2xl border border-[#dce4dc] bg-white p-6 sm:p-10">
          <h2 className="text-2xl font-bold">Creation process</h2>
          <p className="mt-3 text-[#5e6e64]">
            Your machine identity is created locally, with an encrypted
            Control File that you retain.
          </p>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {stages.map((stage, index) => (
              <li
                key={stage}
                className="rounded-xl border border-[#dce4dc] p-5"
              >
                <span className="text-xs font-bold text-[#40735a]">
                  STEP {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{stage}</h3>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl bg-[#eaf1e9] p-5">
            <p className="font-semibold">Browser creation coming next</p>
            <p className="mt-2 text-sm leading-6 text-[#5e6e64]">
              The interface is being connected to the existing MOTB-8
              open-source software. Identifier generation is not yet
              available on this page.
            </p>
          </div>
        </section>

        <footer className="py-10 text-sm text-[#5e6e64]">
          <Link href="/">← Return to homepage</Link>
        </footer>
      </div>
    </main>
  );
}
