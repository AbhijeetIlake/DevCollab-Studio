// src/api/files.ts
import axios from "./axios";

export const getFile = (projectId, path) =>
  axios.get(`/projects/${projectId}/files`, { params: { path } });
export const saveFile = (projectId, data) =>
  axios.post(`/projects/${projectId}/files`, data);
export const deleteFile = (projectId, path) =>
  axios.delete(`/projects/${projectId}/files`, { params: { path } });
export const executeFile = (projectId, filePath, language) =>
  axios.post(`/projects/${projectId}/execute`, { filePath, language });
