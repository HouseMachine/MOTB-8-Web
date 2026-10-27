export type CreateWorkflowStage = "editing" | "review" | "approved";

export interface CreateWorkflowState {
  stage: CreateWorkflowStage;
  approvedFingerprint: string | null;
}

export const initialCreateWorkflowState: CreateWorkflowState = {
  stage: "editing",
  approvedFingerprint: null
};

export function beginReview(ready: boolean): CreateWorkflowState {
  if (!ready) throw new Error("Registration is not ready for review");
  return { stage: "review", approvedFingerprint: null };
}

export function approveReview(
  state: CreateWorkflowState,
  fingerprint: string
): CreateWorkflowState {
  if (state.stage !== "review") {
    throw new Error("Registration must be reviewed before approval");
  }
  if (!fingerprint) {
    throw new Error("Registration fingerprint is required");
  }
  return { stage: "approved", approvedFingerprint: fingerprint };
}

export function invalidateReview(): CreateWorkflowState {
  return initialCreateWorkflowState;
}

export function isReviewCurrent(
  state: CreateWorkflowState,
  fingerprint: string
): boolean {
  return state.stage === "approved" && state.approvedFingerprint === fingerprint;
}

export function canProceedToGeneration(
  state: CreateWorkflowState,
  currentFingerprint: string,
  registrationReady: boolean,
  reviewFingerprint: string | null
): boolean {
  return registrationReady &&
    reviewFingerprint === currentFingerprint &&
    isReviewCurrent(state, currentFingerprint);
}
