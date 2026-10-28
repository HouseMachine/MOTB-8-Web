"use client";

import { useRef, useState } from "react";
import CreationCompletion from "./CreationCompletion";
import { Motb8CreationLifecycle } from "@/lib/motb8/create-lifecycle";
import type { IdentityArtifactPackage } from "@/lib/motb8/artifacts";
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

  const lifecycleRef = useRef<Motb8CreationLifecycle | null>(null);
  const generationBusyRef = useRef(false);

  const [controlPassphrase, setControlPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [generationBusy, setGenerationBusy] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedTag, setGeneratedTag] = useState<string | null>(null);
  const [identityCreationStarted, setIdentityCreationStarted] = useState(false);
  const [generatedArtifacts, setGeneratedArtifacts] =
    useState<IdentityArtifactPackage | null>(null);



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
    if (generationBusyRef.current ||
        lifecycleRef.current?.getSnapshot().tag) {
      return;
    }

    setWorkflow(invalidateReview());
    setReviewFingerprint(null);
  }

  async function handleGenerateIdentity() {
    if (generationBusyRef.current || generatedArtifacts) return;

    if (!approvalIsCurrent) {
      setGenerationError("Registration approval is no longer current.");
      return;
    }

    if (controlPassphrase.length < 12) {
      setGenerationError("Control File passphrase must contain at least 12 characters.");
      return;
    }

    if (controlPassphrase !== confirmPassphrase) {
      setGenerationError("Control File passphrases do not match.");
      return;
    }

    generationBusyRef.current = true;
    setGenerationBusy(true);
    setIdentityCreationStarted(true);
    setGenerationError(null);

    try {
      if (!lifecycleRef.current) {
        lifecycleRef.current = new Motb8CreationLifecycle();
      }

      const artifacts = await lifecycleRef.current.prepare(
        {
          formData,
          attachmentDrafts,
          acknowledged: goodFaithAcknowledged,
          workflow,
          reviewFingerprint
        },
        controlPassphrase
      );

      const snapshot = lifecycleRef.current.getSnapshot();

      if (!snapshot.tag || !snapshot.artifactsReady) {
        throw new Error("Identity preparation did not complete.");
      }

      setGeneratedTag(snapshot.tag);
      setGeneratedArtifacts(artifacts);
      setControlPassphrase("");
      setConfirmPassphrase("");
    } catch (error) {
      const snapshot = lifecycleRef.current?.getSnapshot();

      if (!snapshot?.tag) {
        setIdentityCreationStarted(false);
      } else {
        setGeneratedTag(snapshot.tag);
      }

      setGenerationError(
        error instanceof Error
          ? error.message
          : "Identity generation failed."
      );
    } finally {
      generationBusyRef.current = false;
      setGenerationBusy(false);
    }
  }

  const registrationLocked =
    generationBusy || identityCreationStarted || generatedTag !== null;

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

      <fieldset
        disabled={registrationLocked}
        className={`min-w-0 ${
          registrationLocked
            ? "[&_input]:bg-[#f1f3f0] [&_textarea]:bg-[#f1f3f0] [&_select]:bg-[#f1f3f0] [&_input]:text-[#718078] [&_textarea]:text-[#718078] [&_select]:text-[#718078] [&_input]:cursor-not-allowed [&_textarea]:cursor-not-allowed [&_select]:cursor-not-allowed"
            : ""
        }`}
      >
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

      </fieldset>

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
            disabled={!registrationReady || registrationLocked}
            onClick={handleBeginReview}
            className="button mt-5 rounded-lg bg-[#174b3a] px-5 py-3 font-semibold text-white disabled:opacity-40"
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
                  disabled={!reviewIsCurrent || registrationLocked}
                  onClick={handleApproveReview}
                  className="button rounded-lg bg-[#174b3a] px-5 py-3 font-semibold text-white disabled:opacity-40"
                >
                  Approve Public Registration
                </button>
              )}

              {!registrationLocked && (
                <button
                  type="button"
                  onClick={handleReturnToEditing}
                  className="button rounded-lg border border-[#dce4dc] px-5 py-3 font-semibold"
                >
                  Return to Editing
                </button>
              )}
            </div>
          </div>
        )}

        {approvalIsCurrent && !generatedArtifacts && (
          <div className="mt-6 rounded-xl border border-[#dce4dc] p-5">
            <h3 className="text-lg font-semibold">Generate your MOTB-8 identity</h3>

            <p className="mt-3 text-sm leading-6 text-[#5e6e64]">
              Your permanent Tag and controller will be generated locally.
              Choose a Control File passphrase and retain it securely.
              MOTB-8 cannot recover a lost passphrase.
            </p>

            <label className="mt-5 block text-sm font-semibold">
              Control File passphrase
              <input
                type="password"
                autoComplete="new-password"
                value={controlPassphrase}
                onChange={(event) => setControlPassphrase(event.target.value)}
                disabled={generationBusy}
                className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
              />
            </label>

            <label className="mt-4 block text-sm font-semibold">
              Confirm passphrase
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassphrase}
                onChange={(event) => setConfirmPassphrase(event.target.value)}
                disabled={generationBusy}
                className="mt-2 w-full rounded-lg border border-[#dce4dc] p-3"
              />
            </label>

            {generatedTag && (
              <p className="mt-4 text-sm font-semibold text-amber-800">
                Your permanent Tag has already been generated.
                Retry preparation without creating another identity.
                If your encrypted Control File was already prepared,
                use its original passphrase.
              </p>
            )}

            <button
              type="button"
              disabled={generationBusy}
              onClick={handleGenerateIdentity}
              className="button mt-5 rounded-lg bg-[#174b3a] px-5 py-3 font-semibold text-white disabled:opacity-40"
            >
              {generationBusy
                ? "Preparing identity..."
                : generatedTag
                  ? "Retry Identity Preparation"
                  : "Generate MOTB-8"}
            </button>
          </div>
        )}

        {generationError && (
          <p role="alert" className="mt-5 text-sm text-red-700">
            {generationError}
          </p>
        )}

        {generatedTag && generatedArtifacts && (
          <CreationCompletion
            tag={generatedTag}
            artifacts={generatedArtifacts}
          />
        )}

        {approvalIsCurrent && !generatedTag && (
          <p className="mt-5 font-semibold text-[#174b3a]">
            Public registration approved.
            Your identity can now be prepared using the controls above.
          </p>
        )}
      </div>
    </section>
  );
}
