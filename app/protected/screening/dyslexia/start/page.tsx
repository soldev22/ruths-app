"use client";

import { Suspense } from "react";
import StartInner from "././StartInner";

export default function StartPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <StartInner />
    </Suspense>
  );
}
