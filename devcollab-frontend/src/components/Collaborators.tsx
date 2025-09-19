// src/components/Collaborators.tsx
import React from "react";

export default function Collaborators({ collaborators, presence }) {
  return (
    <div className="bg-gray-800 w-48 p-2 h-full flex flex-col">
      <h3 className="text-white mb-2">Collaborators</h3>
      {collaborators.map((c) => {
        const online = presence.some((p) => p.userId === c.user._id);
        return (
          <div key={c.user._id} className="flex items-center gap-2 mb-1">
            <div
              className={`w-3 h-3 rounded-full ${online ? "bg-green-500" : "bg-gray-500"}`}
            ></div>
            <span className="text-white">
              {c.user.username} ({c.role})
            </span>
          </div>
        );
      })}
    </div>
  );
}
