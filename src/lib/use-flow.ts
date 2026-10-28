"use client";

import { useSyncExternalStore } from "react";

import { readFlow, type FlowState } from "@/lib/flow";

function subscribe() {
  return () => undefined;
}

function emptyFlow(): FlowState | null {
  return null;
}

export function useFlow(): FlowState | null {
  return useSyncExternalStore(subscribe, readFlow, emptyFlow);
}
