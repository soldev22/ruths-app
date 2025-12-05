import { Suspense } from "react";
import OverviewInner from "./inner";

export default async function OverviewPageWrapper({ searchParams }: any) {
  const params = await searchParams;
  const caseId = params.caseId;

  return (
    <Suspense fallback={<p>Loading…</p>}>
      <OverviewInner caseId={caseId} />
    </Suspense>
  );
}
