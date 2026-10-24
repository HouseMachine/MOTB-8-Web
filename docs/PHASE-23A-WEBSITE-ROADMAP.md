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
| 23A.2 | Website Foundation and Navigation | BUILT - PUSH PENDING |
| 23A.3 | Create and Beacon Editor | IN PROGRESS |
| 23A.4 | Browser Cryptographic Integration | NOT STARTED |
| 23A.5 | Complete Create Experience | NOT STARTED |
| 23A.6 | Manage and Beacon Updates | NOT STARTED |
| 23A.7 | Documentation and Publishing Guidance | NOT STARTED |
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
Status: BUILT - PUSH PENDING.

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
Status: IN PROGRESS.

### 23A.4 — Browser Cryptographic Integration
- Compatible Tag generation and checksum.
- Browser-local Ed25519 controller generation.
- Genesis and Beacon signing.
- Compatible scrypt and AES-256-GCM Control File.
- Cross-verification against core v0.1.0.
- Private-key and passphrase isolation.
Status: NOT STARTED.

### 23A.5 — Complete Create Experience
- Six-stage creation workflow.
- Signed artifact generation and verification.
- Your Machine Is Marked confirmation.
- Control File download and backup guidance.
- Public artifact exports.
Status: NOT STARTED.

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

Step 36J — Attachment JSON editing and validation.

AttachmentJsonEditor.tsx has been created and integrated into
OptionalBeaconFields.tsx.

Next:
1. Verify build and browser behavior.
2. Propagate invalid JSON state to the parent form.
3. Complete optional-field validation.
4. Implement Good-Faith acknowledgment.
5. Implement Discoverability Bar.

Update this document whenever a subphase reaches its completion gate.
