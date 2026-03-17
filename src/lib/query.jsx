/**
 * Minimal react-query-compatible implementation using React built-ins.
 * Replaces @tanstack/react-query to avoid Vercel build resolution issues.
 */
import {
  useState, useEffect, useCallback, useRef,
  createContext, useContext,
} from "react";

// ── Cache invalidation registry ───────────────────────────────────────────────

const _listeners = new Map(); // serialized queryKey → Set<refetch fn>

function _register(key, fn) {
  if (!_listeners.has(key)) _listeners.set(key, new Set());
  _listeners.get(key).add(fn);
}
function _unregister(key, fn) {
  _listeners.get(key)?.delete(fn);
}
function _invalidate(key) {
  (_listeners.get(key) || new Set()).forEach((fn) => fn());
}

// ── QueryClient ───────────────────────────────────────────────────────────────

export class QueryClient {
  invalidateQueries({ queryKey } = {}) {
    if (!queryKey) return;
    _invalidate(JSON.stringify(queryKey));
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const QueryContext = createContext(null);

export function QueryClientProvider({ client, children }) {
  return (
    <QueryContext.Provider value={client}>{children}</QueryContext.Provider>
  );
}

export function useQueryClient() {
  return useContext(QueryContext);
}

// ── useQuery ──────────────────────────────────────────────────────────────────

export function useQuery({
  queryKey,
  queryFn,
  enabled = true,
  // staleTime is accepted for API compatibility but not implemented
}) {
  const [data, setData]         = useState(undefined);
  const [isLoading, setLoading] = useState(!!enabled);
  const [isError, setError]     = useState(false);

  const fnRef  = useRef(queryFn);
  fnRef.current = queryFn;

  const serializedKey = JSON.stringify(queryKey);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fnRef.current();
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [serializedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Register for cache invalidation
  useEffect(() => {
    _register(serializedKey, refetch);
    return () => _unregister(serializedKey, refetch);
  }, [serializedKey, refetch]);

  // Fetch when enabled / key changes
  useEffect(() => {
    if (enabled) {
      refetch();
    } else {
      setLoading(false);
      setData(undefined);
    }
  }, [serializedKey, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, isError, refetch };
}

// ── useMutation ───────────────────────────────────────────────────────────────

export function useMutation({ mutationFn, onSuccess } = {}) {
  const [isLoading, setLoading] = useState(false);
  const [isError,   setError]   = useState(false);

  const fnRef      = useRef(mutationFn);
  fnRef.current     = mutationFn;
  const successRef = useRef(onSuccess);
  successRef.current = onSuccess;

  const mutate = useCallback(async (variables, callbacks = {}) => {
    setLoading(true);
    setError(false);
    try {
      const result = await fnRef.current(variables);
      successRef.current?.(result, variables);
      callbacks.onSuccess?.(result, variables);
    } catch (err) {
      setError(true);
      callbacks.onError?.(err, variables);
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, mutateAsync: mutate, isLoading, isError };
}
