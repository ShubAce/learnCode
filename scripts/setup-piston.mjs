// Installs the language runtimes LearnCode needs into a self-hosted Piston instance.
// Usage: npm run piston:setup   (reads PISTON_API_URL, defaults to http://localhost:2000/api/v2)

const url = (process.env.PISTON_API_URL ?? "http://localhost:2000/api/v2").replace(/\/+$/, "");

// Piston package names for each platform language (C++ ships in the gcc package)
const PACKAGES = { JAVASCRIPT: "node", PYTHON: "python", JAVA: "java", CPP: "gcc" };

const compareVersions = (a, b) => a.localeCompare(b, undefined, { numeric: true });

const response = await fetch(`${url}/packages`).catch(() => null);
if (!response?.ok) {
	console.error(`Could not reach Piston at ${url}. Is the container running? Try: npm run piston:up`);
	process.exit(1);
}

const available = await response.json();

for (const [language, pkg] of Object.entries(PACKAGES)) {
	const candidates = available.filter((entry) => entry.language === pkg);
	if (candidates.length === 0) {
		console.warn(`✗ ${language}: package "${pkg}" is not available`);
		continue;
	}
	const installed = candidates.find((entry) => entry.installed);
	if (installed) {
		console.log(`✓ ${language}: ${pkg} ${installed.language_version} already installed`);
		continue;
	}
	const latest = candidates.map((entry) => entry.language_version).sort(compareVersions).at(-1);
	process.stdout.write(`… ${language}: installing ${pkg} ${latest} `);
	const install = await fetch(`${url}/packages`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ language: pkg, version: latest }),
	});
	console.log(install.ok ? "✓" : `✗ (${install.status} ${await install.text()})`);
}

console.log("\nDone. Set CODE_EXECUTION_PROVIDERS=piston,wandbox and PISTON_API_URL in .env to use it.");
