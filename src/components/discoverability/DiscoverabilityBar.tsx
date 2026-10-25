"use client";

import type { DiscoverabilityResult } from "./types";

interface DiscoverabilityBarProps {
  result: DiscoverabilityResult;
}

export default function DiscoverabilityBar({
  result,
}: DiscoverabilityBarProps) {
  const percentage = Math.min(
    Math.max(result.percentage, 0),
    100
  );

  return (
    <section className="mt-8 rounded-2xl border border-[#dce4dc] bg-white p-6 sm:p-10">
      <p className="text-xs font-bold uppercase tracking-widest text-[#40735a]">
        Machine information
      </p>

      <h2 className="mt-3 text-2xl font-bold">
        Your Discoverability Bar
      </h2>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div className="text-4xl font-bold tracking-tight text-[#174b3a]">
          {percentage.toFixed(2)}%
        </div>

        <p className="text-sm text-[#5e6e64]">
          Maximum 100%
        </p>
      </div>

      <div
        className="mt-4 h-3 overflow-hidden rounded-full bg-[#e5ebe5]"
        role="progressbar"
        aria-label="Registration information participation"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className="h-full rounded-full bg-[#287a58] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-6 space-y-3 text-sm leading-7 text-[#5e6e64]">
        <p>
          Completing the required information is sufficient to create
          your MOTB-8 machine presence. Additional information increases
          this visual score, up to 100%.
        </p>

        <p>
          A score of 100 indicates that you have provided enough
          information to complete the website&apos;s participation
          checklist. Optional information may be distributed across
          different categories.
        </p>

        <p className="text-xs">
          This is a website participation indicator, not a measure of
          actual discoverability, reachability, performance,
          trustworthiness, or endorsement. It does not affect your
          MOTB-8 Tag or Beacon.
        </p>
      </div>
    </section>
  );
}
