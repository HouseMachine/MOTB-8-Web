import {
  verifyBrowserGenesisRecord,
  verifyBrowserBeacon,
  unlockBrowserControlFile
} from "motb-8/browser";

import type { GeneratedIdentity } from "./generate-identity";
import type { PreparedControlFile } from "./control-file";

export interface DownloadArtifact {
  filename: string;
  content: string;
  mimeType: string;
}

export interface IdentityArtifactPackage {
  public: {
    tag: DownloadArtifact;
    genesis: DownloadArtifact;
    beacon: DownloadArtifact;
  };
  private: {
    controlFile: DownloadArtifact;
  };
}

function jsonArtifact(filename: string, value: unknown): DownloadArtifact {
  return {
    filename,
    content: JSON.stringify(value, null, 2) + "\n",
    mimeType: "application/json"
  };
}

export async function prepareIdentityArtifacts(
  identity: GeneratedIdentity,
  control: PreparedControlFile,
  passphrase: string
): Promise<IdentityArtifactPackage> {
  const genesis = await verifyBrowserGenesisRecord(identity.genesis);
  const beacon = await verifyBrowserBeacon(identity.beacon, identity.genesis);

  if (genesis.status !== "VALID_UNANCHORED" ||
      !beacon.valid ||
      beacon.genesisStatus !== "VALID_UNANCHORED" ||
      identity.tag !== identity.genesis.motb8Tag ||
      identity.tag !== identity.beacon.motb8Tag ||
      control.file.motb8Tag !== identity.tag ||
      control.recoveryVerified !== true) {
    throw new Error("Identity artifacts failed verification");
  }

  const recovered = await unlockBrowserControlFile(
    control.file,
    passphrase,
    identity.genesis
  );

  if (recovered.type !== "private" || recovered.extractable) {
    throw new Error("Control File recovery verification failed");
  }

  return {
    public: {
      tag: {
        filename: "motb8-tag.txt",
        content: identity.tag + "\n",
        mimeType: "text/plain"
      },
      genesis: jsonArtifact("motb8-genesis.json", identity.genesis),
      beacon: jsonArtifact("motb8-beacon.json", identity.beacon)
    },
    private: {
      controlFile: jsonArtifact(
        "motb8-control-private.json",
        control.file
      )
    }
  };
}
