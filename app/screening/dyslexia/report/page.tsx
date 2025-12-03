"use client";

import { Suspense } from "react";
import ReportInner from "../report/report-inner";

export default function ReportPageWrapper() {
  return (
    <Suspense fallback={<p>Loading report…</p>}>
      <ReportInner />
    </Suspense>
  );
}
