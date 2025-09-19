// src/pages/Invites.jsx
import React, { useEffect, useState } from "react";
import { getInvites, acceptInvite, declineInvite } from "../api/collab";

export default function Invites() {
  const [invites, setInvites] = useState([]);

  const loadInvites = async () => {
    try {
      const res = await getInvites();
      setInvites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptInvite(id);
      setInvites(invites.filter((i) => i._id !== id));
    } catch (err) {
      alert("Accept failed");
    }
  };

  const handleDecline = async (id) => {
    try {
      await declineInvite(id);
      setInvites(invites.filter((i) => i._id !== id));
    } catch (err) {
      alert("Decline failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-white text-xl mb-2">Invites</h2>
      <div className="space-y-2">
        {invites.map((i) => (
          <div
            key={i._id}
            className="bg-gray-800 p-2 rounded flex justify-between items-center"
          >
            <div>
              From: {i.from.username} <br /> Project: {i.project.name} <br />{" "}
              Status: {i.status}
            </div>
            <div className="flex gap-2">
              <button
                className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white"
                onClick={() => handleAccept(i._id)}
              >
                Accept
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                onClick={() => handleDecline(i._id)}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
        {invites.length === 0 && (
          <div className="text-gray-400">No pending invites</div>
        )}
      </div>
    </div>
  );
}
