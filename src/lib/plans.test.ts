import { describe, expect, it } from "vitest";
import { DEFAULT_LIMITS } from "./plans-constants";

describe("plans constants", () => {
	it("has free limit set to 3", () => {
		expect(DEFAULT_LIMITS.FREE).toBe(3);
	});
});
