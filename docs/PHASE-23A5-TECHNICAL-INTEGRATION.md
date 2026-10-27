# Phase 23A.5 - Technical Integration Reference

Status: IN PROGRESS
Repository: HouseMachine/MOTB-8-Web
Branch: main only
Core repository: HouseMachine/MOTB-8
Pinned core commit: 02fdd99
Website implementation checkpoint: a7dc505
Updated: 2026-10-27

## Purpose

Document the technical implementation of MOTB-8 Website identity creation
through Phase 23A.5.4.

This is a developer reference, not an assertion that the complete
public Create experience has been released.

## Architecture and Responsibility

The website owns registration forms, validation orchestration,
public-information review, workflow state, and user experience.

The MOTB-8 core owns permanent Tag generation, Ed25519 controller
generation, Genesis and Beacon signing, cryptographic verification,
and Control File encryption.

The browser entry point is motb-8/browser.

No mandatory accounts, centralized registry, or server-side
custody of controller credentials are required.

## Implementation Files

| File | Responsibility |
|---|---|
| src/components/create/PresenceForm.tsx | Registration and public review interface |
| src/components/beacon/normalize.ts | Normalize registration fields |
| src/components/beacon/schema-validation.ts | Registration schema validation |
| src/lib/motb8/registration.ts | Prepare validated registration and Good-Faith metadata |
| src/lib/motb8/workflow.ts | Review and approval transitions |
| src/lib/motb8/fingerprint.ts | Deterministic registration change detection |
| src/lib/motb8/generate-identity.ts | Isolated browser-local identity generation |
| scripts/test-generation.mjs | ESM generation test runner |

## Current Implementation Boundary

Registration review and approval are connected to the Create page.

Identity generation is implemented as an isolated service but is not
connected to a publicly enabled Generate action.

The complete Control File, downloads, and completion workflow remain pending.

## Registration Preparation

prepareMotb8Registration validates the existing Beacon form,
normalizes supported fields, checks the registration schema,
and requires explicit Good-Faith acknowledgment.

The prepared registration contains public Beacon information
and the Good-Faith acknowledgment metadata.

Generated fields such as the permanent Tag, controller, proof,
timestamps for signed records, and revision metadata are not
accepted as registration inputs.

## Review and Approval

The workflow controller currently supports three states:

1. editing
2. review
3. approved

Review requires registration readiness.

Approval requires the review state and a registration fingerprint.

The fingerprint uses deterministic JSON canonicalization to detect
changes in normalized public registration information.

It is not a cryptographic signature or ownership proof.

If the current registration no longer matches the approved
fingerprint, generation readiness becomes false.

The generation service rechecks approval and registration
validity before generating an identity.

The complete six-stage user interface and duplicate-generation
prevention remain pending.

## Identity Generation Sequence

The isolated generateMotb8Identity service performs:

1. Normalize the current registration.
2. Calculate its deterministic fingerprint.
3. Validate registration and Good-Faith participation.
4. Confirm the registration is approved and unchanged.
5. Generate a permanent MOTB-8 Tag.
6. Generate a browser-local Ed25519 controller.
7. Create a signed Genesis Record.
8. Construct the initial unsigned Beacon v1.1.
9. Validate the unsigned Beacon.
10. Sign the Beacon using the controller.
11. Verify the signed Genesis Record.
12. Verify the signed Beacon against Genesis.
13. Return the verified artifacts and controller in memory.

The initial Beacon uses:

- schemaVersion: 1.1
- revision: 1
- status: active
- createdAt matching Genesis
- updatedAt matching createdAt
- no previousBeaconHash

The Genesis and Beacon must agree on the permanent Tag
and initial controller public key.

## Verification Semantics

The core browser API provides:

- verifyBrowserGenesisRecord
- verifyBrowserBeacon
- validateUnsignedBrowserBeaconStructure
- validateBrowserBeaconStructure

Valid self-signed Genesis records currently report VALID_UNANCHORED.

This establishes cryptographic consistency under the declared
controller key, not independently established original ownership.

The browser Beacon verifier was added to the core at commit 02fdd99.

Core verification acceptance:

- 298 automated tests passed.
- Eight browser/Node Beacon parity tests passed.
- Eleven Chrome browser acceptance checks passed.

## Testing

The website uses tsx for existing registration, workflow,
fingerprint, and discoverability tests.

Generation tests require a dedicated ESM runner because the
official browser package exposes an ESM import condition.

Run generation tests:

    npm run test:generation

The runner bundles local TypeScript dependencies using esbuild,
preserves motb-8/browser as an external ESM import, executes
the test in Node, and removes its temporary bundle afterward.

Seven generation tests passed at checkpoint a7dc505.

Run the production checks:

    npx tsc --noEmit
    npm run lint
    npm run build

The latest 54-test website regression remains a release
verification item until its rerun is confirmed.

## Security Boundaries

- Cryptographic operations must execute browser-locally.
- Private controller credentials and passphrases must not be sent
  to MOTB-8 servers.
- No unencrypted private key may be included in public artifacts.
- The generated controller currently contains an extractable
  private key in browser memory.
- The next checkpoint must encrypt the Control File before
  the complete Create experience can report success.
- Do not log or serialize private controller credentials.
- Do not enable public generation before safe downloads are ready.
- Prevent concurrent and accidental duplicate generation.
- Preserve the permanent Tag and Genesis controller binding.
- Do not equate Good-Faith acknowledgment with endorsement.
- Do not equate VALID_UNANCHORED with independently verified ownership.

## Remaining Implementation

23A.5.5 - Control File encryption and downloads.
23A.5.6 - Complete user-facing creation experience.
23A.5.7 - Real-browser end-to-end acceptance.
23A.5.8 - Release and first real MOTB-8 Website identity trial.

The first real production identity will represent the
MOTB-8 Website service, not the abstract protocol specification.

See MOTB8-FIRST-IDENTITY-ACCEPTANCE.md.
See PHASE-23A5-CREATE-IMPLEMENTATION.md.
See PHASE-23A-WEBSITE-ROADMAP.md.
