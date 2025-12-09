import { Suspense } from "react";
import OverviewInner from "./inner"; // assuming file is inner.tsx and component is named OverviewInner

export default async function OverviewPageWrapper({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>;
}) {
  const params = await searchParams;
  const caseId = params?.caseId ?? null;

  return (
    <Suspense fallback={<p>Loading…</p>}>
      <OverviewInner caseIdx={caseId} />
    </Suspense>
  );
}
