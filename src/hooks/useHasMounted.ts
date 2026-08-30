import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only after client hydration. Built on useSyncExternalStore (rather
 * than useEffect+setState) so React handles the server/client snapshot
 * swap natively, with no synchronous setState-in-effect.
 */
export function useHasMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
