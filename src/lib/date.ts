export function getCurrentMonthKey(date = new Date()): string {
	const y = date.getUTCFullYear();
	const m = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	return `${y}-${m}`;
}
