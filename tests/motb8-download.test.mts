import test from "node:test";
import assert from "node:assert/strict";

import { downloadMotb8Artifact } from "../src/lib/motb8/download.ts";

test("rejects downloads outside a browser", () => {
  assert.throws(
    () => downloadMotb8Artifact({
      filename: "test.txt",
      content: "Synthetic MOTB-8 test",
      mimeType: "text/plain"
    }),
    /require a browser/
  );
});

test("initiates a browser download and cleans up", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;

  const events: string[] = [];
  let cleanup: (() => void) | undefined;

  const anchor = {
    href: "",
    download: "",
    style: { display: "" },
    click: () => events.push("click"),
    remove: () => events.push("remove")
  };

  try {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        setTimeout: (callback: () => void) => {
          cleanup = callback;
          return 1;
        }
      }
    });

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        createElement: () => anchor,
        body: {
          appendChild: () => events.push("append")
        }
      }
    });

    URL.createObjectURL = () => {
      events.push("create");
      return "blob:synthetic";
    };

    URL.revokeObjectURL = () => events.push("revoke");

    downloadMotb8Artifact({
      filename: "synthetic-beacon.json",
      content: '{"test":true}',
      mimeType: "application/json"
    });

    assert.equal(anchor.download, "synthetic-beacon.json");
    assert.equal(anchor.href, "blob:synthetic");
    assert.equal(anchor.style.display, "none");

    assert.deepEqual(events, [
      "create", "append", "click", "remove"
    ]);

    assert.ok(cleanup);
    cleanup();

    assert.deepEqual(events, [
      "create", "append", "click", "remove", "revoke"
    ]);
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow
    });

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: originalDocument
    });

    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});

test("cleans up when download initiation fails", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalCreate = URL.createObjectURL;
  const originalRevoke = URL.revokeObjectURL;

  const events: string[] = [];

  try {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { setTimeout: () => 1 }
    });

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        createElement: () => ({
          href: "",
          download: "",
          style: {},
          click: () => {
            throw new Error("Synthetic download failure");
          },
          remove: () => events.push("remove")
        }),
        body: {
          appendChild: () => events.push("append")
        }
      }
    });

    URL.createObjectURL = () => {
      events.push("create");
      return "blob:synthetic-failure";
    };

    URL.revokeObjectURL = () => events.push("revoke");

    assert.throws(
      () => downloadMotb8Artifact({
        filename: "synthetic.json",
        content: '{"test":true}',
        mimeType: "application/json"
      }),
      /Synthetic download failure/
    );

    assert.deepEqual(events, [
      "create", "append", "remove", "revoke"
    ]);
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow
    });

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: originalDocument
    });

    URL.createObjectURL = originalCreate;
    URL.revokeObjectURL = originalRevoke;
  }
});

test("rejects invalid download artifacts", () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  try {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {}
    });

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {}
    });

    const invalid = [
      { filename: "", content: "data", mimeType: "text/plain" },
      { filename: "test.txt", content: "", mimeType: "text/plain" },
      { filename: "test.txt", content: "data", mimeType: "" }
    ];

    for (const artifact of invalid) {
      assert.throws(
        () => downloadMotb8Artifact(artifact),
        /Invalid download artifact/
      );
    }
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow
    });

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: originalDocument
    });
  }
});
