import {
  generateMotb8Identity
} from "./generate-identity";

import type {
  GenerateIdentityInput,
  GeneratedIdentity
} from "./generate-identity";

import {
  prepareMotb8ControlFile
} from "./control-file";

import type {
  PreparedControlFile
} from "./control-file";

import {
  prepareIdentityArtifacts
} from "./artifacts";

import type {
  IdentityArtifactPackage
} from "./artifacts";

import { normalizeBeaconRegistration } from "../../components/beacon/normalize";
import { registrationFingerprint } from "./fingerprint";
import { canProceedToGeneration } from "./workflow";

export type CreationStage =
  | "idle"
  | "generating"
  | "identity-created"
  | "encrypting"
  | "packaging"
  | "ready-for-download"
  | "error";

export interface CreationSnapshot {
  stage: CreationStage;
  tag: string | null;
  error: string | null;
  artifactsReady: boolean;
}

export interface CreationLifecycleDependencies {
  generate: (
    input: GenerateIdentityInput
  ) => Promise<GeneratedIdentity>;

  encrypt: (
    identity: GeneratedIdentity,
    passphrase: string
  ) => Promise<PreparedControlFile>;

  packageArtifacts: (
    identity: GeneratedIdentity,
    control: PreparedControlFile,
    passphrase: string
  ) => Promise<IdentityArtifactPackage>;
}

const defaultDependencies: CreationLifecycleDependencies = {
  generate: generateMotb8Identity,
  encrypt: prepareMotb8ControlFile,
  packageArtifacts: prepareIdentityArtifacts
};

export class Motb8CreationLifecycle {
  constructor(
    private readonly dependencies: CreationLifecycleDependencies =
      defaultDependencies
  ) {}

  private identity: GeneratedIdentity | null = null;
  private approvedFingerprint: string | null = null;
  private controlFile: PreparedControlFile | null = null;

  private artifacts: IdentityArtifactPackage | null = null;
  private stage: CreationStage = "idle";
  private error: string | null = null;
  private busy = false;

  getSnapshot(): CreationSnapshot {
    return {
      stage: this.stage,
      tag: this.identity?.tag ?? null,
      error: this.error,
      artifactsReady: this.artifacts !== null
    };
  }

  getArtifacts(): IdentityArtifactPackage | null {
    return this.artifacts;
  }

  async prepare(
    input: GenerateIdentityInput,
    passphrase: string
  ): Promise<IdentityArtifactPackage> {
    if (this.busy) {
      throw new Error("Identity creation is already in progress");
    }

    const fingerprint = registrationFingerprint(
      normalizeBeaconRegistration(input.formData)
    );

    if (!canProceedToGeneration(
      input.workflow,
      fingerprint,
      true,
      input.reviewFingerprint
    )) {
      throw new Error("Registration review is not current or approved");
    }

    if (this.approvedFingerprint !== null &&
        this.approvedFingerprint !== fingerprint) {
      throw new Error("Registration changed after identity generation");
    }

    if (input.acknowledged !== true) {
      throw new Error("Good-Faith acknowledgment is required");
    }

    if (this.artifacts) {
      throw new Error(
        "Identity already prepared; retrieve existing artifacts without re-encryption"
      );
    }

    if (typeof passphrase !== "string" || passphrase.length < 12) {
      throw new Error("Control File passphrase must contain at least 12 characters");
    }

    this.busy = true;
    this.error = null;

    try {
      if (!this.identity) {
        this.stage = "generating";
        this.identity = await this.dependencies.generate(input);
        this.approvedFingerprint = fingerprint;
      }

      this.stage = "identity-created";

      if (!this.controlFile) {
        this.stage = "encrypting";
        this.controlFile = await this.dependencies.encrypt(
          this.identity,
          passphrase
        );

      }



      this.stage = "packaging";

      this.artifacts = await this.dependencies.packageArtifacts(
        this.identity,
        this.controlFile,
        passphrase
      );

      this.stage = "ready-for-download";

      return this.artifacts;
    } catch (error) {
      this.stage = "error";
      this.error = error instanceof Error
        ? error.message
        : "Identity preparation failed";

      throw error;
    } finally {
      this.busy = false;
    }
  }
}
