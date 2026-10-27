# Phase 23A.5 — Complete Create Experience

Status: IN PROGRESS - CHECKPOINTS 23A.5.1 THROUGH 23A.5.5 IMPLEMENTED
Repository: HouseMachine/MOTB-8-Web
Branch: main
Core repository: HouseMachine/MOTB-8
Core checkpoint: e17c225

## Objective

Deliver a complete browser-based MOTB-8 identity creation experience using the official MOTB-8 core browser package.

The website provides the user interface. The core provides identity generation, cryptographic signing, verification, and Control File encryption.

No mandatory accounts, centralized registry, search index, or server custody of private keys.

## Architecture

The website handles registration, validation, and user experience. The MOTB-8 core handles identity generation and cryptography.

Public artifacts include the permanent Tag, signed Genesis Record, and signed Beacon. Private artifacts include the encrypted Control File and controller credentials.

## Architecture Diagram

Website Create Form -> Registration Validation -> MOTB-8 Core Browser API
Core Browser API -> Permanent Tag + Signed Genesis + Signed Beacon
Core Browser API -> Encrypted Control File
Public records -> Publication and Discoverability
Private Control File -> Browser-Local Download

## Six-Stage Create Workflow

### Stage 1 - Create Your Machine Presence
- Enter required machine information.
- Select presence scope and type.
- Complete conditional and optional Beacon fields.
- Reuse existing Beacon editor components.

### Stage 2 - Review Discoverability and Good-Faith
- Validate registration and optional information.
- Display Registration Readiness and Discoverability Bar.
- Require Good-Faith acknowledgment.
- A 100% discoverability score is not required.

### Stage 3 - Generate Your MOTB-8 Identity
- Generate the permanent Tag using motb-8/browser.
- Generate a browser-local Ed25519 controller.
- Create the signed Genesis Record and initial Beacon.
- Prevent accidental duplicate identity generation.

### Stage 4 - Verify Your Machine Identity
- Verify Tag syntax and checksum.
- Verify Genesis and Beacon signatures.
- Confirm Tag and controller agreement.
- Preserve VALID_UNANCHORED where applicable.
- Self-signing does not independently prove original Tag ownership.

### Stage 5 - Save Your Control Key
- Obtain a user-selected passphrase.
- Encrypt controller credentials locally.
- Download the encrypted Control File.
- Explain backup and recovery limitations.
- Never transmit private keys or passphrases to a server.

### Stage 6 - Your Machine Is Marked
- Display the permanent MOTB-8 Tag.
- Provide signed Genesis and Beacon downloads.
- Explain public publication and discoverability.
- Provide instructions for returning to Manage.

## Implementation Checkpoints

### 23A.5.1 - Core Package Integration
- Import the official motb-8/browser package.
- Verify compatibility with Next.js.
- Do not duplicate core cryptographic code.

### 23A.5.2 - Registration Adapter
- Connect existing form normalization to core inputs.
- Preserve all supported optional Beacon fields.
- Validate against the canonical schema.

### 23A.5.3 - Create Workflow Controller
- Implement six-stage navigation and readiness gates.
- Prevent generation when registration is invalid.
- Prevent accidental duplicate identity creation.

### 23A.5.4 - Identity Generation and Verification
- Generate Tag, controller, Genesis, and signed Beacon.
- Verify signatures and controller continuity.

### 23A.5.5 - Control File and Downloads
- Encrypt credentials locally with a passphrase.
- Export private and public artifacts separately.
- Provide clear backup guidance.

### 23A.5.6 - Completion Experience
- Display Your Machine Is Marked confirmation.
- Show the permanent Tag and publishing guidance.

### 23A.5.7 - End-to-End Acceptance
- Test the complete workflow in a real browser.
- Verify invalid inputs, downloads, and security.

### 23A.5.8 - Release and First Identity Trial
- Complete build, lint, tests, commit, and push.
- Verify Vercel production deployment.
- Register the MOTB-8 Website as the first real identity.
- Verify public publication and independent retrieval.

## Security Requirements

- All cryptographic operations execute locally in the browser.
- Private controller keys and passphrases never go to the server.
- No accidental duplicate identity generation.
- No public disclosure of private controller credentials.
- Invalid registration information blocks generation.
- Discoverability does not require a 100% score.
- Sensitive optional Beacon information must be gated.
- Recovered signing keys remain non-extractable.
- Preserve canonical schemas and Control File compatibility.
- VALID_UNANCHORED does not establish independent original ownership.

## Development Doctrine

- Work on main only.
- Reuse existing Create and Beacon editor components.
- Use the official MOTB-8 browser core package.
- Do not duplicate core cryptographic implementations.
- Make targeted code changes only.
- No repository-wide lint or Prettier autofixes.
- Do not expose unfinished identity generation in production.
- Test, verify, commit, push, and verify deployment.

## Scope Exclusions

No mandatory accounts, central registry, mandatory blockchain anchoring, search indexing, controller rotation, or complete Manage workflow.

## Completion Criteria

Users can create and verify a permanent MOTB-8 identity, download public signed records, and securely retain an encrypted Control File without transmitting private credentials.

The first real-world identity trial will register the MOTB-8 Website service.

See MOTB8-FIRST-IDENTITY-ACCEPTANCE.md.

## Implementation Record - October 2026

Current checkpoint: 23A.5.6 - Completion Experience
Website commit: a7dc505
Pinned core commit: 02fdd99

### 23A.5.1 - Core Package Integration

Status: COMPLETE

- Installed the official MOTB-8 browser package from GitHub.
- Pinned the core dependency to an immutable commit.
- Confirmed Next.js compatibility and production builds.
- Verified browser cryptographic exports.
- Added browser Beacon verification to the core.
- Confirmed browser and Node verification parity.

Website commits: 3c4cbdc, 0919288
Core verifier commit: 02fdd99

### 23A.5.2 - Registration Adapter

Status: COMPLETE

- Added src/lib/motb8/registration.ts.
- Reused existing Beacon form normalization.
- Validated registration against the canonical Beacon schema.
- Preserved optional fields and conditional presence information.
- Prepared Good-Faith acknowledgment metadata.
- Excluded generated identity fields from registration input.
- Verified compatibility with the core unsigned Beacon validator.

Commit: 948d027
Dedicated tests: 10 passed

### 23A.5.3 - Create Workflow Controller

Status: COMPLETE FOR REVIEW AND APPROVAL

- Added workflow.ts and fingerprint.ts.
- Implemented editing, review, and approved states.
- Added deterministic registration change detection.
- Required explicit public-information review.
- Invalidated approval when registration content changes.
- Added generation-readiness checks.
- Connected review and approval controls to PresenceForm.

Commit: 3971a7c
Workflow tests: 7 passed
Fingerprint tests: 5 passed

Remaining:
- Complete six-stage navigation.
- Prevent accidental concurrent or duplicate generation.

### 23A.5.4 - Identity Generation and Verification

Status: IMPLEMENTED - RELEASE VERIFICATION PENDING

- Added src/lib/motb8/generate-identity.ts.
- Reused the official motb-8/browser cryptographic API.
- Generated permanent Tags and Ed25519 controllers.
- Created signed Genesis Records.
- Constructed initial signed Beacon v1.1 records.
- Used revision 1 with no predecessor hash.
- Verified Genesis and Beacon cryptographic consistency.
- Preserved VALID_UNANCHORED verification status.
- Rejected missing approval, stale review, and invalid registration.
- Added an isolated ESM test runner.

Commit: a7dc505
Dedicated generation tests: 7 passed

Remaining:
- Confirm Vercel deployment for a7dc505.
- Confirm the latest 54-test website regression.
- Integrate secure Control File creation and downloads.
- Keep public generation disabled until the complete lifecycle is ready.

### Verification and Security Notes

- The browser core owns Tag generation, signing, and verification.
- The website does not implement independent cryptographic algorithms.
- Controller credentials remain browser-local.
- The generation service currently retains an extractable private key
  in memory for subsequent encrypted Control File creation.
- No server-side private-key custody is implemented.
- No automatic publication occurs during identity generation.
- Synthetic test identities are disposable and unpublished.
- VALID_UNANCHORED confirms self-signed consistency, not
  independently established original ownership.

### Next Checkpoint

23A.5.5 - Control File and Downloads

Implement browser-local encryption, private Control File download,
public artifact exports, backup guidance, and recovery verification.

The public Generate action must remain unavailable until the complete
security and download lifecycle has been implemented and tested.

## Phase 23A.5.5 Implementation Record

Status: IMPLEMENTED AND TESTED
Date: 2026-10-27

### Control File Preparation

File: src/lib/motb8/control-file.ts

- Uses official MOTB-8 browser encryption.
- Verifies Genesis and Beacon before encryption.
- Encrypts controller credentials locally.
- Verifies Genesis-bound controller recovery.
- Confirms recovered private key is non-extractable.

### Artifact Packaging

File: src/lib/motb8/artifacts.ts

- Separates public Tag, Genesis, and Beacon records.
- Separates private encrypted Control File.
- Verifies signed public records.
- Independently verifies Control File recovery.
- Rejects same-Tag controller substitution.

### Browser Downloads

File: src/lib/motb8/download.ts

- Uses browser Blob and object URL APIs.
- Creates temporary download anchors.
- Assigns filenames and MIME types.
- Cleans up temporary object URLs.
- Handles download initiation errors.

Download initiation does not prove durable backup.

### Automated Tests

- 14 generation and security tests passed.
- 58 website and download tests passed.
- 72 total tests passed.
- TypeScript, ESLint, and production build passed.

### Chrome Acceptance

The temporary browser harness successfully tested:

1. Synthetic identity generation.
2. Encrypted Control File preparation.
3. Public and private artifact packaging.
4. Four artifact downloads.
5. Browser page reload.
6. Reimport of downloaded JSON files.
7. Genesis and Beacon verification.
8. Genesis-bound controller recovery.

All acceptance steps passed.
The temporary harness was removed.

### Security Boundary

- No production identity was generated.
- No public artifact publication occurred.
- No server-side private-key custody was introduced.
- Public Generate action remains unavailable.
- Operator backup confirmation remains pending.

Next: Phase 23A.5.6 - Completion Experience.
