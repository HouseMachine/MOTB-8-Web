"use client";

import type { BeaconFormData } from "./types";
import AttachmentJsonEditor from "./AttachmentJsonEditor";
import IndustryTaxonomySelector from "./IndustryTaxonomySelector";
import { createAttachmentDraftId, type AttachmentDraftState } from "./attachment-draft";

type OptionalData = Pick<
  BeaconFormData,
  | "taxonomy"
  | "capabilities"
  | "reachability"
  | "profiles"
  | "catalogs"
  | "protocols"
  | "relationships"
  | "attachments"
>;

interface OptionalBeaconFieldsProps {
  value: OptionalData;
  onChange: (next: OptionalData) => void;
  attachmentDrafts: AttachmentDraftState[];
  onAttachmentDraftsChange: (next: AttachmentDraftState[]) => void;
}

export default function OptionalBeaconFields({
  value,
  onChange,
  attachmentDrafts,
  onAttachmentDraftsChange,
}: OptionalBeaconFieldsProps) {
  function update<K extends keyof OptionalData>(
    key: K,
    next: OptionalData[K]
  ) {
    onChange({ ...value, [key]: next });
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#dce4dc] bg-white p-6 sm:p-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#40735a]">
          Additional discovery information
        </p>
        <h2 className="mt-3 text-2xl font-bold">
          Help others understand your machine
        </h2>
        <p className="mt-3 text-[#5e6e64]">
          All fields below are optional. You can complete them now or
          return later to update your Beacon.
        </p>
      </div>

      <details className="border-t border-[#dce4dc] py-5">
        <summary className="cursor-pointer font-semibold">
          Industry classification
        </summary>

        <div className="mt-5 space-y-4">
          {value.taxonomy.map((entry, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-[#f7f8f5] p-4">
              <IndustryTaxonomySelector
                value={entry}
                onChange={(nextEntry) => {
                  const next = [...value.taxonomy];
                  next[index] = nextEntry;
                  update("taxonomy", next);
                }}
              />
              <button
                type="button"
                onClick={() =>
                  update("taxonomy", value.taxonomy.filter((_, i) => i !== index))
                }
                className="text-left text-sm text-red-700"
              >
                Remove classification
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              update("taxonomy", [
                ...value.taxonomy,
                { domain: "", category: "" },
              ])
            }
            className="text-sm font-semibold text-[#174b3a]"
          >
            + Add industry classification
          </button>
        </div>
      </details>

      <details className="border-t border-[#dce4dc] py-5">
        <summary className="cursor-pointer font-semibold">
          Machine capabilities
        </summary>

        <div className="mt-5 space-y-4">
          {value.capabilities.map((entry, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-[#f7f8f5] p-4">
              {(["id", "name", "vocabulary", "description"] as const).map(
                (field) => (
                  <input
                    key={field}
                    aria-label={`Capability ${field}`}
                    placeholder={`Capability ${field}`}
                    value={entry[field] ?? ""}
                    maxLength={field === "description" ? 500 : field === "vocabulary" ? 200 : 160}
                    onChange={(event) => {
                      const next = [...value.capabilities];
                      next[index] = { ...entry, [field]: event.target.value };
                      update("capabilities", next);
                    }}
                    className="rounded-lg border border-[#dce4dc] p-3"
                  />
                )
              )}
              <button
                type="button"
                onClick={() =>
                  update("capabilities", value.capabilities.filter((_, i) => i !== index))
                }
                className="text-left text-sm text-red-700"
              >
                Remove capability
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              update("capabilities", [
                ...value.capabilities,
                { id: "", name: "" },
              ])
            }
            className="text-sm font-semibold text-[#174b3a]"
          >
            + Add capability
          </button>
        </div>
      </details>
      <details className="border-t border-[#dce4dc] py-5">
        <summary className="cursor-pointer font-semibold">
          Reachability and contact
        </summary>
        <div className="mt-5 space-y-4">
          {value.reachability.map((entry, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-[#f7f8f5] p-4">
              {(["type", "value", "label"] as const).map((field) => (
                <input
                  key={field}
                  aria-label={`Reachability ${field}`}
                  placeholder={field}
                  maxLength={field === "value" ? 2048 : field === "type" ? 100 : 160}
                  value={entry[field] ?? ""}
                  onChange={(event) => {
                    const next = [...value.reachability];
                    next[index] = { ...entry, [field]: event.target.value };
                    update("reachability", next);
                  }}
                  className="rounded-lg border border-[#dce4dc] p-3"
                />
              ))}
              <button type="button"
                onClick={() => update("reachability", value.reachability.filter((_, i) => i !== index))}
                className="text-left text-sm text-red-700">
                Remove reachability entry
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => update("reachability", [...value.reachability, { type: "", value: "" }])}
            className="text-sm font-semibold text-[#174b3a]">
            + Add reachability
          </button>
        </div>
      </details>

      <details className="border-t border-[#dce4dc] py-5">
        <summary className="cursor-pointer font-semibold">
          Developer and organization profiles
        </summary>
        <div className="mt-5 space-y-5">
          {(["developers", "organizations"] as const).map((field) => (
            <div key={field}>
              <h3 className="mb-3 font-medium capitalize">{field}</h3>
              {value.profiles[field].map((entry, index) => (
                <div key={index} className="mb-2 flex gap-2">
                  <input
                    aria-label={`${field} entry`}
                    value={entry}
                    maxLength={160}
                    onChange={(event) => {
                      const next = [...value.profiles[field]];
                      next[index] = event.target.value;
                      update("profiles", { ...value.profiles, [field]: next });
                    }}
                    className="min-w-0 flex-1 rounded-lg border border-[#dce4dc] p-3"
                  />
                  <button type="button"
                    onClick={() => update("profiles", {
                      ...value.profiles,
                      [field]: value.profiles[field].filter((_, i) => i !== index)
                    })}
                    className="text-sm text-red-700">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button"
                onClick={() => update("profiles", {
                  ...value.profiles,
                  [field]: [...value.profiles[field], ""]
                })}
                className="text-sm font-semibold text-[#174b3a]">
                + Add {field === "developers" ? "developer" : "organization"}
              </button>
            </div>
          ))}

          <h3 className="font-medium">Public profile links</h3>
          {value.profiles.links.map((entry, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-[#f7f8f5] p-4">
              {(["type", "url", "label"] as const).map((field) => (
                <input
                  key={field}
                  aria-label={`Profile link ${field}`}
                  placeholder={field}
                  type={field === "url" ? "url" : "text"}
                  maxLength={field === "url" ? 2048 : field === "type" ? 100 : 160}
                  value={entry[field] ?? ""}
                  onChange={(event) => {
                    const next = [...value.profiles.links];
                    next[index] = { ...entry, [field]: event.target.value };
                    update("profiles", { ...value.profiles, links: next });
                  }}
                  className="rounded-lg border border-[#dce4dc] p-3"
                />
              ))}
              <button type="button"
                onClick={() => update("profiles", {
                  ...value.profiles,
                  links: value.profiles.links.filter((_, i) => i !== index)
                })}
                className="text-left text-sm text-red-700">
                Remove link
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => update("profiles", {
              ...value.profiles,
              links: [...value.profiles.links, { type: "", url: "" }]
            })}
            className="text-sm font-semibold text-[#174b3a]">
            + Add public profile link
          </button>
        </div>
      </details>

      <details className="border-t border-[#dce4dc] py-5">
        <summary className="cursor-pointer font-semibold">
          Native and external catalogs
        </summary>
        <div className="mt-5 space-y-5">
          <h3 className="font-medium">Native capabilities offered or sought</h3>
          {value.catalogs.native.map((entry, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-[#f7f8f5] p-4">
              <select
                aria-label="Catalog direction"
                value={entry.direction}
                onChange={(event) => {
                  const next = [...value.catalogs.native];
                  next[index] = {
                    ...entry,
                    direction: event.target.value as "OFFER" | "SEEK"
                  };
                  update("catalogs", { ...value.catalogs, native: next });
                }}
                className="rounded-lg border border-[#dce4dc] p-3">
                <option value="OFFER">OFFER</option>
                <option value="SEEK">SEEK</option>
              </select>
              {(["id", "name", "description", "resourceUrl"] as const).map((field) => (
                <input
                  key={field}
                  aria-label={`Native catalog ${field}`}
                  placeholder={field}
                  type={field === "resourceUrl" ? "url" : "text"}
                  maxLength={field === "description" ? 500 : field === "resourceUrl" ? 2048 : 160}
                  value={entry[field] ?? ""}
                  onChange={(event) => {
                    const next = [...value.catalogs.native];
                    next[index] = { ...entry, [field]: event.target.value };
                    update("catalogs", { ...value.catalogs, native: next });
                  }}
                  className="rounded-lg border border-[#dce4dc] p-3"
                />
              ))}
              <button type="button"
                onClick={() => update("catalogs", {
                  ...value.catalogs,
                  native: value.catalogs.native.filter((_, i) => i !== index)
                })}
                className="text-left text-sm text-red-700">
                Remove native catalog entry
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => update("catalogs", {
              ...value.catalogs,
              native: [...value.catalogs.native, {
                id: "", direction: "OFFER", name: "", description: ""
              }]
            })}
            className="text-sm font-semibold text-[#174b3a]">
            + Add native catalog entry
          </button>

          <h3 className="font-medium">External catalogs</h3>
          {value.catalogs.external.map((entry, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-[#f7f8f5] p-4">
              {(["url", "label", "format"] as const).map((field) => (
                <input
                  key={field}
                  aria-label={`External catalog ${field}`}
                  placeholder={field}
                  type={field === "url" ? "url" : "text"}
                  maxLength={field === "url" ? 2048 : field === "label" ? 160 : 100}
                  value={entry[field] ?? ""}
                  onChange={(event) => {
                    const next = [...value.catalogs.external];
                    next[index] = { ...entry, [field]: event.target.value };
                    update("catalogs", { ...value.catalogs, external: next });
                  }}
                  className="rounded-lg border border-[#dce4dc] p-3"
                />
              ))}
              <button type="button"
                onClick={() => update("catalogs", {
                  ...value.catalogs,
                  external: value.catalogs.external.filter((_, i) => i !== index)
                })}
                className="text-left text-sm text-red-700">
                Remove external catalog
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => update("catalogs", {
              ...value.catalogs,
              external: [...value.catalogs.external, { url: "" }]
            })}
            className="text-sm font-semibold text-[#174b3a]">
            + Add external catalog
          </button>
        </div>
      </details>
      <details className="border-t border-[#dce4dc] py-5">
        <summary className="cursor-pointer font-semibold">
          Protocols and endpoints
        </summary>
        <div className="mt-5 space-y-4">
          {value.protocols.map((entry, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-[#f7f8f5] p-4">
              {(["id", "version", "documentation"] as const).map((field) => (
                <input
                  key={field}
                  aria-label={`Protocol ${field}`}
                  placeholder={field}
                  type={field === "documentation" ? "url" : "text"}
                  maxLength={field === "documentation" ? 2048 : field === "version" ? 80 : 120}
                  value={entry[field] ?? ""}
                  onChange={(event) => {
                    const next = [...value.protocols];
                    next[index] = { ...entry, [field]: event.target.value };
                    update("protocols", next);
                  }}
                  className="rounded-lg border border-[#dce4dc] p-3"
                />
              ))}
              <label className="text-sm font-medium">
                Endpoints (one URL per line)
              </label>
              <textarea
                aria-label="Protocol endpoints"
                rows={3}
                value={(entry.endpoints ?? []).join("\n")}
                onChange={(event) => {
                  const next = [...value.protocols];
                  next[index] = {
                    ...entry,
                    endpoints: event.target.value.split("\n")
                  };
                  update("protocols", next);
                }}
                className="rounded-lg border border-[#dce4dc] p-3"
              />
              <button type="button"
                onClick={() => update("protocols", value.protocols.filter((_, i) => i !== index))}
                className="text-left text-sm text-red-700">
                Remove protocol
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => update("protocols", [...value.protocols, { id: "" }])}
            className="text-sm font-semibold text-[#174b3a]">
            + Add protocol
          </button>
        </div>
      </details>

      <details className="border-t border-[#dce4dc] py-5">
        <summary className="cursor-pointer font-semibold">
          Relationships
        </summary>
        <div className="mt-5 space-y-4">
          {value.relationships.map((entry, index) => (
            <div key={index} className="grid gap-3 rounded-lg bg-[#f7f8f5] p-4">
              {(["type", "target", "label"] as const).map((field) => (
                <input
                  key={field}
                  aria-label={`Relationship ${field}`}
                  placeholder={field}
                  maxLength={field === "target" ? 2048 : field === "type" ? 120 : 160}
                  value={entry[field] ?? ""}
                  onChange={(event) => {
                    const next = [...value.relationships];
                    next[index] = { ...entry, [field]: event.target.value };
                    update("relationships", next);
                  }}
                  className="rounded-lg border border-[#dce4dc] p-3"
                />
              ))}
              <button type="button"
                onClick={() => update("relationships", value.relationships.filter((_, i) => i !== index))}
                className="text-left text-sm text-red-700">
                Remove relationship
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => update("relationships", [
              ...value.relationships, { type: "", target: "" }
            ])}
            className="text-sm font-semibold text-[#174b3a]">
            + Add relationship
          </button>
        </div>
      </details>

      <details className="border-t border-b border-[#dce4dc] py-5">
        <summary className="cursor-pointer font-semibold">
          Structured attachments
        </summary>
        <div className="mt-5 space-y-4">
          {value.attachments.map((entry, index) => (
            <div key={attachmentDrafts[index]?.id ?? index} className="grid gap-3 rounded-lg bg-[#f7f8f5] p-4">
              <input
                aria-label="Attachment type"
                placeholder="Attachment type"
                maxLength={200}
                value={entry.type}
                onChange={(event) => {
                  const next = [...value.attachments];
                  next[index] = { ...entry, type: event.target.value };
                  update("attachments", next);
                }}
                className="rounded-lg border border-[#dce4dc] p-3"
              />
              <input
                aria-label="Attachment version"
                placeholder="Attachment version"
                maxLength={40}
                value={entry.version}
                onChange={(event) => {
                  const next = [...value.attachments];
                  next[index] = { ...entry, version: event.target.value };
                  update("attachments", next);
                }}
                className="rounded-lg border border-[#dce4dc] p-3"
              />
              <AttachmentJsonEditor
                value={entry.data}
                draftText={attachmentDrafts[index]?.text}
                onDraftTextChange={(text) => {
                  const next = [...attachmentDrafts];

                  if (next[index]) {
                    next[index] = { ...next[index], text };
                    onAttachmentDraftsChange(next);
                  }
                }}
                onChange={(data) => {
                  const next = [...value.attachments];
                  next[index] = { ...entry, data };
                  update("attachments", next);
                }}
                onValidityChange={(valid) => {
                  const next = [...attachmentDrafts];
                  if (next[index]) {
                    next[index] = { ...next[index], valid };
                    onAttachmentDraftsChange(next);
                  }
                }}
              />
              <button type="button"
                onClick={() => {
                  update("attachments", value.attachments.filter((_, i) => i !== index));
                  onAttachmentDraftsChange(attachmentDrafts.filter((_, i) => i !== index));
                }}
                className="text-left text-sm text-red-700">
                Remove from draft
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => {
              update("attachments", [
                ...value.attachments,
                { type: "", version: "1.0", data: {} }
              ]);
              onAttachmentDraftsChange([
                ...attachmentDrafts,
                { id: createAttachmentDraftId(), valid: true }
              ]);
            }}
            className="text-sm font-semibold text-[#174b3a]">
            + Add attachment
          </button>
        </div>
      </details>
    </section>
  );
}
