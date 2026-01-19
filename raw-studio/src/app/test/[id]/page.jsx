"use client";

import { useParams } from "next/navigation";

export default function TestPage() {
  const params = useParams();
  
  return (
    <div className="p-8">
      <h1>Test Params</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}
