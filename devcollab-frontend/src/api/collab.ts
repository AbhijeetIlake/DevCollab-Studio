// src/api/collab.ts
import axios from "./axios";

export const sendInvite = (projectId, data) =>
  axios.post(`/collab/${projectId}/invite`, data);
export const acceptInvite = (inviteId) =>
  axios.post(`/collab/${inviteId}/accept`);
export const declineInvite = (inviteId) =>
  axios.post(`/collab/${inviteId}/decline`);
export const getInvites = () => axios.get("/collab/invites");
