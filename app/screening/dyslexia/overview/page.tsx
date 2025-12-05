import { Suspense } from "react";
import OverviewInner from "./inner"; // assuming file is inner.tsx and component is named OverviewInner

export default function OverviewPageWrapper({
  searchParams,
}: {
  searchParams: { caseId?: string };
}) {
  const caseId = searchParams?.caseId ?? null;

  return (
    <Suspense fallback={<p>Loading…</p>}>
      <OverviewInner caseIdx={caseId} />
    </Suspense>
  );
}
