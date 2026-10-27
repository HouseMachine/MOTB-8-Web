import test from "node:test";
import assert from "node:assert/strict";
import { initialCreateWorkflowState, beginReview, approveReview, invalidateReview, isReviewCurrent } from "../src/lib/motb8/workflow.ts";

test("workflow starts in editing state", () => {
  assert.equal(initialCreateWorkflowState.stage, "editing");
  assert.equal(initialCreateWorkflowState.approvedFingerprint, null);
});

test("review requires registration readiness", () => {
  assert.throws(() => beginReview(false), /not ready/);
  assert.equal(beginReview(true).stage, "review");
});

test("approval requires a registration fingerprint", () => {
  assert.throws(() => approveReview(beginReview(true), ""), /fingerprint is required/);
  assert.equal(approveReview(beginReview(true), "registration-v1").stage, "approved");
});

test("approval is valid only for matching registration", () => {
  const state = approveReview(beginReview(true), "registration-A");
  assert.equal(isReviewCurrent(state, "registration-A"), true);
  assert.equal(isReviewCurrent(state, "registration-B"), false);
});

test("invalidation returns workflow to editing", () => {
  const state = invalidateReview();
  assert.equal(state.stage, "editing");
  assert.equal(state.approvedFingerprint, null);
});

test("approval cannot bypass the review stage", () => {
  assert.throws(
    () => approveReview(initialCreateWorkflowState, "registration-A"),
    /must be reviewed before approval/
  );
});

test("generation readiness rejects stale approval", async () => {
  const { canProceedToGeneration } = await import("../src/lib/motb8/workflow.ts");
  const approved = approveReview(beginReview(true), "registration-A");

  assert.equal(canProceedToGeneration(approved, "registration-A", true, "registration-A"), true);
  assert.equal(canProceedToGeneration(approved, "registration-B", true, "registration-A"), false);
  assert.equal(canProceedToGeneration(approved, "registration-A", false, "registration-A"), false);
  assert.equal(canProceedToGeneration(initialCreateWorkflowState, "registration-A", true, "registration-A"), false);
  assert.equal(canProceedToGeneration(approved, "registration-A", true, null), false);
});
