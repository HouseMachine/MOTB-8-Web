import Link from "next/link";
import IdentityDetails from "@/components/identity/IdentityDetails";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GenesisRecord, MOTB8BeaconV11 } from "motb-8";

const identityDirectory = join(process.cwd(), "public", "identity");

const genesis = JSON.parse(
  readFileSync(join(identityDirectory, "genesis.json"), "utf8")
) as GenesisRecord;

const beacon = JSON.parse(
  readFileSync(join(identityDirectory, "beacon.json"), "utf8")
) as MOTB8BeaconV11;

const tag = readFileSync(
  join(identityDirectory, "motb8-tag.txt"), "utf8"
).trim();

if (
  genesis.motb8Tag !== tag ||
  beacon.motb8Tag !== tag
) {
  throw new Error("Published MOTB-8 identity records do not agree.");
}

export default function IdentityPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#172a22]">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dce4dc] pb-6">
          <Link href="/" className="text-xl font-bold">MOTB-8</Link>
          <nav className="flex flex-wrap gap-5 text-sm">
            <Link href="/">Home</Link>
            <Link href="/create">Create</Link>
            <Link href="/manage">Manage</Link>
            <Link href="/docs">Docs</Link>
          </nav>
        </header>

        <section className="py-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#40735a]">
            Public machine identity
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            {beacon.name}
          </h1>
          <p className="mt-5 max-w-3xl leading-8 text-[#5e6e64]">
            {beacon.description}
          </p>
          <div className="mt-8 rounded-xl border border-[#dce4dc] bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#40735a]">
              Permanent MOTB-8 Tag
            </h2>
            <p className="mt-4 break-all font-mono text-sm leading-7">
              {tag}
            </p>
          </div>
        </section>

        <IdentityDetails genesis={genesis} beacon={beacon} />
      </div>
    </main>
  );
}
