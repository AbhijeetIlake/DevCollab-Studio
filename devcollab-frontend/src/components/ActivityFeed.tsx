// src/components/ActivityFeed.tsx
import React from "react";
import { formatDateTime } from "../utils/format";

export default function ActivityFeed({ events }) {
  return (
    <div className="bg-gray-900 text-white h-48 overflow-y-auto p-2">
      {events.map((e, i) => (
        <div key={i} className="border-b border-gray-700 p-1">
          <div className="text-sm">{e.message}</div>
          <div className="text-xs text-gray-400">
            {formatDateTime(e.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
}
