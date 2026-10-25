# MOTB-8 Website — Discoverability Bar

**Phase:** 23A.3
**Status:** Approved website design; implementation testing in progress

## Purpose

The Discoverability Bar is a dynamic, participatory visual
within the MOTB-8 website registration experience.

It is not part of the MOTB-8 identification protocol.

The score does not determine whether a machine can receive
a Tag, publish a Beacon, or participate in MOTB-8.

## Scoring Model

Maximum displayed score: 100.00%.

Required-information milestone: 38.48%.

Required scoring contributions:

- Machine Name: 15.41
- Description: 15.38
- Good-Faith Participation: 7.69
- Presence Scope: 0.00
- Presence Type: 0.00

Presence Scope and Presence Type remain required
registration information but do not earn visual points.

Eight optional information categories contribute
7.69 points each, totaling 61.52 points.

The 13 baseline categories total 100.00 points.

## Additional Entries

Additional populated, qualifying entries contribute
2.56 points each beyond their first qualifying entry.

There is no diminishing-return calculation,
duplicate policing, or arbitrary entry-count limit.

Additional contributions can compensate for
unpopulated optional categories.

The displayed score and visual bar stop at 100%.

The score is recalculated from current form information.
Removing information may reduce the displayed score.

## Registration Independence

An operator may create a MOTB-8 machine presence
using only the required information.

A score of 100 is not required for registration.

The score does not affect Tag generation,
Genesis Records, Beacon signing, or verification.

## Website Explanation

Completing the required information is sufficient
to create your MOTB-8 machine presence.

Additional information increases this visual
participation score, up to 100%.

A score of 100 indicates that enough information
has been provided to complete the website's
participation checklist.

Optional information may be distributed
across different categories.

This is a website participation indicator,
not a measure or guarantee of actual discoverability,
reachability, performance, trustworthiness,
reputation, or endorsement.

## Implementation

- Scoring weights: src/components/discoverability/types.ts
- Baseline calculation: src/components/discoverability/scoring.ts
- Additional-entry calculation:
  src/components/discoverability/calculate-bonuses.ts
- Visual component:
  src/components/discoverability/DiscoverabilityBar.tsx
- Automated tests: tests/discoverability*.test.mts

All point calculations use integer hundredths
to avoid floating-point rounding errors.

The Discoverability Bar is website presentation logic.
It must not become a field in the signed Beacon
or immutable Genesis Record.
