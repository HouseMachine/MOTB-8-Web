export interface AttachmentDraftState {
  id: string;
  valid: boolean;
  text?: string;
}

export function createAttachmentDraftId(): string {
  return crypto.randomUUID();
}
