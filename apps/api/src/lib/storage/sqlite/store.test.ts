import { afterEach, describe, expect, it } from "vitest";
import { getAnalyticsDb } from "./store.js";
import {
  createTempAnalyticsDbPath,
  resetAnalyticsStore
} from "../../../test/storage-test-helpers.js";

describe("sqlite busy timeout", () => {
  let dbPath: string | undefined;

  afterEach(async () => {
    await resetAnalyticsStore(dbPath);
    dbPath = undefined;
  });

  it("configures a bounded busy_timeout pragma when opening the database", () => {
    dbPath = createTempAnalyticsDbPath();
    const database = getAnalyticsDb(dbPath);

    expect(database.pragma("busy_timeout", { simple: true })).toBe(5000);
  });

  it("keeps WAL mode and foreign keys enabled alongside the busy timeout", () => {
    dbPath = createTempAnalyticsDbPath();
    const database = getAnalyticsDb(dbPath);

    expect(database.pragma("journal_mode", { simple: true })).toBe("wal");
    expect(database.pragma("foreign_keys", { simple: true })).toBe(1);
  });
});
