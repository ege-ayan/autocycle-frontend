import type {
  CollaborationResponse,
  MaterialRequest,
  Partner,
  ProductResponse,
} from "@/lib/api/types";

const STORAGE_KEY = "autocycle.flow";

let cachedRaw: string | null | undefined;
let cachedFlow: FlowState | null = null;

export type FlowState = MaterialRequest & {
  collaboration?: CollaborationResponse;
  partner?: Partner;
  products?: ProductResponse;
};

export function saveFlow(state: FlowState): void {
  const raw = JSON.stringify(state);
  sessionStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedFlow = state;
}

export function readFlow(): FlowState | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) {
    return cachedFlow;
  }
  cachedRaw = raw;
  if (!raw) {
    cachedFlow = null;
    return null;
  }
  try {
    cachedFlow = JSON.parse(raw) as FlowState;
  } catch {
    cachedFlow = null;
  }
  return cachedFlow;
}

export function updateFlow(patch: Partial<FlowState>): FlowState {
  const next = { ...readFlow(), ...patch } as FlowState;
  saveFlow(next);
  return next;
}
