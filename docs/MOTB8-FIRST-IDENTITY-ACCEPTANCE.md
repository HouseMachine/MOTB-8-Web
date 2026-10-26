# MOTB-8 - First Identity Acceptance Plan

Status: PLANNED
Repository: HouseMachine/MOTB-8-Web
Related phase: 23A.5
Core checkpoint: e17c225

## Purpose

The first real MOTB-8 identity created through the completed website will represent the MOTB-8 Website service at https://motb8.com.

This identity represents the operated website service, not the abstract MOTB-8 protocol specification.

This will be a real-world production acceptance trial, not a synthetic test.

## Proposed Registration

| Field | Proposed Value |
|---|---|
| Name | MOTB-8 Website |
| Presence Scope | single |
| Presence Type | other |
| Custom Presence Type | Website Service |
| Public Website | https://motb8.com |
| Industry Taxonomy | Custom / Other, subject to schema validation |
| Good-Faith | Explicit controller acknowledgment |

## Proposed Description

A public website providing access to the open-source MOTB-8 protocol, enabling autonomous systems and their operators to create persistent machine identifiers, describe their capabilities, and publish discoverable machine-presence information.

## Classification

Presence Type and Industry Taxonomy are separate classifications.
The final registration must conform to the canonical Beacon schema while preserving custom taxonomy support.

## Identity Artifacts

The website will generate:
- One permanent MOTB-8 Tag.
- One browser-local Ed25519 controller.
- One signed Genesis Record.
- One signed initial Beacon.
- One encrypted Control File.

The permanent Tag must not be regenerated during retries or downloads.

## Verification Requirements

- Verify Tag format and checksum.
- Verify Genesis and Beacon signatures.
- Confirm permanent Tag agreement.
- Confirm controller continuity.
- Validate against canonical schemas.
- Preserve the correct Genesis verification status.

VALID_UNANCHORED confirms self-signed cryptographic consistency, not independently established original ownership.

## Public and Private Artifacts

Public: permanent Tag, signed Genesis, signed Beacon, and publication references.

Private: encrypted Control File, passphrase, and sensitive recovery information.

Private controller credentials and passphrases must never be transmitted to MOTB-8 servers or published.

## Publication and Discoverability

Creating an identity does not automatically make it discoverable.
- Publish public Genesis and Beacon records at an accessible location.
- Proposed publication location: https://motb8.com.
- Verify independent retrieval of published records.
- Verify retrieved records cryptographically.
- Confirm no private controller information was disclosed.
- No centralized MOTB-8 registry is required.

## Real-World Acceptance Checklist

- [ ] Complete the website Create form.
- [ ] Select the appropriate custom classification.
- [ ] Acknowledge Good-Faith participation.
- [ ] Pass registration validation.
- [ ] Generate the permanent Tag exactly once.
- [ ] Generate and verify the signed Genesis.
- [ ] Generate and verify the signed Beacon.
- [ ] Encrypt controller credentials locally.
- [ ] Download and securely back up the Control File.
- [ ] Export public Genesis and Beacon records.
- [ ] Publish the public identity records.
- [ ] Retrieve the published records independently.
- [ ] Verify retrieved records using the MOTB-8 core.
- [ ] Confirm no private credentials were disclosed.
- [ ] Record the permanent Tag and publication locations.

## Permanent Identity Record

Complete this section only after successful production creation.

Permanent MOTB-8 Tag: NOT YET GENERATED

Creation Date: PENDING

Genesis Verification Status: PENDING

Public Genesis Location: PENDING

Public Beacon Location: PENDING

Control File Backup: PRIVATE - CONFIRMATION PENDING

## Completion Gate

The MOTB-8 Website service has one permanent identity, verified signed records, securely retained controller credentials, and independently retrievable public artifacts.

Do not claim independently anchored ownership unless independent anchoring has actually been implemented and verified.

Preserve the permanent Tag for future authorized Beacon updates.
