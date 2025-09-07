import BuilderClient from "./BuilderClient";
import { Suspense } from "react";

export default function ReportCreatePage() {
  return (
    <Suspense fallback={null}>
      <BuilderClient />
    </Suspense>
  );
}
