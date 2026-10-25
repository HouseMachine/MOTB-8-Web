export interface AttachmentDraftState {
  id: string;
  valid: boolean;
}

export function createAttachmentDraftId(): string {
  return crypto.randomUUID();
}
