# Phase 23A.5 — Complete Create Experience

Status: PLANNED
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
