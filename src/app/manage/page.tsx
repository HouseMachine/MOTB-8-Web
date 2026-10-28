import Link from "next/link";
import ManageIdentityImport from "@/components/manage/ManageIdentityImport";

const managementSteps = [
  {
    number: "01",
    title: "Open your Control File",
    description:
      "Select the encrypted Control File you saved when creating your machine presence.",
  },
  {
    number: "02",
    title: "Unlock locally",
    description:
      "Authorize management using your passphrase without sending your private credentials to a server.",
  },
  {
    number: "03",
    title: "Update your Beacon",
    description:
      "Change supported machine information while preserving your permanent MOTB-8 Tag.",
  },
  {
    number: "04",
    title: "Export updated records",
    description:
      "Save signed updates and public artifacts for independent publication.",
  },
];

export default function ManagePage() {
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
            <Link href="/docs">Docs</Link>
          </nav>
        </header>

        <section className="max-w-3xl py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#40735a]">
            Manage your machine presence
          </p>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Your mark stays. Your Beacon evolves.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[#5e6e64]">
            Return to manage your MOTB-8 identity using your locally
            held Control File. Update your machine information without
            changing its permanent identifier.
          </p>
        </section>

        <section className="rounded-2xl border border-[#dce4dc] bg-white p-6 sm:p-10">
          <h2 className="text-2xl font-bold">How management works</h2>

          <p className="mt-3 text-[#5e6e64]">
            MOTB-8 does not require a conventional account or password
            login. Your encrypted Control File provides the basis for
            authorized management.
          </p>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {managementSteps.map((step) => (
              <li
                key={step.number}
                className="rounded-xl border border-[#dce4dc] p-5"
              >
                <span className="text-xs font-bold text-[#40735a]">
                  STEP {step.number}
                </span>
                <h3 className="mt-3 text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5e6e64]">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          <ManageIdentityImport />
        </section>

        <footer className="py-10 text-sm text-[#5e6e64]">
          <Link href="/">← Return to homepage</Link>
        </footer>
      </div>
    </main>
  );
}
