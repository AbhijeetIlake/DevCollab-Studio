// src/components/RunOutput.tsx
import React from "react";

export default function RunOutput({ result }) {
  if (!result) return null;
  return (
    <div className="bg-gray-900 text-white p-2 h-40 overflow-y-auto font-mono text-sm">
      {result.output && <div className="text-green-400">{result.output}</div>}
      {result.error && <div className="text-red-500">{result.error}</div>}
      <div className="text-gray-400">Exit Code: {result.exitCode}</div>
    </div>
  );
}
