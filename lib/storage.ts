/** Safe localStorage helpers — storage can be unavailable (private mode, SSR, quota). */

const PREFIX = "learncode:";

export function readStorage<T>(key: string, fallback: T): T {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(PREFIX + key);
		return raw === null ? fallback : (JSON.parse(raw) as T);
	} catch {
		return fallback;
	}
}

export function writeStorage(key: string, value: unknown) {
	try {
		window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
	} catch {
		// Ignore quota and privacy-mode errors; persistence is a convenience.
	}
}

export function removeStorage(key: string) {
	try {
		window.localStorage.removeItem(PREFIX + key);
	} catch {
		// Ignore
	}
}
