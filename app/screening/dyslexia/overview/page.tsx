"use client";

import { Suspense } from "react";
import OverviewInner from "../overview/inner";

export default function OverviewPageWrapper() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <OverviewInner />
    </Suspense>
  );
}
