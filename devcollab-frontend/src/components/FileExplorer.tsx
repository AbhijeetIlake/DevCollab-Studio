// src/components/FileExplorer.jsx
import React, { useState } from "react";
import { Trash, Plus } from "lucide-react";

export default function FileExplorer({ files, onSelect, onCreate, onDelete }) {
  const [newFile, setNewFile] = useState("");

  return (
    <div className="bg-gray-800 w-64 p-2 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={newFile}
          onChange={(e) => setNewFile(e.target.value)}
          placeholder="New file"
          className="flex-1 p-1 text-black rounded"
        />
        <button
          onClick={() => {
            onCreate(newFile);
            setNewFile("");
          }}
          className="p-1 bg-green-500 rounded"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.path}
            className="flex justify-between items-center hover:bg-gray-700 p-1 rounded cursor-pointer"
          >
            <span onClick={() => onSelect(file)}>{file.name}</span>
            <Trash
              size={16}
              onClick={() => onDelete(file.path)}
              className="text-red-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
