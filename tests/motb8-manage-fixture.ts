import {
  generateBrowserMotb8Tag,
  generateBrowserControllerKeyPair,
  createBrowserGenesisRecord,
  signBrowserBeacon,
  encryptBrowserControlFile,
  generateDiscoverySummary
} from "motb-8/browser";


export const passphrase = "Synthetic-Manage-Import-2026";

export async function createFixture() {
  const tag = await generateBrowserMotb8Tag();
  const controller = await generateBrowserControllerKeyPair();
  const timestamp = new Date().toISOString();

  const genesis = await createBrowserGenesisRecord(
    tag, controller, timestamp
  );

  const registration = {
    name: "Manage Import Test Machine",
    presenceScope: "single" as const,
    presenceType: "agent" as const,
    description: "A synthetic machine for testing authorized Manage imports.",
    goodFaith: {
      acknowledged: true as const,
      termsVersion: "1.0",
      acknowledgedAt: timestamp
    }
  };

  const beacon = await signBrowserBeacon({
    ...registration,
    schemaVersion: "1.1",
    motb8Tag: tag,
    status: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
    revision: 1,
    controller: genesis.controller,
    discoverySummary: generateDiscoverySummary(registration)
  }, controller);

  const controlFile = await encryptBrowserControlFile(
    tag, controller, passphrase
  );

  return { tag, controller, genesis, beacon, controlFile };
}
