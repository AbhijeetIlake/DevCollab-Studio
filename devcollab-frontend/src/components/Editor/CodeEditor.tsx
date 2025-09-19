// src/components/Editor/CodeEditor.tsx
import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { saveFile } from "../../api/files";

export default function CodeEditor({
  projectId,
  file,
  onSave,
  lock,
  onLockRefresh,
}) {
  const editorRef = useRef(null);
  const [content, setContent] = useState(file.content);
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    setContent(file.content);
    setUnsaved(false);
  }, [file]);

  const handleSave = async () => {
    if (!lock) return alert("File is locked by another user");
    const saved = await saveFile(projectId, {
      path: file.path,
      content,
      language: file.language,
    });
    onSave(saved.data);
    setUnsaved(false);
  };

  return (
    <div className="flex flex-col h-full">
      {lock ? (
        <div className="bg-green-700 p-1 text-sm">Locked by you</div>
      ) : (
        <div className="bg-red-700 p-1 text-sm">Locked by another</div>
      )}
      <Editor
        height="100%"
        defaultLanguage={file.language}
        value={content}
        onChange={(v) => {
          setContent(v);
          setUnsaved(true);
        }}
        options={{ readOnly: !lock }}
        theme="vs-dark"
        onMount={(e) => (editorRef.current = e)}
      />
      <div className="flex gap-2 p-1">
        <button
          onClick={handleSave}
          disabled={!unsaved || !lock}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
        >
          Save
        </button>
        {lock && (
          <button
            onClick={onLockRefresh}
            className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white"
          >
            Refresh Lock
          </button>
        )}
      </div>
    </div>
  );
}
