# MOTB-8 Operator Guide: Create, Manage, Publish, and Verify

Status: Phase 23A.7 documentation
Repository: HouseMachine/MOTB-8-Web
Core: HouseMachine/MOTB-8

## 1. Purpose

MOTB-8 (Machine Open Tag & Beacon) is an open-source method
for identifying and describing independently discoverable
machine presences.

Its public proposition is "Make Your Machine Discoverable."

MOTB-8 does not require a central registry, conventional
user account, mandatory blockchain, or proprietary discovery service.

A MOTB-8 identity consists of a permanent Tag, a signed
Genesis Record, and a mutable signed Beacon.

The operator separately retains an encrypted Control File
used to authorize future Beacon updates.

## 2. The Four Core Components

### Permanent MOTB-8 Tag

The canonical Tag format is:

`([[!MOTB-8:1:<IDENTITY_PAYLOAD>:<CHECKSUM>]])`

The Tag is a persistent public identifier for one independently
discoverable machine presence.

The checksum detects certain transcription errors.
It does not authenticate the Tag or establish ownership.

### Genesis Record

The signed Genesis Record binds the Tag to an initial
Ed25519 controller public key and creation metadata.

A valid unanchored Genesis binding is self-asserted.
It does not independently establish original ownership
of a publicly copyable Tag.

### Beacon

The Beacon is a signed machine-readable description of
the machine presence.

It may contain the machine name, description, taxonomy,
capabilities, reachability, catalogs, protocols, profiles,
relationships, and structured attachments.

Authorized updates produce signed revisions while preserving
the permanent Tag and Genesis controller binding.

### Encrypted Control File

The Control File contains encrypted controller material
needed for future authorized updates.

It is private operator-held material and must never be
included in a public identity package.

The Control File passphrase must also remain private.

## 3. Create a Machine Identity

Visit https://motb8.com/create.

1. Enter the machine name, presence type, scope, and description.
2. Add any optional discovery information relevant to the machine.
3. Acknowledge the Good-Faith Participation terms.
4. Review and approve the registration information.
5. Generate the permanent MOTB-8 identity locally.
6. Save the generated public identity records.
7. Save the encrypted private Control File securely.

The Discoverability Bar helps operators describe their
machine presence. A score of 100% is not required to
generate an identity.

Identity generation creates a new permanent Tag.
Do not generate another identity merely to update
information about an existing machine.

### Identity Generation and Publication

Generating an identity does not automatically publish it.

The operator must separately make the public records
discoverable using a publication method of their choice.

The website does not operate a mandatory central registry.


## 4. Manage an Existing Identity

Visit https://motb8.com/manage.

To authorize an update, provide:

- The signed Genesis Record.
- The current signed Beacon.
- The encrypted Control File.
- The corresponding Control File passphrase.

The browser verifies the supplied records and controller
credentials before permitting authorized management.

### Update Procedure

1. Import and unlock the existing identity.
2. Edit the supported mutable Beacon fields.
3. Review the proposed changes.
4. Re-enter the Control File passphrase.
5. Sign and verify the next Beacon revision.
6. Download the updated signed Beacon.
7. Preserve the previous signed Beacon for revision history.
8. Separately publish the updated public record.

### Revision Continuity

Each authorized Beacon revision preserves the permanent Tag,
Genesis binding, original creation timestamp, and controller.

Revision numbers advance sequentially.

Each revision after the first contains the SHA-256 hash
of its complete signed predecessor Beacon.

Optional information may be added, modified, or removed
through authorized updates.

A signed revision is not automatically published or
established as the latest publicly available revision.


## 5. Backups, Security, and Recovery

The operator is responsible for preserving the files
required to manage an existing MOTB-8 identity.

### Recommended Backups

Retain secure copies of:

- The permanent MOTB-8 Tag.
- The signed Genesis Record.
- The initial signed Beacon.
- Every subsequent signed Beacon revision.
- The encrypted Control File.

Store the encrypted Control File separately from publicly
accessible records whenever practical.

Keep the Control File passphrase confidential and
protected independently of the encrypted file.

### Recovery Limitations

MOTB-8 v0.1 does not provide automatic controller
recovery or controller rotation.

Loss of the encrypted Control File or its usable
passphrase may permanently prevent authorized updates
under the current controller.

Creating another Tag does not recover control of the
original identity.

The website does not maintain an operator account
or server-side backup of private controller credentials.

### Browser Session Limitations

Generated and imported identity information is handled
locally in the browser.

Do not assume that refreshing, closing, or leaving the
page preserves unsaved information or generated revisions.

Download and securely retain all required artifacts
before ending the session.


## 6. Publish a Discoverable Machine Presence

Creating a valid MOTB-8 identity does not automatically
make the machine discoverable.

An operator may publish the permanent Tag and signed
public records through a website, machine profile,
public repository, or another accessible publication method.

### Public and Private Records

Public records:
- Permanent MOTB-8 Tag.
- Signed Genesis Record.
- Signed Beacon revisions.
- Optional public discovery information.

Private records:
- Encrypted Control File.
- Controller private key material.
- Control File passphrase.

Never place private records in a public repository,
website directory, or downloadable publication package.

### Example Static HTTPS Publication

An operator may choose a structure such as:

    https://example.org/machine/
      index.html
      genesis.json
      beacon.json
      revisions/
        beacon-revision-1.json
        beacon-revision-2.json

This is an illustrative hosting pattern, not a required
MOTB-8 directory structure or discovery endpoint.

The public page may display the permanent Tag and link
to the signed Genesis and Beacon JSON records.

Use stable, publicly accessible HTTPS URLs where practical.

The records should remain independently retrievable
without requiring an operator account.

### Discovery

Ordinary web crawlers may encounter the Tag in public
page content.

AI systems and MOTB-8-aware tools may locate linked
machine-readable records and examine their discovery fields.

Publishing a Tag does not guarantee indexing, retrieval,
recognition, or successful independent verification.

No central MOTB-8 registry or mandatory discovery service
is required.

## 7. Publishing Beacon Revisions

When machine information changes, operators should update
the existing Beacon rather than create a new MOTB-8 Tag.

After generating and downloading a signed revision:

1. Preserve the original Genesis Record.
2. Retain the previous signed Beacon.
3. Publish the new signed Beacon.
4. Update public links pointing to the current Beacon.
5. Make previous revisions available where practical.
6. Verify the published records after deployment.

The permanent Tag and Genesis binding remain unchanged.

### Revision History

Each successor Beacon references the SHA-256 hash
of its complete signed predecessor.

Independent verification of a revision pair confirms
the cryptographic relationship between those records.

A valid revision pair does not prove that the successor
is the latest published revision or that conflicting
successors do not exist.

Operators should preserve complete revision history
and avoid publishing conflicting successors.


## 8. Good-Faith Participation and Verification

MOTB-8 includes a Good-Faith Participation acknowledgment.

This acknowledgment records the operator's acceptance
of the applicable participation terms.

It is not an independent certification of lawful,
safe, trustworthy, or benevolent machine behavior.

### What Verification Can Establish

Depending on the supplied records, verification can establish:

- Whether the Tag syntax and checksum are valid.
- Whether the Genesis signature is valid.
- Whether a signed Beacon agrees with its Genesis binding.
- Whether the Beacon signature is valid.
- Whether a supplied revision follows its predecessor.
- Whether the same authorized controller maintains continuity.

### What Verification Does Not Establish

Verification alone does not establish:

- Original ownership of a publicly copyable Tag.
- That a machine's published claims are truthful.
- That the machine is safe, lawful, or trustworthy.
- That a Beacon is the latest published revision.
- That no conflicting Genesis binding or revision exists.
- That a machine operator has fulfilled Good-Faith obligations.

A valid unanchored Genesis binding is self-asserted.

Independent anchoring and additional verification mechanisms
may provide further evidence but are not mandatory
dependencies of MOTB-8.


## 9. Open-Source Resources

MOTB-8 core repository:
https://github.com/HouseMachine/MOTB-8

MOTB-8 website repository:
https://github.com/HouseMachine/MOTB-8-Web

Public website:
https://motb8.com

The core repository contains the reference implementation,
schemas, cryptographic verification logic, and technical
documentation.

The website provides browser-based Create and Manage
interfaces using the official MOTB-8 core package.

Developers may build compatible implementations without
requiring a central registry, proprietary account system,
or mandatory discovery provider.

## 10. Operational Summary

Create the identity once.

Protect the controller credentials.

Publish the permanent Tag and signed public records.

Update the Beacon through authorized signed revisions.

Preserve revision history.

Verify cryptographic relationships independently.

Do not confuse discoverability, cryptographic verification,
Good-Faith acknowledgment, and demonstrated trustworthiness.
