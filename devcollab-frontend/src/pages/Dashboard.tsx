// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { getProjects, createProject, deleteProject } from "../api/projects";
import { getInvites } from "../api/collab";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [invites, setInvites] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadInvites = async () => {
    try {
      const res = await getInvites();
      setInvites(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
    loadInvites();
  }, []);

  const handleCreate = async () => {
    if (!name) return alert("Project name required");
    try {
      const res = await createProject({ name, description: desc });
      setProjects([...projects, res.data]);
      setName("");
      setDesc("");
    } catch (err) {
      alert(err.response?.data?.error || "Create failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete project?")) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="p-4 flex gap-8">
      <div className="flex-1">
        <h2 className="text-white text-xl mb-2">Your Projects</h2>
        <div className="bg-gray-800 p-2 rounded space-y-2">
          {projects.map((p) => (
            <div
              key={p._id}
              className="flex justify-between items-center p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
              onClick={() => navigate(`/project/${p._id}`)}
            >
              <span>{p.name}</span>
              <button
                className="text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(p._id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 p-2 bg-gray-800 rounded space-y-2">
          <input
            className="w-full p-1 text-black rounded"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full p-1 text-black rounded"
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
            onClick={handleCreate}
          >
            Create Project
          </button>
        </div>
      </div>
      <div className="w-64">
        <h2 className="text-white text-xl mb-2">Invites</h2>
        <div className="bg-gray-800 p-2 rounded space-y-2">
          {invites.map((inv) => (
            <div key={inv._id} className="p-2 bg-gray-700 rounded">
              From: {inv.from.username} <br /> Project: {inv.project.name}{" "}
              <br /> Status: {inv.status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
