"use client";

import { useState } from "react";
import taxonomy from "@/data/industry/motb8-industry-v0.1.json";
import type { BeaconFormData } from "./types";

type IndustryEntry = BeaconFormData["taxonomy"][number];

interface IndustryTaxonomySelectorProps {
  value: IndustryEntry;
  onChange: (next: IndustryEntry) => void;
}

const CUSTOM = "__custom__";

const inputClass =
  "w-full rounded-lg border border-[#dce4dc] bg-white p-3";

export default function IndustryTaxonomySelector({
  value,
  onChange,
}: IndustryTaxonomySelectorProps) {
  const [customDomain, setCustomDomain] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);
  const [customSubcategory, setCustomSubcategory] = useState(false);

  const domains = taxonomy.domains;

  const selectedDomain = domains.find(
    (domain) => domain.label === value.domain
  );

  const domainChoice = customDomain
    ? CUSTOM
    : selectedDomain
      ? selectedDomain.key
      : value.domain
        ? CUSTOM
        : "";

  const categories = selectedDomain?.categories ?? [];

  const selectedCategory = categories.find(
    (category) => category.label === value.category
  );

  const categoryChoice = customCategory
    ? CUSTOM
    : selectedCategory
      ? selectedCategory.key
      : value.category
        ? CUSTOM
        : "";

  const subcategories = selectedCategory?.subcategories ?? [];

  const selectedSubcategory = subcategories.find(
    (subcategory) => subcategory.label === value.subcategory
  );

  const subcategoryChoice = customSubcategory
    ? CUSTOM
    : selectedSubcategory
      ? selectedSubcategory.key
      : value.subcategory
        ? CUSTOM
        : "";

  function changeDomain(choice: string) {
    const domain = domains.find((entry) => entry.key === choice);

    onChange({
      domain: domain?.label ?? "",
      category: "",
    });
  }

  function changeCategory(choice: string) {
    const category = categories.find((entry) => entry.key === choice);

    onChange({
      domain: value.domain,
      category: category?.label ?? "",
    });
  }

  function changeSubcategory(choice: string) {
    const subcategory = subcategories.find(
      (entry) => entry.key === choice
    );

    onChange({
      ...value,
      ...(subcategory
        ? { subcategory: subcategory.label }
        : { subcategory: undefined }),
    });
  }
  return (
    <div className="grid gap-4">
      <div>
        <label className="mb-2 block text-sm font-semibold">
          Industry domain
        </label>
        <select
          aria-label="Industry domain"
          value={domainChoice}
          onChange={(event) => {
            const choice = event.target.value;
            setCustomDomain(choice === CUSTOM);
            setCustomCategory(false);
            setCustomSubcategory(false);

            if (choice === CUSTOM) {
              onChange({ domain: "", category: "" });
            } else {
              changeDomain(choice);
            }
          }}
          className={inputClass}
        >
          <option value="">Select a domain</option>
          {domains.map((domain) => (
            <option key={domain.key} value={domain.key}>
              {domain.label}
            </option>
          ))}
          <option value={CUSTOM}>Other / Custom domain</option>
        </select>

        {domainChoice === CUSTOM && (
          <input
            aria-label="Custom industry domain"
            placeholder="Enter custom domain"
            maxLength={120}
            value={value.domain}
            onChange={(event) =>
              onChange({ domain: event.target.value, category: "" })
            }
            className={`${inputClass} mt-3`}
          />
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Industry category
        </label>
        <select
          aria-label="Industry category"
          value={categoryChoice}
          disabled={!value.domain}
          onChange={(event) => {
            const choice = event.target.value;
            setCustomCategory(choice === CUSTOM);
            setCustomSubcategory(false);

            if (choice === CUSTOM) {
              onChange({ ...value, category: "", subcategory: undefined });
            } else {
              changeCategory(choice);
            }
          }}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
          <option value={CUSTOM}>Other / Custom category</option>
        </select>

        {categoryChoice === CUSTOM && (
          <input
            aria-label="Custom industry category"
            placeholder="Enter custom category"
            maxLength={120}
            value={value.category}
            onChange={(event) =>
              onChange({ ...value, category: event.target.value })
            }
            className={`${inputClass} mt-3`}
          />
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Industry subcategory (optional)
        </label>
        <select
          aria-label="Industry subcategory"
          value={subcategoryChoice}
          disabled={!value.category}
          onChange={(event) => {
            const choice = event.target.value;
            setCustomSubcategory(choice === CUSTOM);

            if (choice === CUSTOM) {
              onChange({ ...value, subcategory: "" });
            } else {
              changeSubcategory(choice);
            }
          }}
          className={inputClass}
        >
          <option value="">No subcategory selected</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.key} value={subcategory.key}>
              {subcategory.label}
            </option>
          ))}
          <option value={CUSTOM}>Other / Custom subcategory</option>
        </select>

        {subcategoryChoice === CUSTOM && (
          <input
            aria-label="Custom industry subcategory"
            placeholder="Enter custom subcategory"
            maxLength={120}
            value={value.subcategory ?? ""}
            onChange={(event) =>
              onChange({ ...value, subcategory: event.target.value })
            }
            className={`${inputClass} mt-3`}
          />
        )}
      </div>
    </div>
  );
}
