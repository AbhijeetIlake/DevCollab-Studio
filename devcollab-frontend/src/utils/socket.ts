// src/utils/socket.js
import { io } from "socket.io-client";

let socket;

export function initSocket() {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
    });
  }
  return socket;
}

/**
 * Subscribe to project events: presence + activity
 * @param {Socket} socket
 * @param {string} projectId
 * @param {function} setPresence
 * @param {function} setActivity
 */
export function subscribeProjectEvents(
  socket,
  projectId,
  setPresence,
  setActivity
) {
  if (!socket) return;
  socket.emit("joinProject", { projectId });

  socket.on("projectPresence", (data) => setPresence(data));
  socket.on("activity", (event) => setActivity((prev) => [event, ...prev]));

  // Optional: clean up on unmount
  return () => {
    socket.emit("leaveProject", { projectId });
    socket.off("projectPresence");
    socket.off("activity");
  };
}
