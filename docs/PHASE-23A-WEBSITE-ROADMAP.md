# Phase 23A — MOTB-8 Website Design & Build

Status: IN PROGRESS
Repository: HouseMachine/MOTB-8-Web
Branch: main only
Website: https://motb8.com
Core software: HouseMachine/MOTB-8 v0.1.0

## Project Doctrine

- MOTB-8 is independent of Monet and all associated brands.
- Keep the website simple, open source, and ecosystem-neutral.
- No mandatory accounts, central registry, or search index.
- Private controller keys and passphrases remain browser-local.
- Preserve compatibility with the MOTB-8 core specification.
- All supported optional Beacon fields are available at creation.
- Create and Manage share reusable Beacon editing components.
- Use main exclusively. No development or feature branches.
- At each completed subphase: test, verify, commit, push, and verify Vercel.
- Do not expose unfinished identity-generation functionality.

## Subphase Status

| Subphase | Description | Status |
|---|---|---|
| 23A.1 | Infrastructure and Hosting | COMPLETE |
| 23A.2 | Website Foundation and Navigation | COMPLETE |
| 23A.3 | Create and Beacon Editor | COMPLETE |
| 23A.4 | Browser Cryptographic Integration | COMPLETE |
| 23A.5 | Complete Create Experience | IMPLEMENTED - FINAL ACCEPTANCE PENDING |
| 23A.6 | Manage and Beacon Updates | IMPLEMENTED - FINAL ACCEPTANCE PENDING |
| 23A.7 | Documentation and Publishing Guidance | IMPLEMENTED - RELEASE VERIFICATION PENDING |
| 23A.8 | UX, Security and Compatibility QA | NOT STARTED |
| 23A.9 | MVP Release and Verification | NOT STARTED |

## Completion Gates

### 23A.1 — Infrastructure and Hosting
- GitHub repository established.
- Next.js foundation installed.
- Vercel connected.
- motb8.com and HTTPS verified.
Status: COMPLETE.

### 23A.2 — Website Foundation and Navigation
- Homepage implemented.
- Create, Manage, and Docs routes created.
- Navigation connected.
- Four-route production build passed.
- Commit and push verified.
Status: COMPLETE.

### 23A.3 — Create and Beacon Editor
- Required fields and conditional inputs.
- All optional Beacon categories.
- Repeatable field editing.
- Editable and validated attachment JSON.
- Schema-compatible form validation.
- Good-Faith acknowledgment.
- Discoverability Bar.
- Browser interaction tests.
- Production build, commit, push, deployment verification.
Status: COMPLETE.

### 23A.4 — Browser Cryptographic Integration
- Compatible Tag generation and checksum.
- Browser-local Ed25519 controller generation.
- Genesis and Beacon signing.
- Compatible scrypt and AES-256-GCM Control File.
- Cross-verification against core v0.1.0.
- Private-key and passphrase isolation.
Status: CORE COMPLETE - INTEGRATED INTO WEBSITE.

### 23A.5 — Complete Create Experience
- Six-stage creation workflow.
- Signed artifact generation and verification.
- Your Machine Is Marked confirmation.
- Control File download and backup guidance.
- Public artifact exports.
Status: IN PROGRESS - CHECKPOINTS 1-4 IMPLEMENTED.

### 23A.6 — Manage and Beacon Updates
- Load Control File and public records.
- Unlock locally.
- Edit supported Beacon fields.
- Preserve permanent Tag and Genesis binding.
- Sign and export revisions.
- Verify complete update lifecycle.
Status: NOT STARTED.

### 23A.7 — Documentation and Publishing Guidance
- Core concepts and open-source resources.
- Create and Manage instructions.
- Backup and recovery limitations.
- Publication and discovery guidance.
- Good-Faith and verification limitations.
Status: NOT STARTED.

### 23A.8 — UX, Security and Compatibility QA
- Desktop and mobile testing.
- Accessibility.
- Schema and cryptographic regression tests.
- Secret-handling verification.
- Browser compatibility.
- Final MVP design refinements.
Status: NOT STARTED.

### 23A.9 — MVP Release and Verification
- Final production build.
- GitHub synchronization.
- Vercel production verification.
- Live Create and Manage smoke tests.
- Release notes and limitations.
Status: NOT STARTED.

## Git Checkpoints

- 309e3dd — Next.js website foundation.
- 480098d — MVP homepage implementation.
- 7f9d01d — Generated Next.js type-reference cleanup.
- 07e72ce — Four-page routes and navigation.

## Current Development Position

Phase 23A.3 - Create and Beacon Editor
Status: COMPLETE - production verified
Date: 2026-10-25

Completed implementation:
- Required and conditional registration fields.
- All eight optional Beacon information categories.
- Repeatable field editing and attachment JSON validation.
- Good-Faith Participation v1.0 acknowledgment.
- Discoverability Bar with flexible 100-point participation scoring.
- Canonical Industry Taxonomy v0.1 selector with custom classifications.
- Beacon registration normalization.
- Registration-field validation derived from Beacon v1.1 schema.

Verification:
- 32 automated tests passed.
- TypeScript validation passed.
- Next.js 16.4.3 production build passed.
- Seven browser acceptance checks passed.
- Core taxonomy and Beacon schema copies verified by SHA-256.

Remaining release gates:
1. Commit and push Phase 23A.3 to main.
2. Verify GitHub synchronization.
3. Verify Vercel production deployment.
4. Mark Phase 23A.3 COMPLETE.

Deferred:
- Automatic registration draft persistence: Phase 23A.8.
- Complete signed Beacon generation: Phases 23A.4-23A.5.

Next subphase:
23A.4 - Browser Cryptographic Integration.


## Phase 23A.3 Release Record

- Completed: 2026-10-25
- Commit: 25b149b
- Branch: main
- Automated tests: 32 passed
- Browser acceptance: 7 checks passed
- Production build: passed
- GitHub: pushed and synchronized
- Vercel: production website verified
- Next: Phase 23A.4 - Browser Cryptographic Integration


## Phase 23A.4 Core Integration Record

- Core repository: HouseMachine/MOTB-8
- Core commit: e17c225
- Branch: main
- Browser-compatible core implementation committed and pushed.
- 290 automated core tests passed.
- Targeted ESLint checks passed.
- TypeScript and browser production builds passed.
- Real-browser cryptographic acceptance passed.
- npm audit: zero reported vulnerabilities.
- Browser package entry point: motb-8/browser.
- Experimental browser-adapter backup deleted.
- Website integration remains part of the Complete Create Experience.
- No public identity-generation functionality is enabled yet.

Next: Phase 23A.5 - Complete Create Experience.

## Phase 23A.5 Implementation Progress

Status: IN PROGRESS
Current checkpoint: 23A.5.6 - Completion Experience
Core dependency: HouseMachine/MOTB-8 commit 02fdd99
Website checkpoint: a7dc505

### Completed Implementation

- 23A.5.1 - Core Package Integration
  - Official motb-8/browser package integrated.
  - Initial website integration commit: 3c4cbdc.
  - Browser Beacon verification added to core at 02fdd99.
  - Website dependency updated at 0919288.

- 23A.5.2 - Registration Adapter
  - Form normalization and canonical registration validation.
  - Good-Faith acknowledgment preparation.
  - Core unsigned Beacon compatibility.
  - Commit: 948d027.

- 23A.5.3 - Create Workflow Controller
  - Editing, review, and approval states.
  - Deterministic registration fingerprints.
  - Stale approval detection and review invalidation.
  - Public registration review interface.
  - Commit: 3971a7c.

- 23A.5.4 - Identity Generation and Verification
  - Isolated browser-local identity-generation service.
  - Permanent Tag and Ed25519 controller generation.
  - Signed Genesis and initial Beacon v1.1.
  - Cryptographic verification of generated records.
  - Seven synthetic generation tests passed.
  - Commit: a7dc505.

### Outstanding Release Verification

- Confirm Vercel deployment for website commit a7dc505.
- Confirm the latest 54-test website regression run.
- Complete the Control File and download lifecycle.
- Implement the full six-stage Create interface.
- Implement duplicate-generation protection.
- Complete real-browser end-to-end acceptance.
- Perform the first production identity trial.

### Security Boundary

Identity generation is implemented as an isolated service.
It is not exposed through the public Create interface.

Private controller credentials remain browser-local.
Encrypted Control File creation and secure downloads are pending.

The first permanent production identity is reserved for the
MOTB-8 Website service acceptance trial.

See PHASE-23A5-CREATE-IMPLEMENTATION.md.
See MOTB8-FIRST-IDENTITY-ACCEPTANCE.md.

## Phase 23A.5.5 Control File and Downloads Release Record

Status: IMPLEMENTED AND TESTED - DEPLOYMENT PENDING
Date: 2026-10-27

### Implementation

- Browser-local encrypted Control File preparation.
- Genesis-bound controller recovery verification.
- Separate public Tag, Genesis, and Beacon artifacts.
- Separate private encrypted Control File artifact.
- Cryptographic Control File binding during packaging.
- Browser-local downloads with object URL cleanup.
- No automatic publication or server-side key custody.

### Security Verification

- Incorrect passphrase rejected.
- Tampered ciphertext rejected.
- Unrelated Genesis rejected.
- Mismatched controller rejected.
- Same-Tag substituted Control File rejected.
- Recovered private key confirmed non-extractable.

### Acceptance Results

- Generation and security tests: 14 passed.
- Website and download tests: 58 passed.
- Total automated tests: 72 passed, zero failures.
- TypeScript, ESLint, and production build passed.
- Chrome download and reimport acceptance passed.

Four synthetic artifacts were downloaded in Chrome.
After reloading the page, downloaded Genesis, Beacon,
and encrypted Control File records were reimported.

Genesis and Beacon verification succeeded.
The Control File unlocked against Genesis.

The temporary browser acceptance harness was removed.

### Remaining Work

- Complete public-facing Create workflow.
- Prevent concurrent or duplicate generation.
- Require explicit operator backup acknowledgment.
- Complete end-to-end acceptance.
- Perform first real MOTB-8 Website identity trial.

The public Generate action remains unavailable.

## Phase 23A.5.6 Completion Experience Release Record

Status: IMPLEMENTED AND TESTED - DEPLOYMENT PENDING
Date: 2026-10-27

### Completed Implementation

- Integrated browser-local identity generation into Create.
- Added guarded lifecycle controller.
- Prevented concurrent generation within a lifecycle instance.
- Preserved permanent identity across retryable failures.
- Retained encrypted Control File across packaging retries.
- Added Control File passphrase confirmation.
- Connected public and private artifact downloads.
- Added explicit operator backup acknowledgment.
- Added Your Machine Is Marked completion confirmation.
- Locked registration editing after identity creation.
- Improved disabled-field styling and button presentation.

### Verification

- 20 generation, security, and lifecycle tests passed.
- 58 website and download tests passed.
- 78 total automated tests passed.
- TypeScript, ESLint, and production build passed.
- Local Chrome Create workflow acceptance passed.
- Synthetic identity generated and artifacts downloaded.
- Operator backup acknowledgment and completion verified.
- Registration locking verified.

### Security Boundaries

- No server-side controller custody.
- No automatic public publication.
- No global duplicate-identity registry.
- Download initiation does not guarantee durable backup.
- VALID_UNANCHORED does not establish original Tag ownership.
- First production MOTB-8 Website identity remains reserved
  for the final production acceptance trial.

### Remaining Work

- Final cross-browser and compatibility acceptance.
- Full release security and UX review.
- Production identity acceptance trial.
