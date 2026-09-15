'use client';

import { ErrorSeat } from '@gradial/aci/next/error-seat';
import { registry } from '@/cms/registry';

// The error seat uses the compiled /error/ page payload and never re-enters
// the content provider while the application is failing.
export default function AppError({ error }: { error: Error & { digest?: string } }) {
  return <ErrorSeat registry={registry} error={error} />;
}
