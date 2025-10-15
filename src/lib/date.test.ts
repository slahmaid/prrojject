import { describe, expect, it } from "vitest";
import { getCurrentMonthKey } from "./date";

describe("date util", () => {
	it("formats YYYY-MM", () => {
		const d = new Date(Date.UTC(2025, 9, 15));
		expect(getCurrentMonthKey(d)).toBe("2025-10");
	});
});
