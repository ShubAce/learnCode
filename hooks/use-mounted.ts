import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during SSR and hydration, true afterwards — gate browser-only UI without effects. */
export function useMounted() {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
}
