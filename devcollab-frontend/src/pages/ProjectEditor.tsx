// src/pages/ProjectEditor.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProject } from "../api/projects";
import FileExplorer from "../components/FileExplorer";
import CodeEditor from "../components/Editor/CodeEditor";
import Collaborators from "../components/Collaborators";
import ActivityFeed from "../components/ActivityFeed";
import RunOutput from "../components/RunOutput";
import { initSocket, subscribeProjectEvents } from "../utils/socket";

export default function ProjectEditor() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [presence, setPresence] = useState([]);
  const [activity, setActivity] = useState([]);
  const [runResult, setRunResult] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(id);
        setProject(res.data);
        if (res.data.files.length > 0) setSelectedFile(res.data.files[0]);
      } catch (err) {
        alert("Failed to load project");
      }
    };
    fetchProject();

    const socket = initSocket();
    subscribeProjectEvents(socket, id, setPresence, setActivity);
    return () => socket.emit("leaveProject", { projectId: id });
  }, [id]);

  if (!project) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 border-r border-gray-700">
        <FileExplorer project={project} onSelectFile={setSelectedFile} />
      </div>
      <div className="flex-1 flex flex-col">
        {selectedFile && <CodeEditor file={selectedFile} projectId={id} />}
        <RunOutput result={runResult} />
      </div>
      <div className="w-48 border-l border-gray-700">
        <Collaborators
          collaborators={project.collaborators}
          presence={presence}
        />
        <ActivityFeed events={activity} />
      </div>
    </div>
  );
}
