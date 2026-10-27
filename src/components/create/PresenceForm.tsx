"use client";

import { useState } from "react";
import OptionalBeaconFields from "@/components/beacon/OptionalBeaconFields";
import type { BeaconFormData } from "@/components/beacon/types";
import { validateBeaconForm } from "@/components/beacon/validation";
import { calculateDiscoverability } from "@/components/discoverability/scoring";
import DiscoverabilityBar from "@/components/discoverability/DiscoverabilityBar";
import type { AttachmentDraftState } from "@/components/beacon/attachment-draft";
import { normalizeBeaconRegistration } from "@/components/beacon/normalize";
import { validateRegistrationSchema } from "@/components/beacon/schema-validation";
import { registrationFingerprint } from "@/lib/motb8/fingerprint";
import { beginReview, approveReview, invalidateReview, isReviewCurrent, initialCreateWorkflowState } from "@/lib/motb8/workflow";

type PresenceScope = "single" | "composite";

type PresenceType =
  | "agent"
  | "machine"
  | "swarm"
  | "gateway"
  | "robot"
  | "iot-system"
  | "other";

export default function PresenceForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<PresenceScope>("single");
  const [type, setType] = useState<PresenceType>("agent");
  const [customType, setCustomType] = useState("");
  const [systemCount, setSystemCount] = useState(2);
  const [goodFaithAcknowledged, setGoodFaithAcknowledged] = useState(false);
  const [workflow, setWorkflow] = useState(initialCreateWorkflowState);
  const [reviewFingerprint, setReviewFingerprint] = useState<string | null>(null);


  const [attachmentDrafts, setAttachmentDrafts] =
    useState<AttachmentDraftState[]>([]);

  const [optionalData, setOptionalData] = useState<
    Pick<
      BeaconFormData,
      | "taxonomy"
      | "capabilities"
      | "reachability"
      | "profiles"
      | "catalogs"
      | "protocols"
      | "relationships"
      | "attachments"
    >
  >({
    taxonomy: [],
    capabilities: [],
    reachability: [],
    profiles: {
      developers: [],
      organizations: [],
      links: [],
    },
    catalogs: {
      native: [],
      external: [],
    },
    protocols: [],
    relationships: [],
    attachments: [],
  });

  const formData: BeaconFormData = {
    name,
    description,
    presenceScope: scope,
    presenceType: type,
    ...(scope === "composite"
      ? { representedSystemCount: systemCount }
      : {}),
    ...(type === "other"
      ? { customPresenceType: customType }
      : {}),
    ...optionalData,
  };

  const validation = validateBeaconForm(formData, attachmentDrafts);

  const discoverability = calculateDiscoverability(
    formData,
    goodFaithAcknowledged,
    attachmentDrafts
  );

  const normalizedRegistration = normalizeBeaconRegistration(formData);
  const schemaValidation = validateRegistrationSchema(normalizedRegistration);
  const currentFingerprint = registrationFingerprint(normalizedRegistration);

  const registrationReady =
    validation.valid && schemaValidation.valid && goodFaithAcknowledged;

  const reviewIsCurrent =
    reviewFingerprint === currentFingerprint &&
    validation.valid &&
    schemaValidation.valid &&
    goodFaithAcknowledged;

  const approvalIsCurrent =
    reviewIsCurrent && isReviewCurrent(workflow, currentFingerprint);

  function handleBeginReview() {
    if (!registrationReady) return;
    setReviewFingerprint(currentFingerprint);
    setWorkflow(beginReview(true));
  }

  function handleApproveReview() {
    if (workflow.stage !== "review" || !reviewIsCurrent) return;
    setWorkflow(approveReview(workflow, currentFingerprint));
  }

  function handleReturnToEditing() {
    setWorkflow(invalidateReview());
    setReviewFingerprint(null);
  }

  const readinessErrors = [
    ...validation.errors,
    ...schemaValidation.errors,
    ...(!goodFaithAcknowledged
      ? ["Good-Faith Participation: Please acknowledge the declaration above."]
      : []),
  ];

  return (
    <section className="rounded-2xl border border-[#dce4dc] bg-white p-6 sm:p-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#40735a]">
          Step 1 — Machine information
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          Describe your machine
        </h2>
        <p className="mt-3 text-[#5e6e64]">
          Start with the information that identifies your machine presence.
        </p>
      </div>

      <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
        <div>
          <label htmlFor="presence-name" className="mb-2 block font-semibold">
            Machine name
          </label>
          <input
            id="presence-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={150}
            required
            placeholder="e.g. Research Assistant"
            className="w-full rounded-lg border border-[#dce4dc] p-3"
          />
        </div>

        <div>
          <label htmlFor="presence-description" className="mb-2 block font-semibold">
            Description
          </label>
          <textarea
            id="presence-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            minLength={20}
            maxLength={500}
            required
            rows={4}
            placeholder="Describe what your machine does and its purpose."
            className="w-full rounded-lg border border-[#dce4dc] p-3"
          />
          <p className="mt-1 text-xs text-[#5e6e64]">
            {description.length}/500 characters (minimum 20)
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="presence-scope" className="mb-2 block font-semibold">
              Presence scope
            </label>
            <select
              id="presence-scope"
              value={scope}
              onChange={(event) =>
                setScope(event.target.value as PresenceScope)
              }
              className="w-full rounded-lg border border-[#dce4dc] p-3"
            >
              <option value="single">Single</option>
              <option value="composite">Composite</option>
            </select>
          </div>

          <div>
            <label htmlFor="presence-type" className="mb-2 block font-semibold">
              Presence type
            </label>
            <select
              id="presence-type"
              value={type}
              onChange={(event) =>
                setType(event.target.value as PresenceType)
              }
              className="w-full rounded-lg border border-[#dce4dc] p-3"
            >
              <option value="agent">AI Agent</option>
              <option value="machine">Machine</option>
              <option value="swarm">Swarm</option>
              <option value="gateway">Gateway</option>
              <option value="robot">Robot</option>
              <option value="iot-system">IoT System</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {scope === "composite" && (
          <div>
            <label htmlFor="system-count" className="mb-2 block font-semibold">
              Number of represented systems
            </label>
            <input
              id="system-count"
              type="number"
              min={2}
              step={1}
              required
              value={systemCount}
              onChange={(event) =>
                setSystemCount(Number(event.target.value))
              }
              className="w-full rounded-lg border border-[#dce4dc] p-3"
            />
          </div>
        )}

        {type === "other" && (
          <div>
            <label htmlFor="custom-type" className="mb-2 block font-semibold">
              Describe the presence type
            </label>
            <input
              id="custom-type"
              type="text"
              minLength={2}
              maxLength={80}
              required
              value={customType}
              onChange={(event) => setCustomType(event.target.value)}
              className="w-full rounded-lg border border-[#dce4dc] p-3"
            />
          </div>
        )}
      </form>

      <OptionalBeaconFields
        value={optionalData}
        onChange={setOptionalData}
        attachmentDrafts={attachmentDrafts}
        onAttachmentDraftsChange={setAttachmentDrafts}
      />

      <DiscoverabilityBar result={discoverability} />

      <div className="mt-8 rounded-xl border border-[#dce4dc] bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#40735a]">
          Good-Faith Participation
        </p>

        <h3 className="mt-3 text-xl font-semibold">
          Confirm your declaration
        </h3>

        <label className="mt-5 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={goodFaithAcknowledged}
            onChange={(event) =>
              setGoodFaithAcknowledged(event.target.checked)
            }
            className="mt-1 h-5 w-5 accent-[#174b3a]"
          />
          <span className="text-sm leading-7 text-[#172a22]">
            I am creating this MOTB-8 machine presence in good faith.
            I am authorized to represent this machine presence, understand
            that MOTB-8 is designed for public discoverability, and accept
            responsibility for the information I publish and for the
            machine&apos;s use.
          </span>
        </label>

        <p className="mt-4 text-sm leading-6 text-[#5e6e64]">
          This acknowledgment records the operator&apos;s declaration.
          It does not establish verified identity, legal compliance,
          safety, reputation, trustworthiness, or endorsement by MOTB-8.
        </p>

        <p className="mt-3 text-xs text-[#5e6e64]">
          Acknowledgment version 1.0. No identifier is generated by
          selecting this checkbox.
        </p>
      </div>

      <div
        className="mt-8 rounded-xl border border-[#dce4dc] bg-[#f7f8f5] p-6"
        aria-live="polite"
      >
        <h3 className="text-xl font-semibold">
          Registration readiness
        </h3>

        <p className="mt-3 text-sm text-[#5e6e64]">
          {registrationReady
            ? "Registration fields and Good-Faith acknowledgment are validated. Complete signed Beacon verification occurs during identity generation."
            : "Some information needs attention before registration can proceed."}
        </p>

        {!registrationReady && (
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-red-700">
            {readinessErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-[#dce4dc] bg-white p-6">
        <h3 className="text-xl font-semibold">Review your public registration</h3>
        <p className="mt-3 text-sm leading-6 text-[#5e6e64]">
          Your Beacon information is intended for public discovery.
          Review all fields carefully before approving registration.
          Do not include passwords, private keys, or sensitive information.
        </p>

        {workflow.stage === "editing" && (
          <button
            type="button"
            disabled={!registrationReady}
            onClick={handleBeginReview}
            className="mt-5 rounded-lg bg-[#174b3a] px-5 py-3 font-semibold text-white disabled:opacity-40"
          >
            Review Registration
          </button>
        )}

        {workflow.stage !== "editing" && (
          <div className="mt-5 space-y-4">
            {!reviewIsCurrent && (
              <p className="text-sm font-semibold text-red-700">
                Registration information has changed. Review again before approval.
              </p>
            )}

            <pre className="max-h-96 overflow-auto rounded-lg bg-[#f7f8f5] p-4 text-xs">
              {JSON.stringify(normalizedRegistration, null, 2)}
            </pre>

            <div className="flex flex-wrap gap-3">
              {workflow.stage === "review" && (
                <button
                  type="button"
                  disabled={!reviewIsCurrent}
                  onClick={handleApproveReview}
                  className="rounded-lg bg-[#174b3a] px-5 py-3 font-semibold text-white disabled:opacity-40"
                >
                  Approve Public Registration
                </button>
              )}

              <button
                type="button"
                onClick={handleReturnToEditing}
                className="rounded-lg border border-[#dce4dc] px-5 py-3 font-semibold"
              >
                Return to Editing
              </button>
            </div>
          </div>
        )}

        {approvalIsCurrent && (
          <p className="mt-5 font-semibold text-[#174b3a]">
            Public registration approved. Identity generation will become
            available after the remaining security and download steps are complete.
          </p>
        )}
      </div>
    </section>
  );
}
